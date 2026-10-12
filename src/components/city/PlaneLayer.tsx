"use client";

import { useEffect, useRef, useState } from "react";
import { useOverlayOptional } from "@/components/overlays/OverlayProvider";
import type { OverlayAction } from "@/data/ctas";
import { useDocumentVisibility } from "@/hooks/useDocumentVisibility";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ctas } from "@/data/ctas";
import { BannerCloth } from "./BannerCloth";
import { Plane } from "./Plane";
import styles from "./PlaneLayer.module.css";

type Accent = "cyan" | "lime" | "coral";
const ACCENTS: Accent[] = ["cyan", "lime", "coral"];

type LaneId = "upper" | "lower";

/** Viewport y-coordinates the planes must fly between (from CityScene). */
export interface FlightBand {
  /** Bottom of the hero name/subtitle. */
  titleBottom: number;
  /** Top of the highest billboard in the scene. */
  signTop: number;
}

// Tallest part of a plane + banner (the 46px cloth plus ripple and bob).
const FLIGHT_BOX = 58;
const SIGN_CLEARANCE = 12;
const TITLE_CLEARANCE = 8;
const NAV_CLEARANCE = 8;
// Keeps the two lanes reading as a pair on tall screens.
const MAX_LANE_SPREAD = 96;
// Hovering a banner slows its plane to this fraction of its speed.
const HOVER_RATE = 0.25;

interface Lanes {
  /** Lane tops in px from the top of the sky layer (the nav's bottom). */
  upper: number;
  lower: number;
  /** Only one plane fits (short screens): both lanes are the same slot. */
  shared: boolean;
}

/**
 * Altitude lanes in the clear sky above the billboards. Prefers the strip
 * between the hero title and the signs; when that's too thin the lanes move
 * up and cross the (faded) title. Landscape phones have no clear sky at all,
 * so there a single plane flies just under the nav, in front of the signs.
 */
function computeLanes(band: FlightBand | null, skyTop: number): Lanes {
  if (!band || !Number.isFinite(band.signTop)) {
    return { upper: NAV_CLEARANCE, lower: NAV_CLEARANCE, shared: true };
  }
  const floor = band.signTop - SIGN_CLEARANCE - FLIGHT_BOX;
  const sky = skyTop + NAV_CLEARANCE;
  const belowTitle = band.titleBottom + TITLE_CLEARANCE;
  const ceiling = floor - belowTitle >= FLIGHT_BOX ? belowTitle : sky;

  if (floor - ceiling >= FLIGHT_BOX) {
    return {
      upper: Math.max(ceiling, floor - MAX_LANE_SPREAD) - skyTop,
      lower: floor - skyTop,
      shared: false,
    };
  }
  const only = Math.max(sky, floor) - skyTop;
  return { upper: only, lower: only, shared: true };
}

interface PlaneInstance {
  id: number;
  label: string;
  href?: string;
  external: boolean;
  action?: OverlayAction;
  accent: Accent;
  lane: LaneId;
  top: number;
  durationS: number;
}

function makePlane(
  id: number,
  seq: number,
  lane: LaneId,
  top: number,
): PlaneInstance {
  const cta = ctas.aerial[seq % ctas.aerial.length];
  return {
    id,
    label: cta.label,
    href: cta.href,
    external: cta.external ?? false,
    action: cta.action,
    accent: ACCENTS[seq % ACCENTS.length],
    lane,
    top,
    durationS: 20 + Math.random() * 6,
  };
}

/** The CSS flight animation on the plane wrapping a banner. */
function flightOf(banner: HTMLElement) {
  const plane = banner.closest<HTMLElement>("[data-plane]");
  return plane
    ?.getAnimations()
    .find((a) => (a as CSSAnimation).animationName?.includes("fly"));
}

interface PlaneLayerProps {
  /** Measures the clear sky band; null before the scene has laid out. */
  getFlightBand: () => FlightBand | null;
}

