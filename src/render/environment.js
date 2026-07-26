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
import { mergeGeometries } from './mazeMesh.js';

const SUN_DIR = new THREE.Vector3(0.01, 0.125, -1).normalize();

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
  // Zeroed while the neon environment cubemap is baked: the sun is by far the
  // brightest thing in the sky and it reflects off the glossy wall tops as a
  // blown-out hot spot. Masking it keeps reflections purely neon.
  uniform float sunMul;

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

    // The sun: a hard-edged disc sliced by horizontal bands.
    float d = distance(dir, sunDir);
    const float SUN_R = 0.155;
    float disc = 1.0 - smoothstep(SUN_R - 0.004, SUN_R + 0.004, d);

    // Atmospheric glow goes down FIRST. Added after the disc it filled the band
    // gaps back in and the slices vanished.
    col += cSun * pow(1.0 - smoothstep(0.09, 0.46, d), 2.0) * 0.15 * above * sunMul;

    // Stripes parametrised in disc-heights, so the count is exact: nine periods
    // from the bottom of the disc to the top.
    float h01 = (dir.y - sunDir.y) / SUN_R;       // -1 at the base, +1 at the top
    float v = h01 * 5.0;
    float aa = max(fwidth(v) * 1.2, 0.02);
    float stripe = smoothstep(0.42 - aa, 0.42 + aa, fract(v));
    // Bands are absent at the crown and total at the base, as in the art.
    float bandMask = mix(1.0, stripe, clamp(-h01 * 0.72 + 0.5, 0.0, 1.0));

    float core = 1.0 - smoothstep(0.0, 0.09, d);
    vec3 sunCol = mix(cSun, cSunCore, core * 0.5);
    // Just under clipping: any brighter and bloom fuses the slices into one blob.
    col = mix(col, sunCol * 0.92, disc * bandMask * above * sunMul);

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
      sunMul: { value: 1 },
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

/* --------------------------------------------------------------------- palms */

/**
 * One palm frond as a flat leaf ribbon: a quadratic spine arcing outward and then
 * drooping, with the width tapering toward both ends. A ribbon silhouettes as a
 * leaf; the tapered cylinders this replaced silhouetted as spikes.
 */
function buildFrondLeaf(len, droop) {
  const steps = 9;
  const positions = [];
  const indices = [];
  // Spine: out along +X, rising, then falling below the crown.
  const p0 = new THREE.Vector2(0, 0);
  const p1 = new THREE.Vector2(len * 0.45, len * 0.34);
  const p2 = new THREE.Vector2(len, -len * droop);

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const omt = 1 - t;
    const x = omt * omt * p0.x + 2 * omt * t * p1.x + t * t * p2.x;
    const y = omt * omt * p0.y + 2 * omt * t * p1.y + t * t * p2.y;
    // Tangent, for a perpendicular offset in the leaf plane.
    const tx = 2 * omt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
    const ty = 2 * omt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
    const tl = Math.hypot(tx, ty) || 1;
    const nx = -ty / tl;
    const ny = tx / tl;
    const w = len * 0.085 * Math.pow(Math.sin(Math.PI * Math.min(0.999, t + 0.02)), 0.55);
    positions.push(x + nx * w, y + ny * w, 0);
    positions.push(x - nx * w, y - ny * w, 0);
  }
  for (let i = 0; i < steps; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const uvs = [];
  for (let i = 0; i <= steps; i++) {
    uvs.push(i / steps, 0, i / steps, 1);
  }
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  return geo;
}

/**
 * Low-poly palm silhouette: a leaning trunk of stacked segments plus drooping
 * leaf fronds. Rendered as a flat near-black shape with an additive magenta rim, so
 * it reads as a backlit cut-out the way the reference art does.
 */
