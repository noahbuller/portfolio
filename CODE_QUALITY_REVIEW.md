# Code Quality Review

> **Archived — 2026-06-09.** This document reflects an earlier dev snapshot. Many items below are resolved (nested anchors, reduced-motion hook, SVG IDs, CI, sub-pages, fonts). See `README.md` for current structure. Re-run `npm run lint && npm run build` before launch.

Review date: 2026-06-07

Scope: Next.js app structure, React runtime behavior, hydration risk, deploy readiness, and the city animation system. This review assumes the project is still in development and prioritizes launch-blocking issues over polish.

## Executive Summary

The app has a solid development-phase shape: a static server-rendered page, client-only animation layers for randomized motion, centralized CTA data, and direct DOM transforms for the continuous parallax loop. The production build currently succeeds.

The main risk is not compilation. It is React/HTML correctness around interactive elements and lint-gated deployment. The highest-priority fix is the social billboard, which nests anchor tags inside another anchor. The next priority is resolving React 19 lint failures caused by synchronous `setState` calls inside effects.

Checks run:

- `npm run lint`: fails with 2 `react-hooks/set-state-in-effect` errors.
- `npm run build`: passes; `/`, `/_not-found`, `/icon.svg`, and `/opengraph-image` prerender successfully.

## Ranked Findings

### 1. Invalid Nested Anchors In The Social Billboard

- Severity: High
- Time to fix: 1-2 hours
- Files: `src/components/city/CityScene.tsx`, `src/components/city/Billboard.tsx`
- Risk type: Hydration/runtime correctness, accessibility, click behavior

The social billboard passes child `<a>` elements into `Billboard`, while `Billboard` itself always renders its root as an `<a>`. That produces nested anchors. Browsers are allowed to normalize invalid interactive HTML in ways React did not render, which can cause hydration warnings, broken click targets, and inconsistent focus behavior.

Why it matters:

- This is the clearest potential hydration issue in the current code.
- It can make the duplicated parallax tile harder to reason about because the DOM the browser creates may differ from the React tree.
- It affects a primary CTA surface.

Recommended fix:

- Split `Billboard` into a presentational shell and explicit variants.
- Render a single-link billboard as one anchor.
- Render the social billboard as a non-anchor container with separate child links.
- Keep `decorative` behavior by applying `aria-hidden` and `tabIndex={-1}` to every interactive child in duplicate tiles.

### 2. Lint Fails On React 19 `set-state-in-effect`

- Severity: High
- Time to fix: 30-60 minutes
- Files: `src/components/city/Billboard.tsx`, `src/components/city/TrafficLayer.tsx`
- Risk type: Deployment gate, React performance guidance

`npm run lint` fails because two effects synchronously call state setters:

- `Billboard` calls `setInView(true)` when reduced motion is enabled.
- `TrafficLayer` calls `setReduce(true)` and `setCars(...)` when reduced motion is enabled.

The production build still passes, but many hosting pipelines run lint before or during deployment. If this repo uses that common gate, deployment will be blocked.

Recommended fix:

- For `Billboard`, initialize from a client-side motion preference hook or derive the reduced-motion class without a synchronous effect setter.
- For `TrafficLayer`, avoid storing `reduce` as separate state that is immediately set in an effect. Use a small `usePrefersReducedMotion` hook and derive parked cars from that value.
- If initial server/client consistency is important, have the hook default to `false` and update from a `matchMedia` listener after mount.

### 3. Reduced-Motion Preferences Are Only Read Once

- Severity: Medium
- Time to fix: 30-60 minutes
- Files: `src/hooks/useAutoScroll.ts`, `src/components/city/Billboard.tsx`, `src/components/city/TrafficLayer.tsx`, `src/components/city/PlaneLayer.tsx`
- Risk type: Accessibility, user preference handling

The app checks `prefers-reduced-motion` on mount but does not subscribe to changes. If a user changes the OS setting while the page is open, animations may keep running until reload.

Recommended fix:

- Add a shared `usePrefersReducedMotion` hook using `matchMedia`.
- Subscribe with `addEventListener("change", ...)`.
- Use the same hook across auto-scroll, traffic, plane spawning, and billboard entrance behavior.

### 4. Duplicate SVG Definition IDs In Repeated Parallax Tiles

- Severity: Medium
- Time to fix: 30-90 minutes
- Files: `src/components/city/ParallaxLayer.tsx`, `src/components/city/ForegroundLayer.tsx`
- Risk type: DOM validity, rendering robustness

`ParallaxLayer` renders each tile twice. `ForegroundLayer` contains SVG `<defs>` with fixed IDs (`fgWindows`, `fgWindowsDim`), so the page contains duplicate IDs when that layer is rendered as a parallax tile. Today the definitions are identical, so visual breakage is unlikely, but duplicate IDs are invalid HTML/SVG and can cause confusing behavior as the scene grows.

Recommended fix:

- Use React `useId()` or pass an `idPrefix` into tile renderers that define SVG IDs.
- Generate `url(#...)` references from that prefix.
- Apply this pattern before adding more SVG defs to duplicated layers.