export function PlaneLayer({ getFlightBand }: PlaneLayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isVisible = useDocumentVisibility();
  const overlay = useOverlayOptional();
  const [planes, setPlanes] = useState<PlaneInstance[]>([]);
  const [parkedTop, setParkedTop] = useState<number | null>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const seq = useRef(0);
  const busyLanes = useRef(new Set<LaneId>());

  const measureLanes = () =>
    computeLanes(
      getFlightBand(),
      skyRef.current?.getBoundingClientRect().top ?? 0,
    );

  useEffect(() => {
    if (prefersReducedMotion || !isVisible) return;

    const timeouts: number[] = [];
    let active = true;

    const trySpawn = () => {
      const lanes = measureLanes();
      const busy = busyLanes.current;
      const free: LaneId[] = lanes.shared
        ? busy.size
          ? []
          : ["upper"]
        : (["upper", "lower"] as const).filter((l) => !busy.has(l));
      if (!free.length) return;

      const lane = free[Math.floor(Math.random() * free.length)];
      busy.add(lane);
      const plane = makePlane(
        nextId.current++,
        seq.current++,
        lane,
        lane === "upper" ? lanes.upper : lanes.lower,
      );
      setPlanes((prev) => [...prev, plane]);
    };

    const loop = () => {
      if (!active || document.visibilityState !== "visible") return;
      trySpawn();
      timeouts.push(window.setTimeout(loop, 12000 + Math.random() * 8000));
    };
    timeouts.push(window.setTimeout(loop, 2500));

    return () => {
      active = false;
      timeouts.forEach((t) => window.clearTimeout(t));
    };
    // measureLanes only reads refs and the stable getFlightBand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion, isVisible]);

  // Reduced motion: one plane parked in the upper lane, measured after layout.
  useEffect(() => {
    if (!prefersReducedMotion) return;
    const raf = requestAnimationFrame(() => setParkedTop(measureLanes().upper));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  const remove = (p: PlaneInstance) => {
    busyLanes.current.delete(p.lane);
    setPlanes((prev) => prev.filter((q) => q.id !== p.id));
  };

  const runAction = (action: OverlayAction) => {
    if (!overlay) return;
    if (action === "about") overlay.openAbout();
    if (action === "projects") overlay.openProjects();
    if (action === "experience") overlay.openExperience();
  };

  // A moving banner is a hard target: hovering eases the plane down to a
  // crawl, and keyboard focus stops it so it can't fly off (and unmount)
  // while focused.
  const catchHandlers = {
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) =>
      flightOf(e.currentTarget)?.updatePlaybackRate(HOVER_RATE),
    onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
      if (document.activeElement !== e.currentTarget) {
        flightOf(e.currentTarget)?.updatePlaybackRate(1);
      }
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) =>
      flightOf(e.currentTarget)?.pause(),
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      const flight = flightOf(e.currentTarget);
      flight?.updatePlaybackRate(1);
      flight?.play();
    },
  };

  const renderBanner = (p: PlaneInstance) => {
    const content = (
      <>
        <BannerCloth className={styles.cloth} animate={!prefersReducedMotion} />
        <span className={styles.label}>
          {p.label}
          <span aria-hidden="true"> ›</span>
        </span>
      </>
    );
    const className = `${styles.banner} font-display`;

    if (p.action) {
      const action = p.action;
      return (
        <button
          type="button"
          className={className}
          aria-label={p.label}
          onClick={() => runAction(action)}
          {...catchHandlers}
        >
          {content}
        </button>
      );
    }

    return (
      <a
        className={className}
        href={p.href}
        target={p.external ? "_blank" : undefined}
        rel={p.external ? "noopener noreferrer" : undefined}
        aria-label={p.label}
        {...catchHandlers}
      >
        {content}
      </a>
    );
  };

  const displayPlanes: PlaneInstance[] = prefersReducedMotion
    ? [
        {
          ...makePlane(-1, 0, "upper", parkedTop ?? 0),
          durationS: 0,
        },
      ]
    : planes;

  return (
    <div ref={skyRef} className={styles.sky}>
      {displayPlanes.map((p) => (
        <div
          key={p.id}
          data-plane
          className={`${styles.plane} ${styles[p.accent]} ${prefersReducedMotion ? styles.parked : ""}`}
          style={
            {
              top: p.top,
              visibility:
                prefersReducedMotion && parkedTop === null
                  ? "hidden"
                  : undefined,
              animationDuration: prefersReducedMotion
                ? undefined
                : `${p.durationS}s`,
              "--parked-left": prefersReducedMotion ? "42vw" : undefined,
            } as React.CSSProperties
          }
          onAnimationEnd={(e) => {
            if (!prefersReducedMotion && e.animationName.includes("fly")) {
              remove(p);
            }
          }}
        >
          <div className={styles.inner}>
            {renderBanner(p)}
            <svg
              className={styles.bridle}
              width="40"
              height="46"
              viewBox="0 0 40 46"
              aria-hidden="true"
            >
              <path d="M0 1 L14 23 L0 45 M14 23 L40 24" />
            </svg>
            <span className={styles.sprite}>
              <Plane spinning={!prefersReducedMotion} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
