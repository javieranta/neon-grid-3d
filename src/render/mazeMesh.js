/**
 * NEON GRID — maze geometry.
 *
 * The arcade maze is drawn as outlined blocks, so rather than stamping a cube
 * per wall tile we extract the true silhouette of every connected wall region
 * with marching-edge boundary tracing, round its corners, and build:
 *
 *   1. a bevelled, near-black metallic slab (the wall body),
 *   2. a glowing neon tube traced along the top of that silhouette,
 *   3. a second, dimmer tube at floor level for light spill,
 *   4. a blurred canvas "glow map" baked from the same silhouettes, used as the
 *      floor's emissive so the neon appears to bleed onto the ground.
 *
 * All of it is merged into a handful of draw calls, and the whole assembly is
 * duplicated upside-down under the floor to act as a planar reflection.
 */

import * as THREE from 'three';
import { MAZE_H, MAZE_W, TILE } from '../core/maze.js';
import { PALETTE, TUBE_RADIUS, WALL_HEIGHT } from './palette.js';

const CORNER_RADIUS = 0.26;

/* ------------------------------------------------------- boundary extraction */
/*
 * The tracing helpers below are exported at the bottom of this file purely so
 * the test suite can verify that the rendered wall silhouettes agree with the
 * logical grid - i.e. that no collectible ends up inside a wall.
 */

/** Corner-grid coords -> shape space (shape.y maps to -worldZ). */
const sx = (cx) => cx - 14;
const sy = (cy) => 15.5 - cy;

function isWall(tiles, x, y) {
  if (y < 0 || y >= MAZE_H || x < 0 || x >= MAZE_W) return false;
  const t = tiles[y][x];
  return t === TILE.WALL;
}

/** Flood-fills the wall mask into connected components (4-connectivity). */
function wallComponents(tiles) {
  const seen = new Uint8Array(MAZE_W * MAZE_H);
  const comps = [];
  for (let y = 0; y < MAZE_H; y++) {
    for (let x = 0; x < MAZE_W; x++) {
      if (!isWall(tiles, x, y) || seen[y * MAZE_W + x]) continue;
      const cells = [];
      const stack = [[x, y]];
      seen[y * MAZE_W + x] = 1;
      while (stack.length) {
        const [cx, cy] = stack.pop();
        cells.push([cx, cy]);
        const nb = [
          [cx + 1, cy],
          [cx - 1, cy],
          [cx, cy + 1],
          [cx, cy - 1],
        ];
        for (const [nx, ny] of nb) {
          if (nx < 0 || nx >= MAZE_W || ny < 0 || ny >= MAZE_H) continue;
          if (!isWall(tiles, nx, ny) || seen[ny * MAZE_W + nx]) continue;
          seen[ny * MAZE_W + nx] = 1;
          stack.push([nx, ny]);
        }
      }
      comps.push(cells);
    }
  }
  return comps;
}

/**
 * Traces the outline(s) of one wall component. Every tile edge that touches a
 * non-wall tile becomes a directed segment; segments are then chained head to
 * tail into closed rectilinear loops.
 */
function traceLoops(tiles, cells) {
  const set = new Set(cells.map(([x, y]) => `${x},${y}`));
  const inComp = (x, y) => set.has(`${x},${y}`);
  const edges = new Map(); // "cx,cy" -> [ [cx,cy], ... ]

  const push = (ax, ay, bx, by) => {
    const k = `${ax},${ay}`;
    if (!edges.has(k)) edges.set(k, []);
    edges.get(k).push([bx, by]);
  };

  for (const [x, y] of cells) {
    // Corner-grid: tile (x, y) spans corners (x, y) .. (x+1, y+1).
    if (!inComp(x, y - 1)) push(x + 1, y, x, y); // top edge, travelling -x
    if (!inComp(x, y + 1)) push(x, y + 1, x + 1, y + 1); // bottom edge, +x
    if (!inComp(x - 1, y)) push(x, y, x, y + 1); // left edge, +y
    if (!inComp(x + 1, y)) push(x + 1, y + 1, x + 1, y); // right edge, -y
  }

  const loops = [];
  let guard = 0;
  while (edges.size && guard++ < 5000) {
    const startKey = edges.keys().next().value;
    let [cxs, cys] = startKey.split(',').map(Number);
    const loop = [[cxs, cys]];
    let cur = [cxs, cys];
    let steps = 0;
    while (steps++ < 5000) {
      const k = `${cur[0]},${cur[1]}`;
      const outs = edges.get(k);
      if (!outs || outs.length === 0) break;
      const next = outs.shift();
      if (outs.length === 0) edges.delete(k);
      cur = next;
      if (cur[0] === cxs && cur[1] === cys) break;
      loop.push(cur);
    }
    if (loop.length >= 4) loops.push(loop);
  }

  // Drop redundant collinear vertices.
  return loops.map(simplify);
}

