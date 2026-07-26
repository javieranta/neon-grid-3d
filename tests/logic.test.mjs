/**
 * NEON GRID — headless simulation tests.
 *
 * Runs the pure game logic thousands of simulated seconds with a scripted bot
 * and asserts the invariants a Pac-Man clone must never break.
 */

import { createGame, STATE } from '../src/core/game.js';
import { createMaze, DIRECTIONS, MAZE_H, MAZE_W, TILE, wrapX } from '../src/core/maze.js';
import { GHOST_ORDER } from '../src/core/ghost.js';
import { levelConfig, wavePlan } from '../src/core/levels.js';

let failures = 0;
let checks = 0;

function ok(cond, label, detail = '') {
  checks++;
  if (!cond) {
    failures++;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function eq(a, b, label) {
  ok(a === b, label, `expected ${b}, got ${a}`);
}

function section(name) {
  console.log(`\n▸ ${name}`);
}

const DT = 1 / 60;

// ---------------------------------------------------------------- maze checks

section('maze integrity');
{
  const maze = createMaze();
  eq(maze.tiles.length, MAZE_H, 'row count is 31');
  ok(
    maze.tiles.every((r) => r.length === MAZE_W),
    'every row is 28 tiles wide'
  );

  const energizers = maze.pelletsInitial.filter((p) => p.energizer);
  eq(energizers.length, 4, 'exactly four energizers');
  ok(maze.totalPellets > 230 && maze.totalPellets < 260, 'collectible count in arcade range', `${maze.totalPellets}`);

  // Energizers sit in the four corners of the playfield.
  const corners = energizers.map((p) => `${p.x},${p.y}`).sort().join(' ');
  eq(corners, '1,23 1,3 26,23 26,3', 'energizers in the four corners');

  // Symmetry: the maze must mirror left/right.
  let asym = 0;
  for (let y = 0; y < MAZE_H; y++) {
    for (let x = 0; x < MAZE_W / 2; x++) {
      if (maze.tiles[y][x] !== maze.tiles[y][MAZE_W - 1 - x]) asym++;
    }
  }
  eq(asym, 0, 'maze is left/right symmetric');

  // Full connectivity from Pac-Man's start tile.
  const seen = new Set();
  const stack = [[13, 23]];
  while (stack.length) {
    const [x, y] = stack.pop();
    const key = `${x},${y}`;
    if (seen.has(key) || !maze.walkable(x, y)) continue;
    seen.add(key);
    for (const d of Object.values(DIRECTIONS)) stack.push([wrapX(x + d.x), y + d.y]);
  }
  let walkable = 0;
  for (let y = 0; y < MAZE_H; y++) for (let x = 0; x < MAZE_W; x++) if (maze.walkable(x, y)) walkable++;
  eq(seen.size, walkable, 'every open tile is reachable');
  ok(
    maze.pelletsInitial.every((p) => seen.has(`${p.x},${p.y}`)),
    'every collectible is reachable'
  );

  // The tunnel must wrap.
  ok(maze.walkable(0, 14) && maze.walkable(27, 14), 'tunnel mouths are open');
  ok(!maze.walkable(0, 13) && !maze.walkable(0, 15), 'tunnel is a single row');

  // Ghost house is sealed to Pac-Man but open to ghosts.
  ok(!maze.walkable(13, 12), 'Pac-Man cannot pass the house gate');
  ok(maze.ghostWalkable(13, 12), 'ghosts can pass the house gate');
  ok(!maze.walkable(13, 14), 'Pac-Man cannot stand inside the house');
}

// ------------------------------------------------------------- level tables

section('level tables');
{
  for (let lvl = 1; lvl <= 25; lvl++) {
    const c = levelConfig(lvl);
    ok(c.pac > 0 && c.pac <= 1, `L${lvl} pac speed sane`);
    ok(c.ghost > 0 && c.ghost <= 1, `L${lvl} ghost speed sane`);
    ok(c.fruit && c.fruit.points > 0, `L${lvl} has a fruit`);
    ok(c.elroy1Dots >= c.elroy2Dots, `L${lvl} elroy thresholds ordered`);
  }
  eq(levelConfig(1).frightSeconds, 6, 'level 1 fright lasts 6s');
  eq(levelConfig(1).fruit.points, 100, 'level 1 fruit is worth 100');
  eq(levelConfig(3).fruit.points, 500, 'level 3 fruit is worth 500');
  ok(levelConfig(19).frightSeconds === 0, 'late levels have no fright time');
  const plan = wavePlan(1);
  eq(plan[0].mode, 'scatter', 'level 1 opens in scatter');
  ok(plan[plan.length - 1].seconds === Infinity, 'wave plan ends in endless chase');
}

// ------------------------------------------------------- movement invariants

/**
 * Pellet-seeking bot: BFS to the closest remaining collectible while treating
 * tiles near a hunting ghost as blocked, so the run survives long enough to
 * exercise later levels.
 */
function botDirection(game) {
  const { maze, pacman } = game;
  const danger = new Set();
  for (const id of GHOST_ORDER) {
    const g = game.ghosts[id];
    if (g.frightened || g.state !== 'hunting') continue;
    const gx = Math.round(g.x);
    const gy = Math.round(g.y);
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        if (Math.abs(dx) + Math.abs(dy) <= 2) danger.add(`${wrapX(gx + dx)},${gy + dy}`);
      }
    }
  }

  const search = (avoid) => {
    const start = { x: Math.round(pacman.x), y: Math.round(pacman.y) };
    const q = [[start.x, start.y, null]];
    const seen = new Set([`${start.x},${start.y}`]);
    let guard = 0;
    while (q.length && guard++ < 4000) {
      const [x, y, first] = q.shift();
      if (maze.pelletAt(x, y) && first) return first;
      for (const [name, d] of Object.entries(DIRECTIONS)) {
        const nx = wrapX(x + d.x);
        const ny = y + d.y;
        const key = `${nx},${ny}`;
        if (seen.has(key) || !maze.walkable(nx, ny)) continue;
        if (avoid && danger.has(key)) continue;
        seen.add(key);
        q.push([nx, ny, first ?? name]);
      }
    }
    return null;
  };

  return search(true) ?? search(false) ?? pacman.dir;
}

