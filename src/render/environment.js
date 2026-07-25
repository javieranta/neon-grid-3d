/**
 * NEON GRID — the world the maze sits inside.
 *
 * A shader-driven synthwave sunset: banded sun, star field, an infinite
 * perspective grid running to the horizon, layered mountain silhouettes with
 * neon rims, drifting motes and slow volumetric light shafts. Everything is
 * procedural, so the whole game ships without a single texture file.
 */

import * as THREE from 'three';
import { PALETTE } from './palette.js';

const SUN_DIR = new THREE.Vector3(0.02, 0.10, -1).normalize();

/* ------------------------------------------------------------------ sky dome */

const skyVert = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const skyFrag = /* glsl */ `
  precision highp float;
  varying vec3 vDir;
  uniform vec3 cHorizon, cLow, cMid, cHigh, cZenith, cSun, cSunCore;
  uniform vec3 sunDir;
  uniform float time;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec3 dir = normalize(vDir);
    float h = dir.y;

    // Vertical gradient, weighted so the hot band hugs the horizon.
    vec3 col = mix(cHorizon, cLow, smoothstep(-0.01, 0.055, h));
    col = mix(col, cMid, smoothstep(0.06, 0.28, h));
    col = mix(col, cHigh, smoothstep(0.22, 0.55, h));
    col = mix(col, cZenith, smoothstep(0.5, 0.95, h));

    // Everything under the horizon collapses to the void: the ground plane
    // and its neon grid own that half of the frame, not the sky.
    float above = smoothstep(-0.035, 0.015, h);

    // The sun: a big soft disc sliced by widening horizontal bands.
    float d = distance(dir, sunDir);
    float disc = 1.0 - smoothstep(0.098, 0.109, d);
    float sunH = (dir.y - sunDir.y) * 42.0;      // local vertical inside the disc
    // Bands: thin near the top of the disc, thickening toward the bottom.
    float band = smoothstep(0.40, 0.60, fract(sunH * 0.58));
    float bandMask = mix(1.0, band, clamp(-sunH * 0.19 + 0.04, 0.0, 1.0));
    float core = 1.0 - smoothstep(0.0, 0.075, d);
    vec3 sunCol = mix(cSun, cSunCore, core * 0.55);
    // Kept just under clipping so the bands stay legible instead of fusing
    // into one white blob once bloom and tone mapping have had their say.
    col = mix(col, sunCol * 1.05, disc * bandMask * 0.94 * above);

    // Tight atmospheric bloom around the sun, clipped to the sky.
    col += cSun * pow(1.0 - smoothstep(0.06, 0.40, d), 2.0) * 0.20 * above;

    // Horizon haze line.
    col += cLow * exp(-abs(h) * 34.0) * 0.3;

    col = mix(vec3(0.014, 0.004, 0.035), col, above);

    // Stars, only well above the haze, gently twinkling.
    if (h > 0.10) {
      vec2 cell = floor(dir.xz * 190.0 + dir.y * 40.0);
      float s = hash(cell);
      if (s > 0.9975) {
        float tw = 0.55 + 0.45 * sin(time * 2.4 + s * 90.0);
        col += vec3(0.85, 0.92, 1.0) * tw * smoothstep(0.10, 0.42, h) * 1.4;
      }
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

function buildSky() {
  const geo = new THREE.SphereGeometry(420, 48, 32);
  const mat = new THREE.ShaderMaterial({
    vertexShader: skyVert,
    fragmentShader: skyFrag,
    side: THREE.BackSide,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      cHorizon: { value: new THREE.Color(PALETTE.skyHorizon) },
      cLow: { value: new THREE.Color(PALETTE.skyLow) },
      cMid: { value: new THREE.Color(PALETTE.skyMid) },
      cHigh: { value: new THREE.Color(PALETTE.skyHigh) },
      cZenith: { value: new THREE.Color(PALETTE.skyZenith) },
      cSun: { value: new THREE.Color(PALETTE.sun) },
      cSunCore: { value: new THREE.Color(PALETTE.sunCore) },
      sunDir: { value: SUN_DIR.clone() },
      time: { value: 0 },
    },
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -100;
  return mesh;
}

/* ------------------------------------------------------- infinite floor grid */

const gridVert = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const gridFrag = /* glsl */ `
  precision highp float;
  varying vec3 vWorld;
  uniform vec3 lineNear, lineFar, base;
  uniform float time, innerFade, outerFade;

  float gridMask(vec2 p, float spacing, float thickness) {
    vec2 g = abs(fract(p / spacing - 0.5) - 0.5) / fwidth(p / spacing);
    float l = min(g.x, g.y);
    return 1.0 - min(l / thickness, 1.0);
  }

  void main() {
    vec2 p = vWorld.xz;
    float dist = length(p);

    // Distance LOD: the 2-unit grid would alias into moire at grazing angles,
    // so it fades out and hands over to the 10-unit grid further away.
    float fineFade = 1.0 - smoothstep(26.0, 78.0, dist);
    float fine = gridMask(p, 2.0, 1.05) * fineFade;
    float coarse = gridMask(p, 10.0, 1.5);
    float huge = gridMask(p, 50.0, 1.8);
    float lines = max(max(fine * 0.42, coarse * 0.9), huge * 0.7);

    // Hide the grid under the maze plinth, fade it out toward the horizon.
    float mask = smoothstep(innerFade, innerFade + 7.0, dist) *
                 (1.0 - smoothstep(outerFade * 0.45, outerFade, dist));

    vec3 col = mix(lineNear, lineFar, smoothstep(18.0, 150.0, dist));
    float pulse = 0.78 + 0.22 * sin(time * 1.1 - dist * 0.06);

    // A magenta haze pools toward the horizon so the ground melts into the sky.
    float haze = smoothstep(60.0, 320.0, dist) * (1.0 - smoothstep(300.0, outerFade, dist));

    vec3 outCol = base + col * lines * mask * pulse * 1.5 + lineNear * haze * 0.16;
    float alpha = clamp(lines * mask * 1.15 + haze * 0.34, 0.0, 1.0);
    gl_FragColor = vec4(outCol, alpha);
  }
