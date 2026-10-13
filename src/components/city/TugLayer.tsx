"use client";

import { useEffect, useRef, useState } from "react";
import { ctas } from "@/data/ctas";
import { useDocumentVisibility } from "@/hooks/useDocumentVisibility";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Tug, TUG_WIDTH } from "./Tug";
import styles from "./TugLayer.module.css";

// On-screen speed in px/s. Eastbound, like the camera, so it reads as a slow
// boat drifting with the view rather than racing against it.
const TUG_SPEED = 30;
// Hovering the tug slows it to this fraction of its speed.
const HOVER_RATE = 0.25;

interface Crossing {
  id: number;
  toX: number;
  durationS: number;
}

/** The CSS crossing animation on the hull wrapping a link. */
function crossingOf(link: HTMLElement) {
  return link
    .closest<HTMLElement>("[data-tug]")
    ?.getAnimations()
    .find((a) => (a as CSSAnimation).animationName?.includes("sail"));
}

/**
 * A tug that crosses the bay one trip at a time, flying a pennant that links
 * to Contact. Lives in the ground scene just above the midground so the
 * foreground buildings pass in front of it. Like the banner planes, hovering
 * slows it and keyboard focus stops it so it can't sail off while focused.
 */
export function TugLayer() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isVisible = useDocumentVisibility();
  const [crossing, setCrossing] = useState<Crossing | null>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion || !isVisible || crossing) return;
    const layer = layerRef.current;
    if (!layer) return;

    const delay = nextId.current === 0 ? 3000 : 6000 + Math.random() * 8000;
    const timeout = window.setTimeout(() => {
      // offsetWidth / rendered width undoes the short-viewport scale() on
      // .groundScene so the tug still crosses the whole visible width.
      const scale =
        layer.getBoundingClientRect().width / layer.offsetWidth || 1;
      const toX = window.innerWidth / scale;
      setCrossing({
        id: nextId.current++,
        toX,
        durationS: (toX + TUG_WIDTH) / TUG_SPEED,
      });
    }, delay);
    return () => window.clearTimeout(timeout);
  }, [prefersReducedMotion, isVisible, crossing]);

  const catchHandlers = {
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) =>
      crossingOf(e.currentTarget)?.updatePlaybackRate(HOVER_RATE),
    onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
      if (document.activeElement !== e.currentTarget) {
        crossingOf(e.currentTarget)?.updatePlaybackRate(1);
      }
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) =>
      crossingOf(e.currentTarget)?.pause(),
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      const sail = crossingOf(e.currentTarget);
      sail?.updatePlaybackRate(1);
      sail?.play();
    },
  };

  const shown = prefersReducedMotion
    ? { id: -1, toX: 0, durationS: 0 }
    : crossing;

  return (
    <div ref={layerRef} className={styles.layer}>
      {shown && (
        <div
          key={shown.id}
          data-tug
          className={prefersReducedMotion ? styles.parked : styles.crossing}
          style={
            prefersReducedMotion
              ? undefined
              : ({
                  "--from": `${-TUG_WIDTH}px`,
                  "--to": `${shown.toX}px`,
                  animationDuration: `${shown.durationS}s`,
                } as React.CSSProperties)
          }
          onAnimationEnd={(e) => {
            if (e.animationName.includes("sail")) setCrossing(null);
          }}
        >
          <a
            className={styles.link}
            href={ctas.contact.href}
            aria-label={ctas.contact.label}
            {...catchHandlers}
          >
            <span className={styles.bob}>
              <Tug label={ctas.contact.label} />
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
