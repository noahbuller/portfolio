"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./Billboard.module.css";

export type BillboardVariant = "lime" | "coral" | "cyan";
export type BillboardMount = "ground" | "building";

interface BillboardProps {
  href: string;
  variant?: BillboardVariant;
  /** How the sign is physically supported in the scene. */
  mount?: BillboardMount;
  download?: boolean | string;
  external?: boolean;
  /** Second (duplicate) copy in the seamless loop: hidden from a11y. */
  decorative?: boolean;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

/**
 * A clickable neon billboard. `mount` controls how it sits in the scene:
 * - "ground": raised on two tall poles planted on the road
 * - "building": mounted atop a small lit building block
 * Pops in (scale/opacity) as it enters the viewport via IntersectionObserver.
 */
export function Billboard({
  href,
  variant = "lime",
  mount = "ground",
  download,
  external,
  decorative,
  eyebrow,
  title,
  subtitle,
  children,
}: BillboardProps) {
  const boardRef = useRef<HTMLAnchorElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.55 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.mount}>
      <a
        ref={boardRef}
        className={`${styles.board} ${styles[variant]} ${inView ? styles.inView : ""}`}
        href={href}
        download={download}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-hidden={decorative || undefined}
        tabIndex={decorative ? -1 : undefined}
      >
        <span className={styles.frame}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <span className={styles.title}>{title}</span>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          {children && <span className={styles.extra}>{children}</span>}
        </span>
      </a>

      {mount === "ground" ? (
        <div className={styles.standGround} aria-hidden="true">
          <span className={styles.pole} />
          <span className={styles.pole} />
        </div>
      ) : (
        <div className={styles.standBuilding} aria-hidden="true" />
      )}
    </div>
  );
}
