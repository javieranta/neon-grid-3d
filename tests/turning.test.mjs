/**
 * NEON GRID — turning out of a wall.
 *
 * Written in response to a report that Pac-Man "gets stuck at the end walls and
 * cannot move into the inner lanes". This drives him into every wall in the maze
 * from every direction and then requests every open perpendicular lane, which is
 * an exhaustive check of the case described. It passes: the simulation always lets
 * him turn out. The actual problem was the control frame - the close camera
 * rotates to sit behind him, so compass input no longer matched the screen - and
 * that is fixed in main.js by steering relative to his heading.
 */
import { createGame, STATE } from '../src/core/game.js';
import { createMaze, MAZE_W, MAZE_H, DIRECTIONS, OPPOSITE } from '../src/core/maze.js';

const DT = 1 / 120;
const maze = createMaze();
const perp = { up: ['left', 'right'], down: ['left', 'right'], left: ['up', 'down'], right: ['up', 'down'] };

let cases = 0, stuck = [];
for (let y = 0; y < MAZE_H; y++) {
  for (let x = 0; x < MAZE_W; x++) {
    if (!maze.walkable(x, y)) continue;
    for (const [dir, d] of Object.entries(DIRECTIONS)) {
      // Only interesting where he would be blocked by a wall ahead.
      if (maze.walkable(x + d.x, y + d.y)) continue;
      for (const turn of perp[dir]) {
        const t = DIRECTIONS[turn];
        if (!maze.walkable(x + t.x, y + t.y)) continue;   // that lane is closed
        cases++;
        const g = createGame({ seed: 5 });
        g.startGame();
        g.setState(STATE.PLAYING);
        // Park every ghost so nothing interferes.
        for (const id of Object.keys(g.ghosts)) { const gh = g.ghosts[id]; gh.state = 'house'; gh.x = gh.meta.homeX; gh.y = 14; }
        g.pacman.x = x; g.pacman.y = y; g.pacman.dir = dir; g.pacman.desiredDir = dir;
        g.pacman.snapAxis = null;
        // Drive into the wall for a quarter second so he is genuinely blocked.
        for (let i = 0; i < 30; i++) g.step(DT);
        const bx = g.pacman.x, by = g.pacman.y;
        // Now request the perpendicular lane and give him half a second.
        g.setDirection(turn);
        for (let i = 0; i < 60; i++) g.step(DT);
        const moved = Math.hypot(g.pacman.x - bx, g.pacman.y - by);
        if (moved < 0.25 || g.pacman.dir !== turn) {
          stuck.push(`tile ${x},${y} facing ${dir} -> ${turn}: dir=${g.pacman.dir} moved=${moved.toFixed(2)}`);
        }
      }
    }
  }
}
console.log(`checked ${cases} blocked-then-turn cases`);
console.log(stuck.length ? `STUCK in ${stuck.length}:\n  ` + stuck.slice(0, 20).join('\n  ') : 'no stuck cases');

console.log(`
${stuck.length === 0 ? 'PASS' : 'FAIL'} — ${cases - stuck.length}/${cases} blocked-then-turn cases`);
process.exit(stuck.length === 0 ? 0 : 1);