`;

function buildHorizonGrid() {
  // Large enough that the fade always finishes before the plane's own edge.
  const geo = new THREE.PlaneGeometry(2400, 2400, 1, 1);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.ShaderMaterial({
    vertexShader: gridVert,
    fragmentShader: gridFrag,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      lineNear: { value: new THREE.Color(PALETTE.gridGlow) },
      lineFar: { value: new THREE.Color(0x00e9ff) },
      base: { value: new THREE.Color(0x020006) },
      time: { value: 0 },
      innerFade: { value: 20.5 },
      outerFade: { value: 620 },
    },
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = -0.06;
  mesh.renderOrder = -50;
  return mesh;
}

/* ----------------------------------------------------------------- mountains */

/**
 * Smooth fractal ridge line. The octave cell count is deliberately low — a
 * handful of broad peaks per range — because high-frequency noise reads as an
 * audio waveform rather than as mountains.
 */
function ridgeProfile(seed, count, height, roughness, basePeaks = 4) {
  const rand = (i) => {
    const s = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
  const pts = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    let h = 0;
    let amp = 1;
    let cells = basePeaks;
    let norm = 0;
    for (let o = 0; o < 4; o++) {
      const pos = t * cells;
      const idx = Math.floor(pos);
      const f = pos - idx;
      const a = rand(idx + o * 131);
      const b = rand(idx + 1 + o * 131);
      // Cosine interpolation keeps the slopes rounded, not faceted.
      const sm = 0.5 - 0.5 * Math.cos(f * Math.PI);
      h += (a + (b - a) * sm) * amp;
      norm += amp;
      amp *= roughness;
      cells = Math.round(cells * 2.3);
    }
    // Slight exponent broadens the bases and sharpens the summits; the sine
    // window tapers both ends to zero so the mesh never ends on a cliff face.
    const window = Math.pow(Math.sin(Math.PI * t), 0.45);
    pts.push(Math.pow(h / norm, 1.15) * window);
  }
  const max = Math.max(...pts) || 1;
  return pts.map((h) => (h / max) * height);
}

function buildMountainRange(seed, width, height, z, colour, rimColour, rimIntensity, peaks = 4) {
  const segments = 260;
  const profile = ridgeProfile(seed, segments, height, 0.42, peaks);
  const positions = [];
  for (let i = 0; i < segments; i++) {
    const x0 = -width / 2 + (i / segments) * width;
    const x1 = -width / 2 + ((i + 1) / segments) * width;
    const y0 = profile[i];
    const y1 = profile[i + 1];
    // Two triangles per column, dropping well below the horizon.
    positions.push(x0, y0, 0, x0, -height * 1.6, 0, x1, y1, 0);
    positions.push(x1, y1, 0, x0, -height * 1.6, 0, x1, -height * 1.6, 0);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ color: colour, toneMapped: false, fog: false })
  );

  // Glowing rim along the crest.
  const rimPts = [];
  for (let i = 0; i <= segments; i++) {
    rimPts.push(new THREE.Vector3(-width / 2 + (i / segments) * width, profile[i], 0.35));
  }
  const rim = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(rimPts),
    new THREE.LineBasicMaterial({
      color: rimColour,
      transparent: true,
      opacity: rimIntensity,
      toneMapped: false,
      fog: false,
    })
  );

  const group = new THREE.Group();
  group.add(mesh, rim);
  group.position.z = z;
  group.renderOrder = -40;
  return group;
}

/* --------------------------------------------------------------------- motes */

function buildMotes(count = 900) {
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const phases = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 70;
    positions[i * 3 + 1] = Math.random() * 26 - 1;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 78;
    speeds[i] = 0.25 + Math.random() * 0.85;
    phases[i] = Math.random() * Math.PI * 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('aSpeed', new THREE.Float32BufferAttribute(speeds, 1));
  geo.setAttribute('aPhase', new THREE.Float32BufferAttribute(phases, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    uniforms: { time: { value: 0 }, size: { value: 2.2 } },
    vertexShader: /* glsl */ `
      attribute float aSpeed;
      attribute float aPhase;
      uniform float time;
      uniform float size;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        p.y = mod(p.y + time * aSpeed * 0.55, 27.0) - 1.0;
        p.x += sin(time * 0.35 * aSpeed + aPhase) * 1.4;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = size * (30.0 / -mv.z) * (0.6 + 0.4 * sin(time * 2.0 + aPhase));
        gl_Position = projectionMatrix * mv;
        vAlpha = smoothstep(26.0, 8.0, p.y) * 0.5 + 0.12;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vAlpha;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float a = (1.0 - d * 2.0);
        gl_FragColor = vec4(mix(vec3(1.0, 0.55, 0.95), vec3(0.45, 0.95, 1.0), vAlpha) * a, a * vAlpha);
      }
    `,
  });

  return new THREE.Points(geo, mat);
}

/* -------------------------------------------------------------- light shafts */

function buildLightShafts(colours) {
  const group = new THREE.Group();
  colours.forEach((colour, i) => {
    const geo = new THREE.ConeGeometry(3.6, 40, 24, 1, true);
    geo.translate(0, 20, 0);
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      toneMapped: false,
      uniforms: {
        colour: { value: new THREE.Color(colour) },
        time: { value: 0 },
        seed: { value: i * 3.7 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying float vY;
        void main() {
          vUv = uv;
          vY = position.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        varying float vY;
        uniform vec3 colour;
        uniform float time, seed;
        void main() {
          float fade = smoothstep(40.0, 2.0, vY) * smoothstep(0.0, 6.0, vY);
          float edge = sin(vUv.x * 3.1415);
          float flicker = 0.72 + 0.28 * sin(time * 1.7 + seed + vY * 0.12);
          float a = fade * edge * flicker * 0.017;
          gl_FragColor = vec4(colour * a * 1.5, a);
        }
      `,
    });
    const mesh = new THREE.Mesh(geo, mat);
    // Kept clear of the maze footprint: a cone seen end-on from the overview
    // camera would pile up additive alpha into a blown-out blob.
    const lane = [-25, 25, -31][i % 3];
    mesh.position.set(lane, 0, -20 + (i % 2) * 34);
    mesh.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.14;
    group.add(mesh);
  });
  return group;
}

