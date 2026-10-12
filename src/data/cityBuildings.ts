import { tightBuildingWidth, tightBuildingTop } from "./cityWindows";

/**
 * SVG y-coordinate of the sidewalk line the foreground buildings stand on.
 * The street (street.ts STREET_HEIGHT) is drawn below it, so the foreground
 * SVG is GROUND + STREET_HEIGHT tall.
 */
export const GROUND = 450;

export interface BuildingSpec {
  /** Window grid columns — determines the building's width. */
  cols: number;
  /** Window grid rows — determines the building's height. */
  rows: number;
  tone: "shadow" | "mid";
  roof?: "antenna" | "tank" | "hvac" | "shed" | "garden";
}

export interface Building {
  x: number;
  w: number;
  top: number;
  tone: "shadow" | "mid";
  roof?: "antenna" | "tank" | "hvac" | "shed" | "garden";
  cols: number;
  rows: number;
}

/**
 * Foreground street buildings, left to right. Rows count only what's visible
 * above the sidewalk — the street (see street.ts) is drawn below GROUND, not
 * over the facades. Only `cols`/`rows`/`tone`/`roof` are authored here —
 * x/width/top are derived below so every building is guaranteed to be
 * contiguous with its neighbors and to contain only whole windows (see
 * cityWindows.ts).
 */
const BUILDING_SPECS: BuildingSpec[] = [
  { cols: 4, rows: 5, tone: "shadow", roof: "shed" },
  { cols: 3, rows: 3, tone: "mid" },
  { cols: 5, rows: 6, tone: "shadow", roof: "antenna" },
  { cols: 3, rows: 3, tone: "mid", roof: "hvac" },
  { cols: 4, rows: 4, tone: "shadow", roof: "garden" },
  { cols: 3, rows: 3, tone: "mid", roof: "tank" },
  { cols: 5, rows: 6, tone: "shadow", roof: "antenna" },
  { cols: 3, rows: 3, tone: "mid" },
  { cols: 5, rows: 4, tone: "shadow", roof: "hvac" },
  { cols: 4, rows: 3, tone: "mid", roof: "shed" },
  { cols: 4, rows: 5, tone: "shadow", roof: "tank" },
  { cols: 3, rows: 3, tone: "mid", roof: "garden" },
  { cols: 4, rows: 4, tone: "shadow" },
];

function deriveBuildings(specs: BuildingSpec[]): Building[] {
  let cursor = 0;
  return specs.map((spec) => {
    const w = tightBuildingWidth(spec.cols);
    const building: Building = {
      x: cursor,
      w,
      top: tightBuildingTop(spec.rows, GROUND),
      tone: spec.tone,
      roof: spec.roof,
      cols: spec.cols,
      rows: spec.rows,
    };
    cursor += w;
    return building;
  });
}

const FOREGROUND_BUILDINGS = deriveBuildings(BUILDING_SPECS);

/** Total width of the seamless foreground tile — the sum of every building's derived width. */
export const FOREGROUND_TILE_WIDTH = FOREGROUND_BUILDINGS.reduce(
  (sum, b) => sum + b.w,
  0,
);

/** Fully resolved, contiguous foreground building layout. */
export function getForegroundBuildings(): Building[] {
  return FOREGROUND_BUILDINGS;
}
