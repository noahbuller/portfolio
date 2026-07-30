# Dark mode theme + sun/moon toggle

## Context

`DESIGN.md` documents a full redesign of the city scene ("Silhouette Theatre City" — a shadow-puppet/backlit-theatre look: warm amber sky, near-black silhouette buildings, cut-light windows and signs) that was never actually implemented in `globals.css`. The live site still uses the original "coastal" blue/teal/cyan palette. Rather than treat `DESIGN.md`'s palette as a replacement, we're implementing it as **dark mode**, toggled by a clickable sun in the scene that becomes a moon. Light mode stays exactly as the site looks today.

This mirrors a pattern already found once this session (`CLAUDE.md` describing a data-driven building system that didn't exist in code) — a design doc ahead of the implementation. Here we're closing that gap for real, gated behind a toggle instead of a blanket replacement, since the user explicitly wants both looks available.

## Scope

In scope: a light/dark theme system covering the entire page (city scene **and** overlay modals — About/Projects/Experience all re-theme too, since a modal that stayed blue while the city behind it went amber would look broken), persisted across visits, defaulting to light for new visitors, toggled by an accessible sun/moon button that visually "sets"/"rises" on click.

Out of scope: redesigning geometry, layout, typography, or copy — this is a color-token and toggle-mechanism change only. No changes to `Bebas Neue`/display-font adoption (`DESIGN.md`'s typography section) — that's a separate, unrelated follow-up not requested here.

## Color tokens

Every color in the codebase is already consumed as a CSS custom property (`var(--sky-top)`, `var(--window-glow)`, etc.), so dark mode is a second block of overrides for the _same variable names_, selected by `:root[data-theme="dark"]`. No component needs a color-related code change — they already reference these tokens.

| Variable                                                             | Light (today, unchanged)    | Dark (mapped from `DESIGN.md`)                                               |
| -------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------- |
| `--sky-top`                                                          | `#0d3b66`                   | `#e8c98f`                                                                    |
| `--sky-mid`                                                          | `#2a6f97`                   | `#eba85c`                                                                    |
| `--sky-horizon`                                                      | `#ffc59e`                   | `#d9622c`                                                                    |
| `--water`                                                            | `#2a9d8f`                   | `#4a3626`                                                                    |
| `--water-deep`                                                       | `#1d7a70`                   | `#1f150d`                                                                    |
| `--building-far`                                                     | `#3d5a73`                   | `#6b5540` (silhouette-far)                                                   |
| `--building-mid`                                                     | `#274156`                   | `#3a2a1c` (silhouette-mid)                                                   |
| `--building-shadow`                                                  | `#16303f`                   | `#14100a` (silhouette-near)                                                  |
| `--window-glow`                                                      | `#ffd27a`                   | `#f7dfa0` (aperture-glow)                                                    |
| `--neon-accent` (lime billboard variant, focus rings, hover accents) | `#ffd166`                   | `#eab155` (sign-gold)                                                        |
| `--neon-secondary` (coral billboard variant)                         | `#ef476f`                   | `#b8452e` (sign-rose)                                                        |
| `--neon-cyan` (cyan billboard variant, plane light)                  | `#06d6a0`                   | `#f0dbb0` (sign-pale — replaces the cool hue `DESIGN.md` explicitly forbids) |
| `--foreground-sand` (eyebrow/label accents, thin borders)            | `#f4d9a0`                   | `#f0dbb0` (sign-pale)                                                        |
| `--gold`                                                             | `#ffcf5c`                   | `#eab155` (sign-gold)                                                        |
| `--text-light`                                                       | `#f5f0e8`                   | `#f3e8d2`                                                                    |
| `--text-muted`                                                       | `#cfd8dd`                   | `#b8a58c`                                                                    |
| `--glass-border`                                                     | `rgba(255, 209, 102, 0.28)` | warm gold-tinted, e.g. `rgba(234, 177, 85, 0.32)`                            |
| `--glass-bg`                                                         | blue/teal gradient          | dark warm gradient derived from silhouette-near/mid                          |
| `--glass-nav-bg`                                                     | blue gradient               | dark warm gradient derived from silhouette-near/mid                          |

`--page-gradient` needs no explicit override — it's already defined as `linear-gradient(... var(--sky-top) ... var(--water-deep) ...)`, so it re-resolves automatically once the leaf tokens flip under `[data-theme="dark"]`.

Billboard variants (`lime`/`coral`/`cyan`), `Plane.tsx`'s accent dot, `PlaneLayer` variants, and every overlay's `--foreground-sand`/`--gold`/`--glass-*` usage all inherit the new colors with zero component edits, since they already read these variable names via `Billboard.module.css`'s `--accent: var(--neon-*)` indirection and similar.

## Architecture

**`ThemeProvider`** (`src/components/theme/ThemeProvider.tsx`, new): a hand-rolled React context following the same shape as the existing `OverlayProvider` — no new dependency. Holds `theme: "light" | "dark"` and exposes `toggleTheme()` via a `useTheme()` hook. On toggle: writes `document.documentElement.dataset.theme = theme` and `localStorage.setItem("theme", theme)`. Mounted inside `HomeShell.tsx`, wrapping the existing `OverlayProvider`.

**Anti-FOUC**: `src/app/layout.tsx` (currently a server component, unchanged otherwise) gets a small inline `<script>` in `<head>`, executed before hydration, that reads `localStorage.getItem("theme")` and sets `document.documentElement.dataset.theme` synchronously. Defaults to `"light"` when nothing is stored (new visitor). This is the standard approach for avoiding a flash of the wrong theme with a pure CSS-variable theme system (no new dependency needed for this either).

**`SunMoonToggle`** (`src/components/city/SunMoonToggle.tsx` + `.module.css`, new): a real `<button type="button" aria-label="Switch to dark mode" | "Switch to light mode">`, calling `toggleTheme()` from `useTheme()`. Sized to meet the site's existing `--touch-min` (44px) convention. Fixed within `.scene` at `top: calc(var(--nav-height) + var(--safe-top) + 14px); right: calc(20px + var(--safe-right))` — a consistent screen position independent of the parallax scroll (the layers scroll underneath it, it does not move), and clear of the nav bar and hero title at all breakpoints.

Rendered as a new layer in `CityScene.tsx`, alongside the existing fixed elements (`heroTitle`, `sunReflection`). `SkyLayer.tsx` loses its decorative sun `<circle>`s (kept: gradient + stars) since this button visually replaces the sun — the doc comment there gets updated to reflect that the sun is now interactive and lives in its own component.

## Toggle visuals & animation

Inside the button, two absolutely-positioned inline-SVG groups, `.sun` and `.moon`, share the warm palette only — the moon is a crescent (a shadow circle offset over a full circle, both filled from the same warm tokens) with a couple of small darker "crater" dots using `var(--building-shadow)`, never a cool gray/blue, preserving `DESIGN.md`'s one-light-source rule even in the icon itself. Both fill from `var(--window-glow)`, so they always match the currently-active theme's glow color without any extra logic.

A `data-theme`-scoped CSS rule handles the animated swap: at rest, the icon matching the _current_ theme sits centered; the other is translated out of view (translateY + opacity 0) above or below its resting position. On click, the sun translates down and fades out while the moon translates up and fades in (or the reverse) — motion and fade both scoped inside the button's own `overflow: hidden` bounds, so it reads as "sets / rises" without depending on real horizon geometry, and works identically at every viewport size. Duration ~500ms ease.

**Scene-wide cross-fade**: rather than an instant snap, scoped `transition: fill .5s ease, stroke .5s ease` on the city SVG layers' shapes (via a shared class — not a blanket `*` selector, to avoid touching unrelated keyframe animations like `roadDash`/`shimmer`/`drive`) and `transition: background .5s ease, border-color .5s ease, color .5s ease` on the overlay glass surfaces and nav bar, so the whole page warms into amber in sync with the icon.

**Reduced motion**: `usePrefersReducedMotion` (already used throughout this codebase for the parallax scroll, billboards, and traffic) disables both the icon's transform animation and the scene-wide cross-fade — the theme still changes, just instantly, consistent with how every other animated element in the scene already handles this preference.

## Persistence

- Toggling writes to `localStorage` under a single key (e.g. `"theme"`).
- New visitors (no stored value) get light mode — today's look, unchanged.
- Returning visitors get whatever they last chose, restored before hydration via the anti-FOUC script.

## Verification

- `npm run lint` / `npm run build` after implementation.
- Manual browser check: toggle from light → dark and back, confirming the icon animates, the scene and all four overlay panels (About/Projects/Project-detail/Experience) re-theme together, no cool hues (blue/teal/cyan/magenta) appear anywhere in dark mode, focus/hover states remain visible in both themes, and the choice survives a page reload.
- Confirm `prefers-reduced-motion` shows an instant (non-animated) theme swap.
- Confirm no flash of the wrong theme on reload when dark mode was previously selected.
