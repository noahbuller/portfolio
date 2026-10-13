"use client";

import { useId } from "react";
import {
  FAR_TOWERS,
  SKYLINE_BUILDINGS,
  SKYLINE_HEIGHT,
  SKYLINE_TILE_WIDTH,
  SKYLINE_WATERLINE,
  SkylineBuilding,
} from "@/data/skyline";

const W = SKYLINE_TILE_WIDTH;
const H = SKYLINE_HEIGHT;

// Deterministic pseudo-random in [0, 1) — same output every render (server
// and client), so window placement never causes a hydration mismatch the
// way Math.random() would.
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

interface SkylineWindow {
  x: number;
  y: number;
  opacity: number;
}

const WINDOW_W = 4;
const WINDOW_H = 6;
const PITCH_X = 11;
const PITCH_Y = 15;
const LIT_SHARE = 0.27;

/**
 * Lit windows on a whole-cell grid across one face (x..x+w, top..bottom) —
 * the same no-partial-windows rule as the foreground facades. Only lit
 * windows are drawn; unlit ones are just the facade.
 */
function windowGrid(
  x: number,
  top: number,
  w: number,
  bottom: number,
  seed: number,
): SkylineWindow[] {
  const cols = Math.floor((w - 14 + (PITCH_X - WINDOW_W)) / PITCH_X);
  const left = x + (w - (cols * PITCH_X - (PITCH_X - WINDOW_W))) / 2;
  const out: SkylineWindow[] = [];
  let n = 0;
  for (let y = top + 10; y + WINDOW_H < bottom - 4; y += PITCH_Y) {
    for (let c = 0; c < cols; c++) {
      const r = pseudoRandom(seed * 97 + n++);
      if (r > LIT_SHARE) continue;
      out.push({
        x: Math.round((left + c * PITCH_X) * 10) / 10,
        y,
        opacity: Math.round((0.5 + pseudoRandom(n + seed) * 0.45) * 100) / 100,
      });
    }
  }
  return out;
}

/** [inset from each side, rise above `top`] for each tier, bottom first. */
const SETBACK_TIERS: [number, number][] = [
  [0, 0],
  [12, 40],
  [24, 72],
  [34, 96],
];
const STEPPED_TIERS: [number, number][] = [
  [0, 0],
  [14, 26],
  [28, 52],
  [42, 78],
];

function tiers(b: SkylineBuilding, steps: [number, number][], seed: number) {
  const shapes = steps.map(([inset, rise]) => (
    <rect
      key={rise}
      x={b.x + inset}
      y={b.top - rise}
      width={b.w - inset * 2}
      height={H - b.top + rise}
    />
  ));
  const windows = steps.flatMap(([inset, rise], k) =>
    windowGrid(
      b.x + inset,
      b.top - rise,
      b.w - inset * 2,
      k ? b.top - steps[k - 1][1] : SKYLINE_WATERLINE,
      seed + k * 7,
    ),
  );
  return { shapes, windows };
}

function roof(b: SkylineBuilding) {
  const cx = b.x + b.w / 2;
  switch (b.roof) {
    case "tank": {
      const tx = b.x + b.w * 0.68;
      return (
        <>
          <rect x={tx - 1} y={b.top - 9} width={2} height={9} />
          <rect x={tx + 11} y={b.top - 9} width={2} height={9} />
          <rect x={tx - 3} y={b.top - 24} width={18} height={16} rx={2} />
          <path
            d={`M${tx - 4} ${b.top - 24} L${tx + 6} ${b.top - 31} L${tx + 16} ${b.top - 24} Z`}
          />
        </>
      );
    }
    case "vents":
      return (
        <>
          <rect x={b.x + 10} y={b.top - 7} width={22} height={7} />
          <rect x={b.x + b.w - 30} y={b.top - 10} width={16} height={10} />
        </>
      );
    case "antenna":
      return (
        <>
          <rect x={cx - 1.5} y={b.top - 46} width={3} height={46} />
          <rect x={cx - 6} y={b.top - 10} width={12} height={10} />
        </>
      );
    default:
      return null;
  }
}

