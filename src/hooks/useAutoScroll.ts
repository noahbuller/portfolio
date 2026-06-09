"use client";

import { useCallback, useEffect, useRef } from "react";
import { useDocumentVisibility } from "@/hooks/useDocumentVisibility";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface RegisteredLayer {
  el: HTMLElement;
  speed: number;
  tileWidth: number;
}

interface UseAutoScrollOptions {
  pixelsPerSecond?: number;
}

/**
 * Drives a single requestAnimationFrame loop that translates every registered
 * layer directly via the DOM. Pauses when the tab is hidden or motion is reduced.
 */
export function useAutoScroll({ pixelsPerSecond = 60 }: UseAutoScrollOptions = {}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isVisible = useDocumentVisibility();
  const layersRef = useRef<Map<HTMLElement, RegisteredLayer>>(new Map());
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);

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
    const applyOffset = (baseOffset: number) => {
      layersRef.current.forEach(({ el, speed, tileWidth }) => {
        const safeTile = tileWidth > 0 ? tileWidth : 1;
        const x = -((baseOffset * speed) % safeTile);
        el.style.transform = `translate3d(${x}px, 0, 0)`;
      });
    };

    if (prefersReducedMotion) {
      applyOffset(0);
      return;
    }

    if (!isVisible) {
      applyOffset(elapsedRef.current * pixelsPerSecond);
      return;
    }

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsedSeconds = (now - startRef.current) / 1000;
      elapsedRef.current = elapsedSeconds;
      applyOffset(elapsedSeconds * pixelsPerSecond);
      rafRef.current = requestAnimationFrame(tick);
    };

    startRef.current = null;
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [pixelsPerSecond, prefersReducedMotion, isVisible]);

  return { registerLayer };
}
