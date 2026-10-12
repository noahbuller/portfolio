import styles from "./Plane.module.css";

/** Sprite size in px; the tow line attaches at the tail, PLANE_TAIL_Y down. */
export const PLANE_WIDTH = 116;
export const PLANE_HEIGHT = 46;

/**
 * High-wing banner-tow prop plane (nose pointing right). The towed banner is
 * rendered by PlaneLayer and attached at the tail. The fuselage stripe takes
 * the banner's `--accent` so each plane matches the cloth it pulls.
 */
export function Plane({ spinning = true }: { spinning?: boolean }) {
  return (
    <svg
      className={styles.plane}
      width={PLANE_WIDTH}
      height={PLANE_HEIGHT}
      viewBox={`0 0 ${PLANE_WIDTH} ${PLANE_HEIGHT}`}
      aria-hidden="true"
    >
      {/* tail fin + horizontal stabilizer */}
      <path d="M6 6 L15 6 L25 22 L4 22 Z" fill="var(--plane-hull)" />
      <path
        d="M0 22 L24 21 L24 25.5 L3 25.5 Z"
        fill="var(--plane-hull-shade)"
      />
      {/* fuselage */}
      <path
        d="M4 24 Q4 20 12 20 L62 17 Q66 12 74 12 L90 13 Q101 15 105 21 L105 29 Q97 33 80 33 L20 30 Q6 29 4 24 Z"
        fill="var(--plane-hull)"
      />
      {/* cockpit glass */}
      <path
        d="M70 15 L88 15 Q96 17 99 21 L70 21 Z"
        fill="var(--plane-window-dim)"
      />
      {/* high wing + strut */}
      <rect
        x="46"
        y="9"
        width="48"
        height="5"
        rx="2.5"
        fill="var(--plane-hull-shade)"
      />
      <line
        x1="56"
        y1="14"
        x2="72"
        y2="29"
        stroke="var(--plane-hull-shade)"
        strokeWidth="2"
      />
      {/* accent stripe */}
      <path
        d="M14 26.5 L100 25.5 L100 28.5 L14 29 Z"
        style={{ fill: "var(--accent)" }}
      />
      {/* landing gear */}
      <line
        x1="80"
        y1="32"
        x2="85"
        y2="40"
        stroke="var(--car-tire)"
        strokeWidth="2.2"
      />
      <circle cx="85" cy="41" r="4.5" fill="var(--car-tire)" />
      <circle cx="10" cy="30.5" r="2" fill="var(--car-tire)" />
      {/* spinner, propeller blur and blade */}
      <path d="M105 20 Q114 25 105 30 Z" fill="var(--plane-hull-shade)" />
      <ellipse
        cx="113"
        cy="25"
        rx="2"
        ry="15"
        fill="var(--plane-hull)"
        opacity="0.28"
      />
      <rect
        className={spinning ? styles.blade : undefined}
        x="112"
        y="11"
        width="2.4"
        height="14"
        rx="1.2"
        fill="var(--plane-hull-shade)"
      />
      {/* tail beacon */}
      <circle
        className={spinning ? styles.beacon : styles.beaconOff}
        cx="11"
        cy="6"
        r="2.6"
        fill="var(--sign-gold)"
      />
    </svg>
  );
}