function buildPalm(seed, height) {
  const rand = (i) => {
    const v = Math.sin(i * 91.7 + seed * 47.3) * 43758.5453;
    return v - Math.floor(v);
  };
  // Parts are collected rather than added: a palm assembled from ~38 separate
  // meshes cost 38 draw calls, and the grove alone was 450. Each palm is baked
  // into one body mesh and one rim mesh at the end.
  const bodyParts = [];
  const rimParts = [];
  const stamp = (geo, pos, rot, scale, into) => {
    const g = geo.clone();
    const m = new THREE.Matrix4().compose(
      pos,
      new THREE.Quaternion().setFromEuler(rot),
      scale
    );
    g.applyMatrix4(m);
    into.push(g);
  };
  const group = new THREE.Group();
  const dark = new THREE.MeshBasicMaterial({
    color: 0x08010f,
    toneMapped: false,
    fog: false,
    side: THREE.DoubleSide,
  });
  const rim = new THREE.MeshBasicMaterial({
    color: 0xff3ad0,
    toneMapped: false,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    fog: false,
  });

  const segments = 5;
  const lean = (rand(1) - 0.5) * 0.5;
  let y = 0;
  const ONE = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const segH = height / segments;
    const r0 = 0.3 * (1 - t * 0.5);
    const r1 = 0.3 * (1 - (t + 1 / segments) * 0.5);
    const geo = new THREE.CylinderGeometry(r1, r0, segH, 7);
    const pos = new THREE.Vector3(lean * t * t * height * 0.5, y + segH / 2, 0);
    const rot = new THREE.Euler(0, 0, -lean * t * 0.55);
    stamp(geo, pos, rot, ONE, bodyParts);
    stamp(geo, pos, rot, new THREE.Vector3(1.18, 1.0, 1.18), rimParts);
    geo.dispose();
    y += segH;
  }

  const crown = new THREE.Vector3(lean * height * 0.5, height, 0);
  const fronds = 11;
  for (let i = 0; i < fronds; i++) {
    const a = (i / fronds) * Math.PI * 2 + rand(i + 7) * 0.5;
    const len = height * (0.32 + rand(i + 20) * 0.12);
    const geo = buildFrondLeaf(len, 0.3 + rand(i + 33) * 0.22);
    const rot = new THREE.Euler(0, a, (rand(i + 61) - 0.5) * 0.3, 'YZX');
    stamp(geo, crown.clone(), rot, new THREE.Vector3(1, 1, 1), bodyParts);
    stamp(geo, crown.clone(), rot, new THREE.Vector3(1.05, 1.05, 1.05), rimParts);
    geo.dispose();
  }

  const body = mergeGeometries(bodyParts);
  const rims = mergeGeometries(rimParts);
  bodyParts.forEach((g) => g.dispose());
  rimParts.forEach((g) => g.dispose());
  group.add(new THREE.Mesh(body, dark), new THREE.Mesh(rims, rim));
  return group;
}

function buildPalmGrove() {
  const grove = new THREE.Group();
  // Ringed around the plinth, denser toward the sunset so they silhouette.
  // Pushed out beyond the plinth so the crowns frame the board rather than
  // crowding into the top of the shot.
  const spots = [
    [-38, -20, 9], [-45, 6, 8], [-34, 30, 7], [38, -22, 8.5],
    [46, 4, 9.5], [33, 29, 7.5], [-20, -42, 8], [19, -44, 9],
    [-56, -12, 10.5], [54, -14, 9.5], [-62, 20, 8], [60, 22, 8.5],
  ];
  spots.forEach(([x, z, h], i) => {
    const palm = buildPalm(i * 3.1 + 1, h);
    palm.position.set(x, 0, z);
    palm.rotation.y = i * 1.7;
    grove.add(palm);
  });
  return grove;
}

/* ----------------------------------------------------------- wireframe ridges */

/**
 * Faceted mountain range drawn as a dark fill plus glowing wireframe edges - the
 * signature synthwave backdrop. Deliberately low segment counts so the facets
 * are large and legible from a distance.
 */
function buildWireRidge(seed, width, height, z, colour, peaks) {
  const segments = 26;
  const profile = ridgeProfile(seed, segments, height, 0.42, peaks);
  const positions = [];
  const lines = [];
  for (let i = 0; i < segments; i++) {
    const x0 = -width / 2 + (i / segments) * width;
    const x1 = -width / 2 + ((i + 1) / segments) * width;
    const y0 = profile[i];
    const y1 = profile[i + 1];
    positions.push(x0, y0, 0, x0, 0, 0, x1, y1, 0);
    positions.push(x1, y1, 0, x0, 0, 0, x1, 0, 0);
    // Crest, plus a vertical rib every other facet.
    lines.push(x0, y0, 0.2, x1, y1, 0.2);
    if (i % 2 === 0) lines.push(x0, y0, 0.2, x0, 0, 0.2);
  }
  const fill = new THREE.Mesh(
    new THREE.BufferGeometry().setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    ),
    new THREE.MeshBasicMaterial({ color: 0x05000d, toneMapped: false, fog: false })
  );
  const wire = new THREE.LineSegments(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(lines, 3)),
    new THREE.LineBasicMaterial({
      color: colour,
      transparent: true,
      opacity: 0.85,
      toneMapped: false,
      fog: false,
    })
  );
  const group = new THREE.Group();
  group.add(fill, wire);
  group.position.z = z;
  return group;
}

