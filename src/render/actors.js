/**
 * NEON GRID — actor models.
 *
 * Every model is generated in code: Pac-Man is two hinged hemispheres so his
 * mouth is a real 3D wedge, the ghosts are a dome plus an animated wavy skirt
 * with tracking eyes, the pellets are one instanced mesh with per-dot pop
 * animation, and the eight fruits are little low-poly sculptures.
 */

import * as THREE from 'three';
import { DIR_YAW, PALETTE, worldX, worldZ } from './palette.js';
import { GHOST_META, GHOST_ORDER } from '../core/ghost.js';
import { DIRECTIONS } from '../core/maze.js';

/* --------------------------------------------------------------- shared utils */

const canvasCache = new Map();

function radialTexture(key, inner, outer, power = 2) {
  if (canvasCache.has(key)) return canvasCache.get(key);
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const a = Math.pow(1 - t, power);
    grad.addColorStop(t, `rgba(${inner[0]}, ${inner[1]}, ${inner[2]}, ${a})`);
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  canvasCache.set(key, tex);
  void outer;
  return tex;
}

function glowSprite(colour, scale, opacity = 0.55) {
  const c = new THREE.Color(colour);
  const tex = radialTexture(
    `glow-${colour}`,
    [Math.round(c.r * 255), Math.round(c.g * 255), Math.round(c.b * 255)],
    null,
    2.2
  );
  const mat = new THREE.SpriteMaterial({
    map: tex,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity,
    toneMapped: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.setScalar(scale);
  return sprite;
}

/** Flat additive light pool laid on the floor beneath an actor. */
function lightPool(colour, size, opacity = 0.5) {
  const c = new THREE.Color(colour);
  const tex = radialTexture(
    `pool-${colour}`,
    [Math.round(c.r * 255), Math.round(c.g * 255), Math.round(c.b * 255)],
    null,
    2.6
  );
  const geo = new THREE.PlaneGeometry(size, size);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    opacity,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = 0.012;
  mesh.renderOrder = 4;
  return mesh;
}

/* --------------------------------------------------------------------- Pac-Man */

const PAC_R = 0.46;
const PAC_Y = 0.46;

export function createPacman(quality) {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: PALETTE.pac,
    emissive: new THREE.Color(PALETTE.pacDeep),
    emissiveIntensity: 0.8,
    metalness: 0.1,
    roughness: 0.11,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.1,
  });
  const mouthMat = new THREE.MeshStandardMaterial({
    color: PALETTE.pacMouth,
    emissive: new THREE.Color(0x662200),
    emissiveIntensity: 0.5,
    roughness: 0.6,
    side: THREE.DoubleSide,
  });

  const makeJaw = (upper) => {
    const jaw = new THREE.Group();
    const dome = new THREE.SphereGeometry(
      PAC_R,
      quality.pacSegments,
      Math.max(10, quality.pacSegments / 2),
      0,
      Math.PI * 2,
      upper ? 0 : Math.PI / 2,
      Math.PI / 2
    );
    const shell = new THREE.Mesh(dome, bodyMat);
    shell.castShadow = quality.shadows;
    jaw.add(shell);

    const disc = new THREE.CircleGeometry(PAC_R, quality.pacSegments);
    disc.rotateX(upper ? Math.PI / 2 : -Math.PI / 2);
    jaw.add(new THREE.Mesh(disc, mouthMat));
    return jaw;
  };

  const upper = makeJaw(true);
  const lower = makeJaw(false);
  group.add(upper, lower);

  // Eyes, as in the reference art: two black almonds high on the front of the
  // head. Parented to the upper jaw so they ride with it as the mouth works.
  const eyeMat = new THREE.MeshPhysicalMaterial({
    color: 0x07030f,
    roughness: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    metalness: 0,
  });
  const pacEyeGeo = new THREE.SphereGeometry(0.115, 18, 14);
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(pacEyeGeo, eyeMat);
    eye.position.set(PAC_R * 0.52, PAC_R * 0.5, side * PAC_R * 0.36);
    eye.scale.set(0.55, 1.25, 0.85);
    eye.rotation.z = -0.22;
    upper.add(eye);
  }

  const halo = glowSprite(0xfff0a0, 1.9, 0.3);
  group.add(halo);

  const pool = lightPool(PALETTE.pac, 2.5, 0.4);

  // Locator ring. At a full-maze framing on a phone Pac-Man is only a few
  // pixels across, so a thin pulsing circle on the floor makes him findable at
  // a glance without adding an out-of-place HUD marker.
  const ringGeo = new THREE.RingGeometry(0.52, 0.6, 40);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xfff3b0,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = 0.02;
  ring.renderOrder = 5;
  pool.add(ring);

  // Lights are added conditionally: an unused light still costs a uniform slot.
  let light = null;
  if (quality.actorLights) {
    light = new THREE.PointLight(0xffd54a, 1.0, 3.1, 2.1);
    light.position.y = 0.2;
    group.add(light);
  }

  const root = new THREE.Group();
  root.add(group);
  let lampScale = 1;

  return {
    root,
    pool,
    setLights(on) {
      if (light) light.visible = on;
    },
    /**
     * Hides the shell without hiding the point light, so in first person - where
     * the camera IS Pac-Man - his lamp still lights the corridor walls.
     */
    setBodyVisible(on) {
      upper.visible = on;
      lower.visible = on;
      halo.visible = on;
    },
    /**
     * The locator ring exists so Pac-Man is findable at a full-board framing. Up
     * close it is just a hoop underfoot, and the lamp has to come down too or it
     * floods the corridor walls.
     */
    setCloseUp(close) {
      ring.visible = !close;
      lampScale = close ? 0.42 : 1;
    },
    /**
     * @param {object} pac   game pacman actor
     * @param {number} time
     * @param {number} death 0..1 death animation progress
     */
    update(pac, time, death) {
      const wx = worldX(pac.x);
      const wz = worldZ(pac.y);
      root.position.set(wx, PAC_Y, wz);
      pool.position.set(wx, 0.012, wz);

      group.rotation.y = DIR_YAW[pac.dir] ?? 0;

      if (death > 0) {
        // The classic vanishing act: mouth opens all the way round, then gone.
        const open = Math.min(1, death * 1.35);
        const half = open * Math.PI;
        upper.rotation.z = half;
        lower.rotation.z = -half;
        const shrink = Math.max(0, 1 - Math.max(0, death - 0.72) / 0.28);
        group.scale.setScalar(shrink);
        group.rotation.y += death * 6.5;
        halo.material.opacity = 0.42 * shrink;
        pool.material.opacity = 0.5 * shrink;
        if (light) light.intensity = lampScale * shrink;
        ringMat.opacity = 0.55 * shrink;
        ring.scale.setScalar(1 + (1 - shrink) * 1.6);
        return;
      }

      group.scale.setScalar(1);
      const chomp = Math.abs(Math.sin(pac.mouth * Math.PI));
      const half = 0.06 + chomp * 0.62;
      upper.rotation.z = half;
      lower.rotation.z = -half;

      const bob = Math.sin(time * 9) * 0.012;
      root.position.y = PAC_Y + bob;
      halo.material.opacity = (0.26 + 0.08 * Math.sin(time * 6)) * lampScale;
      pool.material.opacity = 0.3 + 0.08 * Math.sin(time * 6);
      if (light) light.intensity = lampScale * (0.95 + 0.2 * Math.sin(time * 7));

      const beat = 0.5 + 0.5 * Math.sin(time * 3.1);
      ring.scale.setScalar(0.9 + beat * 0.22);
      ringMat.opacity = 0.32 + beat * 0.3;
      ring.rotation.y = time * 0.8;
    },
  };
}