/* ----------------------------------------------------------------------- API */

export function createEnvironment(scene, renderer, quality, camera) {
  const sky = buildSky();
  scene.add(sky);

  const grid = buildHorizonGrid();
  scene.add(grid);

  // Two ridges, close enough to appear above the ground line on the low
  // cinematic sweeps where the sunset comes into frame.
  const ranges = [
    buildMountainRange(1.7, 700, 18, -150, PALETTE.mountains, PALETTE.mountainRim, 0.6, 9),
    buildMountainRange(4.3, 520, 10, -104, 0x0d0224, 0x00e9ff, 0.38, 6),
  ];
  ranges.forEach((r) => scene.add(r));

  const motes = quality.motes ? buildMotes(quality.motes) : null;
  if (motes) scene.add(motes);

  const shafts = quality.shafts
    ? buildLightShafts([PALETTE.neonNear, 0x00e9ff, PALETTE.neonNear])
    : null;
  if (shafts) scene.add(shafts);

  // Environment map for the metallic maze, baked once from the sky shader.
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envScene = new THREE.Scene();
  const envSky = buildSky();
  envScene.add(envSky);
  const envTarget = pmrem.fromScene(envScene, 0, 1, 500);
  scene.environment = envTarget.texture;
  envSky.geometry.dispose();
  envSky.material.dispose();
  pmrem.dispose();

  // Lighting rig: warm sun for rim light, cool hemisphere for fill.
  const sun = new THREE.DirectionalLight(0xff9ad8, 1.05);
  sun.position.copy(SUN_DIR).multiplyScalar(60);
  sun.position.y = Math.abs(sun.position.y) + 34;
  sun.castShadow = quality.shadows;
  if (quality.shadows) {
    sun.shadow.mapSize.set(quality.shadowMap, quality.shadowMap);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 140;
    const s = 22;
    sun.shadow.camera.left = -s;
    sun.shadow.camera.right = s;
    sun.shadow.camera.top = s;
    sun.shadow.camera.bottom = -s;
    sun.shadow.bias = -0.0009;
    sun.shadow.normalBias = 0.03;
    sun.shadow.radius = 3;
  }
  scene.add(sun);
  scene.add(sun.target);

  const hemi = new THREE.HemisphereLight(0x8a3cff, 0x120026, 0.34);
  scene.add(hemi);

  // A cool key light from above keeps the neon readable against the floor.
  const key = new THREE.DirectionalLight(0x7fe9ff, 0.34);
  key.position.set(-12, 30, 14);
  scene.add(key);

  const fill = new THREE.PointLight(0xff3ad0, 0.45, 90, 1.6);
  fill.position.set(0, 16, 24);
  scene.add(fill);

  return {
    sun,
    update(time) {
      // Keeping the dome centred on the camera makes vDir an exact view ray,
      // so the sun disc never skews as the camera moves.
      if (camera) sky.position.copy(camera.position);
      sky.material.uniforms.time.value = time;
      grid.material.uniforms.time.value = time;
      if (motes) motes.material.uniforms.time.value = time;
      if (shafts) {
        shafts.rotation.y = Math.sin(time * 0.06) * 0.22;
        shafts.children.forEach((c, i) => {
          c.material.uniforms.time.value = time;
          c.rotation.z = Math.sin(time * 0.21 + i) * 0.2;
        });
      }
      ranges[0].position.x = Math.sin(time * 0.012) * 5;
      ranges[1].position.x = Math.cos(time * 0.017) * 4;
    },
    dispose() {
      envTarget.dispose();
    },
  };
}

export { SUN_DIR };
