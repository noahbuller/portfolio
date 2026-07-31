/**
 * Distant skyline: simplified geometric silhouettes (rectangles, a stepped
 * tower, an arch) in the far-building color. Tileable across 1600px.
 * Scattered lit windows keep this the only layer that isn't fully dark —
 * previously the only flat/lightless surface in an otherwise lit scene.
 */

// Deterministic pseudo-random in [0, 1) — same output every render (server
// and client), so window placement never causes a hydration mismatch the
// way Math.random() would.
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function scatterWindows(
  x: number,
  y: number,
  w: number,
  h: number,
  count: number,
  seedBase: number,
) {
  return Array.from({ length: count }, (_, i) => {
    const seed = seedBase + i;
    const wx = Math.round(x + pseudoRandom(seed) * w);
    const wy = Math.round(y + pseudoRandom(seed + 0.31) * h);
    const opacity = 0.35 + Math.round(pseudoRandom(seed + 0.62) * 35) / 100;
    return (
      <rect
        key={i}
        x={wx}
        y={wy}
        width={3}
        height={5}
        fill="var(--window-glow)"
        opacity={opacity}
      />
    );
  });
}

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

      <g>
        {scatterWindows(12, 232, 96, 118, 5, 1)}
        {scatterWindows(150, 182, 70, 168, 6, 6)}
        {scatterWindows(260, 152, 100, 198, 6, 12)}
        {scatterWindows(400, 212, 90, 138, 5, 18)}
        {scatterWindows(528, 132, 54, 218, 7, 23)}
        {scatterWindows(620, 252, 110, 98, 5, 30)}
        {scatterWindows(768, 192, 64, 158, 4, 35)}
        {scatterWindows(870, 162, 80, 188, 6, 39)}
        {scatterWindows(990, 252, 80, 98, 4, 45)}
        {scatterWindows(1108, 212, 74, 138, 5, 49)}
        {scatterWindows(1218, 142, 104, 208, 7, 54)}
        {scatterWindows(1358, 222, 84, 128, 5, 61)}
        {scatterWindows(1480, 192, 100, 158, 6, 66)}
      </g>
    </svg>
  );
}
