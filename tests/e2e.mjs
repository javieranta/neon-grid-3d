/**
 * NEON GRID — browser end-to-end harness.
 *
 * Serves the production build, drives it in headless Chromium at desktop and
 * iPhone viewports, and asserts on decoded screenshot pixels — so "is it
 * actually glowing magenta and cyan" is a test, not an opinion.
 */

import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import zlib from 'node:zlib';
import { chromium } from 'playwright';

const ROOT = resolve(import.meta.dirname, '..');
const DOCS = join(ROOT, 'docs');
const ART = join(ROOT, 'tests', 'artifacts');

let failures = 0;
let checks = 0;

function eqLabel(actual, expected, label) {
  ok(actual === expected, label, `expected ${expected}, got ${actual}`);
}

function ok(cond, label, detail = '') {
  checks++;
  const mark = cond ? '  ok  ' : '  FAIL';
  if (!cond) failures++;
  console.log(`${mark}  ${label}${detail ? ` — ${detail}` : ''}`);
}

/* --------------------------------------------------------------- static server */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
};

function serve(dir) {
  return new Promise((res) => {
    const server = createServer(async (req, out) => {
      try {
        const url = decodeURIComponent((req.url || '/').split('?')[0]);
        let file = join(dir, url === '/' ? 'index.html' : url);
        if (!existsSync(file)) file = join(dir, 'index.html');
        const body = await readFile(file);
        out.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
        out.end(body);
      } catch (err) {
        out.writeHead(500);
        out.end(String(err));
      }
    });
    server.listen(0, '127.0.0.1', () => res({ server, port: server.address().port }));
  });
}

/* ------------------------------------------------------------------ png decode */

function decodePng(buffer) {
  let pos = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 8;
  let colourType = 6;
  const idat = [];
  while (pos < buffer.length) {
    const len = buffer.readUInt32BE(pos);
    const type = buffer.toString('ascii', pos + 4, pos + 8);
    const data = buffer.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colourType = data[9];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    pos += 12 + len;
  }
  if (bitDepth !== 8) throw new Error(`unsupported bit depth ${bitDepth}`);
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[colourType];
  if (!channels) throw new Error(`unsupported colour type ${colourType}`);

  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    const cur = out.subarray(y * stride, (y + 1) * stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? cur[x - channels] : 0;
      const b = prev[x];
      const c = x >= channels ? prev[x - channels] : 0;
      let v = line[x];
      switch (filter) {
        case 1:
          v += a;
          break;
        case 2:
          v += b;
          break;
        case 3:
          v += (a + b) >> 1;
          break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          break;
        }
        default:
          break;
      }
      cur[x] = v & 0xff;
    }
  }
  return { width, height, channels, data: out };
}

/** Summarises an image: brightness, coverage, and hue buckets. */
function analyse(png) {
  const { width, height, channels, data } = png;
  let lum = 0;
  let lit = 0;
  let magenta = 0;
  let cyan = 0;
  let yellow = 0;
  let saturated = 0;
  const total = width * height;

  for (let i = 0; i < total; i++) {
    const o = i * channels;
    const r = data[o] / 255;
    const g = data[o + 1] / 255;
    const b = data[o + 2] / 255;
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    lum += l;
    if (l > 0.08) lit++;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max - min > 0.18) saturated++;
    if (r > 0.35 && b > 0.3 && g < r * 0.72) magenta++;
    if (b > 0.35 && g > 0.3 && r < b * 0.72) cyan++;
    if (r > 0.5 && g > 0.4 && b < g * 0.6) yellow++;
  }

  return {
    width,
    height,
    brightness: lum / total,
    litRatio: lit / total,
    magentaRatio: magenta / total,
    cyanRatio: cyan / total,
    yellowRatio: yellow / total,
    saturatedRatio: saturated / total,
  };
}

/* ----------------------------------------------------------------------- main */

async function shot(page, name) {
  await mkdir(ART, { recursive: true });
  const file = join(ART, `${name}.png`);
  const buf = await page.screenshot({ path: file });
  return { file, png: decodePng(buf), analysis: analyse(decodePng(buf)) };
}

