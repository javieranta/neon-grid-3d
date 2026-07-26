/**
 * NEON GRID — scene assembly and per-frame sync.
 *
 * Owns the WebGL renderer, the camera rig (overview / chase / cinematic orbit),
 * the mirrored reflection world under the floor, and the post chain. Reads the
 * pure game state every frame; never writes to it.
 */

import * as THREE from 'three';
import { STATE } from '../core/game.js';
import { GHOST_ORDER } from '../core/ghost.js';
import { MAZE_H, MAZE_W } from '../core/maze.js';
import {
  createEnergizers,
  createFruitAura,
  createFruitFactory,
  createGhost as createGhostModel,
  createPacman,
  createPellets,
  createPopupPool,
} from './actors.js';
import { createEnvironment } from './environment.js';
import { buildMaze } from './mazeMesh.js';
import { PALETTE, WALL_HEIGHT, worldX, worldZ } from './palette.js';
import { createPostFX } from './postfx.js';
import { createSigns } from './signs.js';
import { TIERS } from './quality.js';

const MAZE_HALF = new THREE.Vector3(MAZE_W / 2 + 0.6, WALL_HEIGHT * 0.5, MAZE_H / 2 + 0.6);
const MAZE_CENTRE = new THREE.Vector3(0, 0, 0);

export const CAMERA_MODES = ['overview', 'chase', 'firstPerson', 'cinematic'];

/**
 * Field of view per camera mode. The overview stays moderately wide so the whole
 * board is still readable; the chase and first-person modes go wider for the
 * corridor drama the reference art has, and first-person sits near the 75-80
 * degrees a headset presents per eye, which keeps the VR port honest.
 */
const MODE_FOV = { overview: 62, chase: 68, firstPerson: 78, cinematic: 60 };

/* ------------------------------------------------------------- camera framing */

/**
 * Places the camera along a tilted axis at the closest distance that still
 * contains the maze bounding box, for any aspect ratio. Solved iteratively
 * because the projected extent is not a closed form once perspective is in play.
 */
const FIT_CORNERS = [];
for (const cx of [-1, 1]) {
  for (const cy of [0, 1]) {
    for (const cz of [-1, 1]) {
      FIT_CORNERS.push(new THREE.Vector3(MAZE_HALF.x * cx, MAZE_HALF.y * cy * 2, MAZE_HALF.z * cz));
    }
  }
}
// Hoisted scratch objects: the cinematic camera re-solves the fit every frame,
// and cloning a PerspectiveCamera per frame is pure garbage on the very first
// screen every player sees.
const FIT_PROBE = new THREE.PerspectiveCamera();
const FIT_DIR = new THREE.Vector3();
const FIT_TMP = new THREE.Vector3();

/** `lens` only needs fov/aspect/near/far - a real camera or a plain object. */
function fitDistance(lens, tiltRad, margin, yawRad = 0) {
  const dir = FIT_DIR.set(
    Math.sin(yawRad) * Math.cos(tiltRad),
    Math.sin(tiltRad),
    Math.cos(yawRad) * Math.cos(tiltRad)
  ).normalize();
  const corners = FIT_CORNERS;

  const tmp = FIT_TMP;
  const probe = FIT_PROBE;
  probe.fov = lens.fov;
  probe.aspect = lens.aspect;
  probe.near = lens.near;
  probe.far = lens.far;

  const extentAt = (dist) => {
    probe.position.copy(dir).multiplyScalar(dist).add(MAZE_CENTRE);
    probe.lookAt(MAZE_CENTRE);
    probe.updateMatrixWorld(true);
    probe.updateProjectionMatrix();
    let maxExtent = 0;
    for (const c of corners) {
      tmp.copy(c).project(probe);
      maxExtent = Math.max(maxExtent, Math.abs(tmp.x), Math.abs(tmp.y));
    }
    return maxExtent;
  };

  // Binary search for the smallest distance that still fits. The projected
  // extent falls monotonically with distance, but not proportionally once the
  // camera is low, which is what defeated the old multiplicative iteration.
  const limit = 1 / margin;
  let lo = 8;
  let hi = 220;
  if (extentAt(hi) > limit) return hi;
  for (let i = 0; i < 26; i++) {
    const mid = (lo + hi) / 2;
    if (extentAt(mid) > limit) lo = mid;
    else hi = mid;
  }
  return hi;
}

