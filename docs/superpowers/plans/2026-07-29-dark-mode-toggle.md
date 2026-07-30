# Dark Mode Theme + Sun/Moon Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dark mode theme (DESIGN.md's unimplemented "Silhouette Theatre City" amber palette) toggled by a clickable sun in the scene that animates into a moon, with the choice persisted across visits.

**Architecture:** Every color in the codebase is already consumed via CSS custom properties. Dark mode is a second `:root[data-theme="dark"]` override block in `globals.css` for those same variable names, flipped by a `data-theme` attribute on `<html>`. A new `SunMoonToggle` button (self-contained, no shared context needed — it's the only consumer of theme state) reads/writes that attribute plus `localStorage`. An inline anti-FOUC script in the root layout applies the persisted value before hydration.

**Tech Stack:** Next.js App Router, React, CSS Modules — no new dependencies.

## Global Constraints

- No test suite exists in this repo (confirmed via CLAUDE.md); `npm run lint` and `npm run build` are the correctness gate for every task. Interactive/visual behavior is verified manually via the dev server and the `playwright-cli` skill, not automated tests.
- Light mode must remain pixel-identical to today's site — every dark value is an _override_, never a change to an existing light value.
- No cool hues (blue/teal/cyan/magenta) may appear anywhere once `data-theme="dark"` is active.
- Theme choice persists via `localStorage` key `"theme"`; visitors with no stored value default to light.
- Respect `prefers-reduced-motion: reduce` — theme still changes, but with zero animation (no icon transform, no color cross-fade).
- The toggle is a real, keyboard-operable `<button>` with a dynamic `aria-label`, sized to the site's existing `--touch-min` (44px) convention.
- No new npm dependencies — hand-rolled state, matching the existing `OverlayProvider` pattern already in this codebase.

---

### Task 1: Dark-mode color tokens in `globals.css`

**Files:**

- Modify: `src/app/globals.css:4-77` (the `:root` block)

**Interfaces:**

- Produces: dark-mode values for `--sky-top`, `--sky-mid`, `--sky-horizon`, `--water`, `--water-deep`, `--foreground-sand`, `--building-far`, `--building-mid`, `--building-shadow`, `--window-glow`, `--neon-accent`, `--neon-secondary`, `--neon-cyan`, `--gold`, `--text-light`, `--text-muted`, `--glass-border`, `--glass-bg`, `--glass-nav-bg`. New RGB-tuple tokens (light + dark): `--deep-tint-rgb`, `--neon-accent-rgb`, `--neon-secondary-rgb`, `--neon-cyan-rgb` — for Task 4 to consume via `rgb(var(--x-rgb) / alpha)`.

- [ ] **Step 1: Add RGB-tuple companion tokens to the existing (light) `:root` block**

In `src/app/globals.css`, find:

```css
--neon-accent: #ffd166;
--neon-secondary: #ef476f;
--neon-cyan: #06d6a0;

--gold: #ffcf5c;
```

Replace with:

```css
--neon-accent: #ffd166;
--neon-secondary: #ef476f;
--neon-cyan: #06d6a0;

--deep-tint-rgb: 13, 59, 102;
--neon-accent-rgb: 255, 209, 102;
--neon-secondary-rgb: 239, 71, 111;
--neon-cyan-rgb: 6, 214, 160;

--gold: #ffcf5c;
```

- [ ] **Step 2: Add the dark-mode override block right after the light `:root` block closes**

Immediately after the closing `}` of `:root { ... }` (right before `html { height: 100%; }`), add:

```css
/*
 * Silhouette Theatre dark mode — mapped from DESIGN.md's amber/near-black
 * backlit-theatre palette. Same variable names as the light palette above;
 * only the values change, so every component that already consumes these
 * tokens re-themes automatically.
 */
:root[data-theme="dark"] {
  --sky-top: #e8c98f;
  --sky-mid: #eba85c;
  --sky-horizon: #d9622c;
  --water: #4a3626;
  --water-deep: #1f150d;
  --foreground-sand: #f0dbb0;
  --building-far: #6b5540;
  --building-mid: #3a2a1c;
  --building-shadow: #14100a;
  --window-glow: #f7dfa0;

  --neon-accent: #eab155;
  --neon-secondary: #b8452e;
  --neon-cyan: #f0dbb0;

  --deep-tint-rgb: 20, 16, 10;
  --neon-accent-rgb: 234, 177, 85;
  --neon-secondary-rgb: 184, 69, 46;
  --neon-cyan-rgb: 240, 219, 176;

  --gold: #eab155;

  --text-light: #f3e8d2;
  --text-muted: #b8a58c;

  --glass-border: rgba(234, 177, 85, 0.32);
  --glass-bg: linear-gradient(
    165deg,
    rgba(20, 16, 10, 0.78),
    rgba(58, 42, 28, 0.5)
  );
  --glass-nav-bg: linear-gradient(
    180deg,
    rgba(20, 16, 10, 0.92),
    rgba(58, 42, 28, 0.8)
  );
}
```

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: succeeds (this is a CSS-only change; build mainly confirms no syntax errors broke anything).

- [ ] **Step 5: Manual visual check (temporary attribute, no UI yet)**

Start the dev server (`npm run dev`), open the site with the `playwright-cli` skill, and run:

```
eval "() => { document.documentElement.dataset.theme = 'dark'; }"
```

Screenshot and confirm: sky gradient shifts from blue to pale-gold-to-orange, buildings shift toward near-black, window/billboard glow shifts from `#ffd27a`-family gold to `#f7dfa0`-family pale gold, nav/overlay borders shift toward warm gold. Then run the same eval with `'light'` to confirm it reverts exactly to today's look. Close the browser.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "Add dark-mode color tokens mapped from DESIGN.md"
```

---

### Task 2: Anti-FOUC theme script in the root layout

**Files:**

- Modify: `src/app/layout.tsx`

**Interfaces:**

- Consumes: `localStorage` key `"theme"` (values `"light"` | `"dark"`, written by Task 3's toggle).
- Produces: `document.documentElement.dataset.theme` set to `"light"` or `"dark"` before React hydrates, on every page (not just the home page).

- [ ] **Step 1: Add the inline script to `<head>`**

Replace the `RootLayout` function body:

```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body>{children}</body>
    </html>
  );
}
```

with:

```tsx
const THEME_INIT_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem("theme");
    document.documentElement.dataset.theme = stored === "dark" ? "dark" : "light";
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Manual verification of no flash-of-wrong-theme**

