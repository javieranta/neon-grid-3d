import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';
const ROOT = resolve(import.meta.dirname, '..');
const DOCS = join(ROOT, 'docs');
const OUT = join(ROOT, 'tests', 'artifacts');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (req, out) => {
  const u = decodeURIComponent((req.url || '/').split('?')[0]);
  let f = join(DOCS, u === '/' ? 'index.html' : u);
  if (!existsSync(f)) f = join(DOCS, 'index.html');
  out.writeHead(200, { 'Content-Type': MIME[extname(f)] ?? 'application/octet-stream' });
  out.end(await readFile(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/?tier=${process.env.TIER || 'ultra'}`;
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('PAGEERROR', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => !!window.__neon, null, { timeout: 60000 });
await page.evaluate(() => window.__neon.start());
await page.waitForTimeout(3500);
await page.evaluate(() => {
  const { game } = window.__neon;
  for (const [id, x, y] of [['blinky', 12, 20], ['pinky', 6, 17], ['inky', 21, 11], ['clyde', 15, 8]]) {
    const g = game.ghosts[id]; g.state = 'hunting'; g.frightened = false; g.waypoints = []; g.x = x; g.y = y;
  }
  game.pacman.x = 9; game.pacman.y = 20; game.pacman.dir = 'left';
  window.__neon.setPaused(true);
  const c = document.getElementById('centre'); if (c) c.style.display = 'none';
});
const mode = process.env.MODE || 'overview';
await page.evaluate((m) => window.__neon.view.setCameraMode(m), mode);
await page.waitForTimeout(Number(process.env.WAIT || 3000));
const name = process.env.NAME || 'quick';
await page.screenshot({ path: join(OUT, `${name}.png`) });
console.log(name, JSON.stringify(await page.evaluate(() => {
  const v = window.__neon.view, g = window.__neon.game;
  return {
    ...v.stats(),
    mode: v.cameraMode,
    cam: [+v.camera.position.x.toFixed(2), +v.camera.position.y.toFixed(2), +v.camera.position.z.toFixed(2)],
    fov: +v.camera.fov.toFixed(1),
    pac: [+g.pacman.x.toFixed(2), +g.pacman.y.toFixed(2)],
    dir: g.pacman.dir,
    state: g.state,
    wallY: +(v.scene.getObjectByProperty('type','Group') ? 0 : 0),
  };
})));
await browser.close(); server.close();
