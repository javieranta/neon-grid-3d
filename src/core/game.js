/**
 * NEON GRID — game orchestrator.
 *
 * Pure logic: no Three.js, no DOM. The renderer reads this state every frame
 * and the audio layer subscribes to the event bus, which keeps the simulation
 * deterministic and unit-testable at any frame rate.
 */

import { advance, createActor, lockLane, tileOf, tryTurn } from './actor.js';
import { DIRECTIONS, SPAWN, TILE, createMaze, deltaX } from './maze.js';
import {
  FRUITS,
  FRUITS_PER_LEVEL,
  FRUIT_SPAWNS,
  FULL_SPEED_TPS,
  GLOBAL_DOT_LIMITS,
  SCORE,
  houseDotLimits,
  levelConfig,
  wavePlan,
} from './levels.js';
import {
  GHOST_ORDER,
  beginLeaving,
  createGhost,
  frighten,
  queueReverse,
  resetGhost,
  updateElroy,
  updateGhost,
} from './ghost.js';

export const STATE = {
  ATTRACT: 'attract',
  READY: 'ready',
  PLAYING: 'playing',
  GHOST_SCORE: 'ghostScore',
  DYING: 'dying',
  LEVEL_CLEAR: 'levelClear',
  GAME_OVER: 'gameOver',
};

const READY_TIME = 2.3;
const READY_TIME_RESPAWN = 1.6;
const DEATH_TIME = 1.9;
const GHOST_SCORE_TIME = 0.85;
const LEVEL_CLEAR_TIME = 2.4;
const GAME_OVER_TIME = 3.4;

/** Jump: a short hop, and the height above which a ghost passes underneath. */
const JUMP_DURATION = 0.62;
const JUMP_PEAK = 1.15;
const JUMP_CLEAR_HEIGHT = 0.42;
export const JUMPS_PER_LEVEL = 3;

/** Scout: two seconds at full view, with a short ease either side. */
const SCOUT_HOLD = 2.0;
const SCOUT_RAMP = 0.35;
const SCOUT_TOTAL = SCOUT_HOLD + SCOUT_RAMP * 2;
export const SCOUTS_PER_LEVEL = 3;

/** Small deterministic PRNG so replays and tests behave identically. */
export function makeRng(seed = 0x2f6e2b1) {
  // Zero is a fixed point for xorshift: it would return 0 forever, which would
  // silently pin every frightened ghost to the first legal direction.
  let s = (seed >>> 0) || 0x2f6e2b1;
  return function rng() {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 0x100000000;
  };
}

