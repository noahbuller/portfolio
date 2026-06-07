export type CarType = "sedan" | "compact" | "van";

interface CarProps {
  type?: CarType;
  color?: string;
  /** The white-sedan easter egg: gold accents, crown, and an "NB" plate. */
  special?: boolean;
}

const DIMS: Record<CarType, { w: number; h: number }> = {
  sedan: { w: 150, h: 64 },
  compact: { w: 120, h: 62 },
  van: { w: 172, h: 72 },
};

/**
 * A small vehicle sprite used by the traffic system. `type` selects the
 * silhouette, `color` paints the body. `special` marks the rare white sedan
 * easter egg (the developer's ride): white body, gold trim + underglow, a
 * little crown, and an "NB" plate.
 */
export function Car({ type = "sedan", color = "#ef476f", special = false }: CarProps) {
  const body = special ? "#f7f9fb" : color;
  const dim = DIMS[type];

  return (
    <svg
      width={dim.w}
      height={dim.h}
      viewBox={`0 0 ${dim.w} ${dim.h}`}
      aria-hidden="true"
      style={{ display: "block", overflow: "visible" }}
    >
      {special && (
        <ellipse cx={dim.w / 2} cy={dim.h - 4} rx={dim.w / 2} ry="7" fill="var(--gold)" opacity="0.45">
          <animate attributeName="opacity" values="0.25;0.55;0.25" dur="1.8s" repeatCount="indefinite" />
        </ellipse>
      )}

      {type === "sedan" && <Sedan body={body} special={special} />}
      {type === "compact" && <Compact body={body} />}
      {type === "van" && <Van body={body} />}
    </svg>
  );
}

function Sedan({ body, special }: { body: string; special: boolean }) {
  const glass = "#7fb4c4";
  const trim = special ? "var(--gold)" : "rgba(0,0,0,0.18)";
  return (
    <g>
      <ellipse cx="75" cy="58" rx="64" ry="6" fill="rgba(0,0,0,0.22)" />
      <path d="M40 30 L54 12 Q57 9 62 9 L96 9 Q101 9 105 13 L118 30 Z" fill={body} />
      <rect x="8" y="28" width="134" height="22" rx="9" fill={body} />
      <rect x="8" y="40" width="134" height="10" rx="5" fill="rgba(0,0,0,0.14)" />
      <path d="M48 28 L58 15 L73 15 L73 28 Z" fill={glass} opacity="0.85" />
      <path d="M78 28 L78 15 L95 15 Q99 15 102 19 L110 28 Z" fill={glass} opacity="0.85" />
      <rect x="6" y="26" width="138" height="2" rx="1" fill={trim} />
      <rect x="136" y="32" width="6" height="7" rx="2" fill="#ffe2a8" />
      <rect x="8" y="32" width="5" height="7" rx="2" fill="#ef476f" />
      <circle cx="40" cy="50" r="11" fill="#1c2227" />
      <circle cx="40" cy="50" r="4.5" fill="#9aa3aa" />
      <circle cx="110" cy="50" r="11" fill="#1c2227" />
      <circle cx="110" cy="50" r="4.5" fill="#9aa3aa" />

      {special && (
        <>
          {/* crown */}
          <g transform="translate(67 -8)">
            <path d="M0 10 L0 2 L4 6 L8 0 L12 6 L16 2 L16 10 Z" fill="var(--gold)" stroke="#caa030" strokeWidth="0.6" />
            <circle cx="8" cy="-0.5" r="1.4" fill="#fff3c4" />
          </g>
        </>
      )}
    </g>
  );
}

function Compact({ body }: { body: string }) {
  const glass = "#7fb4c4";
  return (
    <g>
      <ellipse cx="60" cy="56" rx="52" ry="6" fill="rgba(0,0,0,0.22)" />
      <path d="M28 28 L40 10 Q43 7 48 7 L78 7 Q83 7 86 11 L96 28 Z" fill={body} />
      <rect x="8" y="26" width="104" height="22" rx="10" fill={body} />
      <rect x="8" y="38" width="104" height="10" rx="5" fill="rgba(0,0,0,0.14)" />
      <path d="M38 26 L46 13 L62 13 L62 26 Z" fill={glass} opacity="0.85" />
      <path d="M67 26 L67 13 L80 13 Q84 13 87 17 L93 26 Z" fill={glass} opacity="0.85" />
      <rect x="106" y="30" width="6" height="7" rx="2" fill="#ffe2a8" />
      <circle cx="34" cy="48" r="10" fill="#1c2227" />
      <circle cx="34" cy="48" r="4" fill="#9aa3aa" />
      <circle cx="90" cy="48" r="10" fill="#1c2227" />
      <circle cx="90" cy="48" r="4" fill="#9aa3aa" />
    </g>
  );
}

function Van({ body }: { body: string }) {
  const glass = "#7fb4c4";
  return (
    <g>
      <ellipse cx="86" cy="64" rx="74" ry="6" fill="rgba(0,0,0,0.22)" />
      <path d="M30 30 L38 12 Q40 9 45 9 L150 9 Q158 9 158 18 L158 30 Z" fill={body} />
      <rect x="8" y="28" width="156" height="28" rx="8" fill={body} />
      <rect x="8" y="46" width="156" height="10" rx="5" fill="rgba(0,0,0,0.14)" />
      <path d="M40 28 L46 14 L66 14 L66 28 Z" fill={glass} opacity="0.85" />
      <rect x="74" y="14" width="80" height="14" rx="2" fill={glass} opacity="0.7" />
      <rect x="158" y="32" width="6" height="8" rx="2" fill="#ffe2a8" />
      <circle cx="44" cy="56" r="11" fill="#1c2227" />
      <circle cx="44" cy="56" r="4.5" fill="#9aa3aa" />
      <circle cx="132" cy="56" r="11" fill="#1c2227" />
      <circle cx="132" cy="56" r="4.5" fill="#9aa3aa" />
    </g>
  );
}