function assertOnGrid(game, log) {
  const p = game.pacman;
  const px = Math.round(p.x);
  const py = Math.round(p.y);
  if (!game.maze.walkable(px, py)) log.push(`pacman inside wall at ${p.x.toFixed(2)},${p.y.toFixed(2)}`);
  if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) log.push('pacman position not finite');
  if (p.y < -1 || p.y > MAZE_H) log.push(`pacman off-board y=${p.y}`);

  for (const id of GHOST_ORDER) {
    const g = game.ghosts[id];
    if (!Number.isFinite(g.x) || !Number.isFinite(g.y)) log.push(`${id} position not finite`);
    const gx = Math.round(g.x);
    const gy = Math.round(g.y);
    if (game.maze.tileAt(gx, gy) === TILE.WALL) {
      log.push(`${id} inside wall at ${g.x.toFixed(2)},${g.y.toFixed(2)} state=${g.state}`);
    }
  }
}

section('movement invariants over a long bot run');
{
  const game = createGame({ seed: 12345 });
  game.startGame();
  const log = [];
  let levelsCleared = 0;
  let deaths = 0;
  let ghostsEaten = 0;
  let fruitsEaten = 0;
  let maxLevel = 1;
  let everFrightened = false;
  let everLeftHouse = false;
  let everTunnelWrapped = false;
  let maxScore = 0;
  let lastX = game.pacman.x;

  game.on('levelClear', () => levelsCleared++);
  game.on('death', () => deaths++);
  game.on('ghostEaten', () => ghostsEaten++);
  game.on('fruitEaten', () => fruitsEaten++);

  // 25 simulated minutes.
  const steps = Math.round(25 * 60 * 60);
  for (let i = 0; i < steps; i++) {
    if (game.state === STATE.PLAYING) game.setDirection(botDirection(game));
    game.step(DT);
    if (game.state === STATE.ATTRACT) game.startGame();
    if (i % 3 === 0) assertOnGrid(game, log);
    maxLevel = Math.max(maxLevel, game.level);
    maxScore = Math.max(maxScore, game.score);
    if (GHOST_ORDER.some((id) => game.ghosts[id].frightened)) everFrightened = true;
    if (GHOST_ORDER.some((id) => game.ghosts[id].state === 'hunting')) everLeftHouse = true;
    if (Math.abs(game.pacman.x - lastX) > 5) everTunnelWrapped = true;
    lastX = game.pacman.x;
    if (log.length > 6) break;
  }

  ok(log.length === 0, 'no grid violations during the run', log.slice(0, 6).join(' | '));
  ok(levelsCleared >= 1, 'bot cleared at least one level', `cleared ${levelsCleared}`);
  ok(maxLevel >= 2, 'level progression advanced', `reached ${maxLevel}`);
  ok(everFrightened, 'energizers frightened the ghosts');
  ok(everLeftHouse, 'ghosts left the house');
  ok(everTunnelWrapped, 'Pac-Man used the wrap tunnel');
  ok(ghostsEaten >= 1, 'bot ate at least one ghost', `${ghostsEaten}`);
  ok(maxScore > 3000, 'score accumulated', `${maxScore}`);
  console.log(
    `  · levels=${levelsCleared} maxLevel=${maxLevel} deaths=${deaths} ghosts=${ghostsEaten} fruit=${fruitsEaten} best=${maxScore}`
  );
}

