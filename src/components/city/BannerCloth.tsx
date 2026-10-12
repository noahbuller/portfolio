"use client";

import { useEffect, useRef, useState } from "react";

const HEIGHT = 46;
/** Depth of the swallowtail fork cut into the trailing (left) end. */
const NOTCH = 14;
/** Width of the reinforced sleeve on the leading edge the bridle ties to. */
const SLEEVE = 5;
const AMPLITUDE = 3;
const SEGMENTS = 6;
const PHASES = [0, 1.4, 2.8];

// Ripple dies out toward the leading edge, where the sleeve holds the cloth
// taut, and is largest at the free trailing end.
function rippleY(i: number, phase: number) {
  return Math.sin(phase + i * 1.1) * AMPLITUDE * (1 - i / (SEGMENTS + 2));
}

function swallowtailPath(width: number, phase: number) {
  const seg = width / SEGMENTS;
  const top = -HEIGHT / 2;
  const bottom = HEIGHT / 2;
  let d = `M0 ${top + rippleY(0, phase)}`;
  for (let i = 1; i <= SEGMENTS; i++) {
    const y = top + rippleY(i, phase);
    d += ` Q${(i - 0.5) * seg} ${y - AMPLITUDE * 0.6} ${i * seg} ${y}`;
  }
  d += ` L${width} ${bottom + rippleY(SEGMENTS, phase)}`;
  for (let i = SEGMENTS - 1; i >= 0; i--) {
    const y = bottom + rippleY(i, phase);
    d += ` Q${(i + 0.5) * seg} ${y + AMPLITUDE * 0.6} ${i * seg} ${y}`;
  }
  return `${d} L${NOTCH} 0 Z`;
}

/**
 * Rippling swallowtail cloth drawn behind a towed banner's label. It sizes
 * itself to its parent (the banner button), so the label's own width sets
 * the cloth width. The fill is the banner's `--accent`.
 */
export function BannerCloth({
  className,
  animate,
}: {
  className?: string;
  animate: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const paths = width ? PHASES.map((p) => swallowtailPath(width, p)) : [];

  return (
    <svg
      ref={ref}
      className={className}
      viewBox={`0 ${-HEIGHT / 2} ${width || 1} ${HEIGHT}`}
      aria-hidden="true"
    >
      {width > 0 && (
        <>
          <path d={paths[0]} style={{ fill: "var(--accent)" }}>
            {animate && (
              <animate
                attributeName="d"
                dur="1.8s"
                repeatCount="indefinite"
                values={[...paths, paths[0]].join(";")}
              />
            )}
          </path>
          <rect
            x={width - SLEEVE}
            y={-HEIGHT / 2 - 2}
            width={SLEEVE}
            height={HEIGHT + 4}
            rx={2}
            fill="var(--building-shadow)"
            opacity={0.55}
          />
        </>
      )}
    </svg>
  );
}
