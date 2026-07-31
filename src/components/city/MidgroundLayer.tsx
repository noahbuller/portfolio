"use client";

import { useId } from "react";
import styles from "./MidgroundLayer.module.css";

/**
 * Midground: distant land and the water body, with a small boat that
 * sails the full width of the tile. Theme-aware via CSS custom properties.
 * Tileable across 2000px.
 *
 * A bridge used to span the gap between the two hills here — it read as
 * "dropped in" with no clear purpose even after a full rework (lit deck,
 * towers, a train, a lighthouse). That work is stashed (see `git stash
 * list`) for possible revival later; for now the water stands on its own.
 */
export function MidgroundLayer() {
  // ParallaxLayer renders this component twice at once (the seamless-loop
  // duplicate), so any hardcoded id="..." would collide across the two
  // <svg> instances and silently break url(#...) resolution.
  const uid = useId().replace(/:/g, "");
  const gradientId = `${uid}-reflection-fade`;
  const maskId = `${uid}-reflection-mask`;

  const land = { fill: "var(--water-deep)" };
  const tower = { fill: "var(--building-far)" };

  // Shared by the real hills and their mirrored reflection below the
  // waterline (y=106) so the two stay pixel-identical as the source shapes
  // change — a hand-authored mirror copy would drift out of sync silently.
  const hills = (
    <g style={land}>
      <path d="M0,90 Q120,60 260,82 Q400,100 560,106 L560,140 L0,140 Z" />
      <path d="M1180,106 Q1320,58 1480,80 Q1640,98 1820,78 Q1920,82 2000,90 L2000,140 L1180,140 Z" />
    </g>
  );

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
      <path d="M0,178 Q13,193 38,193 Q50,193 54,178 Z" style={tower} />
      <rect x="24" y="150" width="3.5" height="28" style={tower} />
      <path d="M27.5,152 L44,172 L27.5,172 Z" style={tower} opacity="0.7" />
      <circle cx="14" cy="185" r="2.2" fill="var(--window-glow)" />
    </g>
  );

  return (
    <svg
      width={2000}
      height={280}
      viewBox="0 0 2000 280"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        {/* Reflection fades out with depth — strongest right at the
            waterline, gone by the bottom of the water body. */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="106"
          width="2000"
          height="174"
        >
          <rect
            x="0"
            y="106"
            width="2000"
            height="174"
            fill={`url(#${gradientId})`}
          />
        </mask>
      </defs>

      {hills}

      <rect
        x="0"
        y="106"
        width="2000"
        height="174"
        style={{ fill: "var(--water-deep)" }}
      />

      {/* Mirror of the hills about the waterline (y=106), clipped and faded
          by reflectionMask so it only ever appears inside the water.
          Painted after the water rect so it isn't hidden underneath it. */}
      <g mask={`url(#${maskId})`}>
        <g className={styles.ripple} transform="translate(0, 212) scale(1, -1)">
          {hills}
        </g>
      </g>

      {boat}
    </svg>
  );
}
