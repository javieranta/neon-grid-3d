/**
 * NEON GRID — ghost behaviour.
 *
 * Each ghost is a small state machine (house -> leaving -> hunting -> eaten ->
 * entering -> house) wrapped around the arcade's target-tile AI:
 *
 *   BLAZE  (red)    chases Pac-Man's tile directly; becomes "Cruise Elroy" and
 *                   speeds up as the maze empties.
 *   VIOLET (pink)   aims four tiles ahead of Pac-Man, reproducing the original
 *                   overflow quirk where "ahead" also drifts left when Pac-Man
 *                   faces up.
 *   CYAN   (blue)   takes the vector from Blaze to two tiles ahead of Pac-Man
 *                   and doubles it, so it flanks.
 *   AMBER  (orange) chases while far away but retreats to its corner within
 *                   eight tiles, making it the erratic one.
 *
 * Decisions are taken at tile centres, reversals are forbidden except on a mode
 * flip, and the four "no-up" junctions of the original maze are honoured.
 */

import { advance, createActor, lockLane, tileOf } from './actor.js';
import {
  DIRECTIONS,
  DIR_ORDER,
  OPPOSITE,
  SCATTER_TARGETS,
  SPAWN,
  TILE,
} from './maze.js';
import { FULL_SPEED_TPS } from './levels.js';

export const GHOST_ORDER = ['blinky', 'pinky', 'inky', 'clyde'];

export const GHOST_META = {
  blinky: { name: 'BLAZE', colour: 0xff2d5e, glow: 0xff6b8f, homeX: 13.5 },
  pinky: { name: 'VIOLET', colour: 0xff5bf0, glow: 0xffa8f7, homeX: 13.5 },
  inky: { name: 'CYAN', colour: 0x00e5ff, glow: 0x9bf6ff, homeX: 11.5 },
  clyde: { name: 'AMBER', colour: 0xffa23e, glow: 0xffd39b, homeX: 15.5 },
};

const HOUSE_TOP = 11; // tile row just above the door
const HOUSE_ROW = 14; // interior row the ghosts idle on

export function createGhost(id) {
  const g = createActor(SPAWN[id]);
  g.id = id;
  g.meta = GHOST_META[id];
  g.state = id === 'blinky' ? 'hunting' : 'house';
  g.frightened = false;
  g.frightTimer = 0;
  g.elroy = 0;
  g.bob = Math.random() * Math.PI * 2;
  g.dotCounter = 0;
  g.dotLimit = 0;
  g.releaseTimer = 0;
  g.waypoints = [];
  g.reverseQueued = false;
  g.eyeDir = g.dir;
  return g;
}

export function resetGhost(g, level) {
  const s = SPAWN[g.id];
  g.x = s.x;
  g.y = s.y;
  g.dir = s.dir;
  g.eyeDir = s.dir;
  g.state = g.id === 'blinky' ? 'hunting' : 'house';
  g.frightened = false;
  g.frightTimer = 0;
  g.elroy = 0;
  g.waypoints = [];
  g.snapAxis = null;
  g.reverseQueued = false;
  g.dotCounter = 0;
  g.bob = Math.random() * Math.PI * 2;
  void level;
}

/** Where a ghost wants to go right now, in tile coordinates. */
export function targetTile(g, ctx) {
  const { pacman, ghosts, mode } = ctx;
  const pt = tileOf(pacman);
  const pd = DIRECTIONS[pacman.dir];

  if (g.state === 'eaten') return { x: 13, y: HOUSE_TOP };
  if (g.frightened) return pt;

  const scatter = SCATTER_TARGETS[g.id];
  const scattering = mode === 'scatter';

  switch (g.id) {
    case 'blinky':
      // Cruise Elroy overrides scatter: he never stops hunting once enraged.
      return scattering && g.elroy === 0 ? scatter : pt;

    case 'pinky': {
      if (scattering) return scatter;
      let tx = pt.x + pd.x * 4;
      let ty = pt.y + pd.y * 4;
      if (pacman.dir === 'up') tx -= 4; // faithful overflow quirk
      return { x: tx, y: ty };
    }

    case 'inky': {
      if (scattering) return scatter;
      let px = pt.x + pd.x * 2;
      let py = pt.y + pd.y * 2;
      if (pacman.dir === 'up') px -= 2;
      const bt = tileOf(ghosts.blinky);
      return { x: px + (px - bt.x), y: py + (py - bt.y) };
    }

    case 'clyde': {
      if (scattering) return scatter;
      // Tile centres and raw deltas, switching at exactly eight tiles. Using
      // continuous positions moved the boundary by up to half a tile, and a
      // wrapped delta made him retreat when the two were in opposite tunnel
      // mouths — twenty tiles apart in arcade terms.
      const ct = tileOf(g);
      const dx = pt.x - ct.x;
      const dy = pt.y - ct.y;
      return dx * dx + dy * dy >= 64 ? pt : scatter;
    }

    default:
      return pt;
  }
}