### 5. Animation Timers Need Slightly Stronger Lifecycle Guards

- Severity: Medium
- Time to fix: 30-60 minutes
- Files: `src/components/city/PlaneLayer.tsx`, `src/components/city/TrafficLayer.tsx`
- Risk type: Development-mode Strict Mode noise, future maintainability

The spawn loops store timeout IDs and clear them on cleanup, which is generally good. In development Strict Mode, effects mount, clean up, and mount again. The current code should clear scheduled timers, but the timeout array can continue to receive IDs from callbacks until cleanup runs. The risk is low today, but a small active flag makes the loop easier to reason about as behavior grows.

Recommended fix:

- Add an `active` boolean inside each effect.
- In `spawn`, return early when inactive.
- Set `active = false` in cleanup before clearing pending timeouts.

### 6. Global Viewport Locking May Create Mobile Browser Edge Cases

- Severity: Medium
- Time to fix: 1-2 hours
- Files: `src/app/globals.css`, `src/app/page.module.css`, `src/components/city/CityScene.module.css`
- Risk type: Mobile viewport behavior, accessibility

The app locks `html`, `body`, and the page to `100vh` with hidden overflow. That fits the one-screen city concept, but mobile browser chrome can make `100vh` unstable. Hidden overflow also means any content added later outside the scene may become unreachable.

Recommended fix:

- Use modern viewport units such as `100dvh` for the fixed scene.
- Keep the body lock if the experience is intentionally single-screen, but document that constraint.
- Re-test on iOS Safari and Android Chrome before launch.

### 7. Placeholder/Unimplemented CTA Target

- Severity: Low
- Time to fix: 15-30 minutes
- Files: `src/data/ctas.ts`
- Risk type: User experience, launch polish

The aerial `About` CTA points to `#about`, but there is no visible `about` section in the current one-screen page. This is not a deployment blocker, but it creates a dead-feeling CTA.

Recommended fix:

- Replace with a real route/section before launch.
- Or remove it from `ctas.aerial` until that destination exists.

### 8. Accessibility Coverage Is Directionally Good But Needs A Pass Before Launch

- Severity: Low
- Time to fix: 1-2 hours
- Files: `src/components/city/*`, `src/components/nav/*`
- Risk type: Keyboard and screen reader quality

The app already has a screen-reader-only `<h1>`, decorative SVGs marked `aria-hidden`, and duplicate parallax tiles partially hidden from focus. The main remaining accessibility work is tied to the invalid nested anchors and ensuring all moving CTA surfaces remain reachable and understandable.

Recommended fix:

- After fixing billboard structure, keyboard-test all links.
- Verify duplicate parallax tiles do not add duplicate focus stops.
- Consider visible focus styles for any future interactive non-link elements.

## Step-by-Step Plan

### Step 1. Fix The Billboard Markup

Refactor `Billboard` so it can render either:

- A single anchor for normal CTAs.
- A non-anchor sign container for grouped children such as social links.

Acceptance criteria:

- No `<a>` exists inside another `<a>`.
- Social chips remain clickable in the primary tile.
- Decorative duplicate social chips are hidden from accessibility and removed from tab order.
- Billboard visual styling remains unchanged.

### Step 2. Add A Shared Reduced-Motion Hook

Create a client hook such as `usePrefersReducedMotion`.

Acceptance criteria:

- Defaults safely during SSR/hydration.
- Reads `window.matchMedia("(prefers-reduced-motion: reduce)")` after mount.
- Subscribes to preference changes.
- Cleans up listeners.

### Step 3. Remove Lint-Blocking Effect State Updates

Apply the reduced-motion hook to `Billboard` and `TrafficLayer`.

Acceptance criteria:

- `npm run lint` passes.
- Reduced-motion users still see a static composed scene.
- Non-reduced-motion users still get traffic, planes, parallax, and billboard entrance animations.

### Step 4. Harden Animation Loops

Add simple active guards to timeout-based spawning in `TrafficLayer` and `PlaneLayer`.

Acceptance criteria:

- Strict Mode development behavior does not leave duplicate spawn loops.
- Cleanup clearly cancels future scheduling.
- No functional visual regression.

### Step 5. Make Duplicated SVG IDs Unique

Prefix SVG defs used inside repeated parallax tiles.

Acceptance criteria:

- Repeated foreground tiles no longer duplicate `id` values.
- Pattern fills still render in both tile copies.
- The pattern can be reused for future SVG tile layers.

### Step 6. Verify Mobile Viewport Behavior

Replace or supplement `100vh` layout locks with `100dvh` where appropriate and test on mobile browsers.

Acceptance criteria:

- Scene fills the visible viewport on mobile.
- Fixed nav remains reachable.
- No unintended scroll traps or clipped links.

### Step 7. Final Launch Checks

Run the project checks and a small manual test pass.

Acceptance criteria:

- `npm run lint` passes.
- `npm run build` passes.
- Keyboard tab order reaches fixed nav links, active billboard links, and plane banner links.
- Browser console has no hydration warnings or invalid DOM nesting warnings.
- `prefers-reduced-motion` mode is verified.
