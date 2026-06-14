"use client";

import { useEffect, useRef, useState } from "react";
import { useAboutOptional } from "@/components/about/AboutProvider";
import { useDocumentVisibility } from "@/hooks/useDocumentVisibility";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ctas } from "@/data/ctas";
import { Plane } from "./Plane";
import styles from "./PlaneLayer.module.css";

type Accent = "cyan" | "lime" | "coral";
const ACCENTS: Accent[] = ["cyan", "lime", "coral"];
const MAX_PLANES = 2;

interface PlaneInstance {
  id: number;
  label: string;
  href?: string;
  external: boolean;
  action?: "about";
  accent: Accent;
  topVh: number;
  durationS: number;
}

function makePlane(id: number, seq: number): PlaneInstance {
  const cta = ctas.aerial[seq % ctas.aerial.length];
  return {
    id,
    label: cta.label,
    href: cta.href,
    external: cta.external ?? false,
    action: cta.action,
    accent: ACCENTS[seq % ACCENTS.length],
    topVh: 17 + Math.random() * 22,
    durationS: 20 + Math.random() * 6,
  };
}

const PARKED_PLANE: PlaneInstance = {
  id: -1,
  label: ctas.aerial[0].label,
  href: ctas.aerial[0].href,
  external: ctas.aerial[0].external ?? false,
  accent: "cyan",
  topVh: 24,
  durationS: 0,
};

export function PlaneLayer() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isVisible = useDocumentVisibility();
  const about = useAboutOptional();
  const [planes, setPlanes] = useState<PlaneInstance[]>([]);
  const nextId = useRef(0);
  const seq = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion || !isVisible) return;

    const timeouts: number[] = [];
    let active = true;

    const spawn = () => {
      if (!active || document.visibilityState !== "visible") return;
      setPlanes((prev) =>
        prev.length >= MAX_PLANES
          ? prev
          : [...prev, makePlane(nextId.current++, seq.current++)],
      );
      if (active) {
        timeouts.push(window.setTimeout(spawn, 12000 + Math.random() * 8000));
      }
    };
    timeouts.push(window.setTimeout(spawn, 2500));

    return () => {
      active = false;
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [prefersReducedMotion, isVisible]);

  const remove = (id: number) =>
    setPlanes((prev) => prev.filter((p) => p.id !== id));

  const renderBanner = (p: PlaneInstance) => {
    if (p.action === "about") {
      return (
        <button
          type="button"
          className={`${styles.banner} font-display`}
          aria-label={p.label}
          onClick={() => about?.openAbout()}
        >
          {p.label}
        </button>
      );
    }

    return (
      <a
        className={`${styles.banner} font-display`}
        href={p.href}
        target={p.external ? "_blank" : undefined}
        rel={p.external ? "noopener noreferrer" : undefined}
        aria-label={p.label}
      >
        {p.label}
      </a>
    );
  };

  const displayPlanes = prefersReducedMotion ? [PARKED_PLANE] : planes;

  return (
    <div className={styles.sky}>
      {displayPlanes.map((p) => (
        <div
          key={p.id}
          className={`${styles.plane} ${styles[p.accent]} ${prefersReducedMotion ? styles.parked : ""}`}
          style={{
            top: `${p.topVh}vh`,
            animationDuration: prefersReducedMotion ? undefined : `${p.durationS}s`,
            "--parked-left": prefersReducedMotion ? "42vw" : undefined,
          } as React.CSSProperties}
          onAnimationEnd={(e) => {
            if (!prefersReducedMotion && e.animationName.includes("fly")) remove(p.id);
          }}
        >
          <div className={styles.inner}>
            {renderBanner(p)}
            <span className={styles.rope} />
            <span className={styles.sprite}>
              <Plane />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
