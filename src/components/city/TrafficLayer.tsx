"use client";

import { useEffect, useRef, useState } from "react";
import { useDocumentVisibility } from "@/hooks/useDocumentVisibility";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { LANES, LaneId, TRAFFIC_GAP, TRAFFIC_SPEED } from "@/data/street";
import { Car, VEHICLE_SIZE, VehicleKind } from "./Car";
import styles from "./TrafficLayer.module.css";

interface Vehicle {
  id: number;
  kind: VehicleKind;
  color: string;
  lane: LaneId;
  fromX: number;
  toX: number;
  durationS: number;
}

/** Relative spawn odds — buses and bikes are rare treats, cars the norm. */
const KIND_WEIGHTS: [VehicleKind, number][] = [
  ["sedan", 3],
  ["compact", 3],
  ["taxi", 2],
  ["van", 1.2],
  ["truck", 1.2],
  ["bike", 0.7],
  ["bus", 0.6],
];
const KIND_TOTAL = KIND_WEIGHTS.reduce((sum, [, w]) => sum + w, 0);

const COLORS = [
  "var(--car-1)",
  "var(--car-2)",
  "var(--car-3)",
  "var(--car-4)",
  "var(--car-5)",
];

const MAX_VEHICLES = 4;

const PARKED: Vehicle[] = [
  {
    id: -1,
    kind: "sedan",
    color: "var(--car-2)",
    lane: "far",
    fromX: 0,
    toX: 0,
    durationS: 0,
  },
  {
    id: -2,
    kind: "van",
    color: "var(--car-4)",
    lane: "far",
    fromX: 0,
    toX: 0,
    durationS: 0,
  },
];
const PARKED_LEFT = ["16%", "62%"];

function pickKind(): VehicleKind {
  let r = Math.random() * KIND_TOTAL;
  for (const [kind, w] of KIND_WEIGHTS) {
    r -= w;
    if (r <= 0) return kind;
  }
  return "sedan";
}

function renderedWidth(kind: VehicleKind, lane: LaneId) {
  return VEHICLE_SIZE[kind].w * LANES[lane].scale;
}

/**
 * On-screen speed for a lane. The camera scrolls right at `scrollSpeed`, so
 * eastbound traffic appears slower than its road speed and westbound faster.
 * Every vehicle in a lane shares this speed, which is what guarantees no
 * vehicle ever catches up to (and draws through) the one ahead of it.
 */
function screenSpeed(lane: LaneId, scrollSpeed: number) {
  return TRAFFIC_SPEED - LANES[lane].direction * scrollSpeed;
}

/** Seconds per wheel revolution at road speed (sprite wheel radius ≈ 11). */
function wheelSpinSeconds(lane: LaneId) {
  return (2 * Math.PI * 11 * LANES[lane].scale) / TRAFFIC_SPEED;
}

interface TrafficLayerProps {
  /** Camera scroll speed (px/s) — the same value fed to useAutoScroll. */
  scrollSpeed: number;
}

export function TrafficLayer({ scrollSpeed }: TrafficLayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isVisible = useDocumentVisibility();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const layerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const activeCount = useRef(0);
  // performance.now() after which a new vehicle can enter each lane without
  // overlapping the previous one.
  const laneClearAt = useRef<Record<LaneId, number>>({ far: 0, near: 0 });
  // When the last vehicle in each lane exits — used to drain a lane before
  // vehicles at a new speed enter it (see the scrollSpeed change below).
  const laneEmptyAt = useRef<Record<LaneId, number>>({ far: 0, near: 0 });
  const lastScrollSpeed = useRef(scrollSpeed);

  useEffect(() => {
    if (prefersReducedMotion || !isVisible) return;
    const layer = layerRef.current;
    if (!layer) return;

    // A scroll-speed change (e.g. crossing the mobile breakpoint) changes
    // lane speeds; let vehicles already on the road leave before new,
    // differently-paced ones enter behind them.
    if (lastScrollSpeed.current !== scrollSpeed) {
      lastScrollSpeed.current = scrollSpeed;
      laneClearAt.current = { ...laneEmptyAt.current };
    }

    const timeouts: number[] = [];
    let active = true;

    const trySpawn = () => {
      if (activeCount.current >= MAX_VEHICLES) return;
      const now = performance.now();
      const first: LaneId = Math.random() < 0.55 ? "near" : "far";
      const lane = [first, first === "near" ? "far" : "near"].find(
        (l) => now >= laneClearAt.current[l as LaneId],
      ) as LaneId | undefined;
      if (!lane) return;

      const kind = pickKind();
      const width = renderedWidth(kind, lane);
      // offsetWidth / rendered width undoes the short-viewport
      // `transform: scale()` on .groundScene, so traffic still spans the
      // full visible width when the ground layers are shrunk.
      const scale =
        layer.getBoundingClientRect().width / layer.offsetWidth || 1;
      const viewWidth = window.innerWidth / scale;
      const speed = screenSpeed(lane, scrollSpeed);
      const eastbound = LANES[lane].direction === 1;
      const durationS = (viewWidth + width) / speed;

      laneClearAt.current[lane] = now + ((width + TRAFFIC_GAP) / speed) * 1000;
      laneEmptyAt.current[lane] = now + durationS * 1000;
      activeCount.current += 1;
      setVehicles((prev) => [
        ...prev,
        {
          id: nextId.current++,
          kind,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          lane,
          fromX: eastbound ? -width : viewWidth,
          toX: eastbound ? viewWidth : -width,
          durationS,
        },
      ]);
    };

    const loop = () => {
      if (!active) return;
      trySpawn();
      timeouts.push(window.setTimeout(loop, 2200 + Math.random() * 4300));
    };
    timeouts.push(window.setTimeout(loop, 600));

    return () => {
      active = false;
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [prefersReducedMotion, isVisible, scrollSpeed]);

  const removeVehicle = (id: number) => {
    activeCount.current = Math.max(0, activeCount.current - 1);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const displayed = prefersReducedMotion ? PARKED : vehicles;

  return (
    <div ref={layerRef} className={styles.traffic} aria-hidden="true">
      {(["far", "near"] as const).map((laneId) => {
        const lane = LANES[laneId];
        return (
          <div
            key={laneId}
            className={styles.lane}
            style={{ bottom: lane.tireLine }}
          >
            {displayed
              .filter((v) => v.lane === laneId)
              .map((v, i) => (
                <div
                  key={v.id}
                  className={
                    prefersReducedMotion ? styles.parked : styles.vehicle
                  }
                  style={
                    prefersReducedMotion
                      ? { left: PARKED_LEFT[i] }
                      : ({
                          "--from": `${v.fromX}px`,
                          "--to": `${v.toX}px`,
                          animationDuration: `${v.durationS}s`,
                        } as React.CSSProperties)
                  }
                  onAnimationEnd={(e) => {
                    // Wheel/bob animations are infinite and never end, but
                    // guard against bubbling anyway.
                    if (e.target === e.currentTarget) removeVehicle(v.id);
                  }}
                >
                  <div
                    className={`${lane.direction === -1 ? styles.westbound : ""} ${
                      laneId === "far" ? styles.farLane : ""
                    }`}
                  >
                    <Car
                      kind={v.kind}
                      color={v.color}
                      scale={lane.scale}
                      spinSeconds={wheelSpinSeconds(laneId)}
                      parked={prefersReducedMotion}
                    />
                  </div>
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
}
