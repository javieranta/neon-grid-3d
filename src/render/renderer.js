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
import { TIERS } from './quality.js';

const MAZE_HALF = new THREE.Vector3(MAZE_W / 2 + 0.6, WALL_HEIGHT * 0.5, MAZE_H / 2 + 0.6);
const MAZE_CENTRE = new THREE.Vector3(0, 0, 0);

export const CAMERA_MODES = ['overview', 'chase', 'cinematic'];

/* ------------------------------------------------------------- camera framing */

/**
 * Places the camera along a tilted axis at the closest distance that still
 * contains the maze bounding box, for any aspect ratio. Solved iteratively
 * because the projected extent is not a closed form once perspective is in play.
 */
function fitDistance(camera, tiltRad, margin) {
  const dir = new THREE.Vector3(0, Math.sin(tiltRad), Math.cos(tiltRad)).normalize();
  const corners = [];
  for (const sx of [-1, 1]) {
    for (const sy of [0, 1]) {
      for (const sz of [-1, 1]) {
        corners.push(
          new THREE.Vector3(MAZE_HALF.x * sx, MAZE_HALF.y * sy * 2, MAZE_HALF.z * sz)
        );
      }
    }
  }

  let dist = 40;
  const tmp = new THREE.Vector3();
  const probe = camera.clone();
  for (let iter = 0; iter < 14; iter++) {
    probe.position.copy(dir).multiplyScalar(dist).add(MAZE_CENTRE);
    probe.lookAt(MAZE_CENTRE);
    probe.updateMatrixWorld(true);
    probe.updateProjectionMatrix();
    let maxExtent = 0;
    for (const c of corners) {
      tmp.copy(c).project(probe);
      maxExtent = Math.max(maxExtent, Math.abs(tmp.x), Math.abs(tmp.y));
    }
    if (maxExtent < 1e-4) break;
    dist *= maxExtent * margin;
    dist = THREE.MathUtils.clamp(dist, 12, 200);
  }
  return dist;
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

  const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 900);
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
  world.add(pellets.mesh);

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
  let currentFruitId = null;

  const popups = createPopupPool(8);
  world.add(popups.group);

  const post = createPostFX(renderer, scene, camera, quality);

  /* ------------------------------------------------------------- camera state */

  const cam = {
    mode: 'cinematic',
    tilt: THREE.MathUtils.degToRad(52),
    margin: 1.04,
    distance: 40,
    shake: 0,
    fovPunch: 0,
    look: new THREE.Vector3(0, 0, 0),
    pos: new THREE.Vector3(0, 30, 22),
    orbit: 0,
  };

  function recomputeFit() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    cam.distance = fitDistance(camera, cam.tilt, cam.margin);
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

    if (cam.mode === 'cinematic') {
      // Sweep between a low, sunset-revealing angle and a high three-quarter
      // view. Below roughly 22 degrees the horizon clears the top of frame and
      // the banded sun and mountain ridges come into shot.
      cam.orbit += dt * 0.13;
      const sweep = 0.5 + 0.5 * Math.sin(time * 0.16);
      const tiltDeg = 9 + sweep * 34;
      const tilt = THREE.MathUtils.degToRad(tiltDeg);
      const d = fitDistance(camera, tilt, 1.1 + (1 - sweep) * 0.55);
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
    } else {
      // Overview: whole maze framed, drifting gently toward Pac-Man.
      const driftX = THREE.MathUtils.clamp(px * 0.1, -1.5, 1.5);
      const driftZ = THREE.MathUtils.clamp(pz * 0.07, -1.2, 1.2);
      const breathe = Math.sin(time * 0.32) * 0.55;
      desiredPos.set(
        driftX,
        Math.sin(cam.tilt) * cam.distance + breathe,
        Math.cos(cam.tilt) * cam.distance + driftZ
      );
      desiredLook.set(driftX * 0.55, 0.2, driftZ * 0.5);
    }

    const ease = cam.mode === 'chase' ? 1 - Math.pow(0.0015, dt) : 1 - Math.pow(0.06, dt);
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
      camera.fov = 44 - cam.fovPunch * 5;
      camera.updateProjectionMatrix();
    } else if (Math.abs(camera.fov - 44) > 1e-3) {
      camera.fov = 44;
      camera.updateProjectionMatrix();
    }

    // Keep the sun light following the maze so shadows stay inside the map.
    env.sun.target.position.set(0, 0, 0);
  }

  function syncFruit(time) {
    const f = game.fruit;
    if (!f) {
      fruitHolder.visible = false;
      return;
    }
    if (currentFruitId !== f.def.id) {
      fruitHolder.clear();
      fruitHolder.add(fruitFactory(f.def.id));
      currentFruitId = f.def.id;
    }
    fruitHolder.visible = true;
    fruitHolder.position.set(worldX(f.x), 0.42 + Math.sin(time * 3) * 0.06, worldZ(f.y));
    fruitHolder.rotation.y = time * 1.5;
    // Blink out over the last two seconds of its life.
    const child = fruitHolder.children[0];
    if (child) child.visible = f.timer > 2 || Math.sin(time * 16) > -0.3;
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
    if (reflPacman) reflPacman.update(game.pacman, time, death);

    const frightRatio = game.frightTotal > 0 ? game.frightTimer / game.frightTotal : 1;
    for (const id of GHOST_ORDER) {
      const g = game.ghosts[id];
      g.eyeDir = g.dir;
      ghostModels[id].update(g, time, frightRatio);
      if (reflGhosts[id]) reflGhosts[id].update(g, time, frightRatio);
    }

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

    pellets.sync(time);
    energizers.sync(time);
    syncFruit(time);
    popups.sync(game.scorePopups);

    updateCamera(dt, time);
    post.update(dt, time);
    post.render();
  }

  /* ---------------------------------------------------------------- rebuilding */

  function applyTier(nextTier) {
    quality = { ...TIERS[nextTier] };
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.pixelRatioCap));
    renderer.shadowMap.enabled = quality.shadows;
    post.bloom.strength = quality.bloomStrength;
    post.bloom.radius = quality.bloomRadius;
    post.grade.uniforms.aberration.value = quality.aberration;
    post.grade.uniforms.scanline.value = quality.scanline;
    post.grade.uniforms.grain.value = quality.grain;
    // Cheap wins first: drop the extras rather than rebuilding all geometry.
    reflectionRig.visible = quality.reflectActors;
    if (mazeMesh.mirror) mazeMesh.mirror.visible = quality.reflections;
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
      mazeMesh.dispose();
      env.dispose();
      renderer.dispose();
    },
  };
}

/** Turns a normal actor model into a dim, double-sided reflection copy. */
function dimForReflection(root) {
  root.traverse((obj) => {
    if (obj.isPointLight) {
      obj.intensity = 0;
      return;
    }
    if (!obj.material) return;
    obj.renderOrder = -2;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    obj.material = mats.map((m) => {
      const c = m.clone();
      c.side = THREE.DoubleSide;
      c.transparent = true;
      c.opacity = (m.opacity ?? 1) * 0.42;
      c.depthWrite = false;
      if (c.emissiveIntensity !== undefined) c.emissiveIntensity *= 0.6;
      return c;
    });
    if (!Array.isArray(mats) || mats.length === 1) obj.material = obj.material[0];
    obj.castShadow = false;
    obj.receiveShadow = false;
  });
}

export { PALETTE };
