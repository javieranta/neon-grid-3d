/**
 * NEON GRID — per-level tuning tables.
 *
 * Speeds are expressed as a fraction of "full speed", which in the arcade is
 * 75.75757 pixels/second across 8-pixel tiles => 9.4697 tiles/second.
 */

export const FULL_SPEED_TPS = 75.75757 / 8; // tiles per second at 100%

/** Fruit types, in the order they are awarded. */
export const FRUITS = [
  { id: 'cherry', points: 100, label: 'CHERRY' },
  { id: 'strawberry', points: 300, label: 'STRAWBERRY' },
  { id: 'orange', points: 500, label: 'ORANGE' },
  { id: 'apple', points: 700, label: 'APPLE' },
  { id: 'melon', points: 1000, label: 'MELON' },
  { id: 'galaxian', points: 2000, label: 'GALAXIAN' },
  { id: 'bell', points: 3000, label: 'BELL' },
  { id: 'key', points: 5000, label: 'KEY' },
];

/**
 * Level table. `pac`/`ghost` are cruise speeds, `elroy1Dots`/`elroy2Dots` are
 * the remaining-pellet thresholds at which Blinky becomes "Cruise Elroy" and
 * speeds up, `fright` is the power-pellet duration in seconds and `flashes`
 * the number of end-of-fright blink cycles.
 */
const TABLE = [
  //          pac  ghost pacFr ghFr  tun   el1  el1s  el2  el2s fright flashes fruit
  /* 1  */ [0.80, 0.75, 0.90, 0.50, 0.40, 20, 0.80, 10, 0.85, 6, 5, 0],
  /* 2  */ [0.90, 0.85, 0.95, 0.55, 0.45, 30, 0.90, 15, 0.95, 5, 5, 1],
  /* 3  */ [0.90, 0.85, 0.95, 0.55, 0.45, 40, 0.90, 20, 0.95, 4, 5, 2],
  /* 4  */ [0.90, 0.85, 0.95, 0.55, 0.45, 40, 0.90, 20, 0.95, 3, 5, 2],
  /* 5  */ [1.00, 0.95, 1.00, 0.60, 0.50, 40, 1.00, 20, 1.05, 2, 5, 3],
  /* 6  */ [1.00, 0.95, 1.00, 0.60, 0.50, 50, 1.00, 25, 1.05, 5, 5, 3],
  /* 7  */ [1.00, 0.95, 1.00, 0.60, 0.50, 50, 1.00, 25, 1.05, 2, 5, 4],
  /* 8  */ [1.00, 0.95, 1.00, 0.60, 0.50, 50, 1.00, 25, 1.05, 2, 5, 4],
  /* 9  */ [1.00, 0.95, 1.00, 0.60, 0.50, 60, 1.00, 30, 1.05, 1, 3, 5],
  /* 10 */ [1.00, 0.95, 1.00, 0.60, 0.50, 60, 1.00, 30, 1.05, 5, 5, 5],
  /* 11 */ [1.00, 0.95, 1.00, 0.60, 0.50, 60, 1.00, 30, 1.05, 2, 5, 6],
  /* 12 */ [1.00, 0.95, 1.00, 0.60, 0.50, 80, 1.00, 40, 1.05, 1, 3, 6],
  /* 13 */ [1.00, 0.95, 1.00, 0.60, 0.50, 80, 1.00, 40, 1.05, 1, 3, 7],
  /* 14 */ [1.00, 0.95, 1.00, 0.60, 0.50, 80, 1.00, 40, 1.05, 3, 5, 7],
  /* 15 */ [1.00, 0.95, 1.00, 0.60, 0.50, 100, 1.00, 50, 1.05, 1, 3, 7],
  /* 16 */ [1.00, 0.95, 1.00, 0.60, 0.50, 100, 1.00, 50, 1.05, 1, 3, 7],
  /* 17 */ [1.00, 0.95, 1.00, 0.60, 0.50, 100, 1.00, 50, 1.05, 0, 0, 7],
  /* 18 */ [1.00, 0.95, 1.00, 0.60, 0.50, 100, 1.00, 50, 1.05, 1, 3, 7],
  /* 19 */ [1.00, 0.95, 1.00, 0.60, 0.50, 120, 1.00, 60, 1.05, 0, 0, 7],
  /* 20 */ [1.00, 0.95, 1.00, 0.60, 0.50, 120, 1.00, 60, 1.05, 0, 0, 7],
  /* 21+*/ [0.90, 0.95, 0.90, 0.60, 0.50, 120, 1.00, 60, 1.05, 0, 0, 7],
];

const KEYS = [
  'pac',
  'ghost',
  'pacFright',
  'ghostFright',
  'tunnel',
  'elroy1Dots',
  'elroy1Speed',
  'elroy2Dots',
  'elroy2Speed',
  'frightSeconds',
  'frightFlashes',
  'fruitIndex',
];

/** Returns the tuning record for a 1-based level number. */
export function levelConfig(level) {
  const row = TABLE[Math.min(level, TABLE.length) - 1];
  const out = {};
  KEYS.forEach((k, i) => {
    out[k] = row[i];
  });
  out.level = level;
  out.fruit = FRUITS[out.fruitIndex];
  return out;
}

/**
 * Scatter/chase wave schedule in seconds. After the final entry ghosts chase
 * indefinitely. Values mirror the arcade's three schedules.
 */
export function wavePlan(level) {
  if (level === 1) {
    return [
      { mode: 'scatter', seconds: 7 },
      { mode: 'chase', seconds: 20 },
      { mode: 'scatter', seconds: 7 },
      { mode: 'chase', seconds: 20 },
      { mode: 'scatter', seconds: 5 },
      { mode: 'chase', seconds: 20 },
      { mode: 'scatter', seconds: 5 },
      { mode: 'chase', seconds: Infinity },
    ];
  }
  if (level <= 4) {
    return [
      { mode: 'scatter', seconds: 7 },
      { mode: 'chase', seconds: 20 },
      { mode: 'scatter', seconds: 7 },
      { mode: 'chase', seconds: 20 },
      { mode: 'scatter', seconds: 5 },
      { mode: 'chase', seconds: 1033 },
      { mode: 'scatter', seconds: 1 / 60 },
      { mode: 'chase', seconds: Infinity },
    ];
  }
  return [
    { mode: 'scatter', seconds: 5 },
    { mode: 'chase', seconds: 20 },
    { mode: 'scatter', seconds: 5 },
    { mode: 'chase', seconds: 20 },
    { mode: 'scatter', seconds: 5 },
    { mode: 'chase', seconds: 1037 },
    { mode: 'scatter', seconds: 1 / 60 },
    { mode: 'chase', seconds: Infinity },
  ];
}

/** Per-level personal dot limits that release ghosts from the house. */
export function houseDotLimits(level) {
  if (level === 1) return { pinky: 0, inky: 30, clyde: 60 };
  if (level === 2) return { pinky: 0, inky: 0, clyde: 50 };
  return { pinky: 0, inky: 0, clyde: 0 };
}

/** Global dot counter thresholds used after Pac-Man loses a life. */
export const GLOBAL_DOT_LIMITS = { pinky: 7, inky: 17, clyde: 32 };

export const SCORE = {
  pellet: 10,
  energizer: 50,
  ghostChain: [200, 400, 800, 1600],
  extraLifeAt: 10000,
};

/** Dots eaten thresholds that make a fruit appear. */
export const FRUIT_TRIGGERS = [70, 170];
export const FRUIT_LIFETIME = [9, 10]; // seconds, randomised between these
