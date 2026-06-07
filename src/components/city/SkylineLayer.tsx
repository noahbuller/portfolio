/**
 * Distant skyline: simplified geometric silhouettes (rectangles, a stepped
 * tower, an arch) in the far-building color. Tileable across 1600px.
 */
export function SkylineLayer() {
  return (
    <svg
      width={1600}
      height={360}
      viewBox="0 0 1600 360"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <g style={{ fill: "var(--building-far)" }}>
        <rect x="0" y="330" width="1600" height="30" />
        <rect x="0" y="220" width="120" height="140" />
        <rect x="140" y="170" width="90" height="190" />
        <polygon points="250,360 250,140 310,100 370,140 370,360" />
        <rect x="390" y="200" width="110" height="160" />
        <rect x="520" y="120" width="70" height="240" />
        <rect x="610" y="240" width="130" height="120" />
        <rect x="760" y="180" width="80" height="180" />
        <rect x="860" y="150" width="100" height="210" />
        <path d="M980,360 L980,240 Q1030,180 1080,240 L1080,360 Z" />
        <rect x="1100" y="200" width="90" height="160" />
        <rect x="1210" y="130" width="120" height="230" />
        <rect x="1350" y="210" width="100" height="150" />
        <polygon points="1470,360 1470,170 1530,130 1590,170 1590,360" />
      </g>
    </svg>
  );
}