/* ---------------------------------------------------------------------- ghosts */

const GHOST_R = 0.46;
const GHOST_Y = 0.44;
const SKIRT_SEGMENTS = 64;
const SKIRT_LOBES = 5;
const SKIRT_AMPLITUDE = 0.17;

/** Unit triangle wave. Sharp peaks and valleys, unlike a sine's soft scallops. */
const triangleWave = (x) => 2 * Math.abs(x - Math.floor(x + 0.5));

function buildSkirt(radius, height) {
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];
  const rings = 2;

  for (let r = 0; r < rings; r++) {
    for (let i = 0; i <= SKIRT_SEGMENTS; i++) {
      const a = (i / SKIRT_SEGMENTS) * Math.PI * 2;
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;
      positions.push(x, r === 0 ? 0 : -height, z);
      normals.push(Math.cos(a), 0, Math.sin(a));
      uvs.push(i / SKIRT_SEGMENTS, r);
    }
  }
  const stride = SKIRT_SEGMENTS + 1;
  for (let i = 0; i < SKIRT_SEGMENTS; i++) {
    const a = i;
    const b = i + 1;
    const c = stride + i;
    const d = stride + i + 1;
    indices.push(a, c, b, b, c, d);
  }

  // Flat cap so the ghost is not see-through from below (it shows in the mirror).
  // Sits at the hem's mean depth so it stays hidden behind the points.
  const capStart = positions.length / 3;
  positions.push(0, -height + SKIRT_AMPLITUDE * 0.5, 0);
  normals.push(0, -1, 0);
  uvs.push(0.5, 0.5);
  for (let i = 0; i < SKIRT_SEGMENTS; i++) {
    indices.push(capStart, stride + i + 1, stride + i);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.userData.bottomStart = stride;
  geo.userData.bottomCount = stride;
  geo.userData.baseHeight = height;
  return geo;
}

