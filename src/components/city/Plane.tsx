/**
 * Small side-view aircraft sprite (nose pointing right). The towed banner is
 * rendered by PlaneLayer and attached at the tail.
 */
export function Plane() {
  return (
    <svg
      width={84}
      height={36}
      viewBox="0 0 84 36"
      aria-hidden="true"
      style={{ display: "block", overflow: "visible" }}
    >
      {/* horizontal wing (far) */}
      <ellipse cx="44" cy="24" rx="20" ry="4" fill="#c7ced6" />
      {/* fuselage */}
      <path
        d="M10 20 Q5 16 16 14 L62 12 Q78 13 80 19 Q78 25 62 24 L18 25 Q7 25 10 20 Z"
        fill="#eef2f6"
      />
      {/* tail fin */}
      <path d="M12 14 L4 3 L20 13 Z" fill="#eef2f6" />
      {/* horizontal stabilizer */}
      <path d="M10 16 L0 12 L14 17 Z" fill="#dde3ea" />
      {/* near wing */}
      <ellipse cx="46" cy="16" rx="16" ry="3" fill="#dde3ea" />
      {/* cockpit windows */}
      <circle cx="68" cy="18" r="2.1" fill="var(--neon-cyan)" />
      <circle cx="40" cy="18.5" r="1.5" fill="#9fb3c0" />
      <circle cx="48" cy="18.3" r="1.5" fill="#9fb3c0" />
      <circle cx="56" cy="18.1" r="1.5" fill="#9fb3c0" />
      {/* nose accent */}
      <path d="M76 17 Q82 19 76 22 Z" fill="#ffd27a" />
    </svg>
  );
}
