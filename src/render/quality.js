/**
 * NEON GRID — quality tiers.
 *
 * The same scene runs from a desktop GPU down to an older iPhone. Rather than
 * guessing once at boot, we pick a starting tier from the device profile and
 * then let a frame-time watchdog walk the tier down if we miss budget.
 */

const BASE = {
  name: 'ultra',
  pixelRatioCap: 2,
  msaa: 4,
  shadows: true,
  shadowMap: 2048,
  reflections: true,
  reflectActors: true,
  motes: 900,
  shafts: false,
  actorLights: true,
  ghostLights: true,
  energizerLights: true,
  bloomStrength: 0.70,
  bloomRadius: 0.62,
  bloomThreshold: 0.72,
  aberration: 0.75,
  scanline: 0.055,
  grain: 0.055,
  tubeRadial: 10,
  tubeArcSegments: 6,
  bevelSegments: 2,
  glowMapSize: 1024,
  pacSegments: 48,
  ghostSegments: 40,
  pelletSegments: 10,
};

export const TIERS = {
  ultra: { ...BASE },

  high: {
    ...BASE,
    name: 'high',
    msaa: 4,
    shadowMap: 1536,
    motes: 620,
    tubeRadial: 8,
    glowMapSize: 1024,
    pacSegments: 40,
    ghostSegments: 32,
  },

  medium: {
    ...BASE,
    name: 'medium',
    pixelRatioCap: 1.75,
    msaa: 0,
    shadows: false,
    reflections: true,
    reflectActors: true,
    motes: 380,
    shafts: false,
    ghostLights: false,
    energizerLights: false,
    bloomStrength: 0.64,
    bloomRadius: 0.58,
    tubeRadial: 7,
    tubeArcSegments: 5,
    bevelSegments: 1,
    glowMapSize: 768,
    pacSegments: 32,
    ghostSegments: 26,
    pelletSegments: 8,
  },

  low: {
    ...BASE,
    name: 'low',
    pixelRatioCap: 1.4,
    msaa: 0,
    shadows: false,
    reflections: true,
    reflectActors: false,
    motes: 160,
    shafts: false,
    actorLights: true,
    ghostLights: false,
    energizerLights: false,
    bloomStrength: 0.58,
    bloomRadius: 0.52,
    aberration: 0.6,
    scanline: 0.04,
    grain: 0.04,
    tubeRadial: 6,
    tubeArcSegments: 4,
    bevelSegments: 1,
    glowMapSize: 512,
    pacSegments: 26,
    ghostSegments: 20,
    pelletSegments: 6,
  },

  potato: {
    ...BASE,
    name: 'potato',
    pixelRatioCap: 1,
    msaa: 0,
    shadows: false,
    reflections: false,
    reflectActors: false,
    motes: 0,
    shafts: false,
    actorLights: false,
    ghostLights: false,
    energizerLights: false,
    bloomStrength: 0.5,
    bloomRadius: 0.46,
    aberration: 0.45,
    scanline: 0.03,
    grain: 0.03,
    tubeRadial: 5,
    tubeArcSegments: 3,
    bevelSegments: 0,
    glowMapSize: 512,
    pacSegments: 22,
    ghostSegments: 16,
    pelletSegments: 5,
  },
};

export const TIER_ORDER = ['ultra', 'high', 'medium', 'low', 'potato'];

/** Best guess at a starting tier from the device profile. */
export function detectTier() {
  if (typeof navigator === 'undefined') return 'high';
  const ua = navigator.userAgent || '';
  const touch = 'ontouchstart' in globalThis || (navigator.maxTouchPoints ?? 0) > 1;
  const mobile = /iPhone|iPad|iPod|Android/i.test(ua) || touch;
  const cores = navigator.hardwareConcurrency ?? 4;

  if (mobile) {
    // Modern iPhones hold 60fps on medium; the watchdog steps down from there
    // if the first seconds of frames say otherwise.
    return cores >= 6 ? 'medium' : 'low';
  }
  if (cores >= 12) return 'ultra';
  if (cores >= 6) return 'high';
  return 'medium';
}

/**
 * Frame-time watchdog. Reports a tier downgrade at most once every few seconds
 * so the scene never thrashes between rebuilds.
 */
export function createPerfWatchdog(onDowngrade, startTier) {
  let index = TIER_ORDER.indexOf(startTier);
  let acc = 0;
  let frames = 0;
  let cooldown = 3;
  let strikes = 0;

  return {
    get tier() {
      return TIER_ORDER[index];
    },
    sample(dt) {
      cooldown -= dt;
      acc += dt;
      frames++;
      if (acc < 1) return;
      const avg = acc / frames;
      acc = 0;
      frames = 0;
      if (cooldown > 0) return;

      // 22ms average means we are missing 45fps; two strikes and we step down.
      if (avg > 0.022) {
        strikes++;
        if (strikes >= 2 && index < TIER_ORDER.length - 1) {
          index++;
          strikes = 0;
          cooldown = 4;
          onDowngrade(TIER_ORDER[index], avg);
        }
      } else {
        strikes = Math.max(0, strikes - 1);
      }
    },
  };
}
