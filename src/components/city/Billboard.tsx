"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Billboard.module.css";

export type BillboardVariant = "lime" | "coral" | "cyan";
export type BillboardMount = "ground" | "building";

interface BillboardBaseProps {
  variant?: BillboardVariant;
  /** How the sign is physically supported in the scene. */
  mount?: BillboardMount;
  /** Second (duplicate) copy in the seamless loop: hidden from a11y. */
  decorative?: boolean;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

interface BillboardLinkProps extends BillboardBaseProps {
  mode?: "link";
  href: string;
  download?: boolean | string;
  external?: boolean;
}

interface BillboardGroupProps extends BillboardBaseProps {
  /** Non-anchor sign with separate child links (e.g. social chips). */
  mode: "group";
}

type BillboardProps = BillboardLinkProps | BillboardGroupProps;

function BillboardFrame({
  eyebrow,
  title,
  subtitle,
  children,
}: Pick<BillboardBaseProps, "eyebrow" | "title" | "subtitle" | "children">) {
  return (
    <span className={styles.frame}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <span className={`${styles.title} font-display`}>{title}</span>
      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      {children}
    </span>
  );
}

/**
 * A clickable neon billboard. `mount` controls how it sits in the scene:
 * - "ground": raised on two tall poles planted on the road
 * - "building": mounted atop a small lit building block
 *
 * Use `mode="link"` (default) for a single CTA anchor, or `mode="group"` when
 * the sign contains separate child links.
 */
export function Billboard(props: BillboardProps) {
  const {
    variant = "lime",
    mount = "ground",
    decorative,
    eyebrow,
    title,
    subtitle,
    children,
  } = props;

  const isGroup = props.mode === "group";
  const observeTarget = useRef<HTMLElement | null>(null);
  const setObserveTarget = (el: HTMLDivElement | HTMLAnchorElement | null) => {
    observeTarget.current = el;
  };
  const prefersReducedMotion = usePrefersReducedMotion();
  const [observedInView, setObservedInView] = useState(false);
  const inView = prefersReducedMotion || observedInView;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const el = observeTarget.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setObservedInView(entry.isIntersecting),
      { threshold: 0.55 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const boardClassName = `${styles.board} ${styles[variant]} ${inView ? styles.inView : ""}`;

  return (
    <div className={styles.mount}>
      {isGroup ? (
        <div
          ref={setObserveTarget}
          className={boardClassName}
          aria-hidden={decorative || undefined}
        >
          <BillboardFrame eyebrow={eyebrow} title={title} subtitle={subtitle}>
            {children && <span className={styles.extra}>{children}</span>}
          </BillboardFrame>
        </div>
      ) : (
        <a
          ref={setObserveTarget}
          className={boardClassName}
          href={props.href}
          download={props.download}
          target={props.external ? "_blank" : undefined}
          rel={props.external ? "noopener noreferrer" : undefined}
          aria-hidden={decorative || undefined}
          tabIndex={decorative ? -1 : undefined}
        >
          <BillboardFrame eyebrow={eyebrow} title={title} subtitle={subtitle}>
            {children && <span className={styles.extra}>{children}</span>}
          </BillboardFrame>
        </a>
      )}

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
