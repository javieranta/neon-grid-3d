/**
 * NEON GRID — maze definition.
 *
 * A faithful 28x31 reconstruction of the classic arcade maze topology,
 * hand-encoded as ASCII. Legend:
 *
 *   #  wall
 *   .  pellet (10 pts)
 *   o  energizer / power pellet (50 pts)
 *   _  open floor, no pellet (tunnels, ghost-house approach, start tile)
 *   -  ghost house door (ghosts may pass, Pac-Man may not)
 *   H  ghost house interior
 *
 * Grid coordinates: x = column 0..27 (left to right), y = row 0..30 (top to
 * bottom). Tile centres sit at integer (x, y). The horizontal wrap-around
 * tunnel is row 14.
 */

export const ROWS = [
  /*  0 */ '############################',
  /*  1 */ '#............##............#',
  /*  2 */ '#.####.#####.##.#####.####.#',
  /*  3 */ '#o####.#####.##.#####.####o#',
  /*  4 */ '#.####.#####.##.#####.####.#',
  /*  5 */ '#..........................#',
  /*  6 */ '#.####.##.########.##.####.#',
  /*  7 */ '#.####.##.########.##.####.#',
  /*  8 */ '#......##....##....##......#',
  /*  9 */ '######.#####_##_#####.######',
  /* 10 */ '######.#####_##_#####.######',
  /* 11 */ '######.##__________##.######',
  /* 12 */ '######.##_###--###_##.######',
  /* 13 */ '######.##_#HHHHHH#_##.######',
  /* 14 */ '__________#HHHHHH#__________',
  /* 15 */ '######.##_#HHHHHH#_##.######',
  /* 16 */ '######.##_########_##.######',
  /* 17 */ '######.##__________##.######',
  /* 18 */ '######.##.########.##.######',
  /* 19 */ '######.##_########_##.######',
  /* 20 */ '#............##............#',
  /* 21 */ '#.####.#####.##.#####.####.#',
  /* 22 */ '#.####.#####.##.#####.####.#',
  /* 23 */ '#o..##.......__.......##..o#',
  /* 24 */ '###.##.##.########.##.##.###',
  /* 25 */ '###.##.##.########.##.##.###',
  /* 26 */ '#......##....##....##......#',
  /* 27 */ '#.##########.##.##########.#',
  /* 28 */ '#.##########.##.##########.#',
  /* 29 */ '#..........................#',
  /* 30 */ '############################',
];

export const MAZE_W = 28;
export const MAZE_H = 31;

export const TILE = {
  WALL: 0,
  FLOOR: 1,
  PELLET: 2,
  ENERGIZER: 3,
  DOOR: 4,
  HOUSE: 5,
};

const CHAR_TO_TILE = {
  '#': TILE.WALL,
  '.': TILE.PELLET,
  o: TILE.ENERGIZER,
  _: TILE.FLOOR,
  '-': TILE.DOOR,
  H: TILE.HOUSE,
};

/** Row 14 is the wrap-around tunnel. */
export const TUNNEL_ROW = 14;

/** Tiles where ghosts are forbidden from choosing "up" (arcade quirk). */
export const NO_UP_TILES = [
  { x: 12, y: 11 },
  { x: 15, y: 11 },
  { x: 12, y: 23 },
  { x: 15, y: 23 },
];

/** Spawn / anchor points, in tile space (fractional x centres a pair of tiles). */
export const SPAWN = {
  pacman: { x: 13.5, y: 23, dir: 'left' },
  blinky: { x: 13.5, y: 11, dir: 'left' },
  pinky: { x: 13.5, y: 14, dir: 'down' },
  inky: { x: 11.5, y: 14, dir: 'up' },
  clyde: { x: 15.5, y: 14, dir: 'up' },
  houseDoor: { x: 13.5, y: 11 },
  houseCentre: { x: 13.5, y: 14 },
  fruit: { x: 13.5, y: 17 },
};