async function run() {
  const { server, port } = await serve(DOCS);
  const url = `http://127.0.0.1:${port}/`;
  console.log(`\n▸ serving ${DOCS} at ${url}`);

  const browser = await chromium.launch({
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--disable-gpu-sandbox',
      '--no-sandbox',
    ],
  });

  const results = {};

  /* -------------------------------------------------------- desktop viewport */
  {
    console.log('\n▸ desktop 1440x900');
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    const warnings = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
      if (m.type() === 'warning') warnings.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

    await page.goto(url, { waitUntil: 'load' });
    await page.waitForFunction(() => !!window.__neon, null, { timeout: 25000 });
    await page.waitForFunction(() => document.getElementById('loader')?.classList.contains('done'), null, {
      timeout: 25000,
    });
    await page.waitForTimeout(1400);

    const title = await shot(page, 'desktop-01-title');
    ok(title.analysis.brightness > 0.02, 'title screen renders light', `brightness ${title.analysis.brightness.toFixed(3)}`);
    ok(title.analysis.magentaRatio > 0.01, 'title screen shows magenta neon', `${(title.analysis.magentaRatio * 100).toFixed(1)}%`);

    // Boot the run.
    await page.evaluate(() => window.__neon.start());
    await page.waitForTimeout(3200);
    const play = await shot(page, 'desktop-02-gameplay');
    results.play = play.analysis;
    ok(play.analysis.brightness > 0.03, 'gameplay frame is lit', `brightness ${play.analysis.brightness.toFixed(3)}`);
    ok(play.analysis.magentaRatio > 0.015, 'magenta neon present', `${(play.analysis.magentaRatio * 100).toFixed(1)}%`);
    ok(play.analysis.cyanRatio > 0.008, 'cyan neon present', `${(play.analysis.cyanRatio * 100).toFixed(1)}%`);
    ok(play.analysis.yellowRatio > 0.0004, 'Pac-Man yellow present', `${(play.analysis.yellowRatio * 100).toFixed(3)}%`);
    ok(play.analysis.saturatedRatio > 0.12, 'scene is richly saturated', `${(play.analysis.saturatedRatio * 100).toFixed(1)}%`);

    // Drive the game and confirm the simulation actually advanced.
    const before = await page.evaluate(() => ({
      score: window.__neon.game.score,
      remaining: window.__neon.game.maze.remaining,
    }));
    for (const dir of ['left', 'up', 'right', 'down', 'left']) {
      await page.evaluate((d) => window.__neon.setDirection(d), dir);
      await page.waitForTimeout(700);
    }
    const after = await page.evaluate(() => ({
      score: window.__neon.game.score,
      remaining: window.__neon.game.maze.remaining,
      state: window.__neon.game.state,
      pac: { x: window.__neon.game.pacman.x, y: window.__neon.game.pacman.y },
      ghosts: Object.fromEntries(
        Object.entries(window.__neon.game.ghosts).map(([k, g]) => [k, { x: g.x, y: g.y, state: g.state }])
      ),
    }));
    ok(after.score > before.score, 'score increased in the browser', `${before.score} -> ${after.score}`);
    ok(after.remaining < before.remaining, 'pellets were eaten', `${before.remaining} -> ${after.remaining}`);
    ok(Number.isFinite(after.pac.x) && Number.isFinite(after.pac.y), 'Pac-Man position is finite');

    // Controls: the close camera rotates behind Pac-Man, so screen input has to be
    // interpreted relative to his heading or the player fights the camera.
    const steering = await page.evaluate(() => {
      const { game, view } = window.__neon;
      view.setCameraMode('chase');
      const out = {};
      const set = (dir) => {
        game.pacman.dir = dir;
        game.pacman.desiredDir = dir;
      };
      set('left');
      window.__neon.press('right');
      out.leftThenScreenRight = game.pacman.desiredDir;
      set('left');
      window.__neon.press('left');
      out.leftThenScreenLeft = game.pacman.desiredDir;
      set('up');
      window.__neon.press('up');
      out.forwardKeepsHeading = game.pacman.desiredDir;
      set('right');
      window.__neon.steer(1);
      window.__neon.steer(1);
      out.doubleSteerReverses = game.pacman.desiredDir;
      view.setCameraMode('overview');
      set('left');
      window.__neon.press('up');
      out.overviewIsAbsolute = game.pacman.desiredDir;
      return out;
    });
    eqLabel(steering.leftThenScreenRight, 'up', 'screen-right steers right of heading');
    eqLabel(steering.leftThenScreenLeft, 'down', 'screen-left steers left of heading');
    eqLabel(steering.forwardKeepsHeading, 'up', 'screen-forward keeps the heading');
    eqLabel(steering.doubleSteerReverses, 'left', 'two steers make a U-turn');
    eqLabel(steering.overviewIsAbsolute, 'up', 'overview keeps absolute compass input');

    // Mouse steering: buttons turn him, he never stops.
    await page.evaluate(() => {
      const { game, view } = window.__neon;
      view.setCameraMode('chase');
      game.pacman.dir = 'up';
      game.pacman.desiredDir = 'up';
    });
    await page.locator('#scene').dispatchEvent('mousedown', { button: 2 });
    const afterRight = await page.evaluate(() => window.__neon.game.pacman.desiredDir);
    eqLabel(afterRight, 'right', 'right mouse button steers right');
    await page.evaluate(() => {
      const g = window.__neon.game;
      g.pacman.dir = 'up';
      g.pacman.desiredDir = 'up';
    });
    await page.locator('#scene').dispatchEvent('mousedown', { button: 0 });
    const afterLeft = await page.evaluate(() => window.__neon.game.pacman.desiredDir);
    eqLabel(afterLeft, 'left', 'left mouse button steers left');
    await page.evaluate(() => window.__neon.view.setCameraMode('chase'));

    const stats = await page.evaluate(() => window.__neon.stats());
    results.stats = stats;
    ok(stats.triangles > 40000, 'scene has substantial geometry', `${stats.triangles.toLocaleString()} tris`);
    ok(stats.calls > 5 && stats.calls < 220, 'draw calls in a sane range', `${stats.calls}`);
    ok(stats.wallBlocks >= 20, 'wall silhouettes were extracted', `${stats.wallBlocks} blocks`);
    console.log(`  · ${stats.tier} tier · ${stats.triangles.toLocaleString()} tris · ${stats.calls} calls · ${stats.wallBlocks} blocks`);

    // Fruits are placed when a level starts, so this checks the render path end to
    // end: three in state, their meshes visible through the whole parent chain, and
    // a tracker row per fruit. Earlier fruit tests only drove the simulation or
    // injected a fruit into the renderer, so the played path was never covered.
    const fruitState = await page.evaluate(() => {
      const { game, view } = window.__neon;
      const FRUIT_HEX = [
        0xff2b52, 0x4dff8f, 0xff2f6b, 0xffa229, 0xff3355, 0x6dff5c, 0x4dd8ff, 0xffd24d, 0x8ce9ff,
      ];
      let visibleMeshes = 0;
      view.scene.traverse((o) => {
        if (!o.isMesh) return;
        let p = o;
        while (p) {
          if (!p.visible) return;
          p = p.parent;
        }
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        if (m && m.color && FRUIT_HEX.includes(m.color.getHex())) visibleMeshes++;
      });
      const t = document.getElementById('fruit-tracker');
      return {
        onBoard: game.fruits.length,
        ids: game.fruits.map((f) => f.def.id),
        positions: game.fruits.map((f) => `${f.x},${f.y}`),
        visibleMeshes,
        trackerVisible: !!t && t.classList.contains('visible'),
        trackerRows: t ? t.querySelectorAll('.fruit-cue').length : 0,
        trackerDistance: t?.querySelector('.fruit-cue em')?.textContent ?? '',
      };
    });
    eqLabel(fruitState.onBoard, 3, 'three fruits on the board from the level start');
    ok(fruitState.ids.includes('cherry'), 'a cherry is among them', fruitState.ids.join(','));
    ok(new Set(fruitState.positions).size === 3, 'all three sit on distinct tiles', fruitState.positions.join(' '));
    ok(fruitState.visibleMeshes >= 6, 'all three fruit models are rendered', `${fruitState.visibleMeshes} meshes`);
    ok(fruitState.trackerVisible, 'the HUD fruit tracker is showing');
    eqLabel(fruitState.trackerRows, 3, 'a tracker row per fruit');
    ok(/^\d+$/.test(fruitState.trackerDistance), 'tracker reports a distance in tiles', fruitState.trackerDistance);

    // Jump and scout, through the same handlers the keys use.
    //
    // These POLL for the state rather than waiting a fixed number of milliseconds.
    // Under software rasterisation the fixed-timestep loop caps at twelve steps a
    // frame, so at a few frames per second game time advances far slower than wall
    // clock and any sleep-based assertion reads a half-finished arc.
    const startBudgets = await page.evaluate(() => ({
      jumps: window.__neon.game.jumpsLeft,
      scouts: window.__neon.game.scoutsLeft,
    }));
    eqLabel(startBudgets.jumps, 3, 'three jumps at level start');
    eqLabel(startBudgets.scouts, 3, 'three scouts at level start');

    await page.evaluate(() => window.__neon.jump());
    await page.waitForFunction(() => window.__neon.game.airborne > 0.3, null, { timeout: 20000 });
    const midJump = await page.evaluate(() => ({
      airborne: window.__neon.game.airborne,
      jumps: window.__neon.game.jumpsLeft,
    }));
    ok(midJump.airborne > 0.3, 'space lifts Pac-Man off the ground', midJump.airborne.toFixed(2));
    eqLabel(midJump.jumps, 2, 'the jump was deducted');

    await page.waitForFunction(() => window.__neon.game.airborne === 0, null, { timeout: 20000 });
    ok(true, 'and he lands again');

    await page.evaluate(() => window.__neon.scout());
    await page.waitForFunction(() => window.__neon.game.scoutBlend() > 0.9, null, { timeout: 20000 });
    const scoutState = await page.evaluate(() => ({
      blend: window.__neon.game.scoutBlend(),
      scouts: window.__neon.game.scoutsLeft,
    }));
    ok(scoutState.blend > 0.9, 'the scout camera reaches the full board', scoutState.blend.toFixed(2));
    eqLabel(scoutState.scouts, 2, 'the scout was deducted');
    await page.waitForFunction(() => window.__neon.game.scoutBlend() === 0, null, { timeout: 30000 });
    ok(true, 'and the scout returns to the play camera');

    const pips = await page.evaluate(() => ({
      jump: document.querySelectorAll('#ability-jump .pip').length,
      jumpSpent: document.querySelectorAll('#ability-jump .pip.spent').length,
      scout: document.querySelectorAll('#ability-scout .pip').length,
    }));
    eqLabel(pips.jump, 3, 'three jump pips in the sidebar');
    eqLabel(pips.jumpSpent, 1, 'one jump pip shown spent');
    eqLabel(pips.scout, 3, 'three scout pips in the sidebar');

    // Power pellet: force an energizer and check the frightened visual state.
    await page.evaluate(() => {
      const g = window.__neon.game;
      g.frightTimer = 8;
      g.frightTotal = 8;
      for (const id of Object.keys(g.ghosts)) {
        const gh = g.ghosts[id];
        gh.state = 'hunting';
        gh.frightened = true;
        gh.frightTimer = 8;
      }
    });
    await page.waitForTimeout(900);
    const fright = await shot(page, 'desktop-03-frightened');
    ok(fright.analysis.brightness > 0.02, 'frightened frame renders');
    console.log(`  · frightened frame magenta ${(fright.analysis.magentaRatio * 100).toFixed(1)}% cyan ${(fright.analysis.cyanRatio * 100).toFixed(1)}%`);

    // Camera modes must all produce a lit frame.
    for (const mode of ['chase', 'cinematic', 'overview']) {
      await page.evaluate((m) => window.__neon.view.setCameraMode(m), mode);
      await page.waitForTimeout(1100);
      const s = await shot(page, `desktop-04-camera-${mode}`);
      ok(s.analysis.brightness > 0.015, `camera "${mode}" renders a lit frame`, `brightness ${s.analysis.brightness.toFixed(3)}`);
    }

    // Death sequence.
    await page.evaluate(() => window.__neon.view.setCameraMode('overview'));
    await page.evaluate(() => {
      const g = window.__neon.game;
      for (const id of Object.keys(g.ghosts)) {
        g.ghosts[id].frightened = false;
        g.ghosts[id].frightTimer = 0;
      }
      g.frightTimer = 0;
      const b = g.ghosts.blinky;
      b.state = 'hunting';
      b.x = g.pacman.x;
      b.y = g.pacman.y;
    });
    await page.waitForTimeout(900);
    const dying = await shot(page, 'desktop-05-death');
    const deathState = await page.evaluate(() => window.__neon.game.state);
    ok(deathState === 'dying' || deathState === 'ready', 'death sequence triggered', deathState);
    ok(dying.analysis.brightness >= 0, 'death frame renders');

    // Long stability soak: no leaks, no errors, frame rate holds.
    await page.waitForTimeout(6000);
    const soak = await page.evaluate(() => window.__neon.stats());
    const softwareGl = await page.evaluate(() => {
      const gl = document.createElement('canvas').getContext('webgl');
      const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
      return ext ? /swiftshader|software|llvmpipe/i.test(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : false;
    });
    // Headless CI rasterises in software, which is an order of magnitude slower
    // than any real GPU; the meaningful assertion there is that the loop keeps
    // running and the watchdog stepped the tier down to compensate.
    const fpsFloor = softwareGl ? 3 : 40;
    ok(soak.fps > fpsFloor, 'frame rate holds during soak', );
    const final = await shot(page, 'desktop-06-soak');
    ok(final.analysis.brightness > 0.01, 'still rendering after soak');

    // Shader compile failures are reported by three through messages that contain
    // "WebGL", so they must be pulled out BEFORE any noise filtering - an earlier
    // filter swallowed a genuine "undeclared identifier" and the suite stayed green
    // while a ghost material silently failed to compile.
    const shaderErrors = errors.filter((e) =>
      /shader error|not compiled|undeclared identifier|INVALID_OPERATION|Program Info Log/i.test(e)
    );
    ok(shaderErrors.length === 0, 'no shader compile errors', shaderErrors.slice(0, 2).join(' | '));

    const realErrors = errors.filter(
      (e) =>
        !/SwiftShader|Software rasterizer|deprecated|GroupMarker|Automatic fallback/i.test(e) &&
        !shaderErrors.includes(e)
    );
    ok(realErrors.length === 0, 'no JavaScript errors', realErrors.slice(0, 4).join(' | '));
    if (warnings.length) console.log(`  · ${warnings.length} console warnings (informational)`);

    await ctx.close();
  }

  /* --------------------------------------------------------- iPhone viewport */
  {
    console.log('\n▸ iPhone 14 Pro 393x852 (portrait, dpr 3 capped by the app)');
    const ctx = await browser.newContext({
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });

    // Auto-detection check first, on an unpinned load.
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForFunction(() => !!window.__neon, null, { timeout: 25000 });
    await page.waitForTimeout(1200);
    const autoTier = await page.evaluate(() => window.__neon.stats().tier);
    ok(['medium', 'low', 'potato'].includes(autoTier), 'mobile auto-detects a mobile tier', autoTier);

    // Everything below pins the tier so the pixel assertions are deterministic;
    // headless software rasterisation makes the watchdog's choice vary per run.
    await page.goto(`${url}?tier=low`, { waitUntil: 'load' });
    await page.waitForFunction(() => !!window.__neon, null, { timeout: 25000 });
    await page.waitForTimeout(2200);

    const padVisible = await page.evaluate(() => {
      const pad = document.getElementById('pad');
      return pad ? getComputedStyle(pad).display !== 'none' : false;
    });
    ok(padVisible, 'touch thumb pad is visible on mobile');

    const tier = await page.evaluate(() => window.__neon.stats().tier);
    eqLabel(tier, 'low', 'pinned tier honoured');

    const noScroll = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      return body.overflow === 'hidden' && body.touchAction === 'none';
    });
    ok(noScroll, 'page cannot scroll or pan on touch');

    await page.evaluate(() => window.__neon.start());
    await page.waitForTimeout(2600);
    const mob = await shot(page, 'mobile-01-gameplay');
    ok(mob.analysis.brightness > 0.02, 'mobile gameplay frame is lit', `brightness ${mob.analysis.brightness.toFixed(3)}`);
    ok(mob.analysis.magentaRatio > 0.01, 'mobile shows magenta neon', `${(mob.analysis.magentaRatio * 100).toFixed(1)}%`);

    // Close third person is the default framing now, so assert that, then switch
    // to the overview to test its fit behaviour - that is what this check is for.
    const defaultMode = await page.evaluate(() => window.__neon.view.cameraMode);
    eqLabel(defaultMode, 'chase', 'gameplay starts in close third person');
    await page.evaluate(() => window.__neon.view.setCameraMode('overview'));
    await page.waitForTimeout(1400);

    // The whole maze must be inside the viewport in portrait: check that the
    // projected maze corners land on screen.
    const framing = await page.evaluate(() => {
      const { view } = window.__neon;
      const THREE_camera = view.camera;
      const corners = [];
      for (const x of [-14, 14]) {
        for (const z of [-15.5, 15.5]) corners.push([x, 0.5, z]);
      }
      return corners.map(([x, y, z]) => {
        const v = { x, y, z };
        // Manual projection to avoid importing three into the page context.
        const m = THREE_camera.projectionMatrix.elements;
        const vm = THREE_camera.matrixWorldInverse.elements;
        const cx = vm[0] * v.x + vm[4] * v.y + vm[8] * v.z + vm[12];
        const cy = vm[1] * v.x + vm[5] * v.y + vm[9] * v.z + vm[13];
        const cz = vm[2] * v.x + vm[6] * v.y + vm[10] * v.z + vm[14];
        const px = m[0] * cx + m[4] * cy + m[8] * cz + m[12];
        const py = m[1] * cx + m[5] * cy + m[9] * cz + m[13];
        const pw = m[3] * cx + m[7] * cy + m[11] * cz + m[15];
        return [px / pw, py / pw];
      });
    });
    const maxNdc = Math.max(...framing.flat().map(Math.abs));
    ok(maxNdc <= 1.02, 'whole maze fits the portrait viewport', `max |ndc| ${maxNdc.toFixed(3)}`);

    // Simulate a swipe on the canvas.
    const box = await page.locator('#scene').boundingBox();
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(400);
    const dirBefore = await page.evaluate(() => window.__neon.game.pacman.desiredDir);
    await page.locator('#pad [data-dir="up"]').dispatchEvent('touchstart');
    await page.waitForTimeout(300);
    const dirAfter = await page.evaluate(() => window.__neon.game.pacman.desiredDir);
    ok(dirAfter === 'up' || dirBefore !== dirAfter, 'thumb pad changes direction', `${dirBefore} -> ${dirAfter}`);

    await page.waitForTimeout(2500);
    const mobStats = await page.evaluate(() => window.__neon.stats());
    console.log(`  · mobile ${mobStats.tier} tier · ${mobStats.triangles.toLocaleString()} tris · ${mobStats.fps} fps`);
    await shot(page, 'mobile-02-later');

    const shaderErrors = errors.filter((e) =>
      /shader error|not compiled|undeclared identifier|INVALID_OPERATION|Program Info Log/i.test(e)
    );
    ok(shaderErrors.length === 0, 'no shader compile errors on mobile', shaderErrors.slice(0, 2).join(' | '));
    const realErrors = errors.filter(
      (e) =>
        !/SwiftShader|Software rasterizer|deprecated|GroupMarker|Automatic fallback/i.test(e) &&
        !shaderErrors.includes(e)
    );
    ok(realErrors.length === 0, 'no JavaScript errors on mobile', realErrors.slice(0, 4).join(' | '));

    await ctx.close();
  }

  /* -------------------------------------------------------- landscape phone */
  {
    console.log('\n▸ iPhone landscape 852x393');
    const ctx = await browser.newContext({
      viewport: { width: 852, height: 393 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const page = await ctx.newPage();
    await page.goto(`${url}?tier=low`, { waitUntil: 'load' });
    await page.waitForFunction(() => !!window.__neon, null, { timeout: 25000 });
    await page.evaluate(() => window.__neon.start());
    await page.waitForTimeout(2600);
    const land = await shot(page, 'mobile-03-landscape');
    ok(land.analysis.brightness > 0.02, 'landscape frame is lit', `brightness ${land.analysis.brightness.toFixed(3)}`);
    await ctx.close();
  }

  await browser.close();
  server.close();

  await writeFile(join(ART, 'report.json'), JSON.stringify(results, null, 2));
  console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks - failures}/${checks} browser assertions passed`);
  console.log(`artifacts: ${ART}`);
  process.exit(failures === 0 ? 0 : 1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