/** Silhouette shapes and lit windows for one building. */
function building(b: SkylineBuilding, i: number) {
  const seed = i + 3;
  const cx = b.x + b.w / 2;
  const body = <rect x={b.x} y={b.top} width={b.w} height={H - b.top} />;
  const faceWindows = () =>
    windowGrid(b.x, b.top, b.w, SKYLINE_WATERLINE, seed);

  switch (b.kind) {
    case "gable":
      return {
        shapes: (
          <>
            <polygon
              points={`${b.x},${H} ${b.x},${b.top} ${cx},${b.top - 40} ${b.x + b.w},${b.top} ${b.x + b.w},${H}`}
            />
            <rect x={cx - 1.5} y={b.top - 70} width={3} height={32} />
          </>
        ),
        windows: faceWindows(),
        extras: null,
      };
    case "dome":
      return {
        shapes: (
          <>
            {body}
            <rect x={b.x + 14} y={b.top - 18} width={b.w - 28} height={18} />
            <path
              d={`M${b.x + 10} ${b.top - 18} Q${cx} ${b.top - 76} ${b.x + b.w - 10} ${b.top - 18} Z`}
            />
          </>
        ),
        windows: faceWindows(),
        extras: null,
      };
    case "setback": {
      const t = tiers(b, SETBACK_TIERS, seed);
      const crown = b.top - SETBACK_TIERS[SETBACK_TIERS.length - 1][1];
      const inset = SETBACK_TIERS[SETBACK_TIERS.length - 1][0];
      return {
        shapes: (
          <>
            {t.shapes}
            <polygon
              points={`${b.x + inset},${crown} ${cx},${crown - 20} ${b.x + b.w - inset},${crown}`}
            />
            <rect x={cx - 1.5} y={crown - 44} width={3} height={26} />
          </>
        ),
        windows: t.windows,
        extras: null,
      };
    }
    case "stepped": {
      const t = tiers(b, STEPPED_TIERS, seed);
      return { shapes: <>{t.shapes}</>, windows: t.windows, extras: null };
    }
    case "clock":
      return {
        shapes: (
          <>
            {body}
            <polygon
              points={`${b.x - 4},${b.top} ${cx},${b.top - 52} ${b.x + b.w + 4},${b.top}`}
            />
            <rect x={cx - 1} y={b.top - 70} width={2} height={20} />
          </>
        ),
        windows: windowGrid(b.x, b.top + 50, b.w, SKYLINE_WATERLINE, seed),
        // Clock face: a lit dial with dark hands.
        extras: (
          <>
            <circle
              cx={cx}
              cy={b.top + 24}
              r={15}
              fill="var(--window-glow)"
              opacity={0.85}
            />
            <path
              d={`M${cx} ${b.top + 24} L${cx} ${b.top + 14} M${cx} ${b.top + 24} L${cx + 7} ${b.top + 27}`}
              stroke="var(--building-mid)"
              strokeWidth={2}
            />
          </>
        ),
      };
    default:
      return {
        shapes: (
          <>
            {body}
            {roof(b)}
          </>
        ),
        windows: faceWindows(),
        extras: null,
      };
  }
}

// Geometry never changes, so build it once rather than on every render.
const BUILT = SKYLINE_BUILDINGS.map(building);
const WINDOWS = BUILT.flatMap((b) => b.windows);

/**
 * The near skyline's buildings, windows and haze. Shared by the skyline
 * itself and its mirrored reflection in the bay.
 */
function SkylineArt({ hazeId }: { hazeId: string }) {
  return (
    <>
      <defs>
        {/* Atmospheric haze: buildings fade toward the horizon color near
            their base, so they sit in the air rather than on it. */}
        <linearGradient
          id={hazeId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="60"
          x2="0"
          y2={SKYLINE_WATERLINE}
        >
          <stop offset="0" style={{ stopColor: "var(--building-far)" }} />
          <stop offset="1" style={{ stopColor: "var(--skyline-haze)" }} />
        </linearGradient>
      </defs>
      <g fill={`url(#${hazeId})`}>
        {BUILT.map((b, i) => (
          <g key={i}>{b.shapes}</g>
        ))}
      </g>
      <g fill="var(--window-glow)">
        {WINDOWS.map((w, i) => (
          <rect
            key={i}
            x={w.x}
            y={w.y}
            width={WINDOW_W}
            height={WINDOW_H}
            opacity={w.opacity}
          />
        ))}
      </g>
      {BUILT.map((b, i) => b.extras && <g key={i}>{b.extras}</g>)}
    </>
  );
}

function svgId(prefix: string, raw: string) {
  return `${prefix}${raw.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

/**
 * The near skyline across the bay. Tileable across 1600px; its base sits
 * below the waterline and is hidden by the midground's water.
 */
export function SkylineLayer() {
  const hazeId = svgId("haze", useId());
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <SkylineArt hazeId={hazeId} />
    </svg>
  );
}

const REFLECTION_DEPTH = 150;

/**
 * The skyline mirrored about the waterline, laid over the bay. It scrolls on
 * its own layer at the skyline's speed and tile width, so it stays locked to
 * the buildings above it. Kept faint and fading with depth, so it reads as a
 * subtle reflection rather than a second city.
 */
export function SkylineReflection() {
  const uid = useId();
  const hazeId = svgId("rhaze", uid);
  const fadeId = svgId("rfade", uid);
  const maskId = svgId("rmask", uid);
  return (
    <svg
      width={W}
      height={REFLECTION_DEPTH}
      viewBox={`0 0 ${W} ${REFLECTION_DEPTH}`}
      aria-hidden="true"
      style={{ display: "block", opacity: "var(--skyline-reflection-opacity)" }}
    >
      <defs>
        <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={W}
          height={REFLECTION_DEPTH}
        >
          <rect width={W} height={REFLECTION_DEPTH} fill={`url(#${fadeId})`} />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <g transform={`translate(0, ${SKYLINE_WATERLINE}) scale(1, -1)`}>
          <SkylineArt hazeId={hazeId} />
        </g>
      </g>
    </svg>
  );
}

/**
 * Distant towers behind the near skyline, on their own slower parallax
 * layer. Windowless and hazed most of the way into the sky.
 */
export function FarSkylineLayer() {
  const gradId = svgId("far", useId());
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient
          id={gradId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="20"
          x2="0"
          y2={SKYLINE_WATERLINE}
        >
          <stop offset="0" style={{ stopColor: "var(--skyline-far-top)" }} />
          <stop offset="1" style={{ stopColor: "var(--skyline-far-bottom)" }} />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradId})`}>
        {FAR_TOWERS.map(([x, top, w, detail]) => (
          <g key={x}>
            <rect x={x} y={top} width={w} height={H - top} />
            {detail === "mast" && (
              <rect x={x + w / 2 - 1} y={top - 18} width={2} height={18} />
            )}
            {detail === "block" && (
              <rect x={x + 6} y={top - 14} width={w - 12} height={14} />
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}
