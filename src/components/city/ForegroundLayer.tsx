"use client";

import { useId } from "react";
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

/**
 * Foreground street buildings with lit windows. Theme-aware via CSS custom
 * properties. Geometry is derived from src/data/cityBuildings.ts so
 * buildings are always contiguous across the tile and every window pattern
 * is anchored to its own building's corner (never a shared global origin),
 * so facades only ever contain whole windows, consistently aligned.
 */

const BUILDINGS = getForegroundBuildings();

export function ForegroundLayer() {
  const uid = useId().replace(/:/g, "");
  const win = { fill: "var(--window-glow)" };

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
        const patternId = `${uid}-win-${i}`;
        const winX = b.x + BUILDING_SIDE_MARGIN;
        const winY = b.top + buildingTopMargin(b.rows);

        return (
          <g key={i}>
            <rect
              x={b.x}
              y={b.top}
              width={b.w}
              height={h}
              style={{ fill: toneFill }}
              stroke="rgba(6, 14, 20, 0.45)"
              strokeWidth={1.5}
            />
            <pattern
              id={patternId}
              x={winX}
              y={winY}
              width={WINDOW_CELL_WIDTH}
              height={WINDOW_CELL_HEIGHT}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="9"
                y="12"
                width="16"
                height="22"
                rx="2"
                style={win}
                opacity={winOpacity}
              />
            </pattern>
            <rect
              x={winX}
              y={winY}
              width={b.cols * WINDOW_CELL_WIDTH}
              height={b.rows * WINDOW_CELL_HEIGHT}
              fill={`url(#${patternId})`}
            />
            {b.roof === "antenna" && (
              <rect
                x={b.x + b.w / 2 - 2}
                y={b.top - 34}
                width={4}
                height={34}
                style={{ fill: toneFill }}
              />
            )}
            {b.roof === "tank" && (
              <rect
                x={b.x + b.w / 2 - 18}
                y={b.top - 22}
                width={36}
                height={22}
                rx={4}
                style={{ fill: toneFill }}
              />
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
