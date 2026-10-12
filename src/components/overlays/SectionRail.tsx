"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./SectionRail.module.css";

export interface RailItem {
  /** id of the section's heading (PageSection's `id`). */
  id: string;
  title: string;
}

interface SectionRailProps {
  items: readonly RailItem[];
  /** Accessible name for the nav landmark. */
  label: string;
}

// A section counts as "current" once its top passes this fraction of the
// board's visible height.
const ACTIVE_LINE = 0.3;

// Quiet period after the last scroll event before a rail jump counts as
// finished and scroll-spy takes over again.
const JUMP_SETTLE_MS = 150;

function sectionFor(id: string) {
  return document.getElementById(id)?.closest("section") ?? null;
}

/**
 * In-board jump links with scroll-spy. Scrolls the overlay's own scroll
 * container — never touches the URL hash, which drives overlay routing.
 */
export function SectionRail({ items, label }: SectionRailProps) {
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(items[0]?.id);
  const prefersReducedMotion = usePrefersReducedMotion();
  // While a rail jump is scrolling, the clicked item stays lit. Sections
  // near the end can't reach the top of the board (there's not enough
  // content below them), so the jump stops at the bottom — where
  // scroll-spy would otherwise light the last item instead.
  const jumping = useRef(false);
  const settleTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const root = navRef.current?.closest<HTMLElement>("[data-overlay-scroll]");
    if (!root) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const atBottom =
        root.scrollTop + root.clientHeight >= root.scrollHeight - 2;
      if (atBottom) {
        setActive(items[items.length - 1]?.id);
        return;
      }
      // The board may still be mid-grow from its sign (scaled down) on the
      // first measurement, so client rects come back shrunk while
      // clientHeight doesn't. Convert rect offsets back to unscaled pixels
      // before comparing, or every section reads as already scrolled past.
      const rootRect = root.getBoundingClientRect();
      const scale = rootRect.height / root.offsetHeight || 1;
      const line = root.clientHeight * ACTIVE_LINE;
      let current = items[0]?.id;
      for (const item of items) {
        const section = sectionFor(item.id);
        if (!section) continue;
        const top =
          (section.getBoundingClientRect().top - rootRect.top) / scale;
        if (top <= line) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (jumping.current) {
        window.clearTimeout(settleTimer.current);
        settleTimer.current = window.setTimeout(() => {
          jumping.current = false;
        }, JUMP_SETTLE_MS);
        return;
      }
      if (!raf) raf = requestAnimationFrame(update);
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(update);
    const timer = settleTimer;
    return () => {
      root.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      window.clearTimeout(timer.current);
    };
  }, [items]);

  const jumpTo = (id: string) => {
    jumping.current = true;
    // Also covers a jump that doesn't scroll at all (already in place).
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      jumping.current = false;
    }, JUMP_SETTLE_MS);
    sectionFor(id)?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    // Move focus with the view so keyboard users continue from the
    // section they jumped to.
    const heading = document.getElementById(id);
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
    setActive(id);
  };

  return (
    <nav ref={navRef} className={styles.rail} aria-label={label}>
      <p className={styles.label} aria-hidden="true">
        Jump to
      </p>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={styles.item}
              aria-current={active === item.id ? "true" : undefined}
              onClick={() => jumpTo(item.id)}
            >
              <span className={styles.dot} aria-hidden="true" />
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
