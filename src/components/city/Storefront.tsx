import type { Building } from "@/data/cityBuildings";
import { BUILDING_SIDE_MARGIN, WINDOW_CELL_HEIGHT } from "@/data/cityWindows";
import styles from "./ForegroundLayer.module.css";

const DOOR_W = 22;
const AWNING_DROP = 12;

/**
 * Ground-floor shopfront filling a building's bottom window row: a fascia,
 * a display window, a door with a lit transom, and optionally an awning or
 * a small neon sign. Display glass uses --car-glass, so it reads as glass by
 * day and glows amber at night.
 */
export function Storefront({ b, ground }: { b: Building; ground: number }) {
  if (!b.shop) return null;
  const top = ground - WINDOW_CELL_HEIGHT;
  const left = b.x + BUILDING_SIDE_MARGIN;
  const right = b.x + b.w - BUILDING_SIDE_MARGIN;
  const doorX = right - DOOR_W;
  const glassRight = doorX - 8;
  const glassTop = top + 16;
  const mid = (left + glassRight) / 2;

  return (
    <g>
      {/* Fascia */}
      <rect
        x={left - 4}
        y={top + 3}
        width={right - left + 8}
        height={8}
        fill="var(--building-shadow)"
        stroke="var(--curb)"
        strokeWidth={1}
      />
      {/* Display window with a center mullion */}
      <rect
        x={left}
        y={glassTop}
        width={glassRight - left}
        height={ground - glassTop - 2}
        rx={1.5}
        style={{
          fill: "var(--car-glass)",
          opacity: "var(--shop-glass-opacity)",
        }}
      />
      <rect
        x={mid - 1}
        y={glassTop}
        width={2}
        height={ground - glassTop - 2}
        fill="var(--building-shadow)"
      />
      {b.shop.neon && (
        <text
          x={left + 8}
          y={glassTop + 15}
          className={`${styles.neon} font-display`}
          fontSize={14}
          letterSpacing={1}
          fill="var(--sign-rose)"
        >
          OPEN
        </text>
      )}
      {/* Door with a lit transom */}
      <rect
        x={doorX}
        y={top + 18}
        width={DOOR_W}
        height={ground - top - 18}
        fill="var(--building-shadow)"
      />
      <rect
        x={doorX + 3}
        y={top + 21}
        width={DOOR_W - 6}
        height={5}
        fill="var(--window-glow)"
        opacity={0.8}
      />
      {b.shop.awning && (
        <Awning
          x0={left - 6}
          x1={doorX - 4}
          y={top + 11}
          color={b.shop.awning}
        />
      )}
    </g>
  );
}

/** Flat awning with a scalloped valance. */
function Awning({
  x0,
  x1,
  y,
  color,
}: {
  x0: number;
  x1: number;
  y: number;
  color: string;
}) {
  const start = x0 - 4;
  const end = x1 + 4;
  const count = Math.max(4, Math.round((end - start) / 14));
  const step = (end - start) / count;
  let d = `M${x0} ${y} L${x1} ${y} L${end} ${y + AWNING_DROP}`;
  for (let i = count; i > 0; i--) {
    d += ` Q${start + (i - 0.5) * step} ${y + AWNING_DROP + 6} ${start + (i - 1) * step} ${y + AWNING_DROP}`;
  }
  return (
    <>
      <path d={`${d} Z`} style={{ fill: color }} />
      <rect
        x={x0}
        y={y}
        width={x1 - x0}
        height={3}
        fill="rgba(0, 0, 0, 0.18)"
      />
    </>
  );
}