export function createGame(options = {}) {
  const maze = createMaze();
  const rng = makeRng(options.seed ?? 0x2f6e2b1);
  const listeners = new Map();

  const game = {
    maze,
    rng,
    state: STATE.ATTRACT,
    stateTimer: 0,
    level: 1,
    cfg: levelConfig(1),
    score: 0,
    highScore: options.highScore ?? 0,
    lives: 3,
    extraLifeAwarded: false,
    dotsEaten: 0,
    ghostChain: 0,
    pacman: createActor(SPAWN.pacman),
    ghosts: {},
    mode: 'scatter',
    waves: wavePlan(1),
    waveIndex: 0,
    waveTimer: 0,
    frightTimer: 0,
    frightTotal: 0,
    /**
     * Seconds of fright remaining during which the ghosts blink white. The
     * arcade spends a FIXED number of blink cycles (~0.467s each) at the end of
     * every power pellet regardless of its total duration, so this is derived
     * from the level's flash count, not from a fraction of the timer.
     */
    frightFlashSeconds: 0,
    frightFlashPeriod: 28 / 60,
    globalDotCounter: -1,
    elroySuspended: false,
    releaseTimer: 0,
    munchStall: 0,
    /** Limited abilities, both reset per level. */
    jumpsLeft: JUMPS_PER_LEVEL,
    scoutsLeft: SCOUTS_PER_LEVEL,
    /** Current hop height in tiles; 0 while grounded. */
    airborne: 0,
    jumpTimer: 0,
    scoutTimer: 0,
    /** Every fruit currently on the board. Several can coexist. */
    fruits: [],
    fruitsSpawned: 0,
    fruitHistory: [],
    scorePopups: [],
    /** Cosmetic counters the renderer animates from. */
    elapsed: 0,
    deathProgress: 0,
    levelFlash: 0,
    lastEatenGhost: null,
    started: false,
  };

  for (const id of GHOST_ORDER) game.ghosts[id] = createGhost(id);

  game.on = (event, fn) => {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(fn);
    return () => listeners.get(event).delete(fn);
  };
  const emit = (event, payload) => {
    const set = listeners.get(event);
    if (set) for (const fn of set) fn(payload);
  };
  game.emit = emit;

  game.pacman.desiredDir = 'left';
  game.pacman.mouth = 0;
  game.pacman.alive = true;

  // ---------------------------------------------------------------- lifecycle

  function resetActors(respawn) {
    const p = game.pacman;
    p.x = SPAWN.pacman.x;
    p.y = SPAWN.pacman.y;
    p.dir = SPAWN.pacman.dir;
    p.desiredDir = SPAWN.pacman.dir;
    p.snapAxis = null;
    p.alive = true;
    p.mouth = 0;
    for (const id of GHOST_ORDER) resetGhost(game.ghosts[id], game.level);
    game.ghostChain = 0;
    game.frightTimer = 0;
    game.mode = 'scatter';
    game.waves = wavePlan(game.level);
    game.waveIndex = 0;
    game.waveTimer = 0;
    game.munchStall = 0;
    game.releaseTimer = 0;
    // A hop must not survive a death, but the level's remaining budget does.
    game.airborne = 0;
    game.jumpTimer = 0;
    game.scoutTimer = 0;

    const limits = houseDotLimits(game.level);
    game.ghosts.pinky.dotLimit = limits.pinky;
    game.ghosts.inky.dotLimit = limits.inky;
    game.ghosts.clyde.dotLimit = limits.clyde;
    for (const id of GHOST_ORDER) game.ghosts[id].dotCounter = 0;
    game.globalDotCounter = respawn ? 0 : -1;
    // After a death the arcade suspends Cruise Elroy until the last ghost has
    // left the house, rather than restoring him on the very next dot.
    game.elroySuspended = respawn;
    updateElroy(game.ghosts.blinky, maze, game.cfg, game.elroySuspended);
  }

  game.startGame = () => {
    game.score = 0;
    game.lives = 3;
    game.level = 1;
    game.cfg = levelConfig(1);
    game.dotsEaten = 0;
    game.fruitsSpawned = 0;
    game.fruitHistory = [];
    game.extraLifeAwarded = false;
    game.scorePopups.length = 0;
    maze.reset();
    resetActors(false);
    spawnLevelFruits();
    resetAbilities();
    game.started = true;
    setState(STATE.READY, READY_TIME);
    emit('ready', { level: game.level, intro: true });
  };

  game.startLevel = (level) => {
    game.level = level;
    game.cfg = levelConfig(level);
    game.dotsEaten = 0;
    game.fruitsSpawned = 0;
    maze.reset();
    resetActors(false);
    spawnLevelFruits();
    resetAbilities();
    setState(STATE.READY, READY_TIME_RESPAWN);
    emit('ready', { level, intro: false });
  };

  /** Resets the per-level ability budgets. */
  function resetAbilities() {
    game.jumpsLeft = JUMPS_PER_LEVEL;
    game.scoutsLeft = SCOUTS_PER_LEVEL;
    game.airborne = 0;
    game.jumpTimer = 0;
    game.scoutTimer = 0;
  }

  /**
   * Starts a hop if one is available and he is not already in the air.
   * Returns whether it took.
   */
  game.tryJump = () => {
    if (game.state !== STATE.PLAYING) return false;
    if (game.jumpTimer > 0 || game.jumpsLeft <= 0) {
      emit('abilityDenied', { kind: 'jump', left: game.jumpsLeft });
      return false;
    }
    game.jumpsLeft--;
    game.jumpTimer = JUMP_DURATION;
    emit('jump', { left: game.jumpsLeft });
    return true;
  };

  /**
   * Lifts the camera to the full board for a moment. The simulation keeps
   * running, so this is a look rather than a pause.
   */
  game.tryScout = () => {
    if (game.state !== STATE.PLAYING) return false;
    if (game.scoutTimer > 0 || game.scoutsLeft <= 0) {
      emit('abilityDenied', { kind: 'scout', left: game.scoutsLeft });
      return false;
    }
    game.scoutsLeft--;
    game.scoutTimer = SCOUT_TOTAL;
    emit('scout', { left: game.scoutsLeft });
    return true;
  };

  /** 0..1 ease for the scout camera, ramping in and out of the hold. */
  game.scoutBlend = () => {
    if (game.scoutTimer <= 0) return 0;
    const elapsed = SCOUT_TOTAL - game.scoutTimer;
    return Math.max(0, Math.min(1, Math.min(elapsed / SCOUT_RAMP, game.scoutTimer / SCOUT_RAMP)));
  };

  function setState(next, timer = 0) {
    game.state = next;
    game.stateTimer = timer;
  }
  game.setState = setState;

  // ------------------------------------------------------------------- input

  game.setDirection = (dir) => {
    if (!DIRECTIONS[dir]) return;
    game.pacman.desiredDir = dir;
  };

  /** Compass directions in clockwise order, for relative steering. */
  const CLOCKWISE = ['up', 'right', 'down', 'left'];

  /** Rotates a compass direction by a number of quarter turns clockwise. */
  game.turnFrom = (base, quarters) =>
    CLOCKWISE[(CLOCKWISE.indexOf(base) + quarters + 4) % 4];

  /**
   * Steers relative to where Pac-Man is heading: -1 left, +1 right, 2 reverse.
   *
   * Chains off any turn already buffered rather than off his current direction,
   * so two quick right steers make a U-turn instead of collapsing into one.
   */
  game.steer = (quarters) => {
    const p = game.pacman;
    const base = p.desiredDir && p.desiredDir !== p.dir ? p.desiredDir : p.dir;
    game.setDirection(game.turnFrom(base, quarters));
  };

  // -------------------------------------------------------------------- ghosts

  function ghostRelease(dt) {
    if (game.elroySuspended && game.ghosts.clyde.state !== 'house') {
      game.elroySuspended = false;
      updateElroy(game.ghosts.blinky, maze, game.cfg, false);
    }

    // A ghost leaves when its personal dot counter is met, or when the global
    // counter (active after a death) reaches its threshold, or on a timeout.
    game.releaseTimer += dt;
    const timeout = game.level < 5 ? 4 : 3;

    for (const id of ['pinky', 'inky', 'clyde']) {
      const g = game.ghosts[id];
      if (g.state !== 'house' || g.releaseTimer > 0) continue;

      if (game.globalDotCounter >= 0) {
        if (game.globalDotCounter >= GLOBAL_DOT_LIMITS[id]) {
          beginLeaving(g);
          if (id === 'clyde') game.globalDotCounter = -1;
          return;
        }
      } else if (g.dotCounter >= g.dotLimit) {
        beginLeaving(g);
        return;
      }

      if (game.releaseTimer >= timeout) {
        game.releaseTimer = 0;
        beginLeaving(g);
        return;
      }
    }
  }

  function nextHouseGhost() {
    for (const id of ['pinky', 'inky', 'clyde']) {
      if (game.ghosts[id].state === 'house') return game.ghosts[id];
    }
    return null;
  }

  function countDot() {
    if (game.globalDotCounter >= 0) {
      game.globalDotCounter++;
    } else {
      const g = nextHouseGhost();
      if (g) g.dotCounter++;
    }
    game.releaseTimer = 0;
  }

  // --------------------------------------------------------------------- waves

  function updateWaves(dt) {
    if (game.frightTimer > 0) return; // the wave clock freezes while energised
    const wave = game.waves[game.waveIndex];
    if (!wave) return;
    game.waveTimer += dt;
    if (game.waveTimer >= wave.seconds) {
      game.waveTimer = 0;
      game.waveIndex = Math.min(game.waveIndex + 1, game.waves.length - 1);
      const next = game.waves[game.waveIndex];
      if (next.mode !== game.mode) {
        game.mode = next.mode;
        for (const id of GHOST_ORDER) queueReverse(game.ghosts[id]);
        emit('modeChange', { mode: game.mode });
      }
    } else if (wave.mode !== game.mode) {
      game.mode = wave.mode;
    }
  }

  // ---------------------------------------------------------------- pac-man

  function pacSpeed() {
    const frac = game.frightTimer > 0 ? game.cfg.pacFright : game.cfg.pac;
    return frac * FULL_SPEED_TPS;
  }

  function updatePacman(dt) {
    const p = game.pacman;
    const passable = (x, y) => maze.walkable(x, y);

    if (p.desiredDir && p.desiredDir !== p.dir) {
      tryTurn(p, p.desiredDir, passable, true);
    }

    if (game.munchStall > 0) {
      game.munchStall -= dt;
      p.mouth += dt * 0.5;
      return;
    }

    const dist = pacSpeed() * dt;
    advance(p, dist, passable);

    // Mouth animation phase follows distance travelled, so it never desyncs.
    if (!p.blocked) p.mouth += dist * 1.35;

    const t = tileOf(p);
    const pellet = maze.pelletAt(t.x, t.y);
    if (pellet && Math.abs(p.x - t.x) < 0.5 && Math.abs(p.y - t.y) < 0.5) {
      maze.eatPellet(t.x, t.y);
      game.dotsEaten++;
      countDot();
      updateElroy(game.ghosts.blinky, maze, game.cfg, game.elroySuspended);

      if (pellet === TILE.ENERGIZER) {
        addScore(SCORE.energizer);
        game.munchStall = 3 / 60;
        game.ghostChain = 0;
        const seconds = game.cfg.frightSeconds;
        game.frightTotal = seconds;
        game.frightTimer = seconds;
        game.frightFlashSeconds = Math.min(
          seconds,
          game.cfg.frightFlashes * game.frightFlashPeriod
        );
        if (seconds > 0) {
          for (const id of GHOST_ORDER) frighten(game.ghosts[id], seconds);
        } else {
          for (const id of GHOST_ORDER) queueReverse(game.ghosts[id]);
        }
        emit('energizer', { seconds });
      } else {
        addScore(SCORE.pellet);
        game.munchStall = 1 / 60;
        emit('pellet', { remaining: maze.remaining });
      }

      if (maze.remaining === 0) {
        setState(STATE.LEVEL_CLEAR, LEVEL_CLEAR_TIME);
        game.levelFlash = 0;
        emit('levelClear', { level: game.level });
      }
    }
  }

  // ---------------------------------------------------------------- collisions

  function checkCollisions() {
    const p = game.pacman;
    for (const id of GHOST_ORDER) {
      const g = game.ghosts[id];
      if (g.state === 'eaten' || g.state === 'entering' || g.state === 'house') continue;
      const dx = deltaX(g.x, p.x);
      const dy = p.y - g.y;
      if (dx * dx + dy * dy > 0.64) continue;

      if (g.frightened) {
        const points = SCORE.ghostChain[Math.min(game.ghostChain, 3)];
        game.ghostChain++;
        addScore(points);
        g.state = 'eaten';
        g.frightened = false;
        game.lastEatenGhost = { id, x: g.x, y: g.y, points };
        pushPopup(g.x, g.y, points);
        setState(STATE.GHOST_SCORE, GHOST_SCORE_TIME);
        emit('ghostEaten', { id, points, chain: game.ghostChain });
        return;
      }

      // Cleared: he is over the ghost's head. Frightened ghosts are still eaten
      // in the air, above, because a well-timed jump should not cost the bonus.
      if (game.airborne > JUMP_CLEAR_HEIGHT) {
        emit('ghostCleared', { id });
        continue;
      }

      // Fatal contact.
      p.alive = false;
      game.deathProgress = 0;
      setState(STATE.DYING, DEATH_TIME);
      emit('death', { by: id });
      return;
    }
  }

  // -------------------------------------------------------------------- fruit

  /**
   * Places every fruit for the level. Slot 1 is always a cherry whatever the
   * level - it is the signature item - and the others are the level's own fruit
   * from the arcade table. They carry no timer: a fruit waits to be collected.
   */
  function spawnLevelFruits() {
    game.fruits.length = 0;
    for (let slot = 0; slot < FRUITS_PER_LEVEL; slot++) {
      const where = FRUIT_SPAWNS[slot] ?? SPAWN.fruit;
      const def = slot === 1 ? FRUITS[0] : game.cfg.fruit;
      game.fruits.push({ x: where.x, y: where.y, timer: Infinity, def, slot });
    }
    game.fruitsSpawned = game.fruits.length;
    emit('fruitsPlaced', { count: game.fruits.length, fruits: game.fruits.map((f) => f.def) });
  }

  function updateFruit(dt) {
    const p = game.pacman;
    for (let i = game.fruits.length - 1; i >= 0; i--) {
      const f = game.fruits[i];
      if (Number.isFinite(f.timer)) f.timer -= dt;
      if (f.timer <= 0) {
        game.fruits.splice(i, 1);
        emit('fruitExpire', { fruit: f.def });
        continue;
      }
      const dx = deltaX(f.x, p.x);
      const dy = p.y - f.y;
      if (dx * dx + dy * dy < 0.7) {
        addScore(f.def.points);
        pushPopup(f.x, f.y, f.def.points);
        game.fruitHistory.push(f.def);
        game.fruits.splice(i, 1);
        emit('fruitEaten', { fruit: f.def, points: f.def.points });
      }
    }
  }

  // ------------------------------------------------------------------ scoring

  function addScore(points) {
    game.score += points;
    if (game.score > game.highScore) game.highScore = game.score;
    if (!game.extraLifeAwarded && game.score >= SCORE.extraLifeAt) {
      game.extraLifeAwarded = true;
      game.lives++;
      emit('extraLife', { lives: game.lives });
    }
  }

  function pushPopup(x, y, points) {
    game.scorePopups.push({ x, y, points, life: 1.1, age: 0 });
  }

  function updatePopups(dt) {
    for (let i = game.scorePopups.length - 1; i >= 0; i--) {
      const s = game.scorePopups[i];
      s.age += dt;
      if (s.age >= s.life) game.scorePopups.splice(i, 1);
    }
  }

  // --------------------------------------------------------------------- step

  /** Advances the simulation by a fixed timestep (seconds). */
  game.step = (dt) => {
    game.elapsed += dt;
    updatePopups(dt);

    switch (game.state) {
      case STATE.ATTRACT: {
        game.stateTimer += dt;
        // Keep the board alive on the attract screen. The arcade demonstrated
        // play here, and a board with four penned ghosts reads as broken. No
        // collision checks run outside PLAYING, so nothing can die.
        for (const id of GHOST_ORDER) {
          const g = game.ghosts[id];
          if (g.state === 'house' && g.releaseTimer <= 0) beginLeaving(g);
        }
        const demoMode = Math.floor(game.stateTimer / 8) % 2 === 0 ? 'scatter' : 'chase';
        const attractCtx = {
          maze,
          cfg: game.cfg,
          rng,
          pacman: game.pacman,
          ghosts: game.ghosts,
          mode: demoMode,
        };
        for (const id of GHOST_ORDER) updateGhost(game.ghosts[id], dt, attractCtx);
        return;
      }

      case STATE.READY:
        game.stateTimer -= dt;
        if (game.stateTimer <= 0) {
          setState(STATE.PLAYING);
          emit('go', {});
        }
        return;

      case STATE.GHOST_SCORE:
        game.stateTimer -= dt;
        // Only the ghost heading home keeps moving during the freeze.
        for (const id of GHOST_ORDER) {
          const g = game.ghosts[id];
          if (g.state === 'eaten' || g.state === 'entering') {
            updateGhost(g, dt, { maze, cfg: game.cfg, rng, pacman: game.pacman, ghosts: game.ghosts, mode: game.mode });
          }
        }
        if (game.stateTimer <= 0) setState(STATE.PLAYING);
        return;

      case STATE.DYING: {
        game.stateTimer -= dt;
        game.deathProgress = 1 - Math.max(0, game.stateTimer) / DEATH_TIME;
        if (game.stateTimer <= 0) {
          game.lives--;
          if (game.lives <= 0) {
            setState(STATE.GAME_OVER, GAME_OVER_TIME);
            emit('gameOver', { score: game.score });
          } else {
            resetActors(true);
            setState(STATE.READY, READY_TIME_RESPAWN);
            emit('ready', { level: game.level, intro: false });
          }
        }
        return;
      }

      case STATE.LEVEL_CLEAR:
        game.stateTimer -= dt;
        game.levelFlash += dt;
        if (game.stateTimer <= 0) game.startLevel(game.level + 1);
        return;

      case STATE.GAME_OVER:
        game.stateTimer -= dt;
        if (game.stateTimer <= 0) {
          game.state = STATE.ATTRACT;
          game.started = false;
          emit('attract', {});
        }
        return;

      default:
        break;
    }

    // ------- PLAYING -------
    if (game.frightTimer > 0) {
      game.frightTimer -= dt;
      if (game.frightTimer <= 0) {
        game.frightTimer = 0;
        game.ghostChain = 0;
        emit('frightEnd', {});
      }
    }

    if (game.jumpTimer > 0) {
      game.jumpTimer = Math.max(0, game.jumpTimer - dt);
      const t = 1 - game.jumpTimer / JUMP_DURATION;
      // Simple parabola: leaves the ground at t=0, lands at t=1.
      game.airborne = 4 * JUMP_PEAK * (t - t * t);
    } else {
      game.airborne = 0;
    }
    if (game.scoutTimer > 0) game.scoutTimer = Math.max(0, game.scoutTimer - dt);

    updateWaves(dt);
    ghostRelease(dt);
    updatePacman(dt);
    updateFruit(dt);

    const ctx = { maze, cfg: game.cfg, rng, pacman: game.pacman, ghosts: game.ghosts, mode: game.mode };
    for (const id of GHOST_ORDER) updateGhost(game.ghosts[id], dt, ctx);

    checkCollisions();
  };

  return game;
}

export { tileOf, lockLane };
