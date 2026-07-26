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
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('PAGEERROR', e.message));
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => !!window.__neon, null, { timeout: 60000 });
await page.evaluate(() => window.__neon.start());
await page.waitForTimeout(3000);
// Force each fruit in turn and confirm the model + aura actually render.
const ids = ['cherry','strawberry','orange','apple','melon','galaxian','bell','key'];
for (const [i, id] of ids.entries()) {
  await page.evaluate(({ id, i }) => {
    const g = window.__neon.game;
    const defs = { cherry:100, strawberry:300, orange:500, apple:700, melon:1000, galaxian:2000, bell:3000, key:5000 };
    g.fruit = { x: 13.5, y: 17, timer: 9, def: { id, points: defs[id], label: id.toUpperCase() } };
    g.pacman.x = 13.5; g.pacman.y = 20;
    void i;
  }, { id, i });
  await page.waitForTimeout(700);
  const info = await page.evaluate(() => {
    let visible = 0, meshes = 0;
    window.__neon.view.scene.traverse((o) => { if (o.isMesh && o.visible) meshes++; });
    return { meshes, fruit: !!window.__neon.game.fruit };
  });
  if (i === 0) console.log('fruit render sanity:', JSON.stringify(info));
}
// Screenshot the cherry with the camera pulled toward the fruit.
await page.evaluate(() => {
  const g = window.__neon.game;
  g.fruit = { x: 13.5, y: 17, timer: 9, def: { id: 'cherry', points: 100, label: 'CHERRY' } };
  g.pacman.x = 13.5; g.pacman.y = 20; g.pacman.dir = 'up';
  window.__neon.setPaused(true);
  const c = document.getElementById('centre'); if (c) c.style.display = 'none';
});
await page.evaluate(() => window.__neon.view.setCameraMode('overview'));
await page.waitForTimeout(2500);
await page.screenshot({ path: join(OUT, 'fruit-overview.png') });
await page.evaluate(() => window.__neon.view.setCameraMode('chase'));
await page.waitForTimeout(3000);
await page.screenshot({ path: join(OUT, 'fruit-chase.png') });
console.log('captured fruit shots');
await browser.close(); server.close();
