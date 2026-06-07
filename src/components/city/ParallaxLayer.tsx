"use client";

import { CSSProperties, ReactNode, useEffect, useRef } from "react";

type RegisterFn = (
  el: HTMLElement | null,
  speed: number,
  tileWidth: number,
) => () => void;

interface ParallaxLayerProps {
  /** Relative parallax speed. 1 = foreground pace, lower = more distant. */
  speed: number;
  register: RegisterFn;
  className?: string;
  style?: CSSProperties;
  /**
   * Renders one seamless tile. Called twice; the second copy receives
   * `decorative = true` so interactive children can be hidden from a11y.
   */
  renderTile: (decorative: boolean) => ReactNode;
}

/**
 * Positions a layer and renders its tile twice side-by-side so the
 * useAutoScroll loop can translate it seamlessly. Measures the tile width
 * (responsive-safe) and re-registers on resize.
 */
export function ParallaxLayer({
  speed,
  register,
  className,
  style,
  renderTile,
}: ParallaxLayerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const tile = tileRef.current;
    if (!track || !tile) return;

    let cleanup = () => {};
    const update = () => {
      cleanup();
      const width = tile.getBoundingClientRect().width;
      cleanup = register(track, speed, width);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(tile);

    return () => {
      observer.disconnect();
      cleanup();
    };
  }, [register, speed]);

  return (
    <div className={className} style={style}>
      <div
        ref={trackRef}
        style={{ display: "flex", willChange: "transform" }}
      >
        <div ref={tileRef} style={{ flex: "none" }}>
          {renderTile(false)}
        </div>
        <div style={{ flex: "none" }}>{renderTile(true)}</div>
      </div>
    </div>
  );
}
