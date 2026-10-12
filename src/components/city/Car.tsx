import { useId } from "react";
import styles from "./Car.module.css";

export type VehicleKind =
  "sedan" | "compact" | "taxi" | "van" | "truck" | "bus" | "bike";

/**
 * Native sprite size. `h` is the tire line — every sprite's viewBox ends
 * exactly where its wheels meet the road, so callers can position a vehicle
 * by its lane's tire line alone. Shadows and light beams draw outside the
 * viewBox (overflow visible).
 */
export const VEHICLE_SIZE: Record<VehicleKind, { w: number; h: number }> = {
  sedan: { w: 150, h: 61 },
  compact: { w: 120, h: 58 },
  taxi: { w: 150, h: 61 },
  van: { w: 172, h: 67 },
  truck: { w: 225, h: 72 },
  bus: { w: 300, h: 82 },
  bike: { w: 84, h: 84 },
};

interface CarProps {
  kind: VehicleKind;
  color: string;
  scale: number;
  /** Seconds per wheel revolution, matched to road speed by the caller. */
  spinSeconds: number;
  /** Parked vehicles keep their tail glow but switch headlights off. */
  parked?: boolean;
}

/** Side-view vehicle sprite (facing right) used by the traffic system. */
export function Car({ kind, color, scale, spinSeconds, parked }: CarProps) {
  // useId's output contains characters (":", "«") that aren't safe inside
  // an SVG url(#…) reference.
  const id = `car${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const { w, h } = VEHICLE_SIZE[kind];
  const lights: LightIds = { beam: `${id}-beam`, tail: `${id}-tail` };

  return (
    <svg
      width={w * scale}
      height={h * scale}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      className={styles.car}
      data-parked={parked || undefined}
      style={{ "--spin": `${spinSeconds}s` } as React.CSSProperties}
    >
      <defs>
        <linearGradient id={lights.beam} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "var(--window-glow)" }} />
          <stop
            offset="1"
            style={{ stopColor: "var(--window-glow)", stopOpacity: 0 }}
          />
        </linearGradient>
        <radialGradient id={lights.tail}>
          <stop offset="0" style={{ stopColor: "var(--sign-rose)" }} />
          <stop
            offset="1"
            style={{ stopColor: "var(--sign-rose)", stopOpacity: 0 }}
          />
        </radialGradient>
      </defs>
      {kind === "sedan" && <Sedan body={color} lights={lights} />}
      {kind === "taxi" && <Sedan body="var(--car-taxi)" lights={lights} taxi />}
      {kind === "compact" && <Compact body={color} lights={lights} />}
      {kind === "van" && <Van body={color} lights={lights} />}
      {kind === "truck" && <Truck body={color} lights={lights} />}
      {kind === "bus" && <Bus body={color} lights={lights} />}
      {kind === "bike" && <Bike frame={color} lights={lights} />}
    </svg>
  );
}

interface LightIds {
  beam: string;
  tail: string;
}

const HEADLAMP = "var(--window-glow)";
const TAIL_LAMP = "var(--sign-rose)";
const GLASS = "var(--car-glass)";
const SHADOW = "rgba(0,0,0,0.26)";
const UNDERBODY = "rgba(0,0,0,0.16)";

/** Headlight cone ahead of (fx, fy) plus a soft tail-light glow at (rx, ry). */
function Lights({
  ids,
  fx,
  fy,
  rx,
  ry,
}: {
  ids: LightIds;
  fx: number;
  fy: number;
  rx: number;
  ry: number;
}) {
  return (
    <>
      <polygon
        className={styles.beam}
        points={`${fx},${fy - 3} ${fx + 110},${fy - 16} ${fx + 110},${fy + 20} ${fx},${fy + 4}`}
        fill={`url(#${ids.beam})`}
      />
      <circle
        className={styles.tail}
        cx={rx}
        cy={ry}
        r={10}
        fill={`url(#${ids.tail})`}
      />
    </>
  );
}

function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g className={styles.wheel}>
      <circle cx={cx} cy={cy} r={r} fill="var(--car-tire)" />
      <circle cx={cx} cy={cy} r={r * 0.42} fill="var(--car-hub)" />
      <rect
        x={cx - 0.9}
        y={cy - r * 0.8}
        width={1.8}
        height={r * 1.6}
        fill="var(--car-tire)"
        opacity={0.6}
      />
    </g>
  );
}