With the dev server running, use `playwright-cli`:

```
open http://localhost:3000/
eval "() => { localStorage.setItem('theme', 'dark'); }"
reload
eval "() => document.documentElement.dataset.theme"
```

Expected: the eval returns `"dark"` immediately after reload (confirms the script ran before hydration). Screenshot immediately after reload and confirm the sky is already amber (not a blue flash caught mid-load). Then:

```
eval "() => { localStorage.removeItem('theme'); }"
reload
eval "() => document.documentElement.dataset.theme"
```

Expected: returns `"light"` (default for a visitor with no stored preference). Close the browser.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "Add anti-FOUC theme script to root layout"
```

---

### Task 3: `SunMoonToggle` component, wired into the scene

**Files:**

- Create: `src/components/city/SunMoonToggle.tsx`
- Create: `src/components/city/SunMoonToggle.module.css`
- Modify: `src/components/city/CityScene.tsx`
- Modify: `src/components/city/SkyLayer.tsx`

**Interfaces:**

- Consumes: `--window-glow`, `--building-shadow`, `--gold` (Task 1); `--nav-height`, `--safe-top`, `--safe-right`, `--touch-min` (pre-existing globals.css tokens).
- Produces: `export function SunMoonToggle(): JSX.Element` — a self-contained button with no props, reads/writes `document.documentElement.dataset.theme` and `localStorage["theme"]` directly. No context/provider needed elsewhere.

- [ ] **Step 1: Create the toggle component**

Create `src/components/city/SunMoonToggle.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import styles from "./SunMoonToggle.module.css";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

function readDomTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/**
 * Clickable sun that sets into a moon (and back) to switch the site between
 * light and dark mode. Owns its own theme state directly against the DOM —
 * nothing else in the app needs to reactively read the theme, since every
 * other consumer is pure CSS driven by the `data-theme` attribute.
 */
export function SunMoonToggle() {
  // Starts "light" to match the server-rendered markup; synced to the real
  // persisted value in the effect below, after hydration completes, so the
  // two renders never mismatch.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readDomTheme());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      <span className={styles.iconTrack} aria-hidden="true">
        <svg
          className={styles.sunIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg
          className={styles.moonIcon}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 3a9 9 0 1 0 0 18a7 7 0 0 1 0-18z" />
          <circle
            cx="10"
            cy="9.5"
            r="0.9"
            fill="var(--building-shadow)"
            opacity="0.4"
          />
          <circle
            cx="13.5"
            cy="13"
            r="0.6"
            fill="var(--building-shadow)"
            opacity="0.4"
          />
        </svg>
      </span>
    </button>
  );
}
```

- [ ] **Step 2: Create the toggle's stylesheet**

Create `src/components/city/SunMoonToggle.module.css`:

```css
.toggle {
  position: absolute;
  top: calc(var(--nav-height) + var(--safe-top) + 14px);
  right: calc(20px + var(--safe-right));
  z-index: 15;
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.12);
  cursor: pointer;
  overflow: hidden;
}

.toggle:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

.iconTrack {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}

.sunIcon,
.moonIcon {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 26px;
  height: 26px;
  color: var(--window-glow);
}

.sunIcon {
  transform: translateY(0);
  opacity: 1;
}

.moonIcon {
  transform: translateY(150%);
  opacity: 0;
}

:global([data-theme="dark"]) .sunIcon {
  transform: translateY(-150%);
  opacity: 0;
}

:global([data-theme="dark"]) .moonIcon {
  transform: translateY(0);
  opacity: 1;
}

@media (prefers-reduced-motion: no-preference) {
  .sunIcon,
  .moonIcon {
    transition:
      transform 0.5s ease,
      opacity 0.5s ease;
  }
}
```

- [ ] **Step 3: Render the toggle in `CityScene.tsx`**

In `src/components/city/CityScene.tsx`, add the import alongside the other city components:

```tsx
import { SkyLayer } from "./SkyLayer";
```

becomes:

```tsx
import { SkyLayer } from "./SkyLayer";
import { SunMoonToggle } from "./SunMoonToggle";
```

Then in the returned JSX, right after `<SkyLayer />`:

```tsx
    <div className={styles.scene}>
      <SkyLayer />

      <div className={styles.heroTitle} aria-hidden="true">
```

becomes:

```tsx
    <div className={styles.scene}>
      <SkyLayer />
      <SunMoonToggle />

      <div className={styles.heroTitle} aria-hidden="true">
```

- [ ] **Step 4: Remove the now-redundant decorative sun from `SkyLayer.tsx`**

Replace the full contents of `src/components/city/SkyLayer.tsx` with:

```tsx
/**
 * Static sky backdrop: dusk gradient and scattered stars. Uses CSS custom
 * properties so it recolors with the active theme. Does not parallax — it
 * sits behind every moving layer. The interactive sun/moon toggle lives in
 * its own component (SunMoonToggle), rendered on top of this layer.
 */
