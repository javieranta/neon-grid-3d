import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';
const ROOT = resolve(import.meta.dirname, '..'), DOCS = join(ROOT, 'docs'), OUT = join(ROOT, 'tests', 'artifacts');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (req, out) => {
  const u = decodeURIComponent((req.url || '/').split('?')[0]);
  let f = join(DOCS, u === '/' ? 'index.html' : u);
  if (!existsSync(f)) f = join(DOCS, 'index.html');
  out.writeHead(200, { 'Content-Type': MIME[extname(f)] ?? 'application/octet-stream' }); out.end(await readFile(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/?tier=ultra`;
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1400, height: 800 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('PAGEERROR', e.message));
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => !!window.__neon, null, { timeout: 60000 });
await page.evaluate(() => window.__neon.start());
await page.waitForTimeout(3000);
// Line the ghosts up right in front of Pac-Man so the models fill the frame.
await page.evaluate(() => {
  const g = window.__neon.game;
  g.pacman.x = 6; g.pacman.y = 20; g.pacman.dir = 'up'; g.pacman.desiredDir = 'up';
  const spots = [[6, 18], [6, 16.6], [6, 15.2], [6, 13.8]];
  Object.keys(g.ghosts).forEach((id, i) => {
    const gh = g.ghosts[id];
    gh.state = 'hunting'; gh.frightened = false; gh.frightTimer = 0; gh.waypoints = [];
    gh.x = spots[i][0]; gh.y = spots[i][1]; gh.dir = 'down'; gh.eyeDir = 'down';
  });
  window.__neon.setPaused(true);
  const c = document.getElementById('centre'); if (c) c.style.display = 'none';
});
const camMode = process.env.CAM || 'chase';
await page.evaluate((m) => window.__neon.view.setCameraMode(m), camMode);
await page.waitForTimeout(4500);
await page.screenshot({ path: join(OUT, `${process.env.NAME || 'ghosts'}.png`) });
console.log('captured', process.env.NAME || 'ghosts');
await browser.close(); server.close();
