"use client";

import { useEffect, useRef, useState } from "react";
import { ctas } from "@/data/ctas";
import { Plane } from "./Plane";
import styles from "./PlaneLayer.module.css";

type Accent = "cyan" | "lime" | "coral";
const ACCENTS: Accent[] = ["cyan", "lime", "coral"];
const MAX_PLANES = 2;

interface PlaneInstance {
  id: number;
  label: string;
  href: string;
  external: boolean;
  accent: Accent;
  topVh: number;
  durationS: number;
}

function makePlane(id: number, seq: number): PlaneInstance {
  const list = ctas.aerial;
  const cta = list[seq % list.length];
  return {
    id,
    label: cta.label,
    href: cta.href,
    external: cta.external ?? false,
    accent: ACCENTS[seq % ACCENTS.length],
    topVh: 4 + Math.random() * 9,
    durationS: 20 + Math.random() * 6,
  };
}

/**
 * Spawns occasional planes towing flag-style banner CTAs across the upper sky.
 * Each banner is a real, focusable link cycling through `ctas.aerial`.
 * Skipped under reduced motion to keep the sky calm.
 */
export function PlaneLayer() {
  const [planes, setPlanes] = useState<PlaneInstance[]>([]);
  const nextId = useRef(0);
  const seq = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const timeouts: number[] = [];
    const spawn = () => {
      setPlanes((prev) =>
        prev.length >= MAX_PLANES
          ? prev
          : [...prev, makePlane(nextId.current++, seq.current++)],
      );
      timeouts.push(window.setTimeout(spawn, 12000 + Math.random() * 8000));
    };
    timeouts.push(window.setTimeout(spawn, 2500));

    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, []);

  const remove = (id: number) =>
    setPlanes((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className={styles.sky}>
      {planes.map((p) => (
        <div
          key={p.id}
          className={`${styles.plane} ${styles[p.accent]}`}
          style={{ top: `${p.topVh}vh`, animationDuration: `${p.durationS}s` }}
          onAnimationEnd={(e) => {
            if (e.animationName.includes("fly")) remove(p.id);
          }}
        >
          <div className={styles.inner}>
            <a
              className={styles.banner}
              href={p.href}
              target={p.external ? "_blank" : undefined}
              rel={p.external ? "noopener noreferrer" : undefined}
              aria-label={p.label}
            >
              {p.label}
            </a>
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