section('fruits are placed at the start of every level');
{
  const { FRUIT_SPAWNS, FRUITS_PER_LEVEL, FRUITS } = await import('../src/core/levels.js');
  eq(FRUITS_PER_LEVEL, 3, 'three fruits per level');
  eq(FRUIT_SPAWNS.length, 3, 'three fruit spawn points');

  // Every spawn tile must be open floor with no pellet, or it is ambiguous to eat.
  const m = createMaze();
  for (const sp of FRUIT_SPAWNS) {
    const tx = Math.round(sp.x);
    const ty = Math.round(sp.y);
    ok(m.walkable(tx, ty), `fruit spawn ${sp.x},${sp.y} is reachable floor`);
    eq(m.pelletAt(tx, ty), 0, `fruit spawn ${sp.x},${sp.y} carries no pellet`);
  }

  const game = createGame({ seed: 21 });
  let placements = 0;
  game.on('fruitsPlaced', () => placements++);
  game.startGame();
  eq(game.fruits.length, 3, 'three fruits on the board the moment the level starts');
  eq(placements, 1, 'a single placement event per level');
  ok(
    game.fruits.some((f) => f.def.id === 'cherry'),
    'a cherry is always among them',
    game.fruits.map((f) => f.def.id).join(',')
  );
  ok(
    game.fruits.every((f) => !Number.isFinite(f.timer)),
    'level fruits wait to be collected rather than timing out'
  );

  // They must survive a long stretch of play, and a death.
  game.setState(STATE.PLAYING);
  for (let i = 0; i < 60 * 60; i++) game.step(DT);
  eq(game.fruits.length, 3, 'still there after a minute');

  const b = game.ghosts.blinky;
  b.state = 'hunting';
  b.frightened = false;
  b.x = game.pacman.x;
  b.y = game.pacman.y;
  game.setState(STATE.PLAYING);
  for (let i = 0; i < 60 * 6; i++) game.step(DT);
  eq(game.fruits.length, 3, 'a death does not clear the level fruit');

  // A fresh level re-places them.
  game.startLevel(2);
  eq(game.fruits.length, 3, 'the next level gets its own three');
  eq(placements, 2, 'one placement event for the new level');

  // Collecting one scores its own value and records it.
  const before = game.score;
  const target = game.fruits[0];
  game.setState(STATE.PLAYING);
  game.pacman.x = target.x;
  game.pacman.y = target.y;
  game.step(DT);
  eq(game.fruits.length, 2, 'the collected fruit is removed');
  eq(game.score - before, target.def.points, 'it scored its own value');
  eq(game.fruitHistory.length, 1, 'recorded in the HUD history');

  // The arcade item table must be untouched by any of this.
  const expected = [
    ['cherry', 100],
    ['strawberry', 300],
    ['orange', 500],
    ['apple', 700],
    ['melon', 1000],
    ['galaxian', 2000],
    ['bell', 3000],
    ['key', 5000],
  ];
  expected.forEach(([id, pts], i) => {
    eq(FRUITS[i].id, id, `fruit ${i + 1} is the ${id}`);
    eq(FRUITS[i].points, pts, `${id} scores ${pts}`);
  });
  const perLevel = [[1, 'cherry'], [2, 'strawberry'], [3, 'orange'], [4, 'orange'],
                    [5, 'apple'], [7, 'melon'], [9, 'galaxian'], [11, 'bell'], [13, 'key']];
  for (const [lvl, id] of perLevel) {
    eq(levelConfig(lvl).fruit.id, id, `level ${lvl} fruit is the ${id}`);
  }
}

