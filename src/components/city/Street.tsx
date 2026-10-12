"use client";

import { useId } from "react";
import {
  FOREGROUND_TILE_WIDTH,
  getForegroundBuildings,
} from "@/data/cityBuildings";
import { BUILDING_SIDE_MARGIN, WINDOW_CELL_WIDTH } from "@/data/cityWindows";
import {
  CENTER_LINE_Y,
  CURB_HEIGHT,
  ROAD_HEIGHT,
  SIDEWALK_HEIGHT,
  STREET_ITEMS,
} from "@/data/street";

const TILE = FOREGROUND_TILE_WIDTH;
const BUILDINGS = getForegroundBuildings();

// Dash spacing is stretched to divide the tile exactly, so the center line
// has no seam where one foreground tile meets the next.
const DASH_COUNT = Math.round(TILE / 110);
const DASH_PITCH = TILE / DASH_COUNT;

// Window-column centers on the lit (shadow-tone) buildings, for the wet-road
// reflections under them.
const REFLECTION_XS = BUILDINGS.filter((b) => b.tone === "shadow").flatMap(
  (b) =>
    Array.from(
      { length: b.cols },
      (_, c) => b.x + BUILDING_SIDE_MARGIN + c * WINDOW_CELL_WIDTH + 17,
    ),
);

const SILHOUETTE = "var(--building-shadow)";
const LAMP_LIGHT = "var(--window-glow)";

/**
 * Sidewalk, curb, road and street furniture, drawn inside the foreground
 * tile SVG directly below the buildings (which stand on `ground`). Living in
 * the same tile means everything here scrolls at exactly the buildings'
 * speed — no separately animated center line to drift against them.
 */
export function Street({ ground }: { ground: number }) {
  const uid = `street${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const ids = {
    road: `${uid}-road`,
    pool: `${uid}-pool`,
    cone: `${uid}-cone`,
    reflection: `${uid}-refl`,
  };
  const walkTop = ground;
  const curbTop = walkTop + SIDEWALK_HEIGHT;
  const roadTop = curbTop + CURB_HEIGHT;

  return (
    <g>
      <defs>
        <linearGradient id={ids.road} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--road-top)" }} />
          <stop offset="1" style={{ stopColor: "var(--road-bottom)" }} />
        </linearGradient>
        <radialGradient id={ids.pool}>
          <stop
            offset="0"
            style={{ stopColor: LAMP_LIGHT, stopOpacity: 0.9 }}
          />
          <stop offset="1" style={{ stopColor: LAMP_LIGHT, stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id={ids.cone} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0"
            style={{ stopColor: LAMP_LIGHT, stopOpacity: 0.55 }}
          />
          <stop offset="1" style={{ stopColor: LAMP_LIGHT, stopOpacity: 0 }} />
        </linearGradient>
        <radialGradient id={ids.reflection}>
          <stop offset="0" style={{ stopColor: "var(--window-glow)" }} />
          <stop
            offset="1"
            style={{ stopColor: "var(--window-glow)", stopOpacity: 0 }}
          />
        </radialGradient>
      </defs>

      {/* Sidewalk with paving joints, then a lit curb edge and its face */}
      <rect
        x={0}
        y={walkTop}
        width={TILE}
        height={SIDEWALK_HEIGHT}
        style={{ fill: "var(--sidewalk)" }}
      />
      <rect
        x={0}
        y={walkTop}
        width={TILE}
        height={1.5}
        fill="rgba(0,0,0,0.35)"
      />
      {Array.from({ length: Math.round(TILE / 56) }, (_, k) => (
        <rect
          key={k}
          x={k * (TILE / Math.round(TILE / 56))}
          y={walkTop + 2}
          width={1}
          height={SIDEWALK_HEIGHT - 3}
          fill="rgba(0,0,0,0.18)"
        />
      ))}
      <rect
        x={0}
        y={curbTop}
        width={TILE}
        height={1.5}
        style={{ fill: "var(--curb)" }}
      />
      <rect
        x={0}
        y={curbTop + 1.5}
        width={TILE}
        height={CURB_HEIGHT - 1.5}
        style={{ fill: SILHOUETTE }}
      />

      {/* Road */}
      <rect
        x={0}
        y={roadTop}
        width={TILE}
        height={ROAD_HEIGHT}
        fill={`url(#${ids.road})`}
      />
      <g style={{ opacity: "var(--street-reflection-opacity)" }}>
        {REFLECTION_XS.map((x, i) => (
          <ellipse
            key={i}
            cx={x}
            cy={roadTop + 24}
            rx={7}
            ry={i % 3 === 0 ? 26 : 20}
            fill={`url(#${ids.reflection})`}
          />
        ))}
      </g>
      {Array.from({ length: DASH_COUNT }, (_, k) => (
        <rect
          key={k}
          x={k * DASH_PITCH}
          y={roadTop + CENTER_LINE_Y - 2}
          width={30}
          height={4}
          rx={1}
          fill="var(--window-glow)"
          opacity={0.32}
        />
      ))}

      {STREET_ITEMS.map((item, i) => {
        switch (item.kind) {
          case "crosswalk":
            return <Crosswalk key={i} x={item.x} top={roadTop} />;
          case "lamp":
            return (
              <Lamp
                key={i}
                x={item.x}
                base={curbTop}
                pool={ids.pool}
                cone={ids.cone}
              />
            );
          case "tree":
            return <Tree key={i} x={item.x} base={curbTop} />;
          case "hydrant":
            return <Hydrant key={i} x={item.x} base={curbTop} />;
          case "busStop":
            return <BusStop key={i} x={item.x} base={curbTop} />;
        }
      })}
    </g>
  );
}