/** Scatter-mode home corners (deliberately outside the maze, as in the arcade). */
export const SCATTER_TARGETS = {
  blinky: { x: 25, y: -4 },
  pinky: { x: 2, y: -4 },
  inky: { x: 27, y: 34 },
  clyde: { x: 0, y: 34 },
};

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
  right: { x: 1, y: 0 },
};

/** Arcade tie-break preference order when several routes are equidistant. */
export const DIR_ORDER = ['up', 'left', 'down', 'right'];

export const OPPOSITE = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

/**
 * Builds a fresh mutable maze instance. The static geometry (walls, doors)
 * never changes; the pellet layer does, and is reset per level.
 */
export function createMaze() {
  const tiles = [];
  const pelletsInitial = [];
  for (let y = 0; y < MAZE_H; y++) {
    const row = ROWS[y];
    if (row.length !== MAZE_W) {
      throw new Error(`maze row ${y} has length ${row.length}, expected ${MAZE_W}`);
    }
    const line = [];
    for (let x = 0; x < MAZE_W; x++) {
      const t = CHAR_TO_TILE[row[x]];
      if (t === undefined) throw new Error(`unknown maze char "${row[x]}" at ${x},${y}`);
      line.push(t);
      if (t === TILE.PELLET || t === TILE.ENERGIZER) {
        pelletsInitial.push({ x, y, energizer: t === TILE.ENERGIZER });
      }
    }
    tiles.push(line);
  }

  const maze = {
    tiles,
    /** Live pellet layer: 0 = eaten, 2 = pellet, 3 = energizer. */
    pellets: new Uint8Array(MAZE_W * MAZE_H),
    pelletsInitial,
    totalPellets: pelletsInitial.length,
    remaining: 0,

    idx(x, y) {
      return y * MAZE_W + x;
    },

    reset() {
      maze.pellets.fill(0);
      for (const p of pelletsInitial) {
        maze.pellets[maze.idx(p.x, p.y)] = p.energizer ? TILE.ENERGIZER : TILE.PELLET;
      }
      maze.remaining = pelletsInitial.length;
    },

    /** Tile type at integer coords; out-of-bounds vertically counts as wall. */
    tileAt(x, y) {
      if (y < 0 || y >= MAZE_H) return TILE.WALL;
      const wx = wrapX(x);
      return tiles[y][wx];
    },

    /** Can Pac-Man occupy this tile? */
    walkable(x, y) {
      const t = maze.tileAt(x, y);
      return t !== TILE.WALL && t !== TILE.DOOR && t !== TILE.HOUSE;
    },

    /** Can a ghost occupy this tile? (doors and the house are permitted) */
    ghostWalkable(x, y) {
      return maze.tileAt(x, y) !== TILE.WALL;
    },

    pelletAt(x, y) {
      if (y < 0 || y >= MAZE_H) return 0;
      return maze.pellets[maze.idx(wrapX(x), y)];
    },

    eatPellet(x, y) {
      const i = maze.idx(wrapX(x), y);
      const v = maze.pellets[i];
      if (v) {
        maze.pellets[i] = 0;
        maze.remaining--;
      }
      return v;
    },

    isTunnel(x, y) {
      return y === TUNNEL_ROW && (x <= 5 || x >= 22);
    },

    isNoUpTile(x, y) {
      return NO_UP_TILES.some((t) => t.x === x && t.y === y);
    },
  };

  maze.reset();
  return maze;
}

export function wrapX(x) {
  let v = x;
  while (v < 0) v += MAZE_W;
  while (v >= MAZE_W) v -= MAZE_W;
  return v;
}

/** Shortest signed horizontal delta accounting for the wrap tunnel. */
export function deltaX(from, to) {
  let d = to - from;
  if (d > MAZE_W / 2) d -= MAZE_W;
  if (d < -MAZE_W / 2) d += MAZE_W;
  return d;
}
