/**
 * Renders the maze grid in the style of the original arcade screen so the
 * layout can be compared pixel-for-pixel against the reference image.
 */
import zlib from 'node:zlib';
import fs from 'node:fs';
import { createMaze, MAZE_W, MAZE_H, TILE } from '../src/core/maze.js';

const S = 8;                    // pixels per tile, as on the arcade screen
const W = MAZE_W * S, H = MAZE_H * S;
const buf = Buffer.alloc(W * H * 3);

const maze = createMaze();
const px = (x, y, r, g, b) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const o = (y * W + x) * 3;
  buf[o] = r; buf[o + 1] = g; buf[o + 2] = b;
};

// Wall outline: draw an edge wherever a wall tile touches a non-wall tile.
const isWall = (x, y) => (x < 0 || y < 0 || x >= MAZE_W || y >= MAZE_H) ? false : maze.tiles[y][x] === TILE.WALL;
for (let ty = 0; ty < MAZE_H; ty++) {
  for (let tx = 0; tx < MAZE_W; tx++) {
    const t = maze.tiles[ty][tx];
    if (t === TILE.WALL) {
      const edges = [
        [!isWall(tx, ty - 1), 'top'], [!isWall(tx, ty + 1), 'bottom'],
        [!isWall(tx - 1, ty), 'left'], [!isWall(tx + 1, ty), 'right'],
      ];
      for (const [on, side] of edges) {
        if (!on) continue;
        for (let i = 0; i < S; i++) {
          if (side === 'top') { px(tx * S + i, ty * S + 1, 33, 33, 222); px(tx * S + i, ty * S + 2, 33, 33, 222); }
          if (side === 'bottom') { px(tx * S + i, ty * S + S - 2, 33, 33, 222); px(tx * S + i, ty * S + S - 3, 33, 33, 222); }
          if (side === 'left') { px(tx * S + 1, ty * S + i, 33, 33, 222); px(tx * S + 2, ty * S + i, 33, 33, 222); }
          if (side === 'right') { px(tx * S + S - 2, ty * S + i, 33, 33, 222); px(tx * S + S - 3, ty * S + i, 33, 33, 222); }
        }
      }
    }
    if (t === TILE.DOOR) for (let i = 0; i < S; i++) { px(tx * S + i, ty * S + 3, 255, 183, 255); px(tx * S + i, ty * S + 4, 255, 183, 255); }
    if (t === TILE.PELLET) for (let dy = 3; dy < 5; dy++) for (let dx = 3; dx < 5; dx++) px(tx * S + dx, ty * S + dy, 255, 222, 180);
    if (t === TILE.ENERGIZER) {
      for (let dy = 1; dy < 7; dy++) for (let dx = 1; dx < 7; dx++) {
        if (Math.hypot(dx - 3.5, dy - 3.5) <= 3) px(tx * S + dx, ty * S + dy, 255, 222, 180);
      }
    }
  }
}

function crc32(b) { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; } let crc = 0xffffffff; for (const v of b) crc = t[(crc ^ v) & 0xff] ^ (crc >>> 8); return (crc ^ 0xffffffff) >>> 0; }
function chunk(type, data) { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type, 'ascii'), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td)); return Buffer.concat([l, td, c]); }
const SCALE = 4;
const raw = Buffer.alloc(H * SCALE * (W * SCALE * 3 + 1));
for (let y = 0; y < H * SCALE; y++) {
  let o = y * (W * SCALE * 3 + 1); raw[o++] = 0;
  for (let x = 0; x < W * SCALE; x++) {
    const s = ((Math.floor(y / SCALE)) * W + Math.floor(x / SCALE)) * 3;
    raw[o++] = buf[s]; raw[o++] = buf[s + 1]; raw[o++] = buf[s + 2];
  }
}
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W * SCALE, 0); ihdr.writeUInt32BE(H * SCALE, 4); ihdr[8] = 8; ihdr[9] = 2;
fs.mkdirSync('tests/artifacts', { recursive: true });
fs.writeFileSync('tests/artifacts/maze-layout.png', Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
]));
console.log(`wrote tests/artifacts/maze-layout.png (${W * SCALE}x${H * SCALE}) — ${maze.totalPellets} collectibles`);
