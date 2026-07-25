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
  FRUIT_LIFETIME,
  FRUIT_TRIGGERS,
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

/** Small deterministic PRNG so replays and tests behave identically. */
export function makeRng(seed = 0x2f6e2b1) {
  let s = seed >>> 0;
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
    globalDotCounter: -1,
    releaseTimer: 0,
    munchStall: 0,
    fruit: null,
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
    game.fruit = null;

    const limits = houseDotLimits(game.level);
    game.ghosts.pinky.dotLimit = limits.pinky;
    game.ghosts.inky.dotLimit = limits.inky;
    game.ghosts.clyde.dotLimit = limits.clyde;
    for (const id of GHOST_ORDER) game.ghosts[id].dotCounter = 0;
    game.globalDotCounter = respawn ? 0 : -1;
    if (!respawn) updateElroy(game.ghosts.blinky, maze, game.cfg);
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
    setState(STATE.READY, READY_TIME_RESPAWN);
    emit('ready', { level, intro: false });
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

  // -------------------------------------------------------------------- ghosts

  function ghostRelease(dt) {
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
      updateElroy(game.ghosts.blinky, maze, game.cfg);

      if (pellet === TILE.ENERGIZER) {
        addScore(SCORE.energizer);
        game.munchStall = 3 / 60;
        game.ghostChain = 0;
        const seconds = game.cfg.frightSeconds;
        game.frightTotal = seconds;
        game.frightTimer = seconds;
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

      if (FRUIT_TRIGGERS.includes(game.dotsEaten)) spawnFruit();
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

      // Fatal contact.
      p.alive = false;
      game.deathProgress = 0;
      setState(STATE.DYING, DEATH_TIME);
      emit('death', { by: id });
      return;
    }
  }

  // -------------------------------------------------------------------- fruit

  function spawnFruit() {
    const life = FRUIT_LIFETIME[0] + rng() * (FRUIT_LIFETIME[1] - FRUIT_LIFETIME[0]);
    game.fruit = {
      x: SPAWN.fruit.x,
      y: SPAWN.fruit.y,
      timer: life,
      def: game.cfg.fruit,
    };
    game.fruitsSpawned++;
    emit('fruitSpawn', { fruit: game.fruit.def });
  }

  function updateFruit(dt) {
    const f = game.fruit;
    if (!f) return;
    f.timer -= dt;
    if (f.timer <= 0) {
      game.fruit = null;
      emit('fruitExpire', {});
      return;
    }
    const p = game.pacman;
    const dx = deltaX(f.x, p.x);
    const dy = p.y - f.y;
    if (dx * dx + dy * dy < 0.7) {
      addScore(f.def.points);
      pushPopup(f.x, f.y, f.def.points);
      game.fruitHistory.push(f.def);
      game.fruit = null;
      emit('fruitEaten', { fruit: f.def, points: f.def.points });
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
      case STATE.ATTRACT:
        game.stateTimer += dt;
        return;

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
