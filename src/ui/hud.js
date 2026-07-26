/**
 * NEON GRID — HUD and overlays.
 *
 * Kept in the DOM rather than in-scene: crisp text at any pixel ratio, trivial
 * safe-area handling on notched iPhones, and no extra draw calls in the 3D pass.
 */

import { JUMPS_PER_LEVEL, SCOUTS_PER_LEVEL, STATE } from '../core/game.js';
import { DIRECTIONS } from '../core/maze.js';
import { FRUITS } from '../core/levels.js';
import { GHOST_META, GHOST_ORDER } from '../core/ghost.js';

/** Direction name -> [dx, dy] in tile space, for the fruit bearing arrow. */
const DIR_VECTORS = Object.fromEntries(
  Object.entries(DIRECTIONS).map(([k, v]) => [k, [v.x, v.y]])
);

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
  const fruitTracker = el('#fruit-tracker');
  const jumpPips = el('#ability-jump .ability-pips');
  const scoutPips = el('#ability-scout .ability-pips');
  const jumpRow = el('#ability-jump');
  const scoutRow = el('#ability-scout');

  let lastScore = -1;
  let lastHigh = -1;
  let lastLives = -1;
  let lastLevel = -1;
  let lastFruits = -1;
  let lastState = null;
  let toastTimer = 0;
  let lastFruitKey = '';
  let lastJumps = -1;
  let lastScouts = -1;

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

  /** Renders a spent/available pip row for a limited ability. */
  function renderPips(host, row, left, total) {
    if (!host) return;
    host.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const pip = document.createElement('span');
      pip.className = i < left ? 'pip' : 'pip spent';
      host.append(pip);
    }
    if (row) row.classList.toggle('empty', left === 0);
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

      if (game.jumpsLeft !== lastJumps) {
        lastJumps = game.jumpsLeft;
        renderPips(jumpPips, jumpRow, game.jumpsLeft, JUMPS_PER_LEVEL);
      }
      if (game.scoutsLeft !== lastScouts) {
        lastScouts = game.scoutsLeft;
        renderPips(scoutPips, scoutRow, game.scoutsLeft, SCOUTS_PER_LEVEL);
      }

      // Live fruit tracker. The close camera shows about eight tiles and no map,
      // so a fruit twenty tiles away is unfindable without a bearing. The arrow is
      // rotated into Pac-Man's own heading frame, because the camera sits behind
      // him and screen-up is whichever way he is facing.
      if (fruitTracker) {
        const fruits = game.fruits ?? [];
        if (fruits.length === 0) {
          fruitTracker.classList.remove('visible');
          fruitTracker.innerHTML = '';
          lastFruitKey = '';
        } else {
          const key = fruits.map((f) => `${f.def.id}${Math.round(f.x)}${Math.round(f.y)}`).join('|');
          if (key !== lastFruitKey) {
            lastFruitKey = key;
            fruitTracker.innerHTML = '';
            for (const f of fruits) {
              const row = document.createElement('div');
              row.className = 'fruit-cue';
              const glyph = document.createElement('span');
              glyph.className = 'fruit-cue-icon';
              glyph.textContent = FRUIT_GLYPH[f.def.id] ?? '●';
              const arrow = document.createElement('span');
              arrow.className = 'fruit-cue-arrow';
              arrow.textContent = '▲';
              const dist = document.createElement('em');
              row.append(glyph, arrow, dist);
              fruitTracker.append(row);
              f._cue = { arrow, dist };
            }
          }
          fruitTracker.classList.add('visible');

          const p = game.pacman;
          const heading = Math.atan2(DIR_VECTORS[p.dir]?.[0] ?? -1, -(DIR_VECTORS[p.dir]?.[1] ?? 0));
          for (const f of fruits) {
            if (!f._cue) continue;
            // Shortest delta accounting for the wrap tunnel.
            let dx = f.x - p.x;
            if (dx > 14) dx -= 28;
            if (dx < -14) dx += 28;
            const dy = f.y - p.y;
            const bearing = Math.atan2(dx, -dy) - heading;
            f._cue.arrow.style.transform = `rotate(${(bearing * 180) / Math.PI}deg)`;
            f._cue.dist.textContent = `${Math.round(Math.hypot(dx, dy))}`;
          }
        }
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