function ghostCanEnter(g, maze, x, y) {
  const t = maze.tileAt(x, y);
  if (t === TILE.WALL) return false;
  if (t === TILE.DOOR || t === TILE.HOUSE) {
    // Only a ghost heading home may pass back through the gate.
    return g.state === 'eaten' || g.state === 'entering' || g.state === 'leaving';
  }
  return true;
}

/** Picks the next direction using the arcade's distance + tie-break rules. */
export function chooseDirection(g, maze, target, rng) {
  const t = tileOf(g);
  const back = OPPOSITE[g.dir];
  const hunting = !g.frightened && g.state !== 'eaten';

  const options = [];
  for (const name of DIR_ORDER) {
    if (name === back) continue;
    if (name === 'up' && hunting && maze.isNoUpTile(t.x, t.y)) continue;
    const d = DIRECTIONS[name];
    if (!ghostCanEnter(g, maze, t.x + d.x, t.y + d.y)) continue;
    options.push(name);
  }

  if (options.length === 0) return back;
  if (options.length === 1) return options[0];

  if (g.frightened) {
    // The arcade draws a random index into [up, left, down, right] and walks
    // forward until it finds a legal exit, which biases the distribution (the
    // direction after an illegal one gets picked twice as often). A uniform pick
    // over the legal set is subtly wrong at three-way junctions.
    const start = Math.floor(rng() * 4) % 4;
    for (let i = 0; i < 4; i++) {
      const name = DIR_ORDER[(start + i) % 4];
      if (options.includes(name)) return name;
    }
    return options[0];
  }

  let best = options[0];
  let bestDist = Infinity;
  for (const name of options) {
    const d = DIRECTIONS[name];
    const nx = t.x + d.x;
    const ny = t.y + d.y;
    // Raw tile deltas, deliberately NOT wrapped through the tunnel: the arcade's
    // metric treats the maze as flat, so the side tunnel is never a shortcut in
    // the AI's eyes. Wrapping here collapses the scatter corners (Blaze ends up
    // camping in Violet's corner) and makes ghosts walk away from Pac-Man near
    // the maze edges.
    const dx = target.x - nx;
    const dy = target.y - ny;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) {
      bestDist = dist;
      best = name;
    }
  }
  return best;
}

/** Current speed in tiles/second. */
export function ghostSpeed(g, maze, cfg) {
  const t = tileOf(g);
  let frac;
  if (g.state === 'eaten') frac = 1.6;
  else if (g.state === 'entering') frac = 1.2;
  else if (g.state === 'leaving') frac = 0.55;
  // The tunnel slows every state except the returning eyes, so it is tested
  // ahead of the frightened speed (Cruise Elroy already resolved this way).
  else if (maze.isTunnel(t.x, t.y)) frac = cfg.tunnel;
  else if (g.frightened) frac = cfg.ghostFright;
  else if (g.id === 'blinky' && g.elroy === 2) frac = cfg.elroy2Speed;
  else if (g.id === 'blinky' && g.elroy === 1) frac = cfg.elroy1Speed;
  else frac = cfg.ghost;
  return frac * FULL_SPEED_TPS;
}

/** Queues the forced reversal that happens on every scatter/chase flip. */
export function queueReverse(g) {
  if (g.state === 'hunting') g.reverseQueued = true;
}

export function frighten(g, seconds) {
  if (g.state === 'eaten' || g.state === 'entering') return;
  g.frightened = true;
  g.frightTimer = seconds;
  if (g.state === 'hunting') g.reverseQueued = true;
}