function zigzagTexture() {
  if (canvasCache.has('zigzag')) return canvasCache.get('zigzag');
  const w = 128;
  const h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 9;
  ctx.lineJoin = 'miter';
  ctx.beginPath();
  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const y = i % 2 === 0 ? h * 0.66 : h * 0.3;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  canvasCache.set('zigzag', tex);
  return tex;
}

export function createGhost(id, quality) {
  const meta = GHOST_META[id];
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: meta.colour,
    emissive: new THREE.Color(meta.colour),
    emissiveIntensity: 0.6,
    metalness: 0.05,
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 0.9,
  });

  // Fresnel rim, injected into the physical shader. A flat emissive tint makes a
  // ghost brighter; an edge-weighted term makes it read as a glowing object,
  // which is how the reference art separates them from the dark.
  let rimUniform = null;
  let rimStrengthUniform = null;
  bodyMat.onBeforeCompile = (shader) => {
    shader.uniforms.uGhostRim = { value: new THREE.Color(meta.glow) };
    shader.uniforms.uGhostRimStrength = { value: 1.6 };
    rimUniform = shader.uniforms.uGhostRim;
    rimStrengthUniform = shader.uniforms.uGhostRimStrength;
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vRimNormal;\nvarying vec3 vRimView;'
      )
      .replace(
        '#include <project_vertex>',
        '#include <project_vertex>\n  vRimNormal = normalize(transformedNormal);\n  vRimView = -mvPosition.xyz;'
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vRimNormal;\nvarying vec3 vRimView;\nuniform vec3 uGhostRim;\nuniform float uGhostRimStrength;'
      )
      .replace(
        '#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\n  float ghostRim = 1.0 - abs(dot(normalize(vRimNormal), normalize(vRimView)));\n  totalEmissiveRadiance += uGhostRim * pow(ghostRim, 2.4) * uGhostRimStrength;'
      );
  };

  const dome = new THREE.SphereGeometry(
    GHOST_R,
    quality.ghostSegments,
    Math.max(10, quality.ghostSegments / 2),
    0,
    Math.PI * 2,
    0,
    Math.PI / 2
  );
  const domeMesh = new THREE.Mesh(dome, bodyMat);
  domeMesh.castShadow = quality.shadows;
  body.add(domeMesh);

  const skirtGeo = buildSkirt(GHOST_R, 0.42);
  const skirtMesh = new THREE.Mesh(skirtGeo, bodyMat);
  skirtMesh.castShadow = quality.shadows;
  body.add(skirtMesh);

  // Neon aura shell.
  const auraMat = new THREE.MeshBasicMaterial({
    color: meta.glow,
    transparent: true,
    // Strong enough to carry the skirt: the Fresnel rim fires on the silhouette
    // but the hem had nothing else, so it sank into the dark at low angles.
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.BackSide,
    toneMapped: false,
  });
  const aura = new THREE.Mesh(new THREE.SphereGeometry(GHOST_R * 1.42, 22, 16), auraMat);
  aura.position.y = -0.13;
  body.add(aura);

  // Eyes.
  const eyes = new THREE.Group();
  const whiteMat = new THREE.MeshStandardMaterial({
    color: PALETTE.ghostEyeWhite,
    emissive: new THREE.Color(0x8899cc),
    emissiveIntensity: 0.35,
    roughness: 0.25,
  });
  const pupilMat = new THREE.MeshStandardMaterial({
    color: PALETTE.ghostPupil,
    emissive: new THREE.Color(0x2222aa),
    emissiveIntensity: 0.45,
    roughness: 0.2,
  });
  const eyeGeo = new THREE.SphereGeometry(0.175, 24, 18);
  const pupilGeo = new THREE.SphereGeometry(0.094, 18, 16);
  const eyeParts = [];
  for (const side of [-1, 1]) {
    const white = new THREE.Mesh(eyeGeo, whiteMat);
    white.position.set(side * 0.175, 0.135, 0.3);
    white.scale.set(1, 1.18, 0.8);
    const pupil = new THREE.Mesh(pupilGeo, pupilMat);
    pupil.position.set(side * 0.175, 0.135, 0.425);
    eyes.add(white, pupil);
    eyeParts.push({ white, pupil, side });
  }
  root.add(eyes);

  // Angled brows, as in the reference art. Hidden while frightened, when the
  // ghosts lose their expression entirely.
  const browMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a0418,
    roughness: 0.12,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    metalness: 0,
  });
  const browGeo = new THREE.BoxGeometry(0.23, 0.06, 0.06);
  const brows = [];
  for (const side of [-1, 1]) {
    const brow = new THREE.Mesh(browGeo, browMat);
    brow.position.set(side * 0.182, 0.29, 0.335);
    brow.rotation.z = side * 0.5;
    brows.push(brow);
    root.add(brow);
  }

  // Frightened zigzag mouth.
  const mouthMat = new THREE.MeshBasicMaterial({
    map: zigzagTexture(),
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  const mouth = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.2), mouthMat);
  mouth.position.set(0, -0.09, GHOST_R * 0.94);
  mouth.visible = false;
  root.add(mouth);

  const halo = glowSprite(meta.glow, 2.3, 0.3);
  halo.position.y = -0.05;
  root.add(halo);

  const pool = lightPool(meta.colour, 2.6, 0.4);

  let light = null;
  if (quality.ghostLights) {
    light = new THREE.PointLight(meta.colour, 1.7, 5.2, 2);
    light.position.y = 0.1;
    root.add(light);
  }

  const skirtPos = skirtGeo.attributes.position;
  const baseHeight = skirtGeo.userData.baseHeight;
  const bottomStart = skirtGeo.userData.bottomStart;
  const bottomCount = skirtGeo.userData.bottomCount;

  const frightColour = new THREE.Color(PALETTE.frightened);
  const flashColour = new THREE.Color(PALETTE.frightenedFlash);
  const normalColour = new THREE.Color(meta.colour);

  let auraBase = 0.3;
  let haloBase = 0.3;
  // Emissive and lamp scaling for close cameras. At a distance a strong emissive
  // is what makes a ghost readable; from two tiles away it turns the model into a
  // lantern, where the reference art has solid glossy plastic with specular
  // highlights. Close up the environment and the rim do the work instead.
  let emissiveScale = 1;
  let lampScale = 1;

  return {
    root,
    pool,
    setLights(on) {
      if (light) light.visible = on;
    },
    /**
     * The aura and the Fresnel rim are sized for a camera across the board. From
     * two tiles away they swamp the frame, so both ease off - the same problem
     * Pac-Man's lamp had once the default camera moved in close.
     */
    setCloseUp(close) {
      auraBase = close ? 0.11 : 0.3;
      haloBase = close ? 0.12 : 0.3;
      emissiveScale = close ? 0.3 : 1;
      lampScale = close ? 0.3 : 1;
      if (rimStrengthUniform) rimStrengthUniform.value = close ? 0.7 : 1.6;
    },
    update(g, time, flashing) {
      const wx = worldX(g.x);
      const wz = worldZ(g.y);
      root.position.set(wx, GHOST_Y, wz);
      pool.position.set(wx, 0.012, wz);

      const hidden = g.state === 'eaten';
      body.visible = !hidden;
      halo.visible = !hidden;
      pool.visible = !hidden;

      // Animated skirt hem: a triangle wave gives the sharp points the reference
      // art and the arcade sprite both have, where a sine gives soft scallops.
      const phase = time * 1.1 + (g.x + g.y) * 0.1;
      for (let i = 0; i < bottomCount; i++) {
        const u = (i / SKIRT_SEGMENTS) * SKIRT_LOBES + phase;
        skirtPos.setY(bottomStart + i, -baseHeight + SKIRT_AMPLITUDE * triangleWave(u));
      }
      skirtPos.needsUpdate = true;

      // Eyes track the direction of travel, in the projected top-down sense.
      const d = DIRECTIONS[g.eyeDir ?? g.dir] ?? DIRECTIONS.left;
      for (const part of eyeParts) {
        part.pupil.position.x = part.side * 0.175 + d.x * 0.06;
        part.pupil.position.y = 0.135 - d.y * 0.06;
        part.pupil.position.z = 0.425 - Math.abs(d.y) * 0.02;
      }

      const bob = Math.sin(time * 5.5 + phase * 0.1) * 0.02;
      root.position.y = GHOST_Y + bob;
      auraMat.opacity = auraBase;
      halo.material.opacity = haloBase;

      if (g.frightened) {
        // `flashing` comes from the simulation's fixed flash window, so the
        // number of blinks matches the arcade at every level.
        bodyMat.color.copy(flashing ? flashColour : frightColour);
        bodyMat.emissive.copy(flashing ? flashColour : frightColour);
        bodyMat.emissiveIntensity = (flashing ? 1.1 : 0.85) * emissiveScale;
        auraMat.color.copy(flashing ? flashColour : frightColour);
        if (rimUniform) rimUniform.value.copy(flashing ? flashColour : frightColour);
        mouth.visible = !hidden;
        mouthMat.color.copy(flashing ? new THREE.Color(0x2b3cff) : flashColour);
        for (const part of eyeParts) part.pupil.visible = false;
        for (const brow of brows) brow.visible = false;
        if (light) light.color.copy(flashing ? flashColour : frightColour);
      } else {
        bodyMat.color.copy(normalColour);
        bodyMat.emissive.copy(normalColour);
        bodyMat.emissiveIntensity =
          (0.7 + 0.12 * Math.sin(time * 4 + phase * 0.2)) * emissiveScale;
        auraMat.color.setHex(meta.glow);
        if (rimUniform) rimUniform.value.setHex(meta.glow);
        mouth.visible = false;
        for (const part of eyeParts) part.pupil.visible = true;
        for (const brow of brows) brow.visible = !hidden;
        if (light) light.color.setHex(meta.colour);
      }
      if (light) {
        light.intensity = (hidden ? 0.5 : 1.5 + 0.35 * Math.sin(time * 5)) * lampScale;
        light.distance = lampScale < 1 ? 3.0 : 5.2;
      }
    },
  };
}

