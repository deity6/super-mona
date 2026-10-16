# Super Mona

[English](README.md) · [中文](README.zh-CN.md)

A **complete recreation** — project-grade, not a single-file demo — of the `WebGLSuperMona`
hero block on [githubuniverse.com](https://githubuniverse.com/).

Idle, it is a 3D Mona who turns her head to follow your cursor. Press Play and the same canvas
becomes a side-scrolling platformer running on a 94×26 block grid.

## Getting started

```bash
npm install
npm run dev        # http://127.0.0.1:5178
```

Build and preview:

```bash
npm run build
npm run preview    # http://127.0.0.1:4173
```

> ⚠️ Serve it over http. `mona2.glb` and the sprite sheets are fetched, and `file://` blocks
> that with CORS.

## Controls

| Key | What it does |
|---|---|
| `←` `→` / `A` `D` | Move left and right |
| `Space` | Jump (double jump). Rising into a block smashes it |
| Speaker in the HUD | Toggle sound (the preference is kept in localStorage) |

## Layout

```
src/
├─ game/
│  ├─ constants.js       Every numeric constant (palette / level params / physics / 10 sfx presets / pixel font)
│  ├─ shaders.js         Seven GLSL programs: grid fade, Mona sprite, trails, bug atlas, face, pupil, transition
│  ├─ rng.js             Lehmer PRNG (the original MINSTD) + Fisher–Yates
│  ├─ utils.js           Grid↔world conversion, AABB intersection, hidden matrix
│  ├─ Gradient.js        Three-stop gradient material for pickups (see "Palette" below)
│  ├─ Grid.js            Grid lines (InstancedMesh, shifted with scrollX)
│  ├─ BlockField.js      Terrain blocks (2048 instances = 512 blocks × 4 tiles, with break-apart animation)
│  ├─ Bug.js             Bug atlas + bug entity (patrol / perch / squash / knock-out)
│  ├─ MonaSheet.js       Mona sprite animation state machine + trail material
│  ├─ Mona.js            Player (physics / trail history interpolation / invulnerability blink)
│  ├─ Ducky.js           The duck (waiting / following / leaving / pickup magnetism)
│  ├─ Pickup.js          Pickups (mega 4×4 / normal 3×3 + contribution icons cropped to their alpha bounds)
│  ├─ ScorePopups.js     Score pop-ups (3×5 pixel font, mega ones go through a flicker shader)
│  ├─ GameOver.js        Score board (Mona running and jumping forever inside a frame) + GAME OVER pixel type
│  ├─ LevelGenerator.js  Level generation (flat / raised / stairs / bridge + bag shuffle)
│  ├─ Sfx.js             WebAudio synthesis (oscillators + noise + convolution reverb)
│  ├─ OpeningScene.js    Idle scene (GLB Mona + procedural materials + cursor following)
│  ├─ Transition.js      Colour-bar transition (6 bands, uOffsetY −2 → 0 → 2)
│  ├─ Engine.js          Engine (two scenes / orthographic camera / size and visibility sync)
│  ├─ DemoRunner.js      The looping demo that runs on the SOFT LAB index card
│  └─ Game.js            Main game loop
└─ ui/
   ├─ SuperMona.jsx      React shell (HUD / button state machine / high score / fallback)
   ├─ SuperMona.module.css  A line-by-line translation of the original's chunk 4963
   └─ page.css           Demo page shell
public/assets/           Every file is the original, unmodified
```

## Assets

All 11 files in `public/assets/` were downloaded from the original paths on githubuniverse.com
and are byte-for-byte unchanged:

| File | Purpose |
|---|---|
| `mona2.glb` | The 3D Mona of the idle scene (9 meshes / 264 KB) |
| `UniverseGameSet_01.png` | Mona's game sprite sheet (130×135, 5×5 frames of 26×27) |
| `UniverseBug_02.png` | Bug sprite sheet (78×81, 9 frames, Aseprite metadata inlined) |
| `DuckGame_02.png` | The duck (16×15) |
| `HeartGame.png` | Life icon (16×15) |
| `ContributionIcon_1..5.png` | Icons in the middle of a pickup |
| `super-mona-fallback.webp` | Shown when WebGL is unavailable |
| `fonts/MonaSansVF-opsz-wght.woff2` | Mona Sans variable font (weight 200–900), eyebrow and body |
| `fonts/MonaSansMonoVF-wght.woff2` | Mona Sans Mono variable font, eyebrow and `kbd` hints |

## Fidelity

### Rendering

| Original | Here |
|---|---|
| Three.js r182 + WebGL2 | Three.js 0.186 + WebGL2 ✓ |
| Orthographic camera (game world, frustum follows canvas size) | `worldCamera` in `Engine.js` ✓ |
| `PerspectiveCamera` **fov=10** (idle scene) | `OpeningScene.js` ✓ |
| Grid-line InstancedMesh + left-edge fade shader | `Grid.js` + `GRID_FADE_*` ✓ |
| Block InstancedMesh (2048 instances) | `BlockField.js` ✓ |
| Bug InstancedMesh (128) with a custom instance attribute carrying UVs | `Bug.js` ✓ |
| Mona sprite through a ShaderMaterial; Super state flows through a rainbow | `MonaSheet.js` + `applySuperMona()` ✓ |
| Trails cycle through 6 colours with an HSL offset | `Mona.js` `updateTrails()` ✓ |
| The idle Mona's nine parts rebuilt: four-colour Face gradient / noisy Pupil with two highlights / the whole eye group mirrored / symmetric parts merged | `OpeningScene.js` ✓ |
| Six-band colour-bar transition | `Transition.js` ✓ |

### Gameplay and numbers

| Item | Original | Here |
|---|---|---|
| Grid | 94 × 26 (67 × 26 narrow) | same ✓ |
| Sprite width / collision width | 3 / 2.6 cells | same ✓ |
| MOVE_SPEED / JUMP_SPEED | 21 / 30 | same ✓ |
| Gravity | 64 | same ✓ |
| Jumps | 2 (double jump) | same ✓ |
| Scroll speed | 2 → 20 cells/s (+0.2/s) | same ✓ |
| Power-up decay | Up to 25% shorter | same ✓ |
| Level patterns | flatLong / flatShort / raised / stairsUp / stairsDown / bridge | same ✓ |
| Bag shuffle weights | 7 lower, 5 upper | same ✓ |
| Row height ranges | 4–12 / 17–19 | same ✓ |
| Minimum vertical gap | 3 | same ✓ |
| Bridge probability | 1/8 | same ✓ |
| Ground bug spacing | 20 + rand(9) cells | same ✓ |
| Platform bug chance | 25% (segments longer than 2) | same ✓ |
| Pickup chance | 55%; a mega one every 20 seconds | same ✓ |
| Smashing a block | +10, 10% drops a pickup | same ✓ |
| Stomping a bug | +25, bounce at 0.6 × JUMP_SPEED | same ✓ |
| Normal / mega pickup | +50 / +100; mega grants 10s of Super | same ✓ |
| Normal pickup colour | Each tile starts on a random colour and converges on **the pickup's one colour** — a single-colour block with a contribution icon on top | **changed**, see "Palette" |
| Mega pickup colour | Each tile converges on **its own quadrant colour**, so it stays four-quadrant | **changed**, see "Palette" |
| Super | Invulnerable, double points, sound pitched up 1.5×, rainbow | same ✓ |
| Damage invulnerability | 1.5s at 12 Hz blink | same ✓ |
| Lives | 3 | same ✓ |
| Duck | Follows for 12.5s, 20-cell magnetism radius | same ✓ |
| Duck spawn interval | 12 + 8 × rand | same ✓ |
| Score pop-up de-overlap | Max 4 nudges × 1.2 cells within a 0.75s window | same ✓ |

### Palette

The original's `l` is six flat colours, and a 3×3 or 4×4 of them reads flat. This project uses
**eleven three-stop gradients** instead. The three named by the project owner —
`#FFCEE3 → #678EC9 → #262277`, `#F9D2E4 → #67C9B5 → #007E79`, `#FFE28D → #21A7CF → #D4FEFA`
— plus eight more built on the same light → mid → deep logic, because what makes a block read as
solid is the lightness spread *inside* one set, not the number of hues.

The blocks share the set: each tile covers one slice of the gradient (`uT0` / `uT1`), so a whole
pickup reads as one continuous transition rather than nine small ones. It is a custom
`ShaderMaterial`, not a texture, because the colour has to change continuously through the
appear and disappear animations and a texture cannot do that. `GradientColor` exposes the same
surface as `THREE.Color` (`getHSL` / `copy` / `setHSL`), so the animation code in `Pickup.js`
needed no changes at all.

`PALETTE` is deliberately untouched: `Mona.js` builds its trails from `PALETTE.length`, so
extending it would turn the original's six trails into eleven.

### Sound

All ten effects are **synthesised live with WebAudio** (the original ships no audio files), with
every parameter traced back: `jump` `collect` `collectMega` `catchDucky` `duckyLeave` `megaEnd`
`breakBlock` `squashBug` `gameOver` `damage`.

That includes a 0.3s white-noise buffer, a 0.45s exponentially-decaying convolution reverb, a
`(1-x)³` reverb envelope, the Super-state pitch-up rule (jump excepted), the four-effect reverb
allow-list, muted-state persistence, and user-gesture unlocking.

### UI

Three-column HUD grid (lives / controls / score + sound), the controls sliding away once you
have moved and jumped, high score in localStorage, WebGL capability detection with a fallback,
`prefers-reduced-motion` support, and container-query font sizing on the score board.

**The eyebrow and its copy table** — the original's `module 2003` and `module 2283`:

| Item | Original | Here |
|---|---|---|
| Eyebrow component | An internal `Eyebrow` (scramble decode + cursor) | `src/ui/Eyebrow.jsx` ✓ |
| Decode alphabet | `A-Z0-9.!@#$%^&*()_+-=[]{}|/;<>?` | same ✓ |
| Decode timing | Character *i* starts at `0.075×⌊i/2⌋ + 0.0375×(i mod 2)`s, tints to the accent colour, scrambles 2–3 times, settles on the real character, then restores its target colour | same ✓ |
| Cursor | `Eyebrow_Cursor`: a 10×10 square, `background: #08872b`, parked at `translateX(1ch)` once settled | same ✓ |
| Trigger | IntersectionObserver; `rootMargin: 0px` with `animateOnViewportEnter`, otherwise `0px 0px -20% 0px` | same ✓ |
| Accessibility | An `sr-only` span carries the full text; the visual layer is `aria-hidden` | same ✓ |
| Copy · default | `play_super-mona_while_you_wait/` (switches to `play_super-mona/` after the event) | same ✓ |
| Copy · with a high score | `super-mona / your high score:` with the score in the accent colour | same ✓ |
| Button labels | `Play` / `Exit game` / `Play again` | same ✓ |
| Sound button | `aria-label` of `Turn sound on` / `Turn sound off` | same ✓ |
| Analytics string | `Content, Play game, ref_loc: SuperMona;` (kept separate from the visible copy) | same ✓ |
| Type | Self-hosted variable `Mona Sans` / `Mona Sans Mono` (weight 200–900) | same files in `public/fonts/` ✓ |
| Play button | Primer Brand `Button variant="secondary"`: `rgba(0,0,0,.05)` fill + `#b6bfb8` border + `blur(20px)`, measured at 66×56 | same size ✓ |
| Eyebrow typography | `font: 425 16px/1.5 "Mona Sans Mono"`, `letter-spacing .15px`, `gap: 4px` in Labels | same ✓ |

## Differences from the original

| Item | Notes |
|---|---|
| Framework | The original is a Next.js (pages router) app; this is Vite + React 19. The game code is framework-agnostic and ported 1:1 |
| Dependency versions | Three.js 0.186 / GSAP 3.15 / React 19, all newer than what the original shipped with |
| Pickup palette | Replaced six flat colours with eleven three-stop gradients, at the owner's request. See "Palette" above |
| Cover demo | The SOFT LAB index card runs this same game with a script at the controls (`DemoRunner.js` + `Game.autoPlay`). The original has no such card, and the demo camera frames 20 rows rather than all 26 so the character reads at 18px instead of 9px |
| Canvas width | The page here allows up to 1524px, matching the original's full-bleed hero; the original has no explicit cap |
| Portrait hint | A CSS-only overlay on the SOFT LAB copy and this site, telling phone users to rotate. Not in the original |
| Pupil outline | The original's shader references `uOutlineTexture` without ever assigning it; this project hands it a fully black 1×1 texture, which is equivalent to no outline |
| Transition timing | The original's reveal offset looks like it was damaged during minification; this project uses "fully covered, then reveal" |
| Eyebrow cursor blink | The original calls `classList.add(styles.CursorBlink)` but that class is not exported from its CSS module, so the cursor is a **static** square. This project copies the same no-op, so behaviour matches |
| Page shell | The original's hero/nav/footer belong to the site framework, not to `WebGLSuperMona`, and are not included |

## Sources

- Original visuals and interaction: <https://githubuniverse.com/>
- Design system reference: [`primer/brand`](https://github.com/primer/react-brand) (MIT)
- Libraries: [three.js](https://github.com/mrdoob/three.js), [GSAP](https://gsap.com/)

This project is for **study and exchange, non-commercial**. Asset copyright belongs to GitHub.