export function updateGhost(g, dt, ctx) {
  const { maze, cfg, rng } = ctx;

  if (g.frightened) {
    g.frightTimer -= dt;
    if (g.frightTimer <= 0) {
      g.frightened = false;
      g.frightTimer = 0;
    }
  }

  switch (g.state) {
    case 'house':
      updateHouse(g, dt, ctx);
      return;
    case 'leaving':
      followWaypoints(g, dt, ghostSpeed(g, maze, cfg), () => {
        g.state = 'hunting';
        g.dir = 'left';
        g.y = HOUSE_TOP;
        lockLane(g);
      });
      return;
    case 'entering':
      followWaypoints(g, dt, ghostSpeed(g, maze, cfg), () => {
        g.state = 'house';
        g.frightened = false;
        g.releaseTimer = 0.4;
      });
      return;
    default:
      break;
  }

  // Hunting or returning home: normal grid navigation.
  if (g.reverseQueued) {
    g.reverseQueued = false;
    g.dir = OPPOSITE[g.dir];
    lockLane(g);
  }

  const speed = ghostSpeed(g, maze, cfg);
  const passable = (x, y) => ghostCanEnter(g, maze, x, y);
  const before = tileOf(g);
  const reached = advance(g, speed * dt, passable);

  // Re-evaluate the route on every tile centre we settle on.
  for (const tile of reached) {
    if (g.state === 'eaten' && tile.x === 13 && tile.y === HOUSE_TOP) {
      beginEntering(g);
      return;
    }
    const target = targetTile(g, ctx);
    const next = chooseDirection(g, maze, target, rng);
    if (next !== g.dir) {
      g.dir = next;
      lockLane(g);
    }
  }

  if (g.blocked && reached.length === 0) {
    const target = targetTile(g, ctx);
    g.dir = chooseDirection(g, maze, target, rng);
    lockLane(g);
  }

  if (g.state === 'eaten') {
    // Arrival can also happen mid-tile after a wrap; catch it defensively.
    const t = tileOf(g);
    if (t.y === HOUSE_TOP && Math.abs(g.x - 13.5) < 0.6 && Math.abs(g.y - HOUSE_TOP) < 0.1) {
      beginEntering(g);
    }
  }

  void before;
}

function beginEntering(g) {
  g.state = 'entering';
  g.frightened = false;
  g.snapAxis = null;
  g.x = 13.5;
  g.y = HOUSE_TOP;
  g.waypoints = [
    { x: 13.5, y: HOUSE_ROW },
    { x: g.meta.homeX, y: HOUSE_ROW },
  ];
}

export function beginLeaving(g) {
  if (g.state !== 'house') return;
  g.state = 'leaving';
  g.snapAxis = null;
  g.waypoints = [
    { x: g.meta.homeX, y: HOUSE_ROW },
    { x: 13.5, y: HOUSE_ROW },
    { x: 13.5, y: HOUSE_TOP },
  ];
}

function updateHouse(g, dt, ctx) {
  g.bob += dt * 4.2;
  const base = HOUSE_ROW;
  g.y = base + Math.sin(g.bob) * 0.32;
  g.x = g.meta.homeX;
  g.dir = Math.sin(g.bob) > 0 ? 'down' : 'up';
  if (g.releaseTimer > 0) {
    g.releaseTimer -= dt;
    if (g.releaseTimer <= 0) g.releaseTimer = 0;
  }
  void ctx;
}

function followWaypoints(g, dt, speed, onDone) {
  let budget = speed * dt;
  let guard = 0;
  while (budget > 1e-9 && g.waypoints.length && guard++ < 8) {
    const wp = g.waypoints[0];
    const dx = wp.x - g.x;
    const dy = wp.y - g.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= budget + 1e-9) {
      g.x = wp.x;
      g.y = wp.y;
      budget -= dist;
      g.waypoints.shift();
    } else {
      g.x += (dx / dist) * budget;
      g.y += (dy / dist) * budget;
      if (Math.abs(dx) > Math.abs(dy)) g.dir = dx > 0 ? 'right' : 'left';
      else g.dir = dy > 0 ? 'down' : 'up';
      budget = 0;
    }
  }
  if (g.waypoints.length === 0) onDone();
}

/**
 * Blinky's rage thresholds, recomputed whenever pellets are eaten. After a life
 * is lost the arcade suspends Elroy until the last ghost has left the house, so
 * the caller passes that state in rather than restoring him on the next dot.
 */
export function updateElroy(g, maze, cfg, suspended = false) {
  if (g.id !== 'blinky') return;
  if (suspended) {
    g.elroy = 0;
    return;
  }
  const left = maze.remaining;
  if (left <= cfg.elroy2Dots) g.elroy = 2;
  else if (left <= cfg.elroy1Dots) g.elroy = 1;
  else g.elroy = 0;
}
