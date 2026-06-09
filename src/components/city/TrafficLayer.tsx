"use client";

import { useEffect, useRef, useState } from "react";
import { useDocumentVisibility } from "@/hooks/useDocumentVisibility";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Car, CarType } from "./Car";
import styles from "./TrafficLayer.module.css";

interface CarInstance {
  id: number;
  type: CarType;
  color: string;
  durationS: number;
  bottomVh: number;
  scale: number;
}

const TYPES: CarType[] = ["sedan", "compact", "van"];
const COLORS = [
  "#ef476f",
  "#06d6a0",
  "#577590",
  "#ffd166",
  "#e0e3e7",
  "#3d6e8f",
  "#e76f51",
];

const MAX_CARS = 3;

const PARKED_CARS: CarInstance[] = [
  { id: -1, type: "sedan", color: "#ef476f", durationS: 0, bottomVh: 1.4, scale: 1 },
  { id: -2, type: "van", color: "#577590", durationS: 0, bottomVh: 2.4, scale: 0.92 },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeCar(id: number): CarInstance {
  return {
    id,
    type: pick(TYPES),
    color: pick(COLORS),
    durationS: 19 + Math.random() * 4,
    bottomVh: 0.8 + Math.random() * 2.4,
    scale: 0.85 + Math.random() * 0.25,
  };
}

export function TrafficLayer() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isVisible = useDocumentVisibility();
  const [cars, setCars] = useState<CarInstance[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion || !isVisible) return;

    const timeouts: number[] = [];
    let active = true;

    const spawn = () => {
      if (!active || document.visibilityState !== "visible") return;
      setCars((prev) =>
        prev.length >= MAX_CARS ? prev : [...prev, makeCar(nextId.current++)],
      );
      if (active) {
        timeouts.push(window.setTimeout(spawn, 5500 + Math.random() * 5000));
      }
    };
    timeouts.push(window.setTimeout(spawn, 800));

    return () => {
      active = false;
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [prefersReducedMotion, isVisible]);

  const removeCar = (id: number) =>
    setCars((prev) => prev.filter((c) => c.id !== id));

  const displayCars = prefersReducedMotion ? PARKED_CARS : cars;

  return (
    <div className={styles.lane} aria-hidden="true">
      {displayCars.map((car) => (
        <div
          key={car.id}
          className={`${styles.car} ${prefersReducedMotion ? styles.parked : ""}`}
          style={
            {
              bottom: `${car.bottomVh}vh`,
              animationDuration: prefersReducedMotion
                ? undefined
                : `${car.durationS}s`,
              "--car-scale": car.scale,
              "--parked-left": prefersReducedMotion
                ? `${car.id === -1 ? 18 : 62}vw`
                : undefined,
            } as React.CSSProperties
          }
          onAnimationEnd={() => !prefersReducedMotion && removeCar(car.id)}
        >
          <div className={styles.inner}>
            <Car type={car.type} color={car.color} />
          </div>
        </div>
      ))}
    </div>
  );
}