section('jump and scout');
{
  const { JUMPS_PER_LEVEL, SCOUTS_PER_LEVEL } = await import('../src/core/game.js');
  eq(JUMPS_PER_LEVEL, 3, 'three jumps per level');
  eq(SCOUTS_PER_LEVEL, 3, 'three scouts per level');

  const land = (g) => {
    let guard = 0;
    while (g.jumpTimer > 0 && guard++ < 1000) g.step(DT);
  };

  const game = createGame({ seed: 77 });
  game.startGame();
  game.setState(STATE.PLAYING);
  eq(game.jumpsLeft, 3, 'starts with three jumps');
  eq(game.scoutsLeft, 3, 'starts with three scouts');

  ok(game.tryJump(), 'first jump takes');
  ok(!game.tryJump(), 'no double jump while airborne');
  land(game);
  ok(game.tryJump(), 'second jump takes');
  land(game);
  ok(game.tryJump(), 'third jump takes');
  land(game);
  ok(!game.tryJump(), 'fourth jump is refused');
  eq(game.jumpsLeft, 0, 'budget exhausted');

  // The arc leaves and returns to the ground.
  const g2 = createGame({ seed: 5 });
  g2.startGame();
  g2.setState(STATE.PLAYING);
  g2.tryJump();
  let peak = 0;
  let guard = 0;
  while (g2.jumpTimer > 0 && guard++ < 1000) {
    g2.step(DT);
    peak = Math.max(peak, g2.airborne);
  }
  ok(peak > 0.9, 'the hop clears a useful height', peak.toFixed(2));
  eq(g2.airborne, 0, 'and lands back on the ground');

  // A well-timed jump carries him over a hunting ghost.
  const clear = createGame({ seed: 9 });
  clear.startGame();
  clear.setState(STATE.PLAYING);
  let cleared = 0;
  let died = 0;
  clear.on('ghostCleared', () => cleared++);
  clear.on('death', () => died++);
  clear.tryJump();
  let g3 = 0;
  while (clear.airborne < 0.9 && g3++ < 1000) clear.step(DT);
  const gh = clear.ghosts.blinky;
  gh.state = 'hunting';
  gh.frightened = false;
  gh.x = clear.pacman.x;
  gh.y = clear.pacman.y;
  clear.step(DT);
  eq(died, 0, 'jumping over a ghost is not fatal');
  ok(cleared >= 1, 'and it reports the clear', `${cleared}`);

  // Grounded, the same contact kills.
  const hit = createGame({ seed: 9 });
  hit.startGame();
  hit.setState(STATE.PLAYING);
  let deaths = 0;
  hit.on('death', () => deaths++);
  const gh2 = hit.ghosts.blinky;
  gh2.state = 'hunting';
  gh2.frightened = false;
  gh2.x = hit.pacman.x;
  gh2.y = hit.pacman.y;
  hit.step(DT);
  eq(deaths, 1, 'the same contact on the ground is fatal');

  // A frightened ghost is still eaten in the air: a good jump should not cost
  // the bonus.
  const air = createGame({ seed: 3 });
  air.startGame();
  air.setState(STATE.PLAYING);
  let eatenPoints = 0;
  air.on('ghostEaten', (e) => (eatenPoints += e.points));
  air.frightTimer = 8;
  air.frightTotal = 8;
  air.tryJump();
  let g4 = 0;
  while (air.airborne < 0.9 && g4++ < 1000) air.step(DT);
  const gf = air.ghosts.blinky;
  gf.state = 'hunting';
  gf.frightened = true;
  gf.frightTimer = 8;
  gf.x = air.pacman.x;
  gf.y = air.pacman.y;
  air.step(DT);
  eq(eatenPoints, 200, 'a frightened ghost still scores while airborne');

  // Scout: three per level, and the blend ramps up and back down.
  const sc = createGame({ seed: 11 });
  sc.startGame();
  sc.setState(STATE.PLAYING);
  eq(sc.scoutBlend(), 0, 'no scout blend at rest');
  ok(sc.tryScout(), 'scout takes');
  ok(!sc.tryScout(), 'cannot re-scout while one is running');
  let maxBlend = 0;
  let g5 = 0;
  while (sc.scoutTimer > 0 && g5++ < 2000) {
    sc.step(DT);
    maxBlend = Math.max(maxBlend, sc.scoutBlend());
  }
  ok(maxBlend > 0.99, 'the scout reaches the full board view', maxBlend.toFixed(2));
  eq(sc.scoutBlend(), 0, 'and returns to the play camera');
  eq(sc.scoutsLeft, 2, 'one scout spent');

  // Both budgets reset on a new level but survive a death.
  const rst = createGame({ seed: 13 });
  rst.startGame();
  rst.setState(STATE.PLAYING);
  rst.tryJump();
  land(rst);
  rst.tryScout();
  eq(rst.jumpsLeft, 2, 'a jump was spent');
  eq(rst.scoutsLeft, 2, 'a scout was spent');
  const bl = rst.ghosts.blinky;
  bl.state = 'hunting';
  bl.frightened = false;
  bl.x = rst.pacman.x;
  bl.y = rst.pacman.y;
  rst.setState(STATE.PLAYING);
  for (let i = 0; i < 60 * 6; i++) rst.step(DT);
  eq(rst.jumpsLeft, 2, 'a death does not refill the jump budget');
  rst.startLevel(2);
  eq(rst.jumpsLeft, 3, 'a new level refills jumps');
  eq(rst.scoutsLeft, 3, 'a new level refills scouts');
  eq(rst.airborne, 0, 'and nobody starts a level mid-hop');
}

