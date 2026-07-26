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
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('PAGEERROR', e.message));
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => !!window.__neon, null, { timeout: 60000 });
await page.evaluate(() => window.__neon.start());
await page.waitForTimeout(2500);
await page.evaluate(() => window.__neon.view.setCameraMode('cinematic'));
// Hold until the sweep bottoms out, then shoot: that is when the sun is in frame.
let best = 1e9;
for (let i = 0; i < 16; i++) {
  await page.waitForTimeout(1800);
  const y = await page.evaluate(() => window.__neon.view.camera.position.y);
  if (y < best) { best = y; await page.screenshot({ path: join(OUT, `${process.env.NAME || 'sunshot'}.png`) }); }
}
console.log('sun shot at camera height', best.toFixed(1));
await browser.close(); server.close();
