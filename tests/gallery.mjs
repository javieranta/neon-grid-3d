/**
 * Gallery rig: five distinct in-game moments captured from the production build
 * at the pinned ultra tier. The game state is nudged directly (pellets eaten,
 * ghosts placed, fright armed) so each shot shows a real, recognisable beat
 * rather than the opening seconds.
 */
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const ROOT = resolve(import.meta.dirname, '..');
const DOCS = join(ROOT, 'docs');
const OUT = join(ROOT, 'media', 'gallery');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };


/**
 * Freezes the simulation so a tableau can be composed exactly, while the
 * renderer keeps animating (skirt waves, glow pulses, camera easing). The
 * centre overlay is hidden because pausing would otherwise stamp "PAUSED"
 * across the shot.
 */
async function freeze(page) {
  await page.evaluate(() => {
    window.__neon.setPaused(true);
    const c = document.getElementById('centre');
    if (c) c.style.display = 'none';
    const t = document.getElementById('toast');
    if (t) t.classList.remove('visible');
  });
}

async function thaw(page) {
  await page.evaluate(() => window.__neon.setPaused(false));
}

const server = createServer(async (req, out) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = join(DOCS, url === '/' ? 'index.html' : url);
  if (!existsSync(file)) file = join(DOCS, 'index.html');
  out.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
  out.end(await readFile(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/?tier=ultra`;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('pageerror:', e.message));
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => !!window.__neon, null, { timeout: 60000 });
await page.evaluate(() => window.__neon.start());
await page.waitForTimeout(3000);

// --- set up a mid-game board: a chunk of the maze cleared, ghosts on patrol ---
await page.evaluate(() => {
  const { game } = window.__neon;
  const { maze } = game;
  // Clear a plausible swathe of dots so the board looks played-in.
  let eaten = 0;
  for (const p of maze.pelletsInitial) {
    if (p.energizer) continue;
    if (p.y >= 24 || (p.y >= 19 && p.x <= 12)) {
      if (maze.eatPellet(p.x, p.y)) eaten++;
    }
  }
  game.dotsEaten = eaten;
  game.score = eaten * 10 + 1300;
  game.highScore = Math.max(game.highScore, 24680);
  game.fruitHistory = [game.cfg.fruit];

  const place = (id, x, y, dir) => {
    const g = game.ghosts[id];
    g.state = 'hunting';
    g.frightened = false;
    g.frightTimer = 0;
    g.waypoints = [];
    g.snapAxis = null;
    g.x = x; g.y = y; g.dir = dir;
  };
  place('blinky', 12, 20, 'left');
  place('pinky', 6, 17, 'up');
  place('inky', 21, 11, 'down');
  place('clyde', 15, 8, 'right');
  game.pacman.x = 9; game.pacman.y = 20; game.pacman.dir = 'left'; game.pacman.desiredDir = 'left';
  game.mode = 'chase';
  // A fruit waiting under the ghost house.
  game.fruits = [{ x: 13.5, y: 17, timer: 9, def: game.cfg.fruit, slot: 0 }];
});
await freeze(page);
await page.waitForTimeout(2500);
await page.screenshot({ path: join(OUT, '1-hunt.png') });
console.log('1 hunt', await page.evaluate(() => window.__neon.game.state));

// --- power pellet: every ghost frightened and fleeing ---
await page.evaluate(() => {
  const { game } = window.__neon;
  game.frightTimer = 9; game.frightTotal = 9; game.ghostChain = 0;
  for (const id of Object.keys(game.ghosts)) {
    const g = game.ghosts[id];
    g.state = 'hunting'; g.frightened = true; g.frightTimer = 9;
  }
  game.ghosts.blinky.x = 10; game.ghosts.blinky.y = 20;
  game.ghosts.pinky.x = 6; game.ghosts.pinky.y = 20;
  game.ghosts.inky.x = 12; game.ghosts.inky.y = 23;
  game.ghosts.clyde.x = 6; game.ghosts.clyde.y = 26;
  game.pacman.x = 8; game.pacman.y = 20; game.pacman.dir = 'left';
});
await freeze(page);
await page.waitForTimeout(2500);
await page.screenshot({ path: join(OUT, '2-power-pellet.png') });
console.log('2 power pellet');

// --- ghost eaten: freeze frame with the score popup on screen ---
await thaw(page);
await page.evaluate(() => {
  const { game } = window.__neon;
  game.frightTimer = 9; game.frightTotal = 9;
  const g = game.ghosts.blinky;
  g.state = 'hunting'; g.frightened = true; g.frightTimer = 9;
  g.x = game.pacman.x; g.y = game.pacman.y;
});
await page.waitForFunction(() => window.__neon.game.scorePopups.length > 0, null, { timeout: 20000 });
await freeze(page);
await page.waitForTimeout(1200);
await page.screenshot({ path: join(OUT, '3-ghost-eaten.png') });
console.log('3 ghost eaten');

// --- chase camera ---
await page.evaluate(() => {
  const { game } = window.__neon;
  game.frightTimer = 0;
  for (const id of Object.keys(game.ghosts)) { game.ghosts[id].frightened = false; game.ghosts[id].frightTimer = 0; }
  game.pacman.x = 6; game.pacman.y = 14; game.pacman.dir = 'left'; game.pacman.desiredDir = 'left';
  game.ghosts.blinky.state = 'hunting'; game.ghosts.blinky.x = 6; game.ghosts.blinky.y = 11;
  window.__neon.view.setCameraMode('chase');
});
await freeze(page);
await page.waitForTimeout(4000);
await page.screenshot({ path: join(OUT, '4-chase-cam.png') });
console.log('4 chase cam');

// --- cinematic sunset sweep, held until the sun is centred ---
await thaw(page);
await page.evaluate(() => window.__neon.view.setCameraMode('cinematic'));
let best = null;
for (let i = 0; i < 14; i++) {
  await page.waitForTimeout(2000);
  // Pick the frame where the camera sits lowest, which is when the sun is in shot.
  const y = await page.evaluate(() => window.__neon.view.camera.position.y);
  if (best === null || y < best.y) {
    best = { y };
    await page.screenshot({ path: join(OUT, '5-sunset.png') });
  }
}
console.log('5 sunset (camera height', best.y.toFixed(1), ')');

const stats = await page.evaluate(() => window.__neon.stats());
console.log('stats', JSON.stringify(stats));
await browser.close();
server.close();
