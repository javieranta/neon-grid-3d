/**
 * NEON GRID — HUD and overlays.
 *
 * Kept in the DOM rather than in-scene: crisp text at any pixel ratio, trivial
 * safe-area handling on notched iPhones, and no extra draw calls in the 3D pass.
 */

import { STATE } from '../core/game.js';
import { FRUITS } from '../core/levels.js';
import { GHOST_META, GHOST_ORDER } from '../core/ghost.js';

const FRUIT_GLYPH = {
  cherry: '🍒',
  strawberry: '🍓',
  orange: '🍊',
  apple: '🍎',
  melon: '🍈',
  galaxian: '🛸',
  bell: '🔔',
  key: '🗝️',
};

export function createHud(root, game) {
  const el = (sel) => root.querySelector(sel);

  const scoreEl = el('#score');
  const highEl = el('#highscore');
  const levelEl = el('#level');
  const livesEl = el('#lives');
  const fruitEl = el('#fruits');
  const centreEl = el('#centre');
  const centreTitle = el('#centre-title');
  const centreSub = el('#centre-sub');
  const titleEl = el('#title');
  const statsEl = el('#stats');
  const frightBar = el('#fright-bar');
  const frightFill = el('#fright-fill');
  const ghostList = el('#ghost-list');
  const toast = el('#toast');

  let lastScore = -1;
  let lastHigh = -1;
  let lastLives = -1;
  let lastLevel = -1;
  let lastFruits = -1;
  let lastState = null;
  let toastTimer = 0;

  // Ghost status chips, one per personality.
  const chips = {};
  if (ghostList) {
    for (const id of GHOST_ORDER) {
      const chip = document.createElement('div');
      chip.className = 'chip';
      const dot = document.createElement('span');
      dot.className = 'chip-dot';
      dot.style.background = `#${GHOST_META[id].colour.toString(16).padStart(6, '0')}`;
      dot.style.boxShadow = `0 0 10px #${GHOST_META[id].colour.toString(16).padStart(6, '0')}`;
      const label = document.createElement('span');
      label.textContent = GHOST_META[id].name;
      const mode = document.createElement('em');
      mode.textContent = '—';
      chip.append(dot, label, mode);
      ghostList.append(chip);
      chips[id] = { chip, mode };
    }
  }

  function pad(n, width) {
    return String(n).padStart(width, '0');
  }

  function renderLives(n) {
    livesEl.innerHTML = '';
    for (let i = 0; i < Math.max(0, Math.min(n, 8)); i++) {
      const s = document.createElement('span');
      s.className = 'life';
      livesEl.append(s);
    }
  }

  function renderFruits(history) {
    fruitEl.innerHTML = '';
    const shown = history.slice(-7);
    for (const f of shown) {
      const s = document.createElement('span');
      s.className = 'fruit-icon';
      s.textContent = FRUIT_GLYPH[f.id] ?? '●';
      s.title = `${f.label} ${f.points}`;
      fruitEl.append(s);
    }
  }

  function setCentre(title, sub, cls = '') {
    centreEl.className = `centre ${cls}`;
    centreEl.style.display = title || sub ? 'flex' : 'none';
    centreTitle.textContent = title ?? '';
    centreSub.innerHTML = sub ?? '';
  }

  return {
    showToast(message, seconds = 2.4) {
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('visible');
      toastTimer = seconds;
    },

    update(dt, stats) {
      if (game.score !== lastScore) {
        lastScore = game.score;
        scoreEl.textContent = pad(game.score, 6);
        scoreEl.classList.remove('bump');
        // Restart the CSS pop animation.
        void scoreEl.offsetWidth;
        scoreEl.classList.add('bump');
      }
      if (game.highScore !== lastHigh) {
        lastHigh = game.highScore;
        highEl.textContent = pad(game.highScore, 6);
      }
      if (game.level !== lastLevel) {
        lastLevel = game.level;
        levelEl.textContent = pad(game.level, 2);
      }
      if (game.lives !== lastLives) {
        lastLives = game.lives;
        renderLives(game.lives);
      }
      if (game.fruitHistory.length !== lastFruits) {
        lastFruits = game.fruitHistory.length;
        renderFruits(game.fruitHistory);
      }

      // Power-pellet timer bar.
      if (frightBar) {
        const active = game.frightTimer > 0 && game.frightTotal > 0;
        frightBar.style.opacity = active ? '1' : '0';
        if (active) {
          frightFill.style.transform = `scaleX(${game.frightTimer / game.frightTotal})`;
        }
      }

      // Ghost state chips.
      for (const id of GHOST_ORDER) {
        const c = chips[id];
        if (!c) continue;
        const g = game.ghosts[id];
        let label = game.mode === 'scatter' ? 'SCATTER' : 'CHASE';
        if (g.state === 'house') label = 'PENNED';
        else if (g.state === 'leaving') label = 'LAUNCH';
        else if (g.state === 'eaten' || g.state === 'entering') label = 'RESPAWN';
        else if (g.frightened) label = 'FLEEING';
        else if (id === 'blinky' && g.elroy > 0) label = `ELROY ${g.elroy}`;
        c.mode.textContent = label;
        c.chip.dataset.mode = label.split(' ')[0].toLowerCase();
      }

      // Centre overlay per game state.
      if (game.state !== lastState) {
        lastState = game.state;
        switch (game.state) {
          case STATE.ATTRACT:
            titleEl.classList.add('visible');
            setCentre('', '');
            break;
          case STATE.READY:
            titleEl.classList.remove('visible');
            setCentre('READY', 'GET SET', 'ready');
            break;
          case STATE.PLAYING:
            setCentre('', '');
            break;
          case STATE.LEVEL_CLEAR:
            setCentre(`LEVEL ${game.level} CLEAR`, 'ENTERING THE NEXT GRID', 'clear');
            break;
          case STATE.GAME_OVER:
            setCentre('GAME OVER', `FINAL SCORE ${pad(game.score, 6)}`, 'over');
            break;
          default:
            setCentre('', '');
            break;
        }
      }

      if (toastTimer > 0) {
        toastTimer -= dt;
        if (toastTimer <= 0 && toast) toast.classList.remove('visible');
      }

      if (statsEl && stats) {
        statsEl.textContent = `${stats.fps} FPS · ${stats.tier} · ${stats.triangles.toLocaleString()} tris · ${stats.calls} calls · ${stats.wallBlocks} blocks`;
      }
    },

    setPaused(paused) {
      if (paused) setCentre('PAUSED', 'PRESS P OR TAP TO RESUME', 'paused');
      else setCentre('', '');
    },

    hideTitle() {
      titleEl.classList.remove('visible');
    },
    showTitle() {
      titleEl.classList.add('visible');
    },
  };
}

export { FRUITS };