export function SkyLayer() {
  const stars = [
    [120, 60],
    [320, 110],
    [540, 70],
    [760, 140],
    [980, 90],
    [1180, 50],
    [1380, 130],
    [1560, 80],
    [1760, 120],
    [1880, 60],
    [220, 180],
    [680, 200],
    [1080, 170],
    [1500, 210],
  ];

  return (
    <svg
      className="skyLayer"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--sky-top)" }} />
          <stop offset="45%" style={{ stopColor: "var(--sky-mid)" }} />
          <stop offset="70%" style={{ stopColor: "var(--sky-horizon)" }} />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1920" height="760" fill="url(#skyGradient)" />

      <g style={{ fill: "var(--text-light)" }}>
        {stars.map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={i % 3 === 0 ? 2 : 1.3}
            opacity={0.85}
          />
        ))}
      </g>
    </svg>
  );
}
```

- [ ] **Step 5: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 6: Run build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 7: Manual interactive verification**

With the dev server running, use `playwright-cli`:

```
open http://localhost:3000/
eval "() => { localStorage.removeItem('theme'); }"
reload
screenshot
```

Confirm: the sun icon (not the old decorative circles) is visible top-right below the nav, today's light-mode colors are unchanged.

```
find "Switch to dark mode"
click <ref for the toggle button>
screenshot
eval "() => document.documentElement.dataset.theme"
```

Confirm: eval returns `"dark"`, the scene has recolored to warm amber/near-black, the moon icon is now showing (sun animated out). Then:

```
eval "() => localStorage.getItem('theme')"
reload
eval "() => document.documentElement.dataset.theme"
```

Confirm: both return `"dark"` (persisted across reload, no flash on load). Click the toggle again and confirm it reverts to light and the aria-label updates back to "Switch to dark mode". Close the browser.

- [ ] **Step 8: Commit**

```bash
git add src/components/city/SunMoonToggle.tsx src/components/city/SunMoonToggle.module.css src/components/city/CityScene.tsx src/components/city/SkyLayer.tsx
git commit -m "Add sun/moon theme toggle to the city scene"
```

---

### Task 4: Tokenize remaining hardcoded blue/cyan/rose literals

**Context:** A repo-wide grep found hardcoded `rgba()`/hex literals outside `globals.css` that bypass the CSS-variable system — these would keep showing the old coastal blue or cyan even after Task 1, since they never reference `var(--deep-tint-rgb)` etc. This task converts every one of those to reference the RGB-tuple tokens from Task 1, at the exact same alpha value already in use (so light mode is visually unchanged), using the `rgb(var(--x-rgb) / alpha)` syntax.

**Files:**

- Modify: `src/app/not-found.module.css`
- Modify: `src/components/nav/FixedNav.module.css`
- Modify: `src/components/projects/ProjectCardMedia.module.css`
- Modify: `src/components/projects/ProjectPreview.module.css`
- Modify: `src/components/overlays/OverlayShell.module.css`
- Modify: `src/components/city/Billboard.module.css`
- Modify: `src/components/city/PlaneLayer.module.css`

**Interfaces:**

- Consumes: `--deep-tint-rgb`, `--neon-accent-rgb`, `--neon-secondary-rgb`, `--neon-cyan-rgb` (Task 1).

- [ ] **Step 1: `not-found.module.css`**

Find:

```css
.secondary {
  color: var(--text-light);
  border: 2px solid rgba(255, 209, 102, 0.28);
  background: rgba(13, 59, 102, 0.45);
}
```

Replace with:

```css
.secondary {
  color: var(--text-light);
  border: 2px solid rgba(255, 209, 102, 0.28);
  background: rgb(var(--deep-tint-rgb) / 0.45);
}
```

- [ ] **Step 2: `FixedNav.module.css` — nav bar background**

Find:

```css
background: linear-gradient(
  180deg,
  rgba(13, 59, 102, 0.92),
  rgba(13, 59, 102, 0.55)
);
```

Replace with:

```css
background: linear-gradient(
  180deg,
  rgb(var(--deep-tint-rgb) / 0.92),
  rgb(var(--deep-tint-rgb) / 0.55)
);
```

- [ ] **Step 3: `FixedNav.module.css` — mobile menu backdrop and panel**

Find:

```css
.menuBackdrop {
  display: block;
  position: fixed;
  inset: 0;
  z-index: -1;
  background: rgba(13, 59, 102, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
```

Replace with:

```css
.menuBackdrop {
  display: block;
  position: fixed;
  inset: 0;
  z-index: -1;
  background: rgb(var(--deep-tint-rgb) / 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
```

Find:

```css
background: linear-gradient(
  180deg,
  rgba(13, 59, 102, 0.98),
  rgba(13, 59, 102, 0.92)
);
```

Replace with:

```css
background: linear-gradient(
  180deg,
  rgb(var(--deep-tint-rgb) / 0.98),
  rgb(var(--deep-tint-rgb) / 0.92)
);
```

- [ ] **Step 4: `ProjectCardMedia.module.css`**

Find:

```css
background: linear-gradient(
  165deg,
  rgba(13, 59, 102, 0.85),
  rgba(42, 157, 143, 0.55)
);
```

Replace with:

```css
background: linear-gradient(
  165deg,
  rgb(var(--deep-tint-rgb) / 0.85),
  rgb(var(--deep-tint-rgb) / 0.55)
);
```

(Both gradient stops collapse to the same tint token — the original second stop was the coastal teal `--water`-family color, which has no equivalent role in the dark palette; using the same deep-tint token for both stops keeps this a flat, theme-safe scrim behind the placeholder text instead of introducing a second color that would need its own dark mapping.)

- [ ] **Step 5: `ProjectPreview.module.css`**

Find:

```css
background: rgba(13, 59, 102, 0.88);
```

Replace with:

```css
background: rgb(var(--deep-tint-rgb) / 0.88);
```

- [ ] **Step 6: `OverlayShell.module.css` — backdrop**

Find:

```css
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(13, 59, 102, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
```

Replace with:

```css
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgb(var(--deep-tint-rgb) / 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
```

- [ ] **Step 7: `Billboard.module.css` — accent glow variants**

Find:

```css
/* Accent variants */
.lime {
  --accent: var(--neon-accent);
  --accent-glow: rgba(255, 209, 102, 0.45);
}

.coral {
  --accent: var(--neon-secondary);
  --accent-glow: rgba(239, 71, 111, 0.5);
}

.cyan {
  --accent: var(--neon-cyan);
  --accent-glow: rgba(6, 214, 160, 0.5);
}
```

Replace with:

```css
/* Accent variants */
.lime {
  --accent: var(--neon-accent);
  --accent-glow: rgb(var(--neon-accent-rgb) / 0.45);
}

.coral {
  --accent: var(--neon-secondary);
  --accent-glow: rgb(var(--neon-secondary-rgb) / 0.5);
}

.cyan {
  --accent: var(--neon-cyan);
  --accent-glow: rgb(var(--neon-cyan-rgb) / 0.5);
}
```

- [ ] **Step 8: `PlaneLayer.module.css` — accent glow variants**

Find:

```css
/* Accent variants */
.cyan {
  --accent: var(--neon-cyan);
  --accent-glow: rgba(6, 214, 160, 0.5);
}

.lime {
  --accent: var(--neon-accent);
  --accent-glow: rgba(255, 209, 102, 0.5);
}

.coral {
  --accent: var(--neon-secondary);
  --accent-glow: rgba(239, 71, 111, 0.5);
}
```

Replace with:

```css
/* Accent variants */
.cyan {
  --accent: var(--neon-cyan);
  --accent-glow: rgb(var(--neon-cyan-rgb) / 0.5);
}

.lime {
  --accent: var(--neon-accent);
  --accent-glow: rgb(var(--neon-accent-rgb) / 0.45);
}

.coral {
  --accent: var(--neon-secondary);
  --accent-glow: rgb(var(--neon-secondary-rgb) / 0.5);
}
```

- [ ] **Step 9: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 10: Run build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 11: Manual visual regression + dark-mode check**

With the dev server running, use `playwright-cli`:

```
open http://localhost:3000/
screenshot
```

Confirm light mode is pixel-equivalent to before this task (nav bar, billboards, plane banner unchanged).

```
eval "() => { document.documentElement.dataset.theme = 'dark'; }"
screenshot
```

Confirm: nav bar background is now warm/near-black (not blue), all billboard variants (cyan/lime/coral) show warm-toned glows with no teal/cyan tint, the plane's banner glow (scroll or wait for it to appear) is warm-toned. Then navigate to `#projects` and `#projects/<any-slug>` and screenshot — confirm project card placeholders and preview-frame overlays are warm-toned, not blue. Navigate to a nonexistent path (e.g. `/this-page-does-not-exist`) and screenshot the 404 page — confirm its secondary button background is warm-toned. Close the browser.

- [ ] **Step 12: Commit**

```bash
git add src/app/not-found.module.css src/components/nav/FixedNav.module.css src/components/projects/ProjectCardMedia.module.css src/components/projects/ProjectPreview.module.css src/components/overlays/OverlayShell.module.css src/components/city/Billboard.module.css src/components/city/PlaneLayer.module.css
git commit -m "Tokenize remaining hardcoded blue/cyan literals for dark mode"
```

---

### Task 5: Scoped cross-fade transitions + reduced-motion guard

**Files:**

- Modify: `src/app/globals.css`
- Modify: `src/components/city/CityScene.module.css`
- Modify: `src/components/overlays/OverlayShell.module.css`
- Modify: `src/components/nav/FixedNav.module.css`

**Interfaces:**

- Consumes: nothing new — purely adds `transition` declarations to selectors that already exist.

- [ ] **Step 1: `globals.css` — `body` background cross-fade**

Find:

```css
body {
  color: var(--foreground);
  background: var(--page-gradient);
  background-attachment: fixed;
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

Replace with:

```css
body {
  color: var(--foreground);
  background: var(--page-gradient);
  background-attachment: fixed;
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (prefers-reduced-motion: no-preference) {
  body {
    transition:
      background 0.5s ease,
      color 0.5s ease;
  }
}
```

- [ ] **Step 2: `CityScene.module.css` — scene background and SVG shape cross-fade**

Find the `.scene` rule:

```css
.scene {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    var(--sky-top),
    var(--sky-mid) 45%,
    var(--sky-horizon) 70%
  );
}
```

Add directly after it:

```css
@media (prefers-reduced-motion: no-preference) {
  .scene {
    transition: background 0.5s ease;
  }

  .scene svg rect,
  .scene svg circle,
  .scene svg ellipse,
  .scene svg path,
  .scene svg g,
  .scene svg pattern rect {
    transition:
      fill 0.5s ease,
      stroke 0.5s ease;
  }
}
```

(Scoped to `.scene` specifically — not a bare `*` selector — so this never touches unrelated SVG icons elsewhere on the page, like the nav's social icons or SkillIcons in the overlays.)

- [ ] **Step 3: `OverlayShell.module.css` — modal/backdrop cross-fade**

Find:

```css
.modal {
  position: relative;
  width: min(560px, 100%);
  max-height: min(85dvh, 720px);
  overflow-y: auto;
  padding: 28px 32px 32px;
  border-radius: 16px;
  border: 2px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 0 24px rgba(255, 209, 102, 0.2),
    0 24px 48px rgba(0, 0, 0, 0.45);
  color: var(--text-light);
}
```

Replace with:

```css
.modal {
  position: relative;
  width: min(560px, 100%);
  max-height: min(85dvh, 720px);
  overflow-y: auto;
  padding: 28px 32px 32px;
  border-radius: 16px;
  border: 2px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 0 24px rgba(255, 209, 102, 0.2),
    0 24px 48px rgba(0, 0, 0, 0.45);
  color: var(--text-light);
}

@media (prefers-reduced-motion: no-preference) {
  .modal,
  .barePanel,
  .backdrop {
    transition:
      background 0.5s ease,
      border-color 0.5s ease,
      color 0.5s ease;
  }
}
```

- [ ] **Step 4: `FixedNav.module.css` — nav bar cross-fade**

Find:

```css
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 28px;
  padding-right: calc(28px + var(--safe-right));
  padding-left: calc(28px + var(--safe-left));
  min-height: var(--nav-height);
  background: linear-gradient(
    180deg,
    rgb(var(--deep-tint-rgb) / 0.92),
    rgb(var(--deep-tint-rgb) / 0.55)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 209, 102, 0.12);
}
```

Replace with:

```css
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 28px;
  padding-right: calc(28px + var(--safe-right));
  padding-left: calc(28px + var(--safe-left));
  min-height: var(--nav-height);
  background: linear-gradient(
    180deg,
    rgb(var(--deep-tint-rgb) / 0.92),
    rgb(var(--deep-tint-rgb) / 0.55)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 209, 102, 0.12);
}

@media (prefers-reduced-motion: no-preference) {
  .bar {
    transition:
      background 0.5s ease,
      border-color 0.5s ease;
  }
}
```

- [ ] **Step 5: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 6: Run build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 7: Manual verification of the cross-fade and reduced-motion guard**

With the dev server running, use `playwright-cli`:

```
open http://localhost:3000/
click <ref for the sun/moon toggle>
screenshot
```

Take the screenshot immediately (within ~200ms of the click) and confirm it shows an in-between, partially-blended state (not the old colors, not yet the fully-settled new colors) — evidence the transition is animating rather than snapping.

```
run-code "async page => await page.emulateMedia({ reducedMotion: 'reduce' })"
eval "() => { document.documentElement.dataset.theme = 'light'; }"
click <ref for the sun/moon toggle>
screenshot
```

Confirm this screenshot shows the _fully-settled_ dark state immediately (no partial/blended frame), confirming reduced motion produces an instant swap. Close the browser.

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css src/components/city/CityScene.module.css src/components/overlays/OverlayShell.module.css src/components/nav/FixedNav.module.css
git commit -m "Add scoped color cross-fade transitions for theme toggling"
```

---

### Task 6: Final end-to-end verification

**Files:** none (verification only).

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Full interactive walkthrough with `playwright-cli`**

```
open http://localhost:3000/
eval "() => { localStorage.removeItem('theme'); }"
reload
```

Confirm light mode, unchanged from today's site.

```
find "Switch to dark mode"
click <ref>
screenshot
```

Confirm dark mode applied, icon now shows the moon, aria-label now reads "Switch to light mode". Navigate through each overlay while dark mode is active and screenshot each:

```
goto http://localhost:3000/#about
goto http://localhost:3000/#projects
goto http://localhost:3000/#projects/<any real slug from src/data/projects.ts>
goto http://localhost:3000/#experience
```

Confirm all four panels are warm-toned (no leftover blue/teal), consistent with each other and with the scene.

- [ ] **Step 4: Keyboard operability check**

```
goto http://localhost:3000/
press Tab
```

Repeat `press Tab` until the sun/moon toggle receives focus (snapshot after each to confirm), then:

```
press Enter
eval "() => document.documentElement.dataset.theme"
```

Confirm the theme flips via keyboard activation alone, and a visible focus ring (gold outline) was present on the button in the snapshot.

- [ ] **Step 5: Mobile viewport check**

```
resize 390 844
reload
screenshot
```

Confirm the toggle button doesn't overlap the nav bar or the hero title at this width.

- [ ] **Step 6: Persistence check**

```
resize 1280 800
click <ref for toggle, ensure it ends on dark>
eval "() => localStorage.getItem('theme')"
close
```

Then reopen fresh:

```
open http://localhost:3000/
eval "() => document.documentElement.dataset.theme"
```

Confirm it returns `"dark"` — the choice survived closing and reopening the browser. Toggle back to light before finishing, to leave the dev environment in its default state. Close the browser.

- [ ] **Step 7: Report done**

No commit for this task (verification only) — if any step above surfaces a problem, fix it as part of whichever earlier task owns the affected file, re-run that task's own lint/build/verification, and re-run this task's steps from the top.
