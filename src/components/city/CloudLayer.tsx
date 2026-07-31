/**
 * High, slow-drifting clouds spanning from the sky down behind the fixed
 * nav bar (visible through its glass blur) — the nav's own bit of theme
 * personality. Recolors per theme via --cloud-fill: soft white in coastal
 * light, warm amber-lit undersides in Silhouette Theatre. Tileable across
 * 1800px; registered at the slowest parallax speed in the scene so they
 * feel distant and unhurried.
 */
function Cloud({
  cx,
  cy,
  scale,
  opacity,
}: {
  cx: number;
  cy: number;
  scale: number;
  opacity: number;
}) {
  return (
    <g
      transform={`translate(${cx}, ${cy}) scale(${scale})`}
      style={{
        fill: "var(--cloud-fill)",
        opacity: `calc(${opacity} * var(--cloud-opacity-mult, 1))`,
      }}
    >
      <ellipse cx="-38" cy="6" rx="32" ry="18" />
      <ellipse cx="-8" cy="-8" rx="28" ry="22" />
      <ellipse cx="24" cy="4" rx="30" ry="16" />
      <ellipse cx="52" cy="8" rx="20" ry="13" />
    </g>
  );
}

export function CloudLayer() {
  return (
    <svg
      width={1800}
      height={260}
      viewBox="0 0 1800 260"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <Cloud cx={130} cy={70} scale={1.4} opacity={0.6} />
      <Cloud cx={480} cy={130} scale={1} opacity={0.45} />
      <Cloud cx={860} cy={55} scale={1.7} opacity={0.65} />
      <Cloud cx={1280} cy={105} scale={1.15} opacity={0.5} />
      <Cloud cx={1650} cy={65} scale={1.4} opacity={0.55} />
    </svg>
  );
}
