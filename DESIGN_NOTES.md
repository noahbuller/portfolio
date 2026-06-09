# Design Notes — City Drive Portfolio

Living notes for the immersive homepage: current state, polish ideas, and next
larger steps.

## Current state

- **Single coastal palette** (ocean blue -> peach sky, teal water). The old
  synthwave theme and the theme toggle were removed; all color lives in
  [`src/app/globals.css`](src/app/globals.css).
- **Continuous horizontal drive**, no user scroll. One `requestAnimationFrame`
  loop translates all parallax layers; speed is 50% of the original (35px/s).
- **Faded sky title** (name + role) centered above the buildings.
- **Billboards** for Resume, Contact, Social — varied mounts (`ground` poles vs
  lit `building` blocks), grounded on the road, and they pop in via
  IntersectionObserver as they enter the viewport.
- **Traffic system** ([`TrafficLayer.tsx`](src/components/city/TrafficLayer.tsx)):
  a rolling stream of randomized vehicles (sedan / compact / van, varied colors,
  speeds, depth).
  - **Easter egg:** ~1 in 7 spawns is the white sedan "the developer's ride" —
    white body with gold trim + underglow, a small crown, an `NB` plate, a
    slower cruise, and a hover label.
- **Sun shimmer** softly reflected on the water (smooth glow; the earlier banded
  reflection and the broken discrete window-twinkle were removed).
- **Road plane** at the bottom (asphalt + streaming dashed center line); traffic
  drives on it. Building-mounted billboards sit at the curb (elevated) so their
  pedestals rise from behind the road, not in it.
- **Planes + banners** ([`PlaneLayer.tsx`](src/components/city/PlaneLayer.tsx)):
  occasional aircraft (every ~12-20s, max 2) drift across the upper sky towing a
  flag-style banner CTA. Banners are real, focusable links cycling through
  `ctas.aerial` (Projects, About). Skipped under reduced motion.
- **Reduced motion:** animations pause and a static "postcard" frame is shown
  (parked cars, billboards fully visible, no twinkle/shimmer).
- **Theme-aware inline SVG** layers (sky / skyline / midground / foreground) so
  everything recolors from CSS variables.
- **Metadata:** app favicon ([`src/app/icon.svg`](src/app/icon.svg)) and a
  generated Open Graph image
  ([`src/app/opengraph-image.tsx`](src/app/opengraph-image.tsx)).

## Content

All links live in [`src/data/ctas.ts`](src/data/ctas.ts):

- Email: `bullern22@gmail.com` (Contact pre-fills subject "Reaching out from
  your website")
- GitHub: `github.com/noahbuller`
- LinkedIn: `linkedin.com/in/noahbuller`
- Resume: `public/resume.pdf`, downloads as `NoahBuller_resume.pdf`
- `metadataBase` in [`src/app/layout.tsx`](src/app/layout.tsx) is set to a
  placeholder `https://noahbuller.com` — update to the real domain.

## Sprite review notes (this pass)

- Foreground buildings are now **contiguous** (widths sum to 2000) with a solid
  base band, so no sky/water shows through at street level; strip tiles
  seamlessly.
- Midground distant-land endpoints aligned at the tile seam (y=90 both edges).
- Skyline gained a continuous base band to remove gaps at its base while keeping
  varied tops.
- Known minor item: the sun reflection is positioned at a fixed ~70.8vw to match
  the sun; on extreme aspect ratios it can drift slightly from the sun disc.

## Recommended quick wins

1. **Two-way traffic** — add a second lane heading the other direction (flip the
   sprite) for livelier streets.
2. **Vehicle shadows vs. road** — tie car shadow opacity to scale for depth.
3. **Billboard variety** — alternate frame shapes / add marquee bulb lights.
4. **Sun reflection accuracy** — compute the sun's screen x from viewport aspect
   instead of a fixed vw, or move the reflection into the (static) sky SVG.
5. **OG domain** — set the real production URL in `metadataBase`.
6. **Foreground depth layer** — a closer >1.0-speed layer (lamps, trees, signs).

## Next steps (larger)

- **Boats + billboard sails (Phase B)** — boats riding the water band with the
  sail as the billboard; needs collision handling with the bridge and the sun
  glow, plus correct seating on the (moving) water.
- **Real Projects/About destinations** — the plane banners currently point
  Projects -> GitHub and About -> `#about` placeholder.
- **Phase 2 project billboards** — link to project pages/repos (hybrid:
  redirect for full projects, in-scene for light CTAs).
- **Day/night cycle** — slowly interpolate sky colors over time.
- **Mobile pass** — currently desktop-first; design simplified/scaled small
  screens and verify touch targets (incl. the easter-egg tap label).
- **Performance** — pause the rAF loop and traffic spawns on
  `visibilitychange` when the tab is hidden.
- **Accessibility** — contrast audit of the palette; ensure all CTAs are
  keyboard reachable.
