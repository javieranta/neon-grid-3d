/**
 * NEON GRID — entry point.
 *
 * Wires the pure simulation to the renderer, the procedural audio and the DOM
 * HUD, and drives everything from a fixed-timestep loop so gameplay is frame
 * rate independent from a 120Hz iPad down to a struggling old phone.
 */

import { STATE, createGame } from './core/game.js';
import { GHOST_ORDER } from './core/ghost.js';
import { createAudio } from './audio/synth.js';
import { createRenderer } from './render/renderer.js';
import { TIER_ORDER, createPerfWatchdog, detectTier } from './render/quality.js';
import { createHud } from './ui/hud.js';
import { createInput } from './ui/input.js';

const FIXED_DT = 1 / 120;
const MAX_FRAME = 0.25;
const HIGH_SCORE_KEY = 'neon-grid-highscore';

function loadHighScore() {
  try {
    return Number(localStorage.getItem(HIGH_SCORE_KEY) || 0) || 0;
  } catch {
    return 0;
  }
}

function saveHighScore(value) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(value));
  } catch {
    /* private mode — high score simply will not persist */
  }
}

function boot() {
  const canvas = document.getElementById('scene');
  const ui = document.getElementById('ui');
  const loader = document.getElementById('loader');

  const game = createGame({ highScore: loadHighScore() });

  // ?tier=ultra|high|medium|low|potato pins the quality tier and disables the
  // adaptive watchdog — handy for capture, benchmarking and stubborn devices.
  const params = new URLSearchParams(location.search);
  const forced = params.get('tier');
  const pinned = forced && TIER_ORDER.includes(forced) ? forced : null;
  const tier = pinned ?? detectTier();

  let view;
  try {
    view = createRenderer(canvas, game, tier);
  } catch (err) {
    console.error('[neon-grid] renderer failed', err);
    if (loader) {
      loader.querySelector('.loader-text').textContent =
        'WebGL could not start on this device. Try another browser.';
    }
    return;
  }

  const audio = createAudio();
  const hud = createHud(ui, game);

  let paused = false;
  let wakaFlip = false;
  let savedHigh = game.highScore;

  /* ------------------------------------------------------------- game events */

  game.on('pellet', () => {
    wakaFlip = !wakaFlip;
    audio.waka(wakaFlip);
  });

  game.on('energizer', ({ seconds }) => {
    audio.energizer();
    view.post.flash(0x66ccff, 0.42, 0.32);
    view.punch(0.8);
    view.shake(0.25);
    if (seconds > 0) hud.showToast('POWER SURGE — HUNT THEM DOWN', 1.8);
  });

  game.on('ghostEaten', ({ points, chain }) => {
    audio.ghostEaten(chain);
    view.post.flash(0xffffff, 0.5, 0.22);
    view.shake(0.45);
    view.punch(0.5);
    hud.showToast(`+${points}`, 1.0);
  });

  game.on('fruitSpawn', ({ fruit }) => {
    hud.showToast(`${fruit.label} — ${fruit.points} PTS`, 2.2);
    audio.ui();
  });

  game.on('fruitEaten', ({ fruit }) => {
    audio.fruit();
    view.post.flash(0xffd36e, 0.4, 0.3);
    view.shake(0.2);
    hud.showToast(`${fruit.label} +${fruit.points}`, 1.6);
  });

  game.on('death', () => {
    audio.death();
    audio.setSiren('off');
    view.post.glitch(1.2);
    view.post.flash(0xff2b5e, 0.6, 0.5);
    view.shake(1.1);
  });

  game.on('extraLife', () => {
    audio.extraLife();
    hud.showToast('EXTRA LIFE', 2.0);
    view.post.flash(0x9bff8f, 0.35, 0.4);
  });

  game.on('levelClear', ({ level }) => {
    audio.levelClear();
    audio.setSiren('off');
    view.post.flash(0xffffff, 0.55, 0.6);
    view.shake(0.5);
    hud.showToast(`GRID ${level} CLEARED`, 2.2);
  });

  game.on('ready', ({ intro }) => {
    audio.ready();
    if (intro) view.setCameraMode('overview');
  });

  game.on('gameOver', () => {
    audio.gameOver();
    audio.setSiren('off');
    view.post.glitch(1.6);
    if (game.highScore > savedHigh) {
      savedHigh = game.highScore;
      saveHighScore(savedHigh);
    }
  });

  game.on('attract', () => {
    view.setCameraMode('cinematic');
    hud.showTitle();
  });

  game.on('modeChange', ({ mode }) => {
    if (game.state === STATE.PLAYING) hud.showToast(mode === 'chase' ? 'THEY ARE HUNTING' : 'THEY SCATTER', 1.4);
  });

  /* -------------------------------------------------------------------- input */

  function startOrResume() {
    audio.unlock();
    if (paused) {
      paused = false;
      hud.setPaused(false);
      return;
    }
    if (game.state === STATE.ATTRACT) {
      hud.hideTitle();
      game.startGame();
      view.setCameraMode('overview');
    }
  }

  function togglePause() {
    if (game.state === STATE.ATTRACT) return;
    paused = !paused;
    hud.setPaused(paused);
    audio.setSiren(paused ? 'off' : 'normal');
    audio.ui();
  }

  const input = createInput(canvas, {
    onDirection: (dir) => game.setDirection(dir),
    onStart: startOrResume,
    onPause: togglePause,
    onCamera: () => {
      const mode = view.cycleCameraMode();
      hud.showToast(`CAMERA — ${mode.replace(/([A-Z])/g, ' $1').toUpperCase()}`, 1.4);
      audio.ui();
    },
    onSound: () => {
      const on = audio.toggle();
      hud.showToast(on ? 'SOUND ON' : 'SOUND OFF', 1.4);
    },
    onFullscreen: async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch {
        hud.showToast('FULLSCREEN UNAVAILABLE', 1.6);
      }
    },
    onAnyInput: () => audio.unlock(),
  });

  input.bindPad(document.getElementById('pad'));
  input.bindButton(document.getElementById('btn-pause'), togglePause);
  input.bindButton(document.getElementById('btn-camera'), () => {
    const mode = view.cycleCameraMode();
    hud.showToast(`CAMERA — ${mode.replace(/([A-Z])/g, ' $1').toUpperCase()}`, 1.4);
  });
  input.bindButton(document.getElementById('btn-sound'), () => {
    const on = audio.toggle();
    hud.showToast(on ? 'SOUND ON' : 'SOUND OFF', 1.4);
  });
  input.bindButton(document.getElementById('btn-start'), startOrResume);
  input.bindButton(document.getElementById('btn-fullscreen'), async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      hud.showToast('FULLSCREEN UNAVAILABLE', 1.6);
    }
  });

  if (input.isTouch) document.body.classList.add('touch');

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.state !== STATE.ATTRACT) {
      paused = true;
      hud.setPaused(true);
      audio.setSiren('off');
    }
  });

  /* --------------------------------------------------------------------- loop */

  const watchdog = pinned
    ? { sample() {} }
    : createPerfWatchdog((next, avg) => {
        view.applyTier(next);
        hud.showToast(`QUALITY → ${next.toUpperCase()}`, 1.8);
        console.info(`[neon-grid] tier -> ${next} (avg frame ${(avg * 1000).toFixed(1)}ms)`);
      }, tier);

  let last = performance.now();
  let accumulator = 0;
  let fpsAcc = 0;
  let fpsFrames = 0;
  let fps = 60;
  let frameCount = 0;

  function updateSiren() {
    if (paused || game.state !== STATE.PLAYING) {
      audio.setSiren('off');
      return;
    }
    const returning = GHOST_ORDER.some(
      (id) => game.ghosts[id].state === 'eaten' || game.ghosts[id].state === 'entering'
    );
    if (returning) audio.setSiren('retreat');
    else if (game.frightTimer > 0) audio.setSiren('fright');
    else {
      const progress = 1 - game.maze.remaining / game.maze.totalPellets;
      audio.setSiren('normal', progress);
      audio.setIntensity(Math.min(1, progress * 0.7 + (game.level - 1) * 0.08));
    }
  }

  function frame(now) {
    const raw = Math.min((now - last) / 1000, MAX_FRAME);
    last = now;

    fpsAcc += raw;
    fpsFrames++;
    if (fpsAcc >= 0.5) {
      fps = Math.round(fpsFrames / fpsAcc);
      fpsAcc = 0;
      fpsFrames = 0;
    }
    watchdog.sample(raw);

    if (!paused) {
      accumulator += raw;
      let steps = 0;
      while (accumulator >= FIXED_DT && steps < 12) {
        game.step(FIXED_DT);
        accumulator -= FIXED_DT;
        steps++;
      }
      if (accumulator > FIXED_DT * 12) accumulator = 0;
    }

    updateSiren();
    view.render(raw);

    frameCount++;
    if (frameCount % 6 === 0) {
      const s = view.stats();
      hud.update(raw * 6, { ...s, fps });
    } else {
      hud.update(raw, null);
    }

    if (game.highScore > savedHigh) {
      savedHigh = game.highScore;
      saveHighScore(savedHigh);
    }

    requestAnimationFrame(frame);
  }

  // Reveal the scene once the first frame is on screen.
  requestAnimationFrame((t) => {
    last = t;
    view.render(0.016);
    if (loader) loader.classList.add('done');
    document.body.classList.add('booted');
    requestAnimationFrame(frame);
  });

  // Expose a tiny harness so the automated tests can drive the game headlessly.
  window.__neon = {
    game,
    view,
    audio,
    input,
    STATE,
    setDirection: (d) => game.setDirection(d),
    start: () => {
      hud.hideTitle();
      game.startGame();
      view.setCameraMode('overview');
    },
    stats: () => ({ ...view.stats(), fps }),
    get paused() {
      return paused;
    },
    setPaused: (v) => {
      paused = v;
      hud.setPaused(v);
    },
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