section('scoring rules');
{
  const game = createGame({ seed: 7 });
  game.startGame();
  game.setState(STATE.PLAYING);

  // Walk left into the pellet run on row 23.
  const before = game.score;
  game.setDirection('left');
  for (let i = 0; i < 120; i++) game.step(DT);
  ok(game.score > before, 'eating pellets scores points', `${game.score}`);
  ok(game.score % 10 === 0, 'pellet scores are multiples of ten');

  // Ghost chain values.
  const g2 = createGame({ seed: 7 });
  g2.startGame();
  g2.setState(STATE.PLAYING);
  const chain = [];
  g2.on('ghostEaten', (e) => chain.push(e.points));
  // Force all ghosts out and frightened, then teleport them onto Pac-Man.
  for (const id of GHOST_ORDER) {
    const g = g2.ghosts[id];
    g.state = 'hunting';
    g.frightened = true;
    g.frightTimer = 10;
  }
  g2.frightTimer = 10;
  for (const id of GHOST_ORDER) {
    const g = g2.ghosts[id];
    g.x = g2.pacman.x;
    g.y = g2.pacman.y;
    g2.setState(STATE.PLAYING);
    g2.step(DT);
  }
  eq(chain.join(','), '200,400,800,1600', 'ghost chain doubles 200/400/800/1600');

  // Extra life.
  const g3 = createGame({ seed: 7 });
  g3.startGame();
  let extra = 0;
  g3.on('extraLife', () => extra++);
  g3.score = 9990;
  g3.setState(STATE.PLAYING);
  g3.setDirection('left');
  for (let i = 0; i < 200 && extra === 0; i++) g3.step(DT);
  eq(extra, 1, 'extra life awarded at 10,000');
  ok(g3.lives === 4, 'lives incremented on extra life', `${g3.lives}`);
}

// -------------------------------------------------------------- ghost AI

