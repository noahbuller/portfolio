"use client";

import { useCallback, useEffect, useRef } from "react";

interface RegisteredLayer {
  el: HTMLElement;
  /** Relative parallax speed. 1 = foreground pace, 0.1 = distant. */
  speed: number;
  /** Width of one seamless tile in px. The layer wraps at this width. */
  tileWidth: number;
}

interface UseAutoScrollOptions {
  /** Base scroll speed of the foreground layer, in px/second. */
  pixelsPerSecond?: number;
}

/**
 * Drives a single requestAnimationFrame loop that translates every registered
 * layer directly via the DOM (no per-frame React state) for smooth, seamless
 * horizontal looping. Respects prefers-reduced-motion.
 */
export function useAutoScroll({ pixelsPerSecond = 60 }: UseAutoScrollOptions = {}) {
  const layersRef = useRef<Map<HTMLElement, RegisteredLayer>>(new Map());
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const registerLayer = useCallback(
    (el: HTMLElement | null, speed: number, tileWidth: number) => {
      const map = layersRef.current;
      if (el) {
        map.set(el, { el, speed, tileWidth });
      }
      return () => {
        if (el) map.delete(el);
      };
    },
    [],
  );

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const applyOffset = (baseOffset: number) => {
      layersRef.current.forEach(({ el, speed, tileWidth }) => {
        const safeTile = tileWidth > 0 ? tileWidth : 1;
        const x = -(((baseOffset * speed) % safeTile));
        el.style.transform = `translate3d(${x}px, 0, 0)`;
      });
    };

    if (prefersReducedMotion) {
      // Static composed frame, no animation loop.
      applyOffset(0);
      return;
    }

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsedSeconds = (now - startRef.current) / 1000;
      applyOffset(elapsedSeconds * pixelsPerSecond);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [pixelsPerSecond]);

  return { registerLayer };
}
