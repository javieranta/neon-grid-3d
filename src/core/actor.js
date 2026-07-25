/**
 * NEON GRID — grid-locked movement shared by Pac-Man and the ghosts.
 *
 * Actors live in continuous tile space but are lane-locked: while travelling
 * horizontally their y is an integer, and vice versa. They may only cross from
 * one tile to the next when standing exactly on a tile centre and the tile
 * ahead is passable, which reproduces the arcade's crisp collision feel.
 *
 * Pac-Man additionally supports arcade "cornering": a turn requested slightly
 * before a junction is accepted immediately and the residual offset on the old
 * axis is bled off over the following frames, so he visibly cuts the corner
 * instead of snapping.
 */

import { DIRECTIONS, MAZE_W, OPPOSITE } from './maze.js';

const EPS = 1e-9;

/** How far from a tile centre a turn may be requested (in tiles). */
export const CORNER_TOLERANCE = 0.5;

export function createActor(spawn) {
  return {
    x: spawn.x,
    y: spawn.y,
    dir: spawn.dir ?? 'left',
    speed: 0,
    blocked: false,
    /** Axis being bled off during a corner cut, or null. */
    snapAxis: null,
    snapTarget: 0,
    /** Total distance travelled, handy for animation phase. */
    travelled: 0,
  };
}

export function tileOf(actor) {
  return { x: Math.round(actor.x), y: Math.round(actor.y) };
}

/** Wraps a continuous x coordinate through the side tunnel. */
export function wrapPosition(actor) {
  if (actor.x < -0.5) actor.x += MAZE_W;
  else if (actor.x >= MAZE_W - 0.5) actor.x -= MAZE_W;
}

/**
 * Advances an actor by `distance` tiles along its current direction.
 * `passable(x, y)` decides which tiles may be entered.
 * Returns the list of tile centres that were reached, in order.
 */
export function advance(actor, distance, passable) {
  const reached = [];
  let budget = distance;
  actor.blocked = false;
  let guard = 0;

  while (budget > EPS && guard++ < 64) {
    const d = DIRECTIONS[actor.dir];
    const horizontal = d.x !== 0;
    const tx = Math.round(actor.x);
    const ty = Math.round(actor.y);

    // Signed progress toward the centre of the tile we are heading into.
    const pos = horizontal ? actor.x * d.x : actor.y * d.y;
    const centre = horizontal ? tx * d.x : ty * d.y;
    const toCentre = centre - pos;

    let move;
    if (toCentre > EPS) {
      // Still short of the current tile centre — always safe to continue.
      move = Math.min(budget, toCentre);
    } else {
      // Standing on a centre: may we enter the next tile?
      if (!passable(tx + d.x, ty + d.y)) {
        if (horizontal) actor.x = tx;
        else actor.y = ty;
        actor.blocked = true;
        break;
      }
      move = Math.min(budget, 1);
    }

    if (horizontal) actor.x += d.x * move;
    else actor.y += d.y * move;

    // Bleed off a corner-cut offset at the same rate as forward travel.
    if (actor.snapAxis) {
      const cur = actor[actor.snapAxis];
      const diff = actor.snapTarget - cur;
      const adiff = Math.abs(diff);
      if (adiff <= move + EPS) {
        actor[actor.snapAxis] = actor.snapTarget;
        actor.snapAxis = null;
      } else {
        actor[actor.snapAxis] = cur + Math.sign(diff) * move;
      }
    }

    actor.travelled += move;
    budget -= move;
    wrapPosition(actor);

    const nx = Math.round(actor.x);
    const ny = Math.round(actor.y);
    const settled = Math.abs(actor.x - nx) < 1e-6 && Math.abs(actor.y - ny) < 1e-6;
    if (settled) reached.push({ x: nx, y: ny });
  }

  return reached;
}

/**
 * Attempts to change direction. Reversals are instant; perpendicular turns
 * require the actor to be close to a tile centre with an open tile beyond.
 * `allowCornering` enables the smooth corner cut used by Pac-Man.
 */
export function tryTurn(actor, desired, passable, allowCornering = false) {
  if (!desired || desired === actor.dir) return false;

  if (desired === OPPOSITE[actor.dir]) {
    actor.dir = desired;
    return true;
  }

  const tx = Math.round(actor.x);
  const ty = Math.round(actor.y);
  const d = DIRECTIONS[desired];
  if (!passable(tx + d.x, ty + d.y)) return false;

  const offX = actor.x - tx;
  const offY = actor.y - ty;
  const off = Math.abs(offX) + Math.abs(offY);
  const tol = allowCornering ? CORNER_TOLERANCE : 1e-3;
  if (off > tol) return false;

  actor.dir = desired;
  if (d.x !== 0) {
    // Now travelling horizontally: y must converge to the lane centre.
    if (Math.abs(offY) > 1e-6) {
      actor.snapAxis = 'y';
      actor.snapTarget = ty;
    } else {
      actor.y = ty;
      actor.snapAxis = null;
    }
  } else {
    if (Math.abs(offX) > 1e-6) {
      actor.snapAxis = 'x';
      actor.snapTarget = tx;
    } else {
      actor.x = tx;
      actor.snapAxis = null;
    }
  }
  return true;
}

/** Snaps an actor exactly onto its lane, clearing any corner cut. */
export function lockLane(actor) {
  const d = DIRECTIONS[actor.dir];
  if (d.x !== 0) actor.y = Math.round(actor.y);
  else actor.x = Math.round(actor.x);
  actor.snapAxis = null;
}