/* --------------------------------------------------------------------- factory */

export function createRenderer(canvas, game, tierName) {
  let quality = { ...TIERS[tierName] };

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: 'high-performance',
    stencil: false,
    alpha: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.pixelRatioCap));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = quality.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x150029, 0.0125);

  const camera = new THREE.PerspectiveCamera(
    MODE_FOV.overview,
    window.innerWidth / window.innerHeight,
    0.1,
    900
  );
  camera.position.set(0, 30, 22);
  camera.lookAt(MAZE_CENTRE);

  const env = createEnvironment(scene, renderer, quality, camera);

  /* ------------------------------------------------------------ world content */

  const world = new THREE.Group();
  scene.add(world);

  let mazeMesh = buildMaze(game.maze, quality);
  world.add(mazeMesh.group, mazeMesh.floorGroup);
  const mirrorRoot = new THREE.Group();
  world.add(mirrorRoot);
  if (mazeMesh.mirror) mirrorRoot.add(mazeMesh.mirror);

  const pellets = createPellets(game.maze, quality);
  world.add(pellets.mesh, pellets.halo);

  const energizers = createEnergizers(game.maze, quality);
  world.add(energizers.group);

  const pacman = createPacman(quality);
  world.add(pacman.root, pacman.pool);

  const ghostModels = {};
  for (const id of GHOST_ORDER) {
    const model = createGhostModel(id, quality);
    ghostModels[id] = model;
    world.add(model.root, model.pool);
  }

  // Mirrored dynamic actors: separate instances, dimmed, flipped under the floor.
  const reflectionRig = new THREE.Group();
  reflectionRig.scale.y = -1;
  reflectionRig.position.y = -0.008;
  world.add(reflectionRig);

  let reflPacman = null;
  const reflGhosts = {};
  if (quality.reflectActors) {
    const reflQuality = {
      ...quality,
      shadows: false,
      actorLights: false,
      ghostLights: false,
      energizerLights: false,
      pacSegments: Math.max(16, Math.round(quality.pacSegments * 0.6)),
      ghostSegments: Math.max(14, Math.round(quality.ghostSegments * 0.6)),
    };
    reflPacman = createPacman(reflQuality);
    dimForReflection(reflPacman.root);
    reflectionRig.add(reflPacman.root);
    for (const id of GHOST_ORDER) {
      const model = createGhostModel(id, reflQuality);
      dimForReflection(model.root);
      reflGhosts[id] = model;
      reflectionRig.add(model.root);
    }
  }

  const fruitFactory = createFruitFactory();
  const fruitHolder = new THREE.Group();
  fruitHolder.visible = false;
  world.add(fruitHolder);
  const fruitAura = createFruitAura();
  world.add(fruitAura.group);
  let currentFruitId = null;
  let fruitModelHolder = new THREE.Group();
  fruitHolder.add(fruitModelHolder);

  const popups = createPopupPool(8);
  world.add(popups.group);

  // Arcade signage standing on the grid around the board.
  const signs = createSigns(world);

  const post = createPostFX(renderer, scene, camera, quality);

  /* ------------------------------------------------------------- camera state */

  const cam = {
    mode: 'cinematic',
    tilt: THREE.MathUtils.degToRad(28),
    yaw: THREE.MathUtils.degToRad(8),
    margin: 1.05,
    distance: 40,
    shake: 0,
    fovPunch: 0,
    look: new THREE.Vector3(0, 0, 0),
    pos: new THREE.Vector3(0, 30, 22),
    orbit: 0,
    lastPacX: 0,
  };

  function recomputeFit() {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    // Solve the framing against the overview lens so switching to a wider mode
    // and back does not change how the board is framed.
    FIT_PROBE.fov = MODE_FOV.overview;

    // The maze projects to roughly 28 x 31*sin(tilt) on screen, so a tall
    // portrait phone is always width-bound. Steepening the tilt stretches the
    // projection vertically and recovers a good chunk of that wasted height
    // (about 40% -> 51% of the viewport on a 393x852 screen).
    const portrait = THREE.MathUtils.clamp((0.85 - aspect) / 0.45, 0, 1);
    // A lower tilt reads far more three-dimensional - the wall sides and the
    // reflections both come into view - and a small yaw takes the maze off the
    // screen axes for a proper isometric feel. Portrait steepens both back off,
    // because a tall phone is width-bound and needs the projection stretched.
    // Below half the field of view the horizon clears the top of frame, which is
    // what puts the sun, the ridgeline and the palms behind the board during
    // play. Portrait steepens back up because a tall screen is width-bound and
    // needs the projection stretched vertically instead.
    cam.tilt = THREE.MathUtils.degToRad(28 + portrait * 32);
    cam.yaw = THREE.MathUtils.degToRad(8 * (1 - portrait));
    cam.margin = 1.05 - portrait * 0.03;

    const fitCam = { fov: MODE_FOV.overview, aspect, near: camera.near, far: camera.far };
    cam.distance = fitDistance(fitCam, cam.tilt, cam.margin, cam.yaw);
  }
  recomputeFit();

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.pixelRatioCap));
    renderer.setSize(w, h, false);
    recomputeFit();
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    post.setSize(size.x, size.y);
  }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 120));

  /* ---------------------------------------------------------------- per frame */

  const tmpVec = new THREE.Vector3();
  const desiredPos = new THREE.Vector3();
  const desiredLook = new THREE.Vector3();

  function updateCamera(dt, time) {
    const pac = game.pacman;
    const px = worldX(pac.x);
    const pz = worldZ(pac.y);

    // Ease the lens toward the mode's field of view before anything is solved
    // against it, so the framing and the projection never disagree for a frame.
    const targetFov = MODE_FOV[cam.mode] ?? MODE_FOV.overview;
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 4);
      camera.updateProjectionMatrix();
    }

    if (cam.mode === 'firstPerson') {
      // Eye height inside the corridor, looking down the direction of travel.
      const dirVec = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[pac.dir] ?? [-1, 0];
      const bob = Math.sin(time * 11) * 0.022;
      // Slightly ahead of centre so the near clip never grazes his own shell.
      desiredPos.set(px + dirVec[0] * 0.22, 0.5 + bob, pz + dirVec[1] * 0.22);
      desiredLook.set(px + dirVec[0] * 5, 0.44 + Math.sin(time * 5.5) * 0.02, pz + dirVec[1] * 5);
      if (Math.abs(px - cam.lastPacX) > 8) {
        cam.pos.copy(desiredPos);
        cam.look.copy(desiredLook);
      }
    } else if (cam.mode === 'cinematic') {
      // Sweep between a low, sunset-revealing angle and a high three-quarter
      // view. Below roughly 22 degrees the horizon clears the top of frame and
      // the banded sun and mountain ridges come into shot.
      cam.orbit += dt * 0.13;
      const sweep = 0.5 + 0.5 * Math.sin(time * 0.16);
      const tiltDeg = 9 + sweep * 34;
      const tilt = THREE.MathUtils.degToRad(tiltDeg);
      const d = fitDistance(camera, tilt, 1.06 + (1 - sweep) * 0.5);
      // Yaw is scaled by the sweep so the lowest, most cinematic tilt always
      // looks straight down the sun's azimuth: maze in the foreground, banded
      // disc dead centre behind the ridgeline.
      const yaw = Math.sin(cam.orbit) * 0.5 * sweep;
      desiredPos.set(
        Math.sin(yaw) * d * Math.cos(tilt),
        Math.sin(tilt) * d,
        Math.cos(yaw) * d * Math.cos(tilt)
      );
      desiredLook.set(0, 1.0 + (1 - sweep) * 3.4, 0);
    } else if (cam.mode === 'chase') {
      const dirVec = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[pac.dir] ?? [-1, 0];
      desiredPos.set(px - dirVec[0] * 5.2, 3.4, pz - dirVec[1] * 5.2);
      desiredLook.set(px + dirVec[0] * 3.2, 0.35, pz + dirVec[1] * 3.2);
      // Pac-Man teleports by a full maze width at the side tunnel; lerping
      // through that jump whip-pans the camera across the middle of the board,
      // through the walls, every time the player uses the tunnel.
      if (Math.abs(px - cam.lastPacX) > 8) {
        cam.pos.copy(desiredPos);
        cam.look.copy(desiredLook);
      }
    } else {
      // Overview: whole maze framed, drifting gently toward Pac-Man.
      const driftX = THREE.MathUtils.clamp(px * 0.1, -1.5, 1.5);
      const driftZ = THREE.MathUtils.clamp(pz * 0.07, -1.2, 1.2);
      const breathe = Math.sin(time * 0.32) * 0.55;
      const horiz = Math.cos(cam.tilt) * cam.distance;
      desiredPos.set(
        driftX + Math.sin(cam.yaw) * horiz,
        Math.sin(cam.tilt) * cam.distance + breathe,
        Math.cos(cam.yaw) * horiz + driftZ
      );
      desiredLook.set(driftX * 0.55, 0.9, driftZ * 0.5);
    }

    const ease =
      cam.mode === 'chase' || cam.mode === 'firstPerson'
        ? 1 - Math.pow(0.0004, dt)
        : 1 - Math.pow(0.06, dt);
    cam.pos.lerp(desiredPos, ease);
    cam.look.lerp(desiredLook, ease);

    if (cam.shake > 0.0001) {
      cam.shake = Math.max(0, cam.shake - dt * 2.4);
      const s = cam.shake * cam.shake;
      tmpVec.set(
        (Math.random() - 0.5) * s * 2.4,
        (Math.random() - 0.5) * s * 2.4,
        (Math.random() - 0.5) * s * 2.4
      );
      camera.position.copy(cam.pos).add(tmpVec);
    } else {
      camera.position.copy(cam.pos);
    }
    camera.lookAt(cam.look);

    if (cam.fovPunch > 0.0001) {
      cam.fovPunch = Math.max(0, cam.fovPunch - dt * 3.2);
      camera.fov = targetFov - cam.fovPunch * 5;
      camera.updateProjectionMatrix();
    }

    cam.lastPacX = px;

    // Keep the sun light following the maze so shadows stay inside the map.
    env.sun.target.position.set(0, 0, 0);
  }

  function syncFruit(time) {
    const f = game.fruit;
    if (!f) {
      fruitHolder.visible = false;
      fruitAura.group.visible = false;
      return;
    }
    if (currentFruitId !== f.def.id) {
      fruitModelHolder.clear();
      fruitModelHolder.add(fruitFactory(f.def.id));
      currentFruitId = f.def.id;
    }
    const wx = worldX(f.x);
    const wz = worldZ(f.y);
    fruitHolder.visible = true;
    fruitHolder.position.set(wx, 0.55 + Math.sin(time * 3) * 0.07, wz);
    fruitHolder.rotation.y = time * 1.5;

    fruitAura.group.visible = true;
    fruitAura.group.position.set(wx, 0.03, wz);
    fruitAura.update(time);

    // Blink out over the last two seconds of its life.
    const blink = f.timer > 2 || Math.sin(time * 16) > -0.3;
    fruitModelHolder.visible = blink;
    fruitAura.group.visible = blink;
  }

  let elapsed = 0;

  function render(dt) {
    elapsed += dt;
    const time = elapsed;
    // The composer issues several renderer.render() calls per frame; disabling
    // autoReset lets info accumulate so the stats reflect the whole frame.
    renderer.info.autoReset = false;
    renderer.info.reset();

    env.update(time);
    mazeMesh.update(time, game.frightTimer > 0);

    const death = game.state === STATE.DYING ? game.deathProgress : 0;
    pacman.update(game.pacman, time, death);
    if (reflectionRig.visible && reflPacman) reflPacman.update(game.pacman, time, death);

    // The arcade blinks for a fixed number of cycles at the end of every power
    // pellet, so the phase comes from the simulation's flash window rather than
    // from a fraction of the remaining time.
    const halfFlash = game.frightFlashPeriod / 2;
    const inFlashWindow = game.frightTimer > 0 && game.frightTimer <= game.frightFlashSeconds;
    const flashing =
      inFlashWindow &&
      Math.floor((game.frightFlashSeconds - game.frightTimer) / halfFlash) % 2 === 1;

    const reflectVisible = reflectionRig.visible;
    for (const id of GHOST_ORDER) {
      const g = game.ghosts[id];
      g.eyeDir = g.dir;
      ghostModels[id].update(g, time, flashing);
      if (reflectVisible && reflGhosts[id]) reflGhosts[id].update(g, time, flashing);
    }

    // In first person Pac-Man IS the camera, so his shell, light pool and
    // reflection all have to go or they fill the frame from the inside.
    const fpv = cam.mode === 'firstPerson';
    pacman.root.visible = !fpv;
    pacman.pool.visible = !fpv;
    if (reflPacman) reflPacman.root.visible = !fpv;

    // Hide the actors during the level-clear flash for the classic blink.
    const clearing = game.state === STATE.LEVEL_CLEAR;
    const blink = clearing && Math.sin(game.levelFlash * 18) > 0;
    for (const id of GHOST_ORDER) {
      ghostModels[id].root.visible = !clearing;
      ghostModels[id].pool.visible = !clearing;
      if (reflGhosts[id]) reflGhosts[id].root.visible = !clearing;
    }
    mazeMesh.group.visible = !blink;
    if (mazeMesh.mirror) mazeMesh.mirror.visible = !blink;

    signs.update(game);
    pellets.sync(time);
    energizers.sync(time);
    syncFruit(time);
    popups.sync(game.scorePopups);

    updateCamera(dt, time);
    post.update(dt, time);
    post.render();
  }

  /* ---------------------------------------------------------------- rebuilding */

  /**
   * Steps the whole scene down a tier. Geometry tessellation is baked at build
   * time and is deliberately left alone, but everything that costs per frame -
   * pixel ratio, MSAA, shadows, reflections, particle systems, light count and
   * post strength - is switched off here. Without that the watchdog would walk a
   * struggling phone down five tiers while it kept paying nearly the full price.
   */
  function applyTier(nextTier) {
    quality = { ...TIERS[nextTier] };
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.pixelRatioCap));
    renderer.shadowMap.enabled = quality.shadows;

    post.bloom.strength = quality.bloomStrength;
    post.bloom.radius = quality.bloomRadius;
    post.bloom.threshold = quality.bloomThreshold;
    post.grade.uniforms.aberration.value = quality.aberration;
    post.grade.uniforms.scanline.value = quality.scanline;
    post.grade.uniforms.grain.value = quality.grain;
    post.setMsaa(quality.msaa);

    env.setMotes(quality.motes > 0);
    env.setShafts(quality.shafts);

    pacman.setLights(quality.actorLights);
    for (const id of GHOST_ORDER) ghostModels[id].setLights(quality.ghostLights);
    energizers.setLights(quality.energizerLights);

    reflectionRig.visible = quality.reflectActors;
    mazeMesh.setReflections(quality.reflections);

    resize();
  }

  return {
    renderer,
    scene,
    camera,
    post,
    render,
    resize,
    get quality() {
      return quality;
    },
    applyTier,
    setCameraMode(mode) {
      cam.mode = CAMERA_MODES.includes(mode) ? mode : 'overview';
      recomputeFit();
    },
    cycleCameraMode() {
      const i = CAMERA_MODES.indexOf(cam.mode);
      const next = CAMERA_MODES[(i + 1) % CAMERA_MODES.length];
      cam.mode = next;
      recomputeFit();
      return next;
    },
    get cameraMode() {
      return cam.mode;
    },
    shake(amount) {
      cam.shake = Math.min(1.4, cam.shake + amount);
    },
    punch(amount) {
      cam.fovPunch = Math.min(1.2, cam.fovPunch + amount);
    },
    resetPellets() {
      pellets.reset();
    },
    /** Rebuilds pellet instancing after a level change (layout is identical). */
    stats() {
      return {
        tier: quality.name,
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        wallBlocks: mazeMesh.componentCount,
      };
    },
    dispose() {
      window.removeEventListener('resize', resize);
      post.dispose();
      signs.dispose();
      mazeMesh.dispose();
      env.dispose();
      renderer.dispose();
    },
  };
}

/**
 * Turns a normal actor model into a dim, double-sided reflection copy.
 *
 * The materials are mutated IN PLACE rather than cloned. Each reflection actor is
 * its own instance with its own materials, and the model's update() closure holds
 * direct references to them - swapping in clones orphaned those references, so
 * reflected ghosts never turned blue during a power pellet and never flashed.
 */
function dimForReflection(root) {
  root.traverse((obj) => {
    if (obj.isPointLight) {
      obj.visible = false;
      obj.intensity = 0;
      return;
    }
    if (!obj.material) return;
    obj.renderOrder = -2;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const m of mats) {
      m.side = THREE.DoubleSide;
      m.transparent = true;
      m.opacity = (m.opacity ?? 1) * 0.5;
      m.depthWrite = false;
      m.needsUpdate = true;
    }
    obj.castShadow = false;
    obj.receiveShadow = false;
  });
}

export { PALETTE };
