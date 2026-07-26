/**
 * NEON GRID — the synthwave palette and world-space constants.
 *
 * Every colour in the game comes from here so the whole scene stays inside one
 * coherent 1984-airbrushed-sunset key: magenta and cyan neon over a deep indigo
 * void, with a single warm sun for rim light.
 */

import { MAZE_H, MAZE_W } from '../core/maze.js';

export const PALETTE = {
  // Sky gradient, bottom to top.
  skyHorizon: 0xff5f4a,
  skyLow: 0xff1f77,
  skyMid: 0x7b1fa2,
  skyHigh: 0x2a0a4a,
  skyZenith: 0x0a0118,

  sun: 0xffc44d,
  sunCore: 0xffeab4,

  // Maze.
  wallBody: 0x06050e,
  wallBodyDeep: 0x030208,
  // Every wall carries both hues, as in the reference art: cyan traces the
  // silhouette, magenta runs the inset partner line.
  neonCyan: 0x28d9ff,
  neonMagenta: 0xff2bd6,
  neonNear: 0xff2bd6,
  neonFar: 0x28d9ff,
  neonAccent: 0x9b5cff,
  gateColour: 0xffc4f0,

  // Floor.
  floor: 0x05010f,
  gridLine: 0x5a1e7a,
  gridGlow: 0xff2bd6,

  // Actors.
  pac: 0xffe14d,
  pacDeep: 0xffb300,
  pacMouth: 0x3a1a00,
  pellet: 0xffc12e,
  energizer: 0xffd23a,

  frightened: 0x2b3cff,
  frightenedFlash: 0xf2f8ff,
  ghostEyeWhite: 0xf6fbff,
  ghostPupil: 0x1a1a6e,

  mountains: 0x1a0533,
  mountainRim: 0xff5cc8,
};

/** Height of the neon wall blocks. */
// Low neon kerbs rather than full-height walls: at the game's camera angle a
// tile-tall wall occludes more than a tile of floor behind it, which made whole
// runs of pellets look unreachable even though they never were.
export const WALL_HEIGHT = 0.46;
/** Radius of the neon tube that traces every wall edge. */
export const TUBE_RADIUS = 0.075;

/** Maze -> world space. The maze is centred on the origin, lying in XZ. */
export const ORIGIN_X = (MAZE_W - 1) / 2; // 13.5
export const ORIGIN_Z = (MAZE_H - 1) / 2; // 15

export function worldX(tileX) {
  return tileX - ORIGIN_X;
}

export function worldZ(tileY) {
  return tileY - ORIGIN_Z;
}

export const MAZE_EXTENT = { w: MAZE_W, h: MAZE_H };

/** Direction name -> yaw in radians, for orienting actors in the XZ plane. */
export const DIR_YAW = {
  right: 0,
  down: -Math.PI / 2,
  left: Math.PI,
  up: Math.PI / 2,
};

/** 0..1 blend factor used for the near/far neon gradient. */
export function depthMix(tileY) {
  return Math.min(1, Math.max(0, tileY / (MAZE_H - 1)));
}
