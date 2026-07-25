/**
 * Capture rig: renders the pinned "ultra" tier at a set of framings so the
 * look can be reviewed as stills. Software rasterisation makes this slow but
 * exact — every effect is on.
 */
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const ROOT = resolve(import.meta.dirname, '..');
const DOCS = join(ROOT, 'docs');
const ART = join(ROOT, 'tests', 'artifacts');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };

const server = createServer(async (req, out) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = join(DOCS, url === '/' ? 'index.html' : url);
  if (!existsSync(file)) file = join(DOCS, 'index.html');
  out.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
  out.end(await readFile(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/?tier=${process.env.TIER || 'ultra'}`;

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('pageerror', e.message));
await page.goto(base, { waitUntil: 'load' });
await page.waitForFunction(() => !!window.__neon, null, { timeout: 40000 });
await mkdir(ART, { recursive: true });

const label = process.env.LABEL || 'ultra';
await page.waitForTimeout(2500);
await page.screenshot({ path: join(ART, `${label}-title.png`) });

await page.evaluate(() => window.__neon.start());
await page.waitForTimeout(4000);
// Eat a few pellets so the board looks played-in.
for (const d of ['left', 'up', 'left', 'down', 'right']) {
  await page.evaluate((x) => window.__neon.setDirection(x), d);
  await page.waitForTimeout(1200);
}
await page.evaluate(() => window.__neon.view.setCameraMode('overview'));
await page.waitForTimeout(2500);
await page.screenshot({ path: join(ART, `${label}-overview.png`) });

await page.evaluate(() => window.__neon.view.setCameraMode('chase'));
await page.waitForTimeout(3000);
await page.screenshot({ path: join(ART, `${label}-chase.png`) });

await page.evaluate(() => window.__neon.view.setCameraMode('cinematic'));
for (const [i, wait] of [[0, 5000], [1, 9000], [2, 9000]]) {
  await page.waitForTimeout(wait);
  await page.screenshot({ path: join(ART, `${label}-cinematic-${i}.png`) });
}

await page.evaluate(() => {
  const g = window.__neon.game;
  g.frightTimer = 12; g.frightTotal = 12;
  for (const id of Object.keys(g.ghosts)) { const gh = g.ghosts[id]; gh.state = 'hunting'; gh.frightened = true; gh.frightTimer = 12; gh.x = 13.5 + (Math.random() - 0.5) * 6; gh.y = 20; }
});
await page.evaluate(() => window.__neon.view.setCameraMode('overview'));
await page.waitForTimeout(2500);
await page.screenshot({ path: join(ART, `${label}-frightened.png`) });

const stats = await page.evaluate(() => window.__neon.stats());
console.log('captured', label, JSON.stringify(stats));
await browser.close();
server.close();
