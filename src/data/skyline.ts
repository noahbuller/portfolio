/**
 * Background skyline across the bay, in px. Both skyline bands share one
 * coordinate space: a 1600px tile, `SKYLINE_HEIGHT` tall, ground at the
 * bottom. The bay's waterline sits `SKYLINE_SUBMERGED` px above that ground,
 * so every building's base is hidden under the water and the skyline reads
 * as standing on the far shore (see `.skyline` in CityScene.module.css,
 * which anchors the layer to the midground's waterline).
 *
 * Shapes are deliberately generic city archetypes — no copies of real
 * landmarks.
 */
export const SKYLINE_TILE_WIDTH = 1600;
export const SKYLINE_HEIGHT = 360;
export const SKYLINE_SUBMERGED = 30;
/** y of the waterline in skyline coordinates. */
export const SKYLINE_WATERLINE = SKYLINE_HEIGHT - SKYLINE_SUBMERGED;

export type SkylineKind =
  "box" | "gable" | "dome" | "setback" | "stepped" | "clock";
export type SkylineRoof = "tank" | "vents" | "antenna";

export interface SkylineBuilding {
  x: number;
  /** y of the main roofline (crowns, domes and spires rise above it). */
  top: number;
  w: number;
  kind: SkylineKind;
  roof?: SkylineRoof;
}

export const SKYLINE_BUILDINGS: SkylineBuilding[] = [
  { x: 0, top: 220, w: 120, kind: "box", roof: "tank" },
  { x: 140, top: 170, w: 90, kind: "box", roof: "vents" },
  { x: 262, top: 150, w: 70, kind: "clock" },
  { x: 390, top: 200, w: 110, kind: "box", roof: "tank" },
  { x: 505, top: 220, w: 96, kind: "setback" },
  { x: 620, top: 240, w: 120, kind: "box", roof: "vents" },
  { x: 760, top: 180, w: 80, kind: "box" },
  { x: 860, top: 150, w: 100, kind: "box", roof: "antenna" },
  { x: 980, top: 250, w: 100, kind: "dome" },
  { x: 1100, top: 200, w: 90, kind: "box", roof: "tank" },
  { x: 1205, top: 190, w: 130, kind: "stepped" },
  { x: 1350, top: 210, w: 100, kind: "box", roof: "vents" },
  { x: 1470, top: 170, w: 120, kind: "gable" },
];

/**
 * Distant towers behind the skyline: plain, windowless and hazed most of the
 * way into the sky. [x, top, width, detail] — detail adds a mast or a
 * rooftop block so the far band isn't all flat tops.
 */
export const FAR_TOWERS: [number, number, number, "mast" | "block" | null][] = [
  [70, 110, 40, "mast"],
  [180, 150, 34, "block"],
  [330, 105, 30, null],
  [440, 130, 46, "mast"],
  [640, 120, 36, null],
  [720, 160, 50, "block"],
  [830, 100, 28, "mast"],
  [1010, 125, 44, null],
  [1150, 110, 34, "block"],
  [1290, 140, 40, "mast"],
  [1400, 115, 36, null],
  [1520, 150, 44, "block"],
];
