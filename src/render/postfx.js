/**
 * NEON GRID — post-processing chain.
 *
 * Browsers have no ray tracing, so the "raytraced neon" read is earned in
 * post: HDR bloom for the tube glow, then a single grade pass that adds barrel
 * distortion, radial chromatic aberration, CRT scanlines, film grain, a
 * vignette and the purple-lift/cyan-highlight colour curve that defines the
 * synthwave look. Death and power-pellet hits drive a glitch/flash uniform.
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export const NeonGradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(1, 1) },
    time: { value: 0 },
    aberration: { value: 1.0 },
    barrel: { value: 0.055 },
    vignette: { value: 0.62 },
    scanline: { value: 0.055 },
    grain: { value: 0.055 },
    flash: { value: 0 },
    flashColour: { value: new THREE.Color(0xffffff) },
    glitch: { value: 0 },
    saturation: { value: 1.2 },
    lift: { value: new THREE.Color(0x120320) },
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
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float time, aberration, barrel, vignette, scanline, grain, flash, glitch, saturation;
    uniform vec3 flashColour, lift;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    vec2 distort(vec2 uv, float amount) {
      vec2 c = uv - 0.5;
      float r2 = dot(c, c);
      return 0.5 + c * (1.0 + amount * r2);
    }

    void main() {
      vec2 uv = distort(vUv, barrel);

      // Horizontal tear bands while glitching.
      if (glitch > 0.001) {
        float band = floor(uv.y * 42.0);
        float n = hash(vec2(band, floor(time * 24.0)));
        uv.x += (n - 0.5) * 0.09 * glitch * step(0.62, n);
      }

      // Radial chromatic aberration: colour channels drift apart at the edges.
      vec2 c = uv - 0.5;
      float r2 = dot(c, c);
      float amt = aberration * (0.0016 + r2 * 0.0072);
      vec3 col;
      col.r = texture2D(tDiffuse, uv + c * amt).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - c * amt).b;

      // Beyond the distorted frame, fade to black rather than smear.
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) col = vec3(0.0);

      // Colour grade: purple lift in the shadows, cyan bias in the highlights.
      float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(luma), col, saturation);
      col += lift * (1.0 - smoothstep(0.0, 0.34, luma)) * 0.45;
      // Warm the highlights instead of cooling them: a blue bias is what made the
      // corridors read cold against the reference's magenta.
      col *= mix(vec3(1.0), vec3(1.06, 0.97, 1.03), smoothstep(0.42, 1.0, luma));

      // CRT scanlines plus a faint aperture grille.
      float lines = sin(uv.y * resolution.y * 1.55);
      col *= 1.0 - scanline * (0.5 + 0.5 * lines);
      col *= 1.0 - scanline * 0.35 * (0.5 + 0.5 * sin(uv.x * resolution.x * 3.14159));

      // Film grain.
      float g = hash(uv * resolution + fract(time) * 133.0) - 0.5;
      col += g * grain;

      // Vignette.
      float v = 1.0 - vignette * smoothstep(0.28, 0.95, length(c) * 1.34);
      col *= v;

      // Event flash.
      col = mix(col, flashColour, clamp(flash, 0.0, 1.0));

      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }
  `,
};

export function createPostFX(renderer, scene, camera, quality) {
  // Everything here works in DEVICE pixels. renderer.getSize() returns CSS
  // pixels, while EffectComposer separately multiplies whatever size it is given
  // by its own cached pixel ratio — feeding it CSS pixels once and drawing-buffer
  // pixels later made the buffers half resolution at boot and then four times
  // too large after the first resize. Pinning the composer's ratio to 1 and
  // always passing drawing-buffer sizes removes the double-count entirely.
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());

  // Half-float colour attachments are not universal even on WebGL2; falling back
  // beats rendering a black screen with only a console warning.
  const hasFloat =
    renderer.extensions.has('EXT_color_buffer_float') ||
    renderer.extensions.has('EXT_color_buffer_half_float');
  const target = new THREE.WebGLRenderTarget(size.x, size.y, {
    type: hasFloat ? THREE.HalfFloatType : THREE.UnsignedByteType,
    samples: quality.msaa,
    colorSpace: THREE.LinearSRGBColorSpace,
  });
  if (!hasFloat) {
    console.warn('[neon-grid] no float colour attachments; post runs at 8 bit');
  }

  const composer = new EffectComposer(renderer, target);
  composer.setPixelRatio(1);
  composer.setSize(size.x, size.y);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(size.x, size.y),
    quality.bloomStrength,
    quality.bloomRadius,
    quality.bloomThreshold
  );
  composer.addPass(bloom);

  const output = new OutputPass();
  output.renderToScreen = false;
  composer.addPass(output);

  const grade = new ShaderPass(NeonGradeShader);
  grade.renderToScreen = true;
  grade.uniforms.resolution.value.set(size.x, size.y);
  grade.uniforms.aberration.value = quality.aberration;
  grade.uniforms.scanline.value = quality.scanline;
  grade.uniforms.grain.value = quality.grain;
  composer.addPass(grade);

  let flashTimer = 0;
  let flashDuration = 0.001;
  let flashStrength = 0;
  let glitchTimer = 0;
  let glitchDuration = 0.001;

  return {
    composer,
    bloom,
    grade,
    /** `w`/`h` are drawing-buffer (device) pixels. */
    setSize(w, h) {
      // composer.setSize already forwards to every pass, including the bloom mip
      // chain; calling bloom.setSize again with a different base left the glow
      // sampling at a fraction of the scene resolution.
      composer.setSize(w, h);
      grade.uniforms.resolution.value.set(w, h);
    },
    /** Changing MSAA needs the attachments rebuilt, which dispose() triggers. */
    setMsaa(samples) {
      for (const rt of [composer.renderTarget1, composer.renderTarget2]) {
        if (!rt || rt.samples === samples) continue;
        rt.samples = samples;
        rt.dispose();
      }
    },
    /** Triggers a full-screen colour flash. */
    flash(colour, strength = 0.55, duration = 0.28) {
      grade.uniforms.flashColour.value.set(colour);
      flashStrength = strength;
      flashTimer = duration;
      flashDuration = duration;
    },
    /** Triggers the horizontal tear glitch. */
    glitch(duration = 0.5) {
      glitchTimer = duration;
      glitchDuration = duration;
    },
    update(dt, time) {
      grade.uniforms.time.value = time;

      if (flashTimer > 0) {
        flashTimer = Math.max(0, flashTimer - dt);
        const t = flashTimer / flashDuration;
        grade.uniforms.flash.value = flashStrength * t * t;
      } else {
        grade.uniforms.flash.value = 0;
      }

      if (glitchTimer > 0) {
        glitchTimer = Math.max(0, glitchTimer - dt);
        grade.uniforms.glitch.value = glitchTimer / glitchDuration;
      } else {
        grade.uniforms.glitch.value = 0;
      }
    },
    render() {
      composer.render();
    },
    dispose() {
      composer.dispose();
      target.dispose();
    },
  };
}