/* --------------------------------------------------------------------- pellets */

export function createPellets(maze, quality) {
  const list = maze.pelletsInitial.filter((p) => !p.energizer);
  const geo = new THREE.SphereGeometry(0.15, quality.pelletSegments + 2, quality.pelletSegments);
  const mat = new THREE.MeshBasicMaterial({ color: PALETTE.pellet, toneMapped: false });
  const mesh = new THREE.InstancedMesh(geo, mat, list.length);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;

  // Halo pass: the same instances, scaled up and additive, so each dot reads as
  // a glowing orb rather than a flat disc once bloom gets hold of it.
  const haloGeo = new THREE.SphereGeometry(0.15, 14, 10);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xffd873,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const halo = new THREE.InstancedMesh(haloGeo, haloMat, list.length);
  halo.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  halo.frustumCulled = false;
  halo.renderOrder = 6;

  // Reflection copy. Pellets are the brightest thing in a corridor, so their
  // reflections carry the wet-floor read; it shares the main pass's transforms
  // via one array copy rather than recomputing 240 matrices.
  const reflection = new THREE.InstancedMesh(
    geo,
    new THREE.MeshBasicMaterial({
      color: PALETTE.pellet,
      toneMapped: false,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    list.length
  );
  reflection.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  reflection.frustumCulled = false;
  reflection.renderOrder = -2;

  const state = list.map((p) => ({ ...p, eaten: false, pop: 0 }));
  const dummy = new THREE.Object3D();

  const sync = (time) => {
    for (let i = 0; i < state.length; i++) {
      const s = state[i];
      const gone = maze.pelletAt(s.x, s.y) === 0;
      if (gone && !s.eaten) {
        s.eaten = true;
        s.pop = 1;
      }
      if (!gone && s.eaten) {
        s.eaten = false;
        s.pop = 0;
      }

      let scale;
      if (s.eaten) {
        s.pop = Math.max(0, s.pop - 0.075);
        scale = s.pop > 0 ? (1 + (1 - s.pop) * 1.8) * s.pop : 0;
      } else {
        scale = 0.86 + 0.14 * Math.sin(time * 4.5 + (s.x + s.y) * 0.9);
      }

      dummy.position.set(worldX(s.x), 0.2 + (s.eaten ? (1 - s.pop) * 0.4 : 0), worldZ(s.y));
      dummy.scale.setScalar(scale);
      dummy.rotation.set(0, time * 0.6 + s.x, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      dummy.scale.multiplyScalar(1.9);
      dummy.updateMatrix();
      halo.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    halo.instanceMatrix.needsUpdate = true;
    if (reflection.visible) {
      reflection.instanceMatrix.array.set(mesh.instanceMatrix.array);
      reflection.instanceMatrix.needsUpdate = true;
    }
  };

  const reset = () => {
    for (const s of state) {
      s.eaten = false;
      s.pop = 0;
    }
  };

  return { mesh, halo, reflection, sync, reset };
}

/* ------------------------------------------------------------------ energizers */

export function createEnergizers(maze, quality) {
  const group = new THREE.Group();
  const list = maze.pelletsInitial.filter((p) => p.energizer);
  const mat = new THREE.MeshBasicMaterial({ color: PALETTE.energizer, toneMapped: false });
  const items = list.map((p) => {
    const holder = new THREE.Group();
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 20), mat);
    holder.add(core);
    const halo = glowSprite(0xfff0a0, 2.2, 0.7);
    holder.add(halo);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.022, 8, 28),
      new THREE.MeshBasicMaterial({
        color: 0xffe9a0,
        toneMapped: false,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    ring.rotation.x = Math.PI / 2;
    holder.add(ring);
    holder.position.set(worldX(p.x), 0.3, worldZ(p.y));
    group.add(holder);

    let light = null;
    if (quality.energizerLights) {
      light = new THREE.PointLight(0xfff0b0, 2.2, 6, 2);
      light.position.y = 0.1;
      holder.add(light);
    }
    return { tile: p, holder, halo, ring, light, core };
  });

  return {
    group,
    setLights(on) {
      for (const it of items) if (it.light) it.light.visible = on;
    },
    sync(time) {
      for (const it of items) {
        const alive = maze.pelletAt(it.tile.x, it.tile.y) !== 0;
        it.holder.visible = alive;
        if (!alive) {
          if (it.light) it.light.intensity = 0;
          continue;
        }
        const pulse = 0.72 + 0.28 * Math.sin(time * 7 + it.tile.x);
        it.core.scale.setScalar(0.82 + pulse * 0.3);
        it.halo.scale.setScalar(1.9 + pulse * 1.5);
        it.halo.material.opacity = 0.45 + pulse * 0.4;
        it.ring.scale.setScalar(0.9 + pulse * 0.5);
        it.ring.rotation.z = time * 1.4;
        it.holder.position.y = 0.3 + Math.sin(time * 3 + it.tile.y) * 0.03;
        if (it.light) it.light.intensity = 1.4 + pulse * 1.8;
      }
    },
  };
}

/* ---------------------------------------------------------------------- fruits */

function neon(colour, emissive = 0.7, rough = 0.3) {
  return new THREE.MeshPhysicalMaterial({
    color: colour,
    emissive: new THREE.Color(colour),
    emissiveIntensity: emissive,
    metalness: 0.2,
    roughness: rough,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
  });
}

const FRUIT_BUILDERS = {
  cherry() {
    const g = new THREE.Group();
    const mat = neon(0xff2b52, 0.8);
    for (const dx of [-0.13, 0.13]) {
      const berry = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), mat);
      berry.position.set(dx, -0.06, dx * 0.4);
      g.add(berry);
    }
    const stemMat = neon(0x4dff8f, 0.55);
    for (const dx of [-0.13, 0.13]) {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.3, 6), stemMat);
      stem.position.set(dx * 0.55, 0.16, dx * 0.2);
      stem.rotation.z = -dx * 1.6;
      g.add(stem);
    }
    return g;
  },
  strawberry() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.36, 20), neon(0xff2f6b, 0.8));
    body.rotation.x = Math.PI;
    body.position.y = -0.04;
    g.add(body);
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.09, 6), neon(0x5dff8a, 0.6));
    leaf.position.y = 0.16;
    g.add(leaf);
    return g;
  },
  orange() {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 22, 18), neon(0xffa229, 0.85)));
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 6), neon(0x4dff8f, 0.5));
    stem.position.y = 0.22;
    g.add(stem);
    return g;
  },
  apple() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 22, 18), neon(0xff3355, 0.85));
    body.scale.set(1, 0.94, 1);
    g.add(body);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.14, 6), neon(0x8b5a2b, 0.4));
    stem.position.y = 0.22;
    g.add(stem);
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), neon(0x5dff8a, 0.6));
    leaf.scale.set(1.6, 0.3, 0.8);
    leaf.position.set(0.08, 0.25, 0);
    g.add(leaf);
    return g;
  },
  melon() {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.21, 24, 18), neon(0x6dff5c, 0.7)));
    const stripeMat = neon(0x0f6b2a, 0.4);
    for (let i = 0; i < 5; i++) {
      const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.212, 0.012, 6, 24, Math.PI), stripeMat);
      stripe.rotation.y = (i / 5) * Math.PI;
      stripe.rotation.x = Math.PI / 2;
      g.add(stripe);
    }
    return g;
  },
  galaxian() {
    const g = new THREE.Group();
    const hull = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.34, 4), neon(0x4dd8ff, 0.9));
    hull.rotation.y = Math.PI / 4;
    g.add(hull);
    const wingMat = neon(0xffe14d, 0.9);
    for (const s of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.03, 0.1), wingMat);
      wing.position.set(s * 0.16, -0.08, 0);
      wing.rotation.z = s * 0.5;
      g.add(wing);
    }
    return g;
  },
  bell() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 22, 14, 0, Math.PI * 2, 0, Math.PI / 2),
      neon(0xffd24d, 0.85)
    );
    g.add(body);
    const skirt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.22, 0.12, 22, 1, true),
      neon(0xffd24d, 0.85)
    );
    skirt.position.y = -0.06;
    g.add(skirt);
    const clapper = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), neon(0xff5cc8, 0.9));
    clapper.position.y = -0.16;
    g.add(clapper);
    return g;
  },
  key() {
    const g = new THREE.Group();
    const mat = neon(0x8ce9ff, 0.9);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.032, 10, 22), mat);
    ring.position.y = 0.14;
    g.add(ring);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 10), mat);
    shaft.position.y = -0.08;
    g.add(shaft);
    for (const dy of [-0.14, -0.2]) {
      const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.035, 0.035), mat);
      tooth.position.set(0.06, dy, 0);
      g.add(tooth);
    }
    return g;
  },
};