function simplify(loop) {
  const out = [];
  const n = loop.length;
  for (let i = 0; i < n; i++) {
    const prev = loop[(i - 1 + n) % n];
    const cur = loop[i];
    const next = loop[(i + 1) % n];
    const d1x = cur[0] - prev[0];
    const d1y = cur[1] - prev[1];
    const d2x = next[0] - cur[0];
    const d2y = next[1] - cur[1];
    if (d1x * d2y - d1y * d2x !== 0) out.push(cur);
  }
  return out.length >= 4 ? out : loop;
}

function signedArea(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

/* ------------------------------------------------- rounded path construction */

/**
 * Converts a rectilinear corner loop into a rounded polyline in shape space.
 * Each corner becomes a quadratic arc so the neon reads as bent glass tubing.
 */
function roundedPolyline(loop, radius, arcSegments = 5) {
  const pts = loop.map(([cx, cy]) => new THREE.Vector2(sx(cx), sy(cy)));
  const n = pts.length;
  const out = [];

  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const cur = pts[i];
    const next = pts[(i + 1) % n];

    const inDir = cur.clone().sub(prev);
    const outDir = next.clone().sub(cur);
    const inLen = inDir.length();
    const outLen = outDir.length();
    if (inLen < 1e-6 || outLen < 1e-6) continue;
    inDir.divideScalar(inLen);
    outDir.divideScalar(outLen);

    const r = Math.min(radius, inLen * 0.5, outLen * 0.5);
    const a = cur.clone().sub(inDir.clone().multiplyScalar(r));
    const b = cur.clone().add(outDir.clone().multiplyScalar(r));

    out.push(a);
    for (let s = 1; s < arcSegments; s++) {
      const t = s / arcSegments;
      // Quadratic Bezier a -> cur -> b.
      const omt = 1 - t;
      out.push(
        new THREE.Vector2(
          omt * omt * a.x + 2 * omt * t * cur.x + t * t * b.x,
          omt * omt * a.y + 2 * omt * t * cur.y + t * t * b.y
        )
      );
    }
    out.push(b);
  }
  return out;
}

/**
 * Offsets a closed polyline toward the wall body. The arcade draws every wall
 * as a *pair* of parallel lines, so the neon is built twice: once on the true
 * silhouette and once inset, which is what gives the maze its piped look.
 */
function offsetPolyline(poly, dist) {
  const n = poly.length;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % n];
    area += a.x * b.y - b.x * a.y;
  }
  const sign = area > 0 ? 1 : -1;

  const out = [];
  for (let i = 0; i < n; i++) {
    const p = poly[i];
    const prev = poly[(i - 1 + n) % n];
    const next = poly[(i + 1) % n];
    const tx = next.x - prev.x;
    const ty = next.y - prev.y;
    const len = Math.hypot(tx, ty) || 1;
    // Left-hand normal of the tangent; the winding sign points it inward.
    const nx = (-ty / len) * sign * dist;
    const ny = (tx / len) * sign * dist;
    out.push(new THREE.Vector2(p.x + nx, p.y + ny));
  }
  return out;
}

function shapeFromLoops(outer, holes) {
  const shape = new THREE.Shape(roundedPolyline(outer, CORNER_RADIUS));
  for (const h of holes) {
    shape.holes.push(new THREE.Path(roundedPolyline(h, CORNER_RADIUS)));
  }
  return shape;
}

/* ------------------------------------------------------------- tube building */

/** Builds a closed tube through a shape-space polyline at a given height. */
function tubeFromPolyline(poly, height, radius, radialSegments) {
  const pts = poly.map((p) => new THREE.Vector3(p.x, height, -p.y));
  const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.02);
  const tubular = Math.max(24, Math.min(1200, Math.round(curve.getLength() * 2.4)));
  return new THREE.TubeGeometry(curve, tubular, radius, radialSegments, true);
}

