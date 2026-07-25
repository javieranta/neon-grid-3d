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

  ctx.strokeStyle = 'rgba(150, 90, 255, 0.34)';
  ctx.lineWidth = 1;
  for (let y = 4; y < size; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(size, y + 0.5);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(210, 140, 255, 0.7)';
  for (let y = 0; y < size; y += 64) {
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
  tex.repeat.set(0.5, 0.5);
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
  const topTubeGeos = [];
  const baseTubeGeos = [];
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
      bevelThickness: 0.055,
      bevelSize: 0.05,
      bevelSegments: quality.bevelSegments,
      curveSegments: 4,
    });
    slab.rotateX(-Math.PI / 2);
    slabGeos.push(slab);

    for (const loop of [outerOriented, ...holesOriented]) {
      const poly = roundedPolyline(loop, CORNER_RADIUS, quality.tubeArcSegments);
      topTubeGeos.push(tubeFromPolyline(poly, WALL_HEIGHT + 0.012, TUBE_RADIUS, quality.tubeRadial));
      // Inset partner line, the other half of the arcade's piped wall.
      const inner = offsetPolyline(poly, 0.185);
      topTubeGeos.push(
        tubeFromPolyline(inner, WALL_HEIGHT + 0.012, TUBE_RADIUS * 0.72, quality.tubeRadial)
      );
      baseTubeGeos.push(
        tubeFromPolyline(poly, 0.055, TUBE_RADIUS * 0.66, Math.max(4, quality.tubeRadial - 2))
      );
      // Average depth decides which end of the gradient the glow map uses.
      const avgZ = poly.reduce((s, p) => s - p.y, 0) / poly.length;
      glowLoops.push({ poly, near: avgZ > 0 });
    }
  }

  const merge = (geos) => {
    if (geos.length === 0) return null;
    const merged = mergeGeometries(geos);
    geos.forEach((g) => g.dispose());
    return merged;
  };

  const slabGeo = merge(slabGeos);
  const topTubeGeo = merge(topTubeGeos);
  const baseTubeGeo = merge(baseTubeGeos);

  applyDepthGradient(topTubeGeo, PALETTE.neonNear, PALETTE.neonFar, 1.0);
  applyDepthGradient(baseTubeGeo, PALETTE.neonNear, PALETTE.neonFar, 0.55);

  const panel = panelTexture();
  const slabMat = new THREE.MeshPhysicalMaterial({
    color: PALETTE.wallBody,
    // Deliberately rough: at mirror smoothness the sun in the environment map
    // collapses into a blown-out hot spot on the flat wall tops. Spread out, the
    // same reflection reads as brushed metal catching the sunset.
    metalness: 0.85,
    roughness: 0.44,
    clearcoat: 0.55,
    clearcoatRoughness: 0.38,
    envMapIntensity: 0.42,
    sheen: 0.4,
    sheenColor: new THREE.Color(PALETTE.neonAccent),
    emissiveMap: panel,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.5,
  });

  const tubeMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    toneMapped: false,
  });
  const baseTubeMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    toneMapped: false,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const group = new THREE.Group();
  const slabMesh = new THREE.Mesh(slabGeo, slabMat);
  slabMesh.castShadow = quality.shadows;
  slabMesh.receiveShadow = quality.shadows;
  group.add(slabMesh);
  const topTubeMesh = new THREE.Mesh(topTubeGeo, tubeMat);
  const baseTubeMesh = new THREE.Mesh(baseTubeGeo, baseTubeMat);
  group.add(topTubeMesh, baseTubeMesh);

  // ------------------------------------------------------------- ghost gate
  const gateGeo = new THREE.BoxGeometry(1.9, 0.1, 0.16);
  const gateMat = new THREE.MeshBasicMaterial({
    color: PALETTE.gateColour,
    toneMapped: false,
    transparent: true,
    opacity: 0.95,
  });
  const gate = new THREE.Mesh(gateGeo, gateMat);
  gate.position.set(0, WALL_HEIGHT * 0.52, 12 - 15);
  group.add(gate);

  // ------------------------------------------------------------- floor stack
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
      opacity: { value: quality.reflections ? 0.58 : 0.985 },
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

        // One-unit lattice tying the maze floor into the horizon grid.
        vec2 cell = vUv * span;
        vec2 g = abs(fract(cell - 0.5) - 0.5) / max(fwidth(cell), vec2(1e-5));
        float line = 1.0 - min(min(g.x, g.y), 1.0);
        c += gridColour * line * 0.5 * (1.0 - fade);
        a = clamp(a + line * 0.16 * (1.0 - fade), 0.0, 1.0);

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
    opacity: 0.42,
    toneMapped: false,
  });
  const floorGlow = new THREE.Mesh(glowGeo, glowMat);
  floorGlow.position.y = 0.004;
  floorGlow.renderOrder = 3;
  floorGroup.add(floorGlow);

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
        opacity: 0.62,
        side: THREE.DoubleSide,
      })
    );
    const mTube = new THREE.Mesh(
      topTubeGeo,
      new THREE.MeshBasicMaterial({
        vertexColors: true,
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
        vertexColors: true,
        toneMapped: false,
        transparent: true,
        opacity: 0.34,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    mirror.add(mSlab, mTube, mBase);
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
    update(time, frightened) {
      // Keep the tubes saturated: a near-white multiplier would wash the hue
      // out once bloom lifts the cores.
      const pulse = 0.92 + 0.08 * Math.sin(time * 2.1);
      tubeMat.color.setScalar(pulse);
      gateMat.opacity = 0.55 + 0.35 * Math.sin(time * 3.4);
      if (frightened) {
        // Cool the whole maze down while an energizer is active.
        slabMat.emissive.setHex(0x6a86ff);
        slabMat.emissiveIntensity = 0.75 + 0.25 * Math.sin(time * 9);
      } else {
        slabMat.emissive.setHex(0xffffff);
        slabMat.emissiveIntensity = 0.5;
      }
    },
    dispose() {
      slabGeo.dispose();
      topTubeGeo.dispose();
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
