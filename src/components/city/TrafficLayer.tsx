"use client";

import { useEffect, useRef, useState } from "react";
import { Car, CarType } from "./Car";
import styles from "./TrafficLayer.module.css";

interface CarInstance {
  id: number;
  type: CarType;
  color: string;
  special: boolean;
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

const SPECIAL_CHANCE = 0.14;
const MAX_CARS = 3;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeCar(id: number): CarInstance {
  const special = Math.random() < SPECIAL_CHANCE;
  return {
    id,
    type: special ? "sedan" : pick(TYPES),
    color: pick(COLORS),
    special,
    // Tight speed range so cars keep their spacing and don't overlap.
    // Easter-egg sedan drives a touch slower so it's noticeable.
    durationS: special ? 25 + Math.random() * 3 : 19 + Math.random() * 4,
    // Sit on the road surface (road band is ~9vh tall, anchored at the bottom).
    bottomVh: 0.8 + Math.random() * 2.4,
    scale: 0.85 + Math.random() * 0.25,
  };
}

/**
 * Spawns a stream of randomized vehicles driving across the road. Roughly 1 in 7
 * is the rare white-sedan easter egg. Generates everything client-side after
 * mount to avoid hydration mismatches; renders a couple of parked cars when
 * motion is reduced.
 */
export function TrafficLayer() {
  const [cars, setCars] = useState<CarInstance[]>([]);
  const [reduce, setReduce] = useState(false);
  const nextId = useRef(0);

  useEffect(() => {
    const prefersReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduce) {
      setReduce(true);
      setCars([
        { id: -1, type: "sedan", color: "#ef476f", special: false, durationS: 0, bottomVh: 1.4, scale: 1 },
        { id: -2, type: "van", color: "#577590", special: false, durationS: 0, bottomVh: 2.4, scale: 0.92 },
      ]);
      return;
    }

    // First car shortly after load, then a rolling stream. Skip spawning while
    // at capacity so the road never gets crowded.
    const timeouts: number[] = [];
    const spawn = () => {
      setCars((prev) =>
        prev.length >= MAX_CARS ? prev : [...prev, makeCar(nextId.current++)],
      );
      timeouts.push(
        window.setTimeout(spawn, 5500 + Math.random() * 5000),
      );
    };
    timeouts.push(window.setTimeout(spawn, 800));

    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, []);

  const removeCar = (id: number) =>
    setCars((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className={styles.lane} aria-hidden="true">
      {cars.map((car) => (
        <div
          key={car.id}
          className={`${styles.car} ${reduce ? styles.parked : ""} ${
            car.special ? styles.special : ""
          }`}
          style={
            {
              bottom: `${car.bottomVh}vh`,
              animationDuration: reduce ? undefined : `${car.durationS}s`,
              "--car-scale": car.scale,
              "--parked-left": reduce ? `${car.id === -1 ? 18 : 62}vw` : undefined,
            } as React.CSSProperties
          }
          onAnimationEnd={() => !reduce && removeCar(car.id)}
        >
          <div className={styles.inner}>
            <Car type={car.type} color={car.color} special={car.special} />
            {car.special && (
              <span className={styles.tag}>My Car: the lovely Honda Civic</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