export function createFruitFactory() {
  const cache = new Map();
  return function getFruit(id) {
    if (!cache.has(id)) {
      const builder = FRUIT_BUILDERS[id] ?? FRUIT_BUILDERS.cherry;
      const model = builder();
      // The fruit is only on the board for nine seconds, on a tile with no dots
      // to draw the eye, so it is scaled up and given its own halo.
      model.scale.setScalar(1.7);
      const halo = glowSprite(0xffffff, 3.0, 0.5);
      model.add(halo);
      cache.set(id, model);
    }
    return cache.get(id);
  };
}

/**
 * Standing furniture that appears with any fruit: a pulsing pedestal ring on the
 * floor and a soft column of light above it, so a fruit spawn is visible from
 * anywhere on the board.
 */
export function createFruitAura() {
  const group = new THREE.Group();

  const ringGeo = new THREE.RingGeometry(0.42, 0.62, 44);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xffe27a,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  group.add(ring);

  const beamGeo = new THREE.CylinderGeometry(0.34, 0.62, 3.4, 20, 1, true);
  beamGeo.translate(0, 1.7, 0);
  const beamMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    toneMapped: false,
    uniforms: { colour: { value: new THREE.Color(0xffd76a) }, time: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      varying vec2 vUv;
      uniform vec3 colour;
      uniform float time;
      void main() {
        float fade = pow(1.0 - vUv.y, 2.0);
        float edge = sin(vUv.x * 3.14159);
        float a = fade * edge * (0.16 + 0.05 * sin(time * 3.0));
        gl_FragColor = vec4(colour * a * 2.0, a);
      }
    `,
  });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  group.add(beam);

  return {
    group,
    update(time) {
      const beat = 0.5 + 0.5 * Math.sin(time * 3.4);
      ring.scale.setScalar(0.9 + beat * 0.25);
      ring.rotation.y = time * 0.9;
      ringMat.opacity = 0.35 + beat * 0.4;
      beamMat.uniforms.time.value = time;
    },
  };
}

/* ----------------------------------------------------------------- score popups */

const popupCache = new Map();

function popupTexture(text) {
  if (popupCache.has(text)) return popupCache.get(text);
  const w = 512;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.font = 'bold 150px "Trebuchet MS", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // A dark stroke under a saturated cyan fill: a white core with a wide glow
  // was simply eaten by bloom and read as a featureless smear.
  ctx.lineJoin = 'round';
  ctx.lineWidth = 16;
  ctx.strokeStyle = 'rgba(6, 0, 24, 0.92)';
  ctx.strokeText(text, w / 2, h / 2);
  ctx.shadowColor = '#00e9ff';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#7ef0ff';
  ctx.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  popupCache.set(text, tex);
  return tex;
}

export function createPopupPool(size = 8) {
  const group = new THREE.Group();
  const sprites = [];
  for (let i = 0; i < size; i++) {
    const mat = new THREE.SpriteMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.visible = false;
    sprite.scale.set(2.6, 1.3, 1);
    group.add(sprite);
    sprites.push(sprite);
  }

  return {
    group,
    sync(popups) {
      for (let i = 0; i < sprites.length; i++) {
        const s = sprites[i];
        const p = popups[i];
        if (!p) {
          s.visible = false;
          continue;
        }
        const t = p.age / p.life;
        s.visible = true;
        const tex = popupTexture(String(p.points));
        if (s.material.map !== tex) {
          s.material.map = tex;
          s.material.needsUpdate = true;
        }
        s.position.set(worldX(p.x), 0.7 + t * 1.5, worldZ(p.y));
        s.material.opacity = 1 - t * t;
        s.scale.set(2.6 + t * 0.8, 1.3 + t * 0.4, 1);
      }
    },
  };
}

export { GHOST_ORDER };
