"use client";

import {
  GROUND,
  getForegroundBuildings,
  FOREGROUND_TILE_WIDTH,
} from "@/data/cityBuildings";
import {
  BUILDING_SIDE_MARGIN,
  buildingTopMargin,
  WINDOW_CELL_WIDTH,
  WINDOW_CELL_HEIGHT,
} from "@/data/cityWindows";
import styles from "./ForegroundLayer.module.css";

/**
 * Foreground street buildings with lit windows. Theme-aware via CSS custom
 * properties. Geometry is derived from src/data/cityBuildings.ts so
 * buildings are always contiguous across the tile and every window pattern
 * is anchored to its own building's corner (never a shared global origin),
 * so facades only ever contain whole windows, consistently aligned.
 *
 * Windows are rendered individually (not as a single tiled SVG pattern) so
 * each one can twinkle on its own gentle, staggered cycle — a shared
 * pattern rect can only ever be perfectly uniform.
 */

const BUILDINGS = getForegroundBuildings();

// Deterministic pseudo-random in [0, 1) — same output every render (server
// and client), so per-window animation timing never causes a hydration
// mismatch the way Math.random() would.
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function ForegroundLayer() {
  let windowSeed = 0;

  return (
    <svg
      width={FOREGROUND_TILE_WIDTH}
      height={GROUND}
      viewBox={`0 0 ${FOREGROUND_TILE_WIDTH} ${GROUND}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {BUILDINGS.map((b, i) => {
        const h = GROUND - b.top;
        const toneFill =
          b.tone === "shadow"
            ? "var(--building-shadow)"
            : "var(--building-mid)";
        const winOpacity = b.tone === "shadow" ? 0.85 : 0.35;
        const winClass =
          b.tone === "shadow" ? styles.windowShadow : styles.windowMid;
        const winX = b.x + BUILDING_SIDE_MARGIN;
        const winY = b.top + buildingTopMargin(b.rows);

        // Subtle per-building brightness/saturation jitter on top of the
        // two theme tones — applied as a filter (not a new hex color) so it
        // stays fully theme-aware instead of hardcoding a third palette.
        // Only the wall + roof accessories get it; windows stay a
        // consistent, punchy glow regardless of the wall's tint.
        const brightness = 0.9 + Math.round(pseudoRandom(i * 7.13) * 22) / 100;
        const saturate =
          0.85 + Math.round(pseudoRandom(i * 3.71 + 1) * 40) / 100;
        const buildingFilter = `brightness(${brightness}) saturate(${saturate})`;

        return (
          <g key={i}>
            <rect
              x={b.x}
              y={b.top}
              width={b.w}
              height={h}
              style={{ fill: toneFill, filter: buildingFilter }}
              stroke="rgba(6, 14, 20, 0.45)"
              strokeWidth={1.5}
            />
            {Array.from({ length: b.rows }, (_, row) =>
              Array.from({ length: b.cols }, (_, col) => {
                const seed = windowSeed++;
                // Rounded to 2dp: the browser re-serializes inline style
                // floats when parsing the server-rendered HTML (typically
                // to ~5-6 significant digits), which otherwise mismatches
                // React's full-precision client string and triggers a
                // hydration warning even though the underlying value never
                // actually changed.
                const delay = Math.round(pseudoRandom(seed) * 600) / 100;
                const duration =
                  3.5 + Math.round(pseudoRandom(seed + 0.37) * 350) / 100;
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={winX + col * WINDOW_CELL_WIDTH + 9}
                    y={winY + row * WINDOW_CELL_HEIGHT + 12}
                    width="16"
                    height="22"
                    rx="2"
                    fill="var(--window-glow)"
                    opacity={winOpacity}
                    className={winClass}
                    style={{
                      animationDelay: `${delay}s`,
                      animationDuration: `${duration}s`,
                    }}
                  />
                );
              }),
            )}
            {b.roof === "antenna" && (
              <rect
                x={b.x + b.w / 2 - 2}
                y={b.top - 34}
                width={4}
                height={34}
                style={{ fill: toneFill, filter: buildingFilter }}
              />
            )}
            {b.roof === "tank" && (
              <>
                <rect
                  x={b.x + b.w / 2 - 18}
                  y={b.top - 22}
                  width={36}
                  height={22}
                  rx={4}
                  style={{ fill: toneFill, filter: buildingFilter }}
                />
                {/* Aviation warning light — a sharp blink (not the gentle
                    twinkle/glow used elsewhere) reads as a distinct signal.
                    Lives on the tank buildings rather than the (taller)
                    antenna ones: the antenna buildings are exactly the two
                    with a billboard mounted on their roofline, which would
                    permanently cover a light placed there. */}
                <circle
                  cx={b.x + b.w / 2}
                  cy={b.top - 22}
                  r={2.6}
                  fill="var(--sign-rose)"
                  className={styles.aviationLight}
                />
              </>
            )}
            {b.roof === "hvac" && (
              <g style={{ fill: toneFill, filter: buildingFilter }}>
                <rect
                  x={b.x + b.w * 0.2 - 6}
                  y={b.top - 10}
                  width={12}
                  height={10}
                  rx={1}
                />
                <rect
                  x={b.x + b.w * 0.5 - 7}
                  y={b.top - 13}
                  width={14}
                  height={13}
                  rx={1}
                />
                <rect
                  x={b.x + b.w * 0.78 - 5}
                  y={b.top - 9}
                  width={10}
                  height={9}
                  rx={1}
                />
              </g>
            )}
            {b.roof === "shed" && (
              <rect
                x={b.x + b.w / 2 - 14}
                y={b.top - 18}
                width={28}
                height={18}
                style={{ fill: toneFill, filter: buildingFilter }}
              />
            )}
            {b.roof === "garden" && (
              <g>
                <rect
                  x={b.x + b.w * 0.15}
                  y={b.top - 7}
                  width={b.w * 0.7}
                  height={7}
                  style={{ fill: toneFill, filter: buildingFilter }}
                />
                <circle
                  cx={b.x + b.w * 0.27}
                  cy={b.top - 10}
                  r={4}
                  fill="var(--sign-pale)"
                  opacity={0.75}
                />
                <circle
                  cx={b.x + b.w * 0.5}
                  cy={b.top - 11}
                  r={3.5}
                  fill="var(--sign-pale)"
                  opacity={0.7}
                />
                <circle
                  cx={b.x + b.w * 0.7}
                  cy={b.top - 9}
                  r={4}
                  fill="var(--sign-pale)"
                  opacity={0.75}
                />
              </g>
            )}
          </g>
        );
      })}

      {/* Street */}
      <rect
        x="0"
        y={GROUND - 20}
        width={FOREGROUND_TILE_WIDTH}
        height="20"
        style={{ fill: "var(--building-shadow)" }}
      />
    </svg>
  );
}