function Sedan({
  body,
  lights,
  taxi,
}: {
  body: string;
  lights: LightIds;
  taxi?: boolean;
}) {
  return (
    <>
      <Lights ids={lights} fx={142} fy={35} rx={9} ry={35} />
      <g className={styles.body}>
        <ellipse cx="75" cy="60" rx="64" ry="4" fill={SHADOW} />
        <path
          d="M40 30 L54 12 Q57 9 62 9 L96 9 Q101 9 105 13 L118 30 Z"
          fill={body}
        />
        <rect x="8" y="28" width="134" height="22" rx="9" fill={body} />
        <rect x="8" y="40" width="134" height="10" rx="5" fill={UNDERBODY} />
        <path d="M48 28 L58 15 L73 15 L73 28 Z" fill={GLASS} opacity="0.85" />
        <path
          d="M78 28 L78 15 L95 15 Q99 15 102 19 L110 28 Z"
          fill={GLASS}
          opacity="0.85"
        />
        {taxi && (
          <>
            <rect
              x="70"
              y="2"
              width="22"
              height="8"
              rx="2"
              fill="var(--sign-gold)"
            />
            <rect x="8" y="35" width="134" height="3" fill="rgba(0,0,0,0.3)" />
          </>
        )}
        <rect x="136" y="32" width="6" height="7" rx="2" fill={HEADLAMP} />
        <rect x="8" y="32" width="5" height="7" rx="2" fill={TAIL_LAMP} />
      </g>
      <Wheel cx={40} cy={50} r={11} />
      <Wheel cx={110} cy={50} r={11} />
    </>
  );
}

function Compact({ body, lights }: { body: string; lights: LightIds }) {
  return (
    <>
      <Lights ids={lights} fx={112} fy={33} rx={9} ry={33} />
      <g className={styles.body}>
        <ellipse cx="60" cy="57" rx="52" ry="4" fill={SHADOW} />
        <path
          d="M28 28 L40 10 Q43 7 48 7 L78 7 Q83 7 86 11 L96 28 Z"
          fill={body}
        />
        <rect x="8" y="26" width="104" height="22" rx="10" fill={body} />
        <rect x="8" y="38" width="104" height="10" rx="5" fill={UNDERBODY} />
        <path d="M38 26 L46 13 L62 13 L62 26 Z" fill={GLASS} opacity="0.85" />
        <path
          d="M67 26 L67 13 L80 13 Q84 13 87 17 L93 26 Z"
          fill={GLASS}
          opacity="0.85"
        />
        <rect x="106" y="30" width="6" height="7" rx="2" fill={HEADLAMP} />
        <rect x="8" y="30" width="5" height="7" rx="2" fill={TAIL_LAMP} />
      </g>
      <Wheel cx={34} cy={48} r={10} />
      <Wheel cx={90} cy={48} r={10} />
    </>
  );
}

function Van({ body, lights }: { body: string; lights: LightIds }) {
  return (
    <>
      <Lights ids={lights} fx={164} fy={36} rx={9} ry={36} />
      <g className={styles.body}>
        <ellipse cx="86" cy="66" rx="74" ry="4" fill={SHADOW} />
        <path
          d="M142 30 L134 12 Q132 9 127 9 L22 9 Q14 9 14 18 L14 30 Z"
          fill={body}
        />
        <rect x="8" y="28" width="156" height="28" rx="8" fill={body} />
        <rect x="8" y="46" width="156" height="10" rx="5" fill={UNDERBODY} />
        <path
          d="M132 28 L126 14 L106 14 L106 28 Z"
          fill={GLASS}
          opacity="0.85"
        />
        <rect
          x="18"
          y="14"
          width="80"
          height="14"
          rx="2"
          fill={GLASS}
          opacity="0.7"
        />
        <rect x="158" y="32" width="6" height="8" rx="2" fill={HEADLAMP} />
        <rect x="8" y="32" width="5" height="8" rx="2" fill={TAIL_LAMP} />
      </g>
      <Wheel cx={44} cy={56} r={11} />
      <Wheel cx={132} cy={56} r={11} />
    </>
  );
}