/** Zebra stripes spanning the road, centered on x. */
function Crosswalk({ x, top }: { x: number; top: number }) {
  return (
    <g opacity={0.1}>
      {Array.from({ length: 6 }, (_, k) => (
        <rect
          key={k}
          x={x - 50 + k * 18}
          y={top + 4}
          width={10}
          height={ROAD_HEIGHT - 8}
          fill="var(--window-glow)"
        />
      ))}
    </g>
  );
}

/** Streetlamp standing on the sidewalk at `base`, light falling streetward. */
function Lamp({
  x,
  base,
  pool,
  cone,
}: {
  x: number;
  base: number;
  pool: string;
  cone: string;
}) {
  const top = base - 84;
  return (
    <g>
      <g style={{ opacity: "var(--street-light-opacity)" }}>
        <ellipse
          cx={x + 18}
          cy={base - 3}
          rx={44}
          ry={7}
          fill={`url(#${pool})`}
        />
        <polygon
          points={`${x + 22},${top + 10} ${x - 8},${base} ${x + 52},${base}`}
          fill={`url(#${cone})`}
        />
      </g>
      <g style={{ fill: SILHOUETTE }}>
        <rect x={x - 2} y={top} width={4} height={84} />
        <rect x={x - 5} y={base - 4} width={10} height={4} rx={1} />
        <rect x={x + 13} y={top - 6} width={18} height={7} rx={2} />
      </g>
      <path
        d={`M${x} ${top} Q${x} ${top - 6} ${x + 8} ${top - 6} L${x + 16} ${top - 6}`}
        fill="none"
        stroke={SILHOUETTE}
        strokeWidth={3}
      />
      <rect
        x={x + 15}
        y={top + 1}
        width={14}
        height={2.5}
        rx={1}
        fill={LAMP_LIGHT}
      />
    </g>
  );
}

function Tree({ x, base }: { x: number; base: number }) {
  return (
    <g>
      <rect
        x={x - 12}
        y={base - 9}
        width={24}
        height={9}
        rx={2}
        style={{ fill: "var(--curb)" }}
      />
      <rect
        x={x - 2}
        y={base - 38}
        width={4}
        height={30}
        style={{ fill: SILHOUETTE }}
      />
      <g style={{ fill: "var(--street-tree)" }}>
        <circle cx={x} cy={base - 50} r={16} />
        <circle cx={x - 11} cy={base - 40} r={11} />
        <circle cx={x + 12} cy={base - 42} r={12} />
      </g>
    </g>
  );
}

function Hydrant({ x, base }: { x: number; base: number }) {
  return (
    <g style={{ fill: "var(--car-1)" }}>
      <rect x={x - 5} y={base - 16} width={10} height={16} rx={3} />
      <rect x={x - 8} y={base - 11} width={16} height={4} rx={2} />
      <rect x={x - 6} y={base - 19} width={12} height={4} rx={2} />
    </g>
  );
}

/** Bus shelter (left edge at x) with a route sign post on its right. */
function BusStop({ x, base }: { x: number; base: number }) {
  return (
    <g>
      <rect
        x={x + 8}
        y={base - 50}
        width={80}
        height={36}
        style={{ fill: "var(--car-glass)" }}
        opacity={0.18}
      />
      <g style={{ fill: SILHOUETTE }}>
        <rect x={x} y={base - 56} width={96} height={6} rx={2} />
        <rect x={x + 4} y={base - 50} width={3} height={50} />
        <rect x={x + 89} y={base - 50} width={3} height={50} />
        <rect x={x + 16} y={base - 16} width={60} height={4} rx={1} />
        <rect x={x + 104} y={base - 66} width={3} height={66} />
      </g>
      <circle cx={x + 105.5} cy={base - 70} r={8} fill="var(--sign-gold)" />
      <rect
        x={x + 101}
        y={base - 71.5}
        width={9}
        height={3}
        rx={1}
        style={{ fill: SILHOUETTE }}
      />
    </g>
  );
}
