# Porting NEON GRID to VR

Written while finishing the flat-screen build, so the next session starts from
facts rather than from a survey. Everything below has been checked against the
code as it stands.

---

## What is already in place

**A player rig, not a positioned camera.** `src/render/renderer.js` puts the
camera at the local origin of a `playerRig` group and moves the *rig*. This is the
one structural thing a WebXR port needs: in a session the runtime writes the
camera's own `position` and `quaternion` from the headset every frame, so any code
that assigns `camera.position` fights the pose. With a rig, the head pose composes
on top of the game's framing and every existing camera mode keeps working. The rig
is exported as `view.playerRig`.

**A first-person camera mode.** `firstPerson` already sits at Pac-Man's eye
height, looks along his direction of travel, hides his shell while keeping his
point light, and stretches the wall group to 3.1× so the kerbs become real
corridors. That mode is the VR view.

**A comfort mode.** `view.setComfortMode(true)` (or `?comfort=1`) switches off
baked depth of field, camera shake and field-of-view punches. All three are fine on
a flat screen and are established causes of discomfort in a headset — DoF because
the viewer's eyes accommodate naturally, so baked blur reads as permanent softness.

**A simulation that does not care about rendering.** `src/core/*` has no Three.js
and no DOM. It is driven by a fixed 120 Hz timestep from `src/main.js`, so a
72/90/120 Hz headset changes nothing about game behaviour.

**Relative steering.** Input is already interpreted relative to Pac-Man's heading
in the close cameras (`game.steer`), which is the mapping a thumbstick wants.

---

## Hard requirements this codebase does not yet meet

Found by auditing the code against this document rather than by recalling it. Each
is a change that must happen or nothing renders in a headset.

**The render loop must become `renderer.setAnimationLoop`.** `src/main.js` drives
everything from `requestAnimationFrame` (three call sites). A WebXR session will not
present frames from rAF — the session supplies its own frame callback, and three
routes it through `setAnimationLoop`. The fixed-timestep accumulator moves inside
that callback unchanged; only the scheduler changes.

**The resize handler must stand down during a session.** `resize()` in
`src/render/renderer.js` calls `renderer.setSize(...)` on every window resize and
orientation change. In a session the XR runtime owns the drawing buffer, so this
fights it. Guard the body with `if (renderer.xr.isPresenting) return;` and re-run it
once on session end.

**Foveation and framebuffer scale are the first performance levers**, before any
tier change: `renderer.xr.setFoveation(0.5)` and
`renderer.xr.setFramebufferScaleFactor(0.9)`. Reach for these before cutting
geometry.

## The one real blocker: post-processing

`EffectComposer` does not work in a WebXR session. It renders to its own
single-view render target, while XR needs both eyes into the session's framebuffer
(usually as a texture array). The whole chain in `src/render/postfx.js` — bloom,
the Bokeh depth-of-field pass, `OutputPass`, and the neon grade — has to be dealt
with before anything renders in a headset.

Three options, in increasing effort:

1. **Drop post in VR.** Set a flag that renders `scene`/`camera` directly through
   `renderer.render()` and skips the composer. The maze still reads: the neon tubes
   are `MeshBasicMaterial` with `toneMapped: false`, the environment cubemap bake
   gives the wet reflections, and the mirrored world under the floor is geometry
   rather than a post effect. What is lost is bloom, the CRT grade and the
   chromatic aberration — and the aberration should go in VR anyway.
2. **Emissive bloom substitute.** Fake the glow with additive shell geometry around
   the tubes. Note the earlier attempt at this (scaling a swept tube on one axis)
   smeared badly; it needs a second tube built at a larger radius, not a scaled one.
3. **A per-eye composer.** Run the chain twice against the XR views. Expensive and
   fiddly; not worth it for a first port.

Recommendation: start with (1), measure, then consider (2).

---

## Scale

The simulation is in tiles: one tile is one world unit, corridors are one tile
wide, and Pac-Man is 0.46 in radius. Standing inside that at 1 unit = 1 metre gives
a corridor a person can barely fit in, which will feel cramped and makes the walls
tower oddly.

Pick the scale deliberately. Either scale the world group by ~2 (a two-metre
corridor, Pac-Man about a metre across) or keep 1:1 and treat the player as a
small creature in a large maze — a legitimate art direction, but decide rather than
inherit it.

---

## Audio is not spatialised at all

`src/audio/synth.js` has no `PannerNode` and no `AudioListener` — every voice goes
straight to the master bus. On a flat screen that is fine. In a headset it is the
single largest missed opportunity: a ghost you cannot see but can *hear* approaching
down a corridor is most of the tension of this game in VR.