function Truck({ body, lights }: { body: string; lights: LightIds }) {
  return (
    <>
      <Lights ids={lights} fx={218} fy={50} rx={9} ry={46} />
      <g className={styles.body}>
        <ellipse cx="112" cy="71" rx="104" ry="4" fill={SHADOW} />
        <rect
          x="8"
          y="4"
          width="152"
          height="56"
          rx="4"
          fill="var(--car-steel)"
        />
        <rect x="8" y="50" width="152" height="10" rx="3" fill={UNDERBODY} />
        <rect
          x="22"
          y="22"
          width="124"
          height="18"
          rx="2"
          fill={body}
          opacity="0.9"
        />
        <path
          d="M164 24 L196 24 Q204 24 208 32 L218 46 L218 62 L164 62 Z"
          fill={body}
        />
        <path
          d="M172 29 L194 29 Q199 29 202 34 L208 44 L172 44 Z"
          fill={GLASS}
          opacity="0.85"
        />
        <rect x="160" y="52" width="58" height="10" rx="3" fill={UNDERBODY} />
        <rect x="213" y="48" width="6" height="7" rx="2" fill={HEADLAMP} />
        <rect x="8" y="44" width="5" height="8" rx="2" fill={TAIL_LAMP} />
      </g>
      <Wheel cx={44} cy={61} r={11} />
      <Wheel cx={122} cy={61} r={11} />
      <Wheel cx={190} cy={61} r={11} />
    </>
  );
}

function Bus({ body, lights }: { body: string; lights: LightIds }) {
  return (
    <>
      <Lights ids={lights} fx={292} fy={56} rx={9} ry={56} />
      <g className={styles.body}>
        <ellipse cx="150" cy="81" rx="138" ry="4" fill={SHADOW} />
        <rect x="8" y="6" width="284" height="64" rx="10" fill={body} />
        <rect x="8" y="56" width="284" height="14" rx="6" fill={UNDERBODY} />
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={i}
            x={38 + i * 28}
            y="16"
            width="22"
            height="20"
            rx="2"
            fill={GLASS}
            opacity="0.8"
          />
        ))}
        <rect
          x="266"
          y="14"
          width="22"
          height="34"
          rx="3"
          fill={GLASS}
          opacity="0.9"
        />
        <rect
          x="14"
          y="40"
          width="270"
          height="4"
          fill="var(--sign-gold)"
          opacity="0.85"
        />
        <rect
          x="262"
          y="8"
          width="26"
          height="6"
          rx="1"
          fill={HEADLAMP}
          opacity="0.9"
        />
        <rect x="286" y="54" width="6" height="8" rx="2" fill={HEADLAMP} />
        <rect x="8" y="54" width="5" height="8" rx="2" fill={TAIL_LAMP} />
      </g>
      <Wheel cx={62} cy={70} r={12} />
      <Wheel cx={236} cy={70} r={12} />
    </>
  );
}

function Bike({ frame, lights }: { frame: string; lights: LightIds }) {
  return (
    <>
      <polygon
        className={styles.beam}
        points="57,46 140,38 140,60 57,50"
        fill={`url(#${lights.beam})`}
      />
      <g className={styles.body}>
        <ellipse cx="41" cy="83" rx="36" ry="3" fill={SHADOW} />
        <path
          d="M16 70 L34 70 L52 52 L28 52 Z M34 70 L28 44 M52 52 L66 70 M50 46 L56 46"
          fill="none"
          stroke={frame}
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M38 56 L30 42 L46 24 M38 56 L34 70"
          fill="none"
          stroke="var(--car-3)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M46 26 L54 45"
          fill="none"
          stroke="var(--car-3)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="51" cy="18" r="6" fill="var(--car-3)" />
        <path d="M44 15 Q51 6 58 14 Z" fill={frame} />
        <circle cx="57" cy="48" r="2.5" fill={HEADLAMP} />
      </g>
      {[16, 66].map((cx) => (
        <g key={cx} className={styles.wheel}>
          <circle
            cx={cx}
            cy={70}
            r={13}
            fill="none"
            stroke="var(--car-tire)"
            strokeWidth="3"
          />
          <circle
            cx={cx}
            cy={70}
            r={13}
            fill="none"
            stroke="var(--car-hub)"
            strokeWidth="0.8"
            strokeDasharray="2 6"
          />
        </g>
      ))}
    </>
  );
}
