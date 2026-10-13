import styles from "./Tug.module.css";

/** Sprite size in px. */
export const TUG_WIDTH = 110;
export const TUG_HEIGHT = 86;

/**
 * Harbor tug (bow pointing right) flying a pennant with `label` on it. The
 * pennant takes `--sign-rose` to match the Contact billboard. Drawn in local
 * coordinates around the hull's waterline (y = 9), viewBox crops to the sprite.
 */
export function Tug({ label }: { label: string }) {
  return (
    <svg
      className={styles.tug}
      width={TUG_WIDTH}
      height={TUG_HEIGHT}
      viewBox="-54 -72 110 86"
      aria-hidden="true"
    >
      {/* cabin lights pooled on the water */}
      <ellipse
        cx="0"
        cy="10"
        rx="50"
        ry="3.5"
        fill="var(--window-glow)"
        opacity="0.14"
      />
      {/* mast + pennant, streaming aft */}
      <line
        x1="6"
        y1="-44"
        x2="6"
        y2="-70"
        stroke="var(--building-shadow)"
        strokeWidth="1.6"
      />
      <path
        className={styles.pennant}
        d="M5,-70 L-52,-70 L-45,-63.5 L-52,-57 L5,-57 Z"
      />
      <text className={styles.label} x="-22" y="-59.4" textAnchor="middle">
        {label}
      </text>
      {/* funnel */}
      <rect
        x="-34"
        y="-36"
        width="9"
        height="28"
        fill="var(--building-shadow)"
      />
      <rect
        x="-34"
        y="-31"
        width="9"
        height="3"
        fill="var(--window-glow)"
        opacity="0.8"
      />
      {/* cabin + wheelhouse */}
      <rect
        x="-22"
        y="-26"
        width="40"
        height="18"
        rx="1.5"
        fill="var(--building-mid)"
      />
      <rect
        x="-12"
        y="-44"
        width="24"
        height="18"
        rx="1.5"
        fill="var(--building-mid)"
      />
      <rect
        x="-14"
        y="-46"
        width="28"
        height="2.5"
        fill="var(--building-shadow)"
      />
      <g fill="var(--window-glow)">
        <rect x="-9" y="-40" width="5" height="7" rx="0.8" />
        <rect x="-1" y="-40" width="5" height="7" rx="0.8" />
        <rect x="7" y="-40" width="5" height="7" rx="0.8" />
        <circle cx="-15" cy="-17" r="2.2" opacity="0.85" />
        <circle cx="-5" cy="-17" r="2.2" opacity="0.85" />
        <circle cx="7" cy="-17" r="2.2" opacity="0.85" />
      </g>
      {/* hull */}
      <path
        d="M-48,-9 L46,-9 Q54,-9 51,-3 L42,7 Q40,9 35,9 L-40,9 Q-45,9 -47,5 Z"
        fill="var(--building-shadow)"
      />
      <rect
        x="-48"
        y="-9"
        width="99"
        height="2"
        fill="var(--text-light)"
        opacity="0.5"
      />
      {/* tyre fenders */}
      <g fill="none" stroke="var(--building-mid)" strokeWidth="2">
        <circle cx="-30" cy="-1" r="3" />
        <circle cx="-6" cy="-1" r="3" />
        <circle cx="18" cy="-1" r="3" />
      </g>
    </svg>
  );
}
