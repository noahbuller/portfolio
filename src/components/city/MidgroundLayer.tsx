"use client";

import { useId } from "react";

/** y of the bay's waterline inside the midground tile. */
export const MIDGROUND_WATERLINE = 106;

// Glints of light on the water: [x, y, width, opacity], deterministic so
// server and client render the same thing.
const GLINTS = Array.from({ length: 46 }, (_, i) => [
  (i * 173) % 2000,
  MIDGROUND_WATERLINE + 6 + ((i * 37) % 70),
  24 + ((i * 53) % 60),
  0.12 + ((i * 7) % 5) * 0.04,
]);

/**
 * Midground: the bay between the far-shore skyline and the foreground
 * street. The tug that crosses it is its own layer (TugLayer), so it isn't
 * duplicated by ParallaxLayer and can link to Contact.
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
  // Rendered twice by ParallaxLayer, so ids must be unique per instance.
  const gradientId = `water${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg
      width={2000}
      height={280}
      viewBox="0 0 2000 280"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        {/* Lighter toward the far shore, where the water catches the sky. */}
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={MIDGROUND_WATERLINE}
          x2="0"
          y2={MIDGROUND_WATERLINE + 95}
        >
          <stop offset="0" style={{ stopColor: "var(--water)" }} />
          <stop offset="1" style={{ stopColor: "var(--water-deep)" }} />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y={MIDGROUND_WATERLINE}
        width="2000"
        height={280 - MIDGROUND_WATERLINE}
        fill={`url(#${gradientId})`}
      />
      <g fill="var(--window-glow)">
        {GLINTS.map(([x, y, w, opacity], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={1.5}
            rx={0.75}
            opacity={Math.round(opacity * 100) / 100}
          />
        ))}
      </g>
    </svg>
  );
}
