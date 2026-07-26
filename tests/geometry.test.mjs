/**
 * NEON GRID — geometry/grid agreement.
 *
 * The maze is rendered from traced wall silhouettes with rounded corners, not
 * from the tile grid directly, so the two could in principle disagree. This
 * checks the thing that actually matters to a player: that every collectible
 * sits in open space, that every open tile is reachable, and that the corridor
 * a pellet lives in is genuinely wide enough for Pac-Man to enter.
 */
import { createMaze, MAZE_W, MAZE_H, DIRECTIONS, wrapX, TILE } from '../src/core/maze.js';
import { wallComponents, traceLoops, roundedPolyline, sx, sy } from '../src/render/mazeMesh.js';

let failures = 0, checks = 0;
const ok = (c, label, detail = '') => {
  checks++;
  if (!c) { failures++; console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`); }
};

const maze = createMaze();

/* ---- 1. logical reachability of every collectible ------------------------- */
const seen = new Set();
const stack = [[13, 23]];
while (stack.length) {
  const [x, y] = stack.pop();
  const k = `${x},${y}`;
  if (seen.has(k) || !maze.walkable(x, y)) continue;
  seen.add(k);
  for (const d of Object.values(DIRECTIONS)) stack.push([wrapX(x + d.x), y + d.y]);
}
const unreachable = maze.pelletsInitial.filter((p) => !seen.has(`${p.x},${p.y}`));
ok(unreachable.length === 0, 'every collectible is reachable from spawn',
   unreachable.map((p) => `${p.x},${p.y}`).join(' '));

let open = 0;
for (let y = 0; y < MAZE_H; y++) for (let x = 0; x < MAZE_W; x++) if (maze.walkable(x, y)) open++;
ok(seen.size === open, 'no isolated pockets of open floor', `${seen.size}/${open}`);

/* ---- 2. no collectible sits inside a rendered wall silhouette ------------- */
function inside(poly, px, py) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if (a.y > py !== b.y > py && px < ((b.x - a.x) * (py - a.y)) / (b.y - a.y) + a.x) hit = !hit;
  }
  return hit;
}

const polys = [];
for (const cells of wallComponents(maze.tiles)) {
  for (const loop of traceLoops(maze.tiles, cells)) {
    polys.push(roundedPolyline(loop, 0.26, 6));
  }
}
ok(polys.length >= 22, 'wall silhouettes were traced', `${polys.length} loops`);

// Shape space: x = tileX - 13.5, y = -(tileY - 15)
const toShape = (p) => ({ x: p.x - 13.5, y: -(p.y - 15) });
let buried = [];
for (const p of maze.pelletsInitial) {
  const q = toShape(p);
  // A collectible is "buried" only if it is inside an ODD number of loops of the
  // same component; outer loop = inside wall, hole = back in open space.
  let depth = 0;
  for (const poly of polys) if (inside(poly, q.x, q.y)) depth++;
  if (depth % 2 === 1) buried.push(`${p.x},${p.y}`);
}
ok(buried.length === 0, 'no collectible is inside a wall silhouette', buried.slice(0, 12).join(' '));

/* ---- 3. clearance: the rendered wall must not narrow a corridor too far --- */
function distToPoly(poly, px, py) {
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    const vx = b.x - a.x, vy = b.y - a.y;
    const wx = px - a.x, wy = py - a.y;
    const len2 = vx * vx + vy * vy || 1e-9;
    const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / len2));
    best = Math.min(best, Math.hypot(px - (a.x + vx * t), py - (a.y + vy * t)));
  }
  return best;
}
const TUBE = 0.075;
let tight = [];
for (const p of maze.pelletsInitial) {
  const q = toShape(p);
  let d = Infinity;
  for (const poly of polys) d = Math.min(d, distToPoly(poly, q.x, q.y));
  if (d - TUBE < 0.24) tight.push(`${p.x},${p.y}:${(d - TUBE).toFixed(2)}`);
}
ok(tight.length === 0, 'every collectible has visual clearance from the walls',
   `${tight.length} tight: ${tight.slice(0, 10).join(' ')}`);

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks - failures}/${checks} geometry assertions`);
process.exit(failures === 0 ? 0 : 1);
