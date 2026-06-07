/**
 * Midground: distant land, a simple cable bridge, and the water body.
 * Theme-aware via CSS custom properties. Tileable across 2000px.
 */
export function MidgroundLayer() {
  const land = { fill: "var(--water-deep)" };
  const bridge = { stroke: "var(--building-far)" };

  return (
    <svg
      width={2000}
      height={280}
      viewBox="0 0 2000 280"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <g style={land}>
        <path d="M0,90 Q120,60 260,82 Q400,100 560,80 L560,140 L0,140 Z" />
        <path d="M1180,86 Q1320,58 1480,80 Q1640,98 1820,78 Q1920,82 2000,90 L2000,140 L1180,140 Z" />
      </g>

      <rect x="620" y="96" width="520" height="10" style={{ fill: "var(--building-far)" }} />

      <g style={{ ...bridge, strokeWidth: 4, fill: "none" }}>
        <path d="M700,96 L740,40 L780,96" />
        <path d="M980,96 L1020,40 L1060,96" />
        <path d="M620,96 Q740,52 860,96" />
        <path d="M860,96 Q1020,52 1140,96" />
      </g>
      <g style={{ ...bridge, strokeWidth: 3 }}>
        <line x1="740" y1="40" x2="740" y2="96" />
        <line x1="1020" y1="40" x2="1020" y2="96" />
      </g>

      <rect x="0" y="106" width="2000" height="174" style={{ fill: "var(--water-deep)" }} />

      <g style={{ fill: "var(--water)" }} opacity={0.55}>
        <rect x="120" y="150" width="180" height="4" rx="2" />
        <rect x="520" y="190" width="240" height="4" rx="2" />
        <rect x="980" y="170" width="200" height="4" rx="2" />
        <rect x="1480" y="210" width="260" height="4" rx="2" />
        <rect x="1700" y="150" width="160" height="4" rx="2" />
      </g>
    </svg>
  );
}
