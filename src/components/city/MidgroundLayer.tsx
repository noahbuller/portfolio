import styles from "./MidgroundLayer.module.css";

/** y of the bay's waterline inside the midground tile. */
export const MIDGROUND_WATERLINE = 106;

/**
 * Midground: the bay between the far-shore skyline and the foreground
 * street, with a small boat that sails the full width of the tile.
 * Theme-aware via CSS custom properties. Tileable across 2000px.
 *
 * The area above the waterline is left empty so the skyline (anchored to
 * this waterline, see `.skyline` in CityScene.module.css) stands right on
 * the shore. Its reflection is a separate layer (SkylineReflection) because
 * it has to scroll at the skyline's speed, not this layer's.
 *
 * A bridge used to span the bay here — it read as "dropped in" with no
 * clear purpose even after a full rework (lit deck, towers, a train, a
 * lighthouse). That work is stashed (see `git stash list`) for possible
 * revival later; for now the water stands on its own.
 */
export function MidgroundLayer() {
  const hull = { fill: "var(--building-far)" };

  // A small boat that sails the full width of the tile — kept simple for
  // now (hull, mast, sail, one lit window) so it's easy to build on later.
  const boat = (
    <g className={styles.boat}>
      <ellipse
        cx="13"
        cy="192"
        rx="17"
        ry="3"
        fill="var(--water)"
        opacity="0.35"
      />
      <path d="M0,178 Q13,193 38,193 Q50,193 54,178 Z" style={hull} />
      <rect x="24" y="150" width="3.5" height="28" style={hull} />
      <path d="M27.5,152 L44,172 L27.5,172 Z" style={hull} opacity="0.7" />
      <circle cx="14" cy="185" r="2.2" fill="var(--window-glow)" />
    </g>
  );

  return (
    <svg
      width={2000}
      height={280}
      viewBox="0 0 2000 280"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <rect
        x="0"
        y={MIDGROUND_WATERLINE}
        width="2000"
        height={280 - MIDGROUND_WATERLINE}
        style={{ fill: "var(--water-deep)" }}
      />
      {boat}
    </svg>
  );
}