The work is contained, because the audio layer is already event-driven:

- Add an `AudioListener` and drive its pose from `view.playerRig` each frame.
- Give each of the four ghosts a `PannerNode` (HRTF, inverse distance) fed by a
  quiet looped tone, positioned from `game.ghosts[id]` — the simulation already has
  their world positions.
- Spatialise the pellet munch and the fruit collect at Pac-Man's position.
- Leave the music and the siren on the unspatialised master bus; ambient beds should
  not move with the head.

## HUD migration is bigger than one line

`index.html` carries about fifteen identified HUD elements: score, high score, level,
lives, collected fruit, the four ghost chips, the two ability pip rows, the fruit
bearing tracker, the power-pellet bar, toasts and the centre overlay. None of it
renders in a headset — DOM overlays simply do not exist in a session.

Cheapest credible path: rely on the **in-world arcade signage**, which already
displays score, high score and level on lit panels around the board, and add one
small panel parented to `playerRig` for the things a player needs at a glance —
lives, jumps, scouts. The fruit bearing tracker is the awkward one: its whole point
is direction, so in VR it wants to become a world-space marker or an audio cue
rather than a screen-edge chip.

## Comfort checklist

- Comfort mode on: no DoF, no shake, no FOV changes. Already implemented.
- Never move the rig faster than the game already does; Pac-Man's 7.6 tiles/second
  is brisk for a headset and may want scaling down.
- Never rotate the view for the player. The chase and first-person rigs currently
  yaw to follow his heading — **in VR that is a comfort problem**, because
  turning a corner would whip the world around the player's head. Options: snap-turn
  the rig in 90° steps at the moment of the turn, or keep the rig at a fixed world
  orientation and let the player look around freely while Pac-Man moves under them.
  This needs a decision before anything else.
- Keep a stable horizon: the sky dome already follows the camera's world position.
- Target 72 Hz minimum. The ultra tier is ~1.6M triangles with a full extra scene
  render for DoF; the VR build should start from the `medium` tier with DoF off.
- **Every performance figure in this repository is from software rasterisation.**
  All the captures and test runs were made in headless Chromium with SwiftShader at
  four to twelve frames per second. Nothing here has ever been measured on a GPU, let
  alone on a headset, so treat the tier recommendation as a starting guess and
  measure first.
- The mirrored reflection world under the floor is real duplicated geometry, not a
  post effect. It roughly doubles the scene, and in VR that cost is paid per eye. It
  is the first thing to try switching off if the frame budget is tight —
  `quality.reflections` and `quality.reflectActors` already gate it.

---

## Input mapping

| Action | Flat | Suggested VR |
|---|---|---|
| Steer | WASD / arrows / mouse buttons, relative to heading | Thumbstick left/right → `game.steer(±1)` |
| Jump | Space | Trigger or A |
| Scout | Q | Grip, or a held gesture |
| Pause | P | Menu button |

`game.steer`, `game.tryJump` and `game.tryScout` are the only entry points needed —
they are all pure simulation calls with no rendering coupling.

---

## Concrete first session

1. `renderer.xr.enabled = true`, add `VRButton`, request a `local-floor` session.
2. Add a `xrMode` flag to `createRenderer` that bypasses the composer (option 1).
3. Call `view.setComfortMode(true)` on session start.
4. Force the `firstPerson` camera mode and decide the rig-rotation question above.
5. Map a thumbstick to `game.steer`, trigger to `game.tryJump`.
6. Move the DOM HUD into the world: a panel parented to `playerRig` a metre or two
   ahead, or drop it and rely on the in-world arcade signage, which already carries
   score, high score and level.

---

## How to test without a headset

There is no automated coverage of any of this, and there cannot easily be: Playwright
does not implement WebXR, so the existing browser suite cannot enter a session.

- Use the **WebXR API Emulator** browser extension for pose and controller input. It
  is enough to verify the session starts, the rig composes with the head pose, the
  composer bypass works and the controls map correctly.
- Keep `?comfort=1` in the URL while developing so you are always testing the
  configuration the headset will use.
- The simulation suites (`npm test`) stay valid throughout — they never touch the
  renderer, so gameplay regressions are still caught headlessly.
- Budget a real device pass. The emulator will not reveal comfort problems, and the
  rig-rotation question above can only really be judged wearing the thing.

## Things that will NOT need touching

- `src/core/*` — the whole simulation, including the ghost AI, the fruit placement,
  the jump and scout budgets, and the collision rules.
- The maze geometry builder, the environment, the actor models.
- The three test suites: 218 simulation assertions, 5 geometry, 1060 turning. They
  run headless with no renderer at all.
