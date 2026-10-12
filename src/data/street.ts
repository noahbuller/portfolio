import { getForegroundBuildings } from "./cityBuildings";

/**
 * Street cross-section below the foreground buildings, in px — the same
 * coordinate space as the foreground SVG, which draws the street directly
 * under its buildings so the sidewalk, center line and street furniture all
 * scroll in lockstep with the facades. Top to bottom: sidewalk, curb, road.
 */
export const SIDEWALK_HEIGHT = 12;
export const CURB_HEIGHT = 4;
export const ROAD_HEIGHT = 76;
export const STREET_HEIGHT = SIDEWALK_HEIGHT + CURB_HEIGHT + ROAD_HEIGHT;

/** Dashed center line, measured down from the road's top edge. */
export const CENTER_LINE_Y = 38;

/** Ground-mounted billboard poles are planted mid-sidewalk (px above scene bottom). */
export const SIDEWALK_MID = ROAD_HEIGHT + CURB_HEIGHT + SIDEWALK_HEIGHT / 2;

export type LaneId = "far" | "near";

export interface Lane {
  /** +1 drives with the scroll (eastbound), -1 against it (westbound). */
  direction: 1 | -1;
  /** Where tires meet the asphalt, in px above the scene bottom. */
  tireLine: number;
  /**
   * Vehicle sprite scale. Fixed per lane — never randomized — so every
   * vehicle at the same depth is the same size. The near lane is sized so a
   * sedan is ~70% of the road's height: big enough to read on a phone,
   * small enough that the lane above stays visible.
   */
  scale: number;
}

export const LANES: Record<LaneId, Lane> = {
  // Curb-side lane: sits just above the center line, slightly smaller so
  // it reads as further away.
  far: {
    direction: -1,
    tireLine: ROAD_HEIGHT - CENTER_LINE_Y + 4,
    scale: 0.72,
  },
  near: { direction: 1, tireLine: 6, scale: 0.85 },
};

/** World-space traffic speed (px/s), before subtracting the camera scroll. */
export const TRAFFIC_SPEED = 120;

/** Minimum bumper-to-bumper gap between vehicles in the same lane (px). */
export const TRAFFIC_GAP = 70;

export type FurnitureKind = "lamp" | "tree" | "hydrant" | "busStop";

export interface StreetItem {
  kind: FurnitureKind | "crosswalk";
  /** x in foreground-tile coordinates. */
  x: number;
}

const BUILDINGS = getForegroundBuildings();
const along = (building: number, at: number) =>
  Math.round(BUILDINGS[building].x + BUILDINGS[building].w * at);

/**
 * Street furniture, placed relative to buildings (index into
 * getForegroundBuildings(), fraction across its width) so it stays put if
 * building widths change. Building 9 carries the ground-mounted Contact
 * billboard whose poles stand on the sidewalk, so its frontage is left clear.
 */
export const STREET_ITEMS: StreetItem[] = [
  { kind: "lamp", x: along(1, 0) },
  { kind: "tree", x: along(1, 0.55) },
  { kind: "hydrant", x: along(2, 0.2) },
  { kind: "lamp", x: along(3, 0) },
  { kind: "busStop", x: along(4, 0.15) },
  { kind: "crosswalk", x: along(5, 0) },
  { kind: "tree", x: along(5, 0.6) },
  { kind: "lamp", x: along(7, 0) },
  { kind: "tree", x: along(8, 0.3) },
  { kind: "lamp", x: along(10, 0.5) },
  { kind: "tree", x: along(11, 0.5) },
  { kind: "lamp", x: along(12, 0.6) },
];