/** Paints the near/far magenta-to-cyan gradient into a geometry's colours. */
function applyDepthGradient(geo, nearColour, farColour, boost = 1) {
  const pos = geo.attributes.position;
  const colours = new Float32Array(pos.count * 3);
  const near = new THREE.Color(nearColour);
  const far = new THREE.Color(farColour);
  const tmp = new THREE.Color();
  const halfDepth = (MAZE_H - 1) / 2;
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i);
    const t = THREE.MathUtils.clamp((z + halfDepth) / (halfDepth * 2), 0, 1);
    tmp.copy(far).lerp(near, t);
    // A little extra punch where the two hues meet keeps the gradient alive.
    const s = boost * (1 + 0.22 * Math.sin(t * Math.PI));
    colours[i * 3] = tmp.r * s;
    colours[i * 3 + 1] = tmp.g * s;
    colours[i * 3 + 2] = tmp.b * s;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colours, 3));
}

/* ------------------------------------------------------------- panel detailing */

/**
 * Tiling "Tron panel" texture for the wall bodies: fine scan lines with the
 * occasional brighter rule. ExtrudeGeometry emits top-face UVs in shape units,
 * so a repeat of 0.5 means one tile every two maze squares — small enough to
 * read as surface detail, large enough not to alias at a full-maze framing.
 */
function panelTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = 'rgba(150, 90, 255, 0.5)';
  ctx.lineWidth = 1;
  for (let y = 4; y < size; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(size, y + 0.5);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(215, 150, 255, 0.95)';
  ctx.lineWidth = 2;
  for (let y = 0; y < size; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(size, y + 0.5);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(0, 220, 255, 0.28)';
  for (let x = 0; x < size; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, size);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  // A tighter vertical repeat: the side faces are short, and at 0.5 they only
  // showed a fraction of one tile, so the panel seams never read.
  tex.repeat.set(0.5, 3);
  tex.anisotropy = 4;
  return tex;
}

/* ------------------------------------------------------------ floor glow map */

function bakeGlowMap(loopsInShapeSpace, size = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  // Shape space spans x in [-14, 14] and y in [-15.5, 15.5]; pad a little.
  const span = 34;
  const toPx = (v) => ((v + span / 2) / span) * size;

  const passes = [
    { blur: 34, width: 11, alpha: 0.13 },
    { blur: 16, width: 6, alpha: 0.24 },
    { blur: 6, width: 2.6, alpha: 0.62 },
  ];

  for (const pass of passes) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowBlur = pass.blur;
    ctx.lineWidth = pass.width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    for (const { poly, near } of loopsInShapeSpace) {
      const colour = near
        ? `rgba(255, 60, 220, ${pass.alpha})`
        : `rgba(60, 230, 255, ${pass.alpha})`;
      ctx.strokeStyle = colour;
      ctx.shadowColor = colour;
      ctx.beginPath();
      poly.forEach((p, i) => {
        const px = toPx(p.x);
        const py = size - toPx(p.y);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return { texture: tex, span };
}

/* ----------------------------------------------------------------------- API */

export function buildMaze(maze, quality) {
  const comps = wallComponents(maze.tiles);
  const slabGeos = [];
  const cyanTubeGeos = [];
  const magentaTubeGeos = [];
  const baseTubeGeos = [];
  const stripGeos = [];
  const glowLoops = [];

  for (const cells of comps) {
    const loops = traceLoops(maze.tiles, cells);
    if (!loops.length) continue;

    // Largest |area| loop is the silhouette; the rest are interior holes.
    loops.sort((a, b) => Math.abs(signedArea(b)) - Math.abs(signedArea(a)));
    const outer = loops[0];
    const holes = loops.slice(1);

    const outerArea = signedArea(outer.map(([cx, cy]) => [sx(cx), sy(cy)]));
    const orient = (loop, wantPositive) => {
      const a = signedArea(loop.map(([cx, cy]) => [sx(cx), sy(cy)]));
      return wantPositive === a > 0 ? loop : [...loop].reverse();
    };

    const outerOriented = outerArea > 0 ? outer : [...outer].reverse();
    const holesOriented = holes.map((h) => orient(h, false));

    const shape = shapeFromLoops(outerOriented, holesOriented);
    const slab = new THREE.ExtrudeGeometry(shape, {
      depth: WALL_HEIGHT,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.045,
      bevelSegments: quality.bevelSegments,
      curveSegments: 4,
    });
    slab.rotateX(-Math.PI / 2);
    slabGeos.push(slab);

    for (const loop of [outerOriented, ...holesOriented]) {
      const poly = roundedPolyline(loop, CORNER_RADIUS, quality.tubeArcSegments);
      // Cyan on the silhouette, magenta on the inset partner line: both hues on
      // every wall, which is what gives the reference art its electric read.
      cyanTubeGeos.push(
        tubeFromPolyline(poly, WALL_HEIGHT + 0.02, TUBE_RADIUS, quality.tubeRadial)
      );
      const inner = offsetPolyline(poly, 0.235);
      magentaTubeGeos.push(
        tubeFromPolyline(inner, WALL_HEIGHT + 0.02, TUBE_RADIUS * 0.86, quality.tubeRadial)
      );
      baseTubeGeos.push(
        tubeFromPolyline(poly, 0.07, TUBE_RADIUS * 0.7, Math.max(4, quality.tubeRadial - 2))
      );
      // Vertical neon strips down the wall face, spaced along the silhouette.
      // Barely visible from above, but once the walls stretch for first-person
      // they become the eye-level pipes the reference art has.
      let run = 0;
      for (let i = 1; i < poly.length; i++) {
        const a = poly[i - 1];
        const b = poly[i];
        const segLen = Math.hypot(b.x - a.x, b.y - a.y);
        run += segLen;
        if (run < 1.6) continue;
        run = 0;
        const bar = new THREE.BoxGeometry(0.095, WALL_HEIGHT * 0.8, 0.07);
        const yaw = Math.atan2(-(b.y - a.y), b.x - a.x);
        bar.rotateY(-yaw);
        bar.translate(b.x, WALL_HEIGHT * 0.42, -b.y);
        stripGeos.push(bar);
      }

      glowLoops.push({ poly, near: false });
    }
  }

  const merge = (geos) => {
    if (geos.length === 0) return null;
    const merged = mergeGeometries(geos);
    geos.forEach((g) => g.dispose());
    return merged;
  };

  const slabGeo = merge(slabGeos);
  const cyanTubeGeo = merge(cyanTubeGeos);
  const magentaTubeGeo = merge(magentaTubeGeos);
  const baseTubeGeo = merge(baseTubeGeos);
  const stripGeo = merge(stripGeos);

  const panel = panelTexture();
  // Glossy near-black acrylic: the reference walls are dark mirrors whose only
  // colour comes from the neon they reflect. Roughness stays off zero so the sun
  // in the environment map spreads into a sheen instead of a hot spot.
  const slabMat = new THREE.MeshPhysicalMaterial({
    color: PALETTE.wallBody,
    metalness: 0.62,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.32,
    // Weighted up now that the environment map is the maze's own neon rather than
    // the sky: the light is spread all around the cube instead of concentrated in
    // a sun, so there is no single lobe to blow out.
    envMapIntensity: 0.7,
    emissiveMap: panel,
    emissive: new THREE.Color(0x6a4bff),
    emissiveIntensity: 0.07,
  });

  // Light spill down the wall sides. In the reference art the black acrylic is
  // lit from the neon running along its top edge, which no amount of ambient
  // will reproduce, so a height-based emissive ramp is injected straight into
  // the physical shader. Geometry y is already world height (the extrusion is
  // rotated at build time), so the ramp needs no extra matrix work.
  slabMat.onBeforeCompile = (shader) => {
    shader.uniforms.uRimLow = { value: new THREE.Color(0x0a0018) };
    shader.uniforms.uRimHigh = { value: new THREE.Color(0x5c1cb4) };
    shader.uniforms.uWallHeight = { value: WALL_HEIGHT };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vWallY;\nvarying float vWallSide;')
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\n  vWallY = position.y;\n  vWallSide = 1.0 - abs(normal.y);'
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying float vWallY;\nvarying float vWallSide;\nuniform vec3 uRimLow;\nuniform vec3 uRimHigh;\nuniform float uWallHeight;'
      )
      .replace(
        '#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\n  float rim = clamp(vWallY / uWallHeight, 0.0, 1.0);\n  totalEmissiveRadiance += mix(uRimLow, uRimHigh, rim) * pow(rim, 3.0) * vWallSide * 0.34;'
      );
  };

  const cyanMat = new THREE.MeshBasicMaterial({ color: PALETTE.neonCyan, toneMapped: false });
  const magentaMat = new THREE.MeshBasicMaterial({ color: PALETTE.neonMagenta, toneMapped: false });
  const baseTubeMat = new THREE.MeshBasicMaterial({
    color: PALETTE.neonMagenta,
    toneMapped: false,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });



  const group = new THREE.Group();
  const slabMesh = new THREE.Mesh(slabGeo, slabMat);
  slabMesh.castShadow = quality.shadows;
  slabMesh.receiveShadow = quality.shadows;
  group.add(slabMesh);

  const cyanMesh = new THREE.Mesh(cyanTubeGeo, cyanMat);
  const magentaMesh = new THREE.Mesh(magentaTubeGeo, magentaMat);
  const baseTubeMesh = new THREE.Mesh(baseTubeGeo, baseTubeMat);
  group.add(cyanMesh, magentaMesh, baseTubeMesh);

  const stripMat = new THREE.MeshBasicMaterial({
    color: 0xff5ce6,
    toneMapped: false,
  });
  const stripMesh = stripGeo ? new THREE.Mesh(stripGeo, stripMat) : null;
  if (stripMesh) group.add(stripMesh);

  // No additive shells around the tubes: scaling a swept ring on one axis
  // stretches it into tall soft ghosts that wash the whole frame from a low
  // camera. Bloom supplies the halo, and it respects the geometry.

  // ------------------------------------------------------------- ghost gate
  // The gate is a thin door line, not a beacon. At near-white with tone mapping
  // off it was the single brightest surface in the scene and bloom turned it into
  // a hot spot in the middle of the board.
  const gateGeo = new THREE.BoxGeometry(1.9, 0.055, 0.12);
  const gateMat = new THREE.MeshBasicMaterial({
    color: PALETTE.gateColour,
    toneMapped: false,
    transparent: true,
    opacity: 0.5,
  });
  const gate = new THREE.Mesh(gateGeo, gateMat);
  gate.position.set(0, WALL_HEIGHT * 0.52, 12 - 15);
  group.add(gate);

  // ------------------------------------------------------------- floor stack
  // Registered with setStretch: [slab, tubes to lift, vertical strips].
  let stretch = 1;
  const stretchTargets = [[slabMesh, [cyanMesh, magentaMesh], stripMesh]];

  const glow = bakeGlowMap(glowLoops, quality.glowMapSize);
  const floorGroup = new THREE.Group();

  const baseGeo = new THREE.PlaneGeometry(glow.span, glow.span);
  baseGeo.rotateX(-Math.PI / 2);
  // A shader rather than a flat material so the plinth dissolves into the
  // horizon grid instead of ending on a visible square edge.
  const baseMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      colour: { value: new THREE.Color(PALETTE.floor) },
      edgeColour: { value: new THREE.Color(0x1a0536) },
      gridColour: { value: new THREE.Color(0x2a0d52) },
      span: { value: glow.span },
      opacity: { value: quality.reflections ? 0.4 : 0.985 },
    },
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
      uniform vec3 colour, edgeColour, gridColour;
      uniform float opacity, span;
      void main() {
        vec2 q = abs(vUv - 0.5) * 2.0;
        float fade = max(smoothstep(0.84, 1.0, q.x), smoothstep(0.92, 1.0, q.y));
        float a = opacity * (1.0 - fade);
        // A faint rim of violet where the plinth meets the grid.
        vec3 c = mix(colour, edgeColour, smoothstep(0.7, 0.95, max(q.x, q.y)));

        // Big wet tiles: dark grout between panels, and the panels themselves
        // stay clearer so more of the reflection world shows through.
        vec2 cell = vUv * span * 0.5;
        vec2 g = abs(fract(cell - 0.5) - 0.5) / max(fwidth(cell), vec2(1e-5));
        float grout = 1.0 - min(min(g.x, g.y), 1.0);
        c = mix(c, edgeColour * 0.5, grout * 0.85);
        a = clamp(a + grout * 0.3 * (1.0 - fade), 0.0, 1.0);

        gl_FragColor = vec4(c, a);
      }
    `,
  });
  const floorBase = new THREE.Mesh(baseGeo, baseMat);
  floorBase.position.y = 0.0;
  floorBase.renderOrder = 1;
  floorGroup.add(floorBase);

  const glowGeo = new THREE.PlaneGeometry(glow.span, glow.span);
  glowGeo.rotateX(-Math.PI / 2);
  const glowMat = new THREE.MeshBasicMaterial({
    map: glow.texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.14,
    toneMapped: false,
  });
  const floorGlow = new THREE.Mesh(glowGeo, glowMat);
  floorGlow.position.y = 0.004;
  floorGlow.renderOrder = 3;
  floorGroup.add(floorGlow);

  // ------------------------------------------------------------- the platform
  // The reference art stands the maze on a raised slab with a lit edge, which
  // also hides the seam where the mirrored reflection world begins.
  const PLINTH_H = 0.62;
  const plinthW = MAZE_W + 1.6;
  const plinthD = MAZE_H + 1.6;
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(plinthW, PLINTH_H, plinthD),
    new THREE.MeshPhysicalMaterial({
      color: 0x04030a,
      metalness: 0.7,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.9,
    })
  );
  plinth.position.y = -PLINTH_H / 2 - 0.02;
  floorGroup.add(plinth);

  // Two hairline rules on the platform edge: magenta at the lip, cyan at the
  // base. Thin is the point - a thick band reads as a solid slab of colour.
  for (const [colour, y] of [
    [PALETTE.neonMagenta, -0.05],
    [PALETTE.neonCyan, -PLINTH_H + 0.12],
  ]) {
    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(plinthW + 0.03, 0.03, plinthD + 0.03),
      new THREE.MeshBasicMaterial({ color: colour, toneMapped: false })
    );
    trim.position.y = y;
    floorGroup.add(trim);
  }

  if (quality.shadows) {
    const catcherGeo = new THREE.PlaneGeometry(glow.span, glow.span);
    catcherGeo.rotateX(-Math.PI / 2);
    const catcher = new THREE.Mesh(catcherGeo, new THREE.ShadowMaterial({ opacity: 0.42 }));
    catcher.position.y = 0.002;
    catcher.receiveShadow = true;
    catcher.renderOrder = 2;
    floorGroup.add(catcher);
  }

  // ------------------------------------------------- mirrored reflection copy
  let mirror = null;
  if (quality.reflections) {
    mirror = new THREE.Group();
    const mSlab = new THREE.Mesh(
      slabGeo,
      new THREE.MeshPhysicalMaterial({
        color: PALETTE.wallBodyDeep,
        metalness: 0.9,
        roughness: 0.34,
        envMapIntensity: 0.8,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      })
    );
    const mTube = new THREE.Mesh(
      cyanTubeGeo,
      new THREE.MeshBasicMaterial({
        color: PALETTE.neonCyan,
        toneMapped: false,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const mBase = new THREE.Mesh(
      baseTubeGeo,
      new THREE.MeshBasicMaterial({
        color: PALETTE.neonMagenta,
        toneMapped: false,
        transparent: true,
        opacity: 0.34,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const mTube2 = new THREE.Mesh(
      magentaTubeGeo,
      new THREE.MeshBasicMaterial({
        color: PALETTE.neonMagenta,
        toneMapped: false,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    mirror.add(mSlab, mTube, mTube2, mBase);
    stretchTargets.push([mSlab, [mTube, mTube2], null]);
    // Transparent draw order is renderOrder first, so the reflection is
    // guaranteed to land underneath the semi-transparent floor.
    mirror.children.forEach((c) => (c.renderOrder = -2));
    mirror.scale.y = -1;
    mirror.position.y = -0.006;
  }

  return {
    group,
    floorGroup,
    mirror,
    gate,
    componentCount: comps.length,
    /**
     * Raises the walls without distorting their neon.
     *
     * The kerbs are low so the overview camera can see over them, but from
     * inside the maze that leaves no corridor at all. Scaling the whole group
     * was the first attempt and it squashed the swept tubes into ellipses and
     * smeared them across the frame; instead the slab scales, the top tubes are
     * translated to the new top at their original cross-section, the floor line
     * stays put, and the vertical strips scale with the wall they sit on.
     */
    setStretch(target, dt) {
      const k = stretch + (target - stretch) * Math.min(1, dt * 5);
      if (Math.abs(k - stretch) < 1e-4 && Math.abs(k - target) < 1e-4) return;
      stretch = k;
      const lift = (k - 1) * WALL_HEIGHT;
      for (const [slab, tubes, strips] of stretchTargets) {
        slab.scale.y = k;
        for (const t of tubes) t.position.y = lift;
        if (strips) strips.scale.y = k;
      }
    },
    /**
     * The floor is only part-transparent because there is a reflection world
     * beneath it. If reflections are switched off the plinth has to become
     * opaque, or it turns into a window onto the sky with nothing behind it.
     */
    setReflections(on) {
      if (mirror) mirror.visible = on;
      baseMat.uniforms.opacity.value = on ? 0.4 : 0.985;
    },
    update(time, frightened) {
      // Subtle breathing on the floor-level line only; touching the main tube
      // colours would wash their hues out once bloom lifts the cores.
      baseTubeMat.opacity = 0.72 + 0.14 * Math.sin(time * 2.1);
      gateMat.opacity = 0.3 + 0.16 * Math.sin(time * 3.4);
      if (frightened) {
        // Cool the whole maze down while an energizer is active.
        slabMat.emissive.setHex(0x4b6dff);
        slabMat.emissiveIntensity = 0.5 + 0.2 * Math.sin(time * 9);
      } else {
        slabMat.emissive.setHex(0x6a4bff);
        slabMat.emissiveIntensity = 0.07;
      }
    },
    dispose() {
      slabGeo.dispose();
      cyanTubeGeo.dispose();
      if (stripGeo) stripGeo.dispose();
      magentaTubeGeo.dispose();
      baseTubeGeo.dispose();
      glow.texture.dispose();
      panel.dispose();
    },
  };
}

/* -------------------------------------------------------------- geometry util */

/**
 * Minimal geometry merger: three's BufferGeometryUtils is an addon, and we only
 * ever merge non-indexed/indexed triangle soups with matching attributes, so a
 * focused implementation keeps the bundle lean and the behaviour predictable.
 */
export function mergeGeometries(geometries) {
  const names = ['position', 'normal', 'uv'];
  const present = names.filter((n) => geometries.every((g) => g.attributes[n]));
  let vertexCount = 0;
  let indexCount = 0;
  for (const g of geometries) {
    vertexCount += g.attributes.position.count;
    indexCount += g.index ? g.index.count : g.attributes.position.count;
  }

  const arrays = {};
  for (const name of present) {
    const itemSize = geometries[0].attributes[name].itemSize;
    arrays[name] = { data: new Float32Array(vertexCount * itemSize), itemSize, offset: 0 };
  }
  const indices = vertexCount > 65535 ? new Uint32Array(indexCount) : new Uint16Array(indexCount);

  let vOffset = 0;
  let iOffset = 0;
  for (const g of geometries) {
    const count = g.attributes.position.count;
    for (const name of present) {
      const src = g.attributes[name];
      const dst = arrays[name];
      dst.data.set(src.array.subarray(0, count * dst.itemSize), dst.offset);
      dst.offset += count * dst.itemSize;
    }
    if (g.index) {
      const idx = g.index.array;
      for (let i = 0; i < idx.length; i++) indices[iOffset + i] = idx[i] + vOffset;
      iOffset += idx.length;
    } else {
      for (let i = 0; i < count; i++) indices[iOffset + i] = vOffset + i;
      iOffset += count;
    }
    vOffset += count;
  }

  const out = new THREE.BufferGeometry();
  for (const name of present) {
    out.setAttribute(name, new THREE.BufferAttribute(arrays[name].data, arrays[name].itemSize));
  }
  out.setIndex(new THREE.BufferAttribute(indices, 1));
  out.computeBoundingSphere();
  return out;
}

/* ------------------------------------------------------------- test surface */

export { wallComponents, traceLoops, roundedPolyline, offsetPolyline, sx, sy };
