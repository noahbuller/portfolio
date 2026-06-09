"use client";

import { useId } from "react";

/**
 * Foreground street buildings with lit windows. Theme-aware via CSS custom
 * properties. Buildings are CONTIGUOUS across the full 2000px tile (no
 * see-through gaps at street level) and the strip tiles seamlessly.
 */

interface Building {
  x: number;
  w: number;
  top: number;
  tone: "shadow" | "mid";
  roof?: "antenna" | "tank";
}

// Contiguous: widths sum to exactly 2000.
const BUILDINGS: Building[] = [
  { x: 0, w: 160, top: 200, tone: "shadow" },
  { x: 160, w: 120, top: 320, tone: "mid" },
  { x: 280, w: 180, top: 150, tone: "shadow", roof: "antenna" },
  { x: 460, w: 130, top: 330, tone: "mid" },
  { x: 590, w: 160, top: 250, tone: "shadow" },
  { x: 750, w: 140, top: 320, tone: "mid", roof: "tank" },
  { x: 890, w: 200, top: 170, tone: "shadow", roof: "antenna" },
  { x: 1090, w: 120, top: 340, tone: "mid" },
  { x: 1210, w: 180, top: 240, tone: "shadow" },
  { x: 1390, w: 150, top: 300, tone: "mid" },
  { x: 1540, w: 170, top: 200, tone: "shadow", roof: "tank" },
  { x: 1710, w: 130, top: 330, tone: "mid" },
  { x: 1840, w: 160, top: 250, tone: "shadow" },
];

const GROUND = 540;

export function ForegroundLayer() {
  const uid = useId().replace(/:/g, "");
  const windowsId = `${uid}-fgWindows`;
  const windowsDimId = `${uid}-fgWindowsDim`;
  const win = { fill: "var(--window-glow)" };

  return (
    <svg
      width={2000}
      height={540}
      viewBox="0 0 2000 540"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <pattern
          id={windowsId}
          width="34"
          height="46"
          patternUnits="userSpaceOnUse"
        >
          <rect x="9" y="12" width="16" height="22" rx="2" style={win} opacity={0.85} />
        </pattern>
        <pattern
          id={windowsDimId}
          width="34"
          height="46"
          patternUnits="userSpaceOnUse"
        >
          <rect x="9" y="12" width="16" height="22" rx="2" style={win} opacity={0.35} />
        </pattern>
      </defs>

      {BUILDINGS.map((b, i) => {
        const h = GROUND - b.top;
        const toneFill =
          b.tone === "shadow"
            ? "var(--building-shadow)"
            : "var(--building-mid)";
        const winPattern =
          b.tone === "shadow" ? `url(#${windowsId})` : `url(#${windowsDimId})`;
        return (
          <g key={i}>
            <rect x={b.x} y={b.top} width={b.w} height={h} style={{ fill: toneFill }} />
            <rect
              x={b.x + 12}
              y={b.top + 18}
              width={b.w - 24}
              height={h - 18}
              fill={winPattern}
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
      <rect x="0" y="520" width="2000" height="20" style={{ fill: "var(--building-shadow)" }} />
    </svg>
  );
}