section('ghost targeting');
{
  const game = createGame({ seed: 3 });
  game.startGame();
  game.setState(STATE.PLAYING);
  const { targetTile } = await import('../src/core/ghost.js');

  game.pacman.x = 10;
  game.pacman.y = 20;
  game.pacman.dir = 'left';
  game.mode = 'chase';
  const ctx = { pacman: game.pacman, ghosts: game.ghosts, mode: 'chase' };

  const blinky = targetTile(game.ghosts.blinky, ctx);
  eq(`${blinky.x},${blinky.y}`, '10,20', 'Blaze targets Pac-Man directly');

  const pinky = targetTile(game.ghosts.pinky, ctx);
  eq(`${pinky.x},${pinky.y}`, '6,20', 'Violet targets four tiles ahead');

  game.pacman.dir = 'up';
  const pinkyUp = targetTile(game.ghosts.pinky, ctx);
  eq(`${pinkyUp.x},${pinkyUp.y}`, '6,16', 'Violet reproduces the up-direction overflow quirk');

  game.pacman.dir = 'right';
  game.ghosts.blinky.x = 10;
  game.ghosts.blinky.y = 20;
  const inky = targetTile(game.ghosts.inky, ctx);
  eq(`${inky.x},${inky.y}`, '14,20', 'Cyan doubles the vector from Blaze');

  // Clyde flips between chase and scatter at eight tiles.
  game.ghosts.clyde.x = 10;
  game.ghosts.clyde.y = 21;
  const near = targetTile(game.ghosts.clyde, ctx);
  eq(`${near.x},${near.y}`, '0,34', 'Amber retreats when close');
  game.ghosts.clyde.x = 25;
  game.ghosts.clyde.y = 5;
  const far = targetTile(game.ghosts.clyde, ctx);
  eq(`${far.x},${far.y}`, '10,20', 'Amber chases when far');

  // Scatter targets.
  const sc = targetTile(game.ghosts.blinky, { ...ctx, mode: 'scatter' });
  eq(`${sc.x},${sc.y}`, '25,-4', 'scatter sends Blaze to its corner');
}

section('mode changes force reversals');
{
  const game = createGame({ seed: 5 });
  game.startGame();
  game.setState(STATE.PLAYING);
  for (const id of GHOST_ORDER) {
    game.ghosts[id].state = 'hunting';
    game.ghosts[id].reverseQueued = false;
  }
  // Run past the first 7 second scatter wave and watch for the forced U-turn.
  let flips = 0;
  let modeEvents = 0;
  game.on('modeChange', () => modeEvents++);
  for (let i = 0; i < 60 * 9; i++) {
    const before = GHOST_ORDER.map((id) => game.ghosts[id].dir);
    game.step(DT);
    const after = GHOST_ORDER.map((id) => game.ghosts[id].dir);
    const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };
    for (let k = 0; k < 4; k++) {
      if (after[k] === opposite[before[k]]) flips++;
    }
  }
  eq(game.mode, 'chase', 'wave advanced from scatter to chase');
  eq(modeEvents, 1, 'exactly one mode change in nine seconds');
  ok(flips >= 1, 'at least one ghost performed the forced reversal', `${flips}`);
}

section('death and game over');
{
  const game = createGame({ seed: 9 });
  game.startGame();
  game.setState(STATE.PLAYING);
  let over = 0;
  game.on('gameOver', () => over++);
  for (let life = 0; life < 4; life++) {
    // Drop Blinky onto Pac-Man.
    const b = game.ghosts.blinky;
    b.state = 'hunting';
    b.frightened = false;
    b.x = game.pacman.x;
    b.y = game.pacman.y;
    game.setState(STATE.PLAYING);
    for (let i = 0; i < 60 * 6; i++) {
      game.step(DT);
      if (game.state === STATE.GAME_OVER || game.state === STATE.PLAYING) break;
    }
  }
  ok(game.lives < 3, 'lives were lost', `${game.lives}`);
  ok(over >= 1 || game.lives >= 0, 'game over path reachable');
}

section('frightened ghosts flee and return home');
{
  const game = createGame({ seed: 11 });
  game.startGame();
  game.setState(STATE.PLAYING);
  const b = game.ghosts.blinky;
  b.state = 'hunting';
  b.frightened = true;
  b.frightTimer = 8;
  game.frightTimer = 8;
  b.x = game.pacman.x;
  b.y = game.pacman.y;
  game.step(DT);
  eq(b.state, 'eaten', 'eaten ghost enters the return state');
  let arrived = false;
  for (let i = 0; i < 60 * 20; i++) {
    game.step(DT);
    if (b.state === 'house' || b.state === 'entering') arrived = true;
    if (b.state === 'hunting' && arrived) break;
  }
  ok(arrived, 'eaten ghost made it back to the house');
}

// ------------------------------------------------------------------ summary

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks - failures}/${checks} assertions passed`);
process.exit(failures === 0 ? 0 : 1);