function buildPyramids() {
  const group = new THREE.Group();
  const spots = [
    [-52, -120, 16, 0x28d9ff],
    [46, -108, 13, 0xff2bd6],
    [8, -132, 20, 0x28d9ff],
    [-96, -128, 18, 0xff2bd6],
  ];
  for (const [x, z, h, colour] of spots) {
    const geo = new THREE.ConeGeometry(h * 0.85, h, 4);
    geo.translate(0, h / 2, 0);
    const fill = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: 0x04000a, toneMapped: false, fog: false })
    );
    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({
        color: colour,
        transparent: true,
        opacity: 0.75,
        toneMapped: false,
        fog: false,
      })
    );
    const holder = new THREE.Group();
    holder.add(fill, wire);
    holder.position.set(x, 0, z);
    holder.rotation.y = Math.PI / 4;
    group.add(holder);
  }
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
  const grove = buildPalmGrove();
  scene.add(grove);

  const wireRidges = [
    buildWireRidge(2.9, 320, 17, -92, 0x28d9ff, 7),
    buildWireRidge(6.1, 440, 24, -128, 0xff2bd6, 9),
  ];
  wireRidges.forEach((r) => scene.add(r));

  const pyramids = buildPyramids();
  scene.add(pyramids);

  const ranges = [
    buildMountainRange(1.7, 700, 18, -150, PALETTE.mountains, PALETTE.mountainRim, 0.6, 9),
    buildMountainRange(4.3, 520, 10, -104, 0x0d0224, 0x00e9ff, 0.38, 6),
  ];
  ranges.forEach((r) => scene.add(r));

  const motes = quality.motes ? buildMotes(quality.motes) : null;
  if (motes) scene.add(motes);

  // Volumetric shafts are deliberately not built: seen close to end-on from a
  // top-down camera they pile additive alpha into a flat wash over the board.
  const shafts = null;

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
  // A dim sun only: at full strength its specular lobe collapsed into a hot
  // spot on the glossy wall tops. The maze is lit by its own neon.
  // Kept only for the shadow map. Its specular lobe on the glossy wall tops was
  // the hot spot that kept appearing mid-board; the neon environment map now does
  // all the reflecting, so this contributes almost nothing but that artefact.
  const sun = new THREE.DirectionalLight(0xff9ad8, 0.08);
  // Deliberately NOT aligned with the visible sun. That sits near the horizon, so
  // shadows cast from it are long faint smears that ground nothing; from overhead
  // the characters get short contact shadows instead. The light contributes almost
  // no illumination, so the mismatch never reads.
  sun.position.set(7, 46, 14);
  sun.castShadow = quality.shadows;
  if (quality.shadows) {
    sun.shadow.mapSize.set(quality.shadowMap, quality.shadowMap);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 140;
    const s = 20;
    sun.shadow.camera.left = -s;
    sun.shadow.camera.right = s;
    sun.shadow.camera.top = s;
    sun.shadow.camera.bottom = -s;
    sun.shadow.bias = -0.0009;
    sun.shadow.normalBias = 0.03;
    sun.shadow.radius = 2;
  }
  scene.add(sun);
  scene.add(sun.target);

  const hemi = new THREE.HemisphereLight(0x8a3cff, 0x120026, 0.55);
  scene.add(hemi);

  // No second directional light: with the neon cubemap in place it only added
  // another sharp specular lobe to catch on the wall tops.

  const fill = new THREE.PointLight(0xff3ad0, 0.45, 90, 1.6);
  fill.position.set(0, 16, 24);
  scene.add(fill);

  return {
    sun,
    /** Tier downgrades need to actually remove cost, not just dim it. */
    setMotes(on) {
      if (motes) motes.visible = on;
    },
    setShafts(on) {
      if (shafts) shafts.visible = on;
    },
    /** Masks the sun disc and its glow, for the environment bake. */
    setSunVisible(on) {
      sky.material.uniforms.sunMul.value = on ? 1 : 0;
    },
    update(time) {
      // Keeping the dome centred on the camera makes vDir an exact view ray,
      // so the sun disc never skews as the camera moves.
      // World position: the camera is nested inside the player rig now, and in an
      // XR session the headset offsets it further still.
      if (camera) camera.getWorldPosition(sky.position);
      sky.material.uniforms.time.value = time;
      grid.material.uniforms.time.value = time;
      if (motes && motes.visible) motes.material.uniforms.time.value = time;
      if (shafts && shafts.visible) {
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
