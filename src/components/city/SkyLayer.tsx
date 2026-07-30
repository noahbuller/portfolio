/**
 * Static sky backdrop: dusk gradient and scattered stars. Uses CSS custom
 * properties so it recolors with the active theme. Does not parallax — it
 * sits behind every moving layer. The interactive sun/moon toggle lives in
 * its own component (SunMoonToggle), rendered on top of this layer.
 */
export function SkyLayer() {
  const stars = [
    [120, 60],
    [320, 110],
    [540, 70],
    [760, 140],
    [980, 90],
    [1180, 50],
    [1380, 130],
    [1560, 80],
    [1760, 120],
    [1880, 60],
    [220, 180],
    [680, 200],
    [1080, 170],
    [1500, 210],
  ];

  return (
    <svg
      className="skyLayer"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--sky-top)" }} />
          <stop offset="45%" style={{ stopColor: "var(--sky-mid)" }} />
          <stop offset="70%" style={{ stopColor: "var(--sky-horizon)" }} />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1920" height="760" fill="url(#skyGradient)" />

      <g style={{ fill: "var(--text-light)" }}>
        {stars.map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={i % 3 === 0 ? 2 : 1.3}
            opacity={0.85}
          />
        ))}
      </g>
    </svg>
  );
}
