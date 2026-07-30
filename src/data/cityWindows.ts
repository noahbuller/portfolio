/**
 * Window-grid constants shared by the foreground building layout and the
 * SVG window pattern that fills each building. Building width/height are
 * always derived from a whole number of window columns/rows so a facade
 * never clips a partial window at its edge.
 */

export const WINDOW_CELL_WIDTH = 34;
export const WINDOW_CELL_HEIGHT = 46;

/** Empty margin on each side of the window grid within a building's silhouette. */
export const BUILDING_SIDE_MARGIN = 12;

/**
 * Roofline margin above the window grid. Scales down for shorter buildings
 * so the plain-color cap stays a small, consistent slice of the facade
 * instead of ballooning into a disproportionate solid bar on short
 * buildings — capped at 18px so tall buildings are unchanged.
 */
export function buildingTopMargin(rows: number): number {
  return Math.max(10, Math.min(18, rows * 2.5));
}

/** Exact building width so `cols` window columns fit with no partial column. */
export function tightBuildingWidth(cols: number): number {
  return cols * WINDOW_CELL_WIDTH + 2 * BUILDING_SIDE_MARGIN;
}

/**
 * Exact building `top` (SVG y-coordinate) so `rows` window rows fit with no
 * partial row between the top margin and the ground line.
 */
export function tightBuildingTop(rows: number, ground: number): number {
  return ground - (rows * WINDOW_CELL_HEIGHT + buildingTopMargin(rows));
}

/** Resolved window-grid dimensions for a building spec. */
export function countWindowsForBuilding(
  cols: number,
  rows: number,
): { cols: number; rows: number; count: number } {
  return { cols, rows, count: cols * rows };
}
