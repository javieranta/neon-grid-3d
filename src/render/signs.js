/**
 * NEON GRID — in-world neon signage.
 *
 * The reference art surrounds the board with lit arcade signs rather than a flat
 * screen-space HUD, so the score, the high score and the attract text live on
 * physical panels standing on the grid: a dark glossy back plate, a bright
 * canvas face, and a tube frame that blooms.
 *
 * Faces are redrawn only when their text actually changes, so a sign costs one
 * canvas upload per score change rather than one per frame.
 */

import * as THREE from 'three';
import { PALETTE } from './palette.js';

const FACE_W = 512;
const FACE_H = 256;

function drawFace(ctx, { label, value, labelColour, valueColour }) {
  ctx.clearRect(0, 0, FACE_W, FACE_H);
  ctx.fillStyle = '#05010c';
  ctx.fillRect(0, 0, FACE_W, FACE_H);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const write = (text, y, size, colour) => {
    ctx.font = `bold ${size}px "Trebuchet MS", "Segoe UI", sans-serif`;
    ctx.shadowColor = colour;
    ctx.shadowBlur = 28;
    ctx.fillStyle = colour;
    ctx.fillText(text, FACE_W / 2, y);
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, FACE_W / 2, y);
  };

  if (value === null || value === undefined) {
    write(label, FACE_H / 2, 96, labelColour);
  } else {
    write(label, FACE_H * 0.3, 54, labelColour);
    write(value, FACE_H * 0.68, 104, valueColour);
  }
}

function buildSign(spec) {
  const group = new THREE.Group();
  const canvas = document.createElement('canvas');
  canvas.width = FACE_W;
  canvas.height = FACE_H;
  const ctx = canvas.getContext('2d');
  drawFace(ctx, spec);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  const w = spec.width;
  const h = (w * FACE_H) / FACE_W;

  // Glossy back plate, so the sign has a body and catches the surrounding neon.
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(w * 1.08, h * 1.16, 0.26),
    new THREE.MeshPhysicalMaterial({
      color: 0x05040c,
      metalness: 0.6,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    })
  );
  group.add(plate);

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true })
  );
  face.position.z = 0.14;
  group.add(face);

  // Tube frame: four bars, mitred by simply overlapping at the corners.
  const frameMat = new THREE.MeshBasicMaterial({ color: spec.frame, toneMapped: false });
  const bar = 0.075;
  const fw = w * 1.08;
  const fh = h * 1.16;
  for (const [sw, sh, x, y] of [
    [fw, bar, 0, fh / 2],
    [fw, bar, 0, -fh / 2],
    [bar, fh, fw / 2, 0],
    [bar, fh, -fw / 2, 0],
  ]) {
    const edge = new THREE.Mesh(new THREE.BoxGeometry(sw, sh, bar), frameMat);
    edge.position.set(x, y, 0.15);
    group.add(edge);
  }

  // A pair of posts down to the grid.
  const postMat = new THREE.MeshPhysicalMaterial({
    color: 0x07050f,
    metalness: 0.7,
    roughness: 0.3,
  });
  for (const sx of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, spec.height, 8), postMat);
    post.position.set(sx * w * 0.34, -spec.height / 2 - fh / 2, 0);
    group.add(post);
  }

  group.position.set(spec.x, spec.height + fh / 2, spec.z);
  group.rotation.y = spec.rotY;

  return {
    group,
    /** Redraws only when the rendered string actually changed. */
    setValue(value) {
      const text = String(value);
      if (spec.value === text) return;
      spec.value = text;
      drawFace(ctx, spec);
      tex.needsUpdate = true;
    },
    dispose() {
      tex.dispose();
    },
  };
}

export function createSigns(scene) {
  const specs = [
    {
      key: 'score',
      label: '1UP',
      value: '000000',
      labelColour: '#00e9ff',
      valueColour: '#ff5ce0',
      frame: PALETTE.neonCyan,
      width: 7.4,
      height: 3.6,
      x: -21.5,
      z: 7,
      rotY: 0.52,
    },
    {
      key: 'high',
      label: 'HIGH SCORE',
      value: '000000',
      labelColour: '#ff2bd6',
      valueColour: '#8cf6ff',
      frame: PALETTE.neonMagenta,
      width: 7.4,
      height: 3.6,
      x: 21.5,
      z: 7,
      rotY: -0.52,
    },
    {
      key: 'title',
      label: 'NEON GRID',
      value: null,
      labelColour: '#ff2bd6',
      valueColour: '#ffffff',
      frame: PALETTE.neonMagenta,
      width: 8.2,
      height: 4.4,
      x: -20.5,
      z: -15,
      rotY: 0.36,
    },
    {
      key: 'grid',
      label: 'GRID',
      value: '01',
      labelColour: '#00e9ff',
      valueColour: '#ffd23a',
      frame: PALETTE.neonCyan,
      width: 6.4,
      height: 4.4,
      x: 20.5,
      z: -15,
      rotY: -0.36,
    },
  ];

  const signs = {};
  for (const spec of specs) {
    const sign = buildSign(spec);
    signs[spec.key] = sign;
    scene.add(sign.group);
  }

  const pad = (n, w) => String(n).padStart(w, '0');

  return {
    signs,
    update(game) {
      signs.score.setValue(pad(game.score, 6));
      signs.high.setValue(pad(game.highScore, 6));
      signs.grid.setValue(pad(game.level, 2));
    },
    dispose() {
      for (const s of Object.values(signs)) s.dispose();
    },
  };
}
