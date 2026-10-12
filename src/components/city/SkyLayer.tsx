/**
 * Static sky backdrop: dusk gradient and scattered stars. Uses CSS custom
 * properties so it recolors with the active theme. Does not parallax — it
 * sits behind every moving layer. The interactive sun/moon toggle lives in
 * its own component (SunMoonToggle), rendered on top of this layer.
 */
export function SkyLayer() {
  // `preserveAspectRatio="xMidYMid slice"` crops horizontally on narrow
  // (portrait phone) viewports, leaving only roughly the central 700-1220
  // band of this 1920-wide viewBox visible. Half the stars sit inside that
  // band so the sky isn't nearly empty on mobile; the rest spread across
  // the full width for the wide-desktop view.
  const stars = [
    [760, 70],
    [840, 130],
    [900, 60],
    [960, 160],
    [1020, 90],
    [1080, 140],
    [1140, 70],
    [880, 190],
    [1020, 200],
    [120, 60],
    [320, 110],
    [1560, 80],
    [1760, 120],
    [1880, 60],
    [220, 180],
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
            style={{ opacity: "var(--star-opacity)" }}
          />
        ))}
      </g>
    </svg>
  );
}
