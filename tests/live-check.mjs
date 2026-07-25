/** Verifies the deployed GitHub Pages build actually boots and plays, at iPhone size. */
import { chromium } from 'playwright';
const URL = 'https://javieranta.github.io/neon-grid-3d/';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });

for (const [label, opts] of [
  ['iPhone portrait', { viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' }],
  ['desktop', { viewport: { width: 1440, height: 900 } }],
]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  const failed = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', (r) => failed.push(`${r.url()} ${r.failure()?.errorText}`));
  await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => !!window.__neon, null, { timeout: 45000 });
  await page.evaluate(() => window.__neon.start());
  await page.waitForTimeout(4000);
  await page.evaluate(() => window.__neon.setDirection('left'));
  await page.waitForTimeout(2500);
  const s = await page.evaluate(() => ({ ...window.__neon.stats(), score: window.__neon.game.score, remaining: window.__neon.game.maze.remaining, state: window.__neon.game.state }));
  await page.screenshot({ path: `tests/artifacts/live-${label.replace(/\s+/g, '-')}.png` });
  const real = errors.filter((e) => !/WebGL|SwiftShader|Software|deprecated/i.test(e));
  console.log(`${label}: tier=${s.tier} score=${s.score} pelletsLeft=${s.remaining} state=${s.state} tris=${s.triangles} | errors=${real.length ? real.slice(0,3).join(' | ') : 'none'} | failedRequests=${failed.length ? failed.slice(0,3).join(' | ') : 'none'}`);
  await ctx.close();
}
await browser.close();
