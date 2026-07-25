/**
 * NEON GRID — input.
 *
 * Keyboard for desktop, swipe plus a translucent thumb pad for touch. Touch
 * handling is deliberately defensive on iOS: every gesture calls
 * preventDefault so Safari never scrolls, rubber-bands or double-tap zooms the
 * canvas out from under the player.
 */

const KEY_DIRS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
  Numpad8: 'up',
  Numpad2: 'down',
  Numpad4: 'left',
  Numpad6: 'right',
};

const SWIPE_MIN = 24; // px before a drag counts as a direction

export function createInput(target, handlers) {
  const {
    onDirection = () => {},
    onStart = () => {},
    onPause = () => {},
    onCamera = () => {},
    onSound = () => {},
    onFullscreen = () => {},
    onAnyInput = () => {},
  } = handlers;

  let touchActive = false;
  let startX = 0;
  let startY = 0;
  let lastDir = null;
  let disposed = false;

  const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0;

  /* ------------------------------------------------------------------ keyboard */

  function onKeyDown(e) {
    if (e.repeat) return;
    onAnyInput();
    const dir = KEY_DIRS[e.code];
    if (dir) {
      e.preventDefault();
      onDirection(dir);
      onStart();
      return;
    }
    switch (e.code) {
      case 'Enter':
      case 'Space':
        e.preventDefault();
        onStart();
        break;
      case 'KeyP':
      case 'Escape':
        e.preventDefault();
        onPause();
        break;
      case 'KeyC':
        onCamera();
        break;
      case 'KeyM':
        onSound();
        break;
      case 'KeyF':
        onFullscreen();
        break;
      default:
        break;
    }
  }
  window.addEventListener('keydown', onKeyDown, { passive: false });

  /* --------------------------------------------------------------------- touch */

  function beginTouch(e) {
    const t = e.changedTouches ? e.changedTouches[0] : e;
    touchActive = true;
    startX = t.clientX;
    startY = t.clientY;
    lastDir = null;
    onAnyInput();
    onStart();
  }

  function moveTouch(e) {
    if (!touchActive) return;
    const t = e.changedTouches ? e.changedTouches[0] : e;
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) < SWIPE_MIN && Math.abs(dy) < SWIPE_MIN) return;
    const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
    if (dir !== lastDir) {
      lastDir = dir;
      onDirection(dir);
    }
    // Re-anchor so a continuous drag can chain turns.
    startX = t.clientX;
    startY = t.clientY;
  }

  function endTouch() {
    touchActive = false;
    lastDir = null;
  }

  target.addEventListener(
    'touchstart',
    (e) => {
      e.preventDefault();
      beginTouch(e);
    },
    { passive: false }
  );
  target.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
      moveTouch(e);
    },
    { passive: false }
  );
  target.addEventListener('touchend', (e) => {
    e.preventDefault();
    endTouch();
  }, { passive: false });
  target.addEventListener('touchcancel', endTouch, { passive: true });

  // Mouse drag mirrors the swipe gesture so the same code path is testable.
  target.addEventListener('mousedown', beginTouch);
  window.addEventListener('mousemove', moveTouch);
  window.addEventListener('mouseup', endTouch);

  // Kill iOS gesture zoom and the double-tap-to-zoom delay.
  for (const evt of ['gesturestart', 'gesturechange', 'gestureend']) {
    document.addEventListener(evt, (e) => e.preventDefault(), { passive: false });
  }
  document.addEventListener(
    'dblclick',
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );

  /* ----------------------------------------------------------------- thumb pad */

  function bindPad(root) {
    if (!root) return;
    const press = (dir) => (e) => {
      e.preventDefault();
      e.stopPropagation();
      onAnyInput();
      onStart();
      onDirection(dir);
    };
    for (const dir of ['up', 'down', 'left', 'right']) {
      const btn = root.querySelector(`[data-dir="${dir}"]`);
      if (!btn) continue;
      btn.addEventListener('touchstart', press(dir), { passive: false });
      btn.addEventListener('mousedown', press(dir));
    }
  }

  function bindButton(el, fn) {
    if (!el) return;
    const run = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onAnyInput();
      fn();
    };
    el.addEventListener('click', run);
    el.addEventListener('touchstart', run, { passive: false });
  }

  return {
    isTouch,
    bindPad,
    bindButton,
    dispose() {
      if (disposed) return;
      disposed = true;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousemove', moveTouch);
      window.removeEventListener('mouseup', endTouch);
    },
  };
}
