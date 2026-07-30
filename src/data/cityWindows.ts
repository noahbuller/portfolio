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
export const BUILDING_TOP_MARGIN = 18;

/** Exact building width so `cols` window columns fit with no partial column. */
export function tightBuildingWidth(cols: number): number {
  return cols * WINDOW_CELL_WIDTH + 2 * BUILDING_SIDE_MARGIN;
}

/**
 * Exact building `top` (SVG y-coordinate) so `rows` window rows fit with no
 * partial row between the top margin and the ground line.
 */
export function tightBuildingTop(rows: number, ground: number): number {
  return ground - (rows * WINDOW_CELL_HEIGHT + BUILDING_TOP_MARGIN);
}

/** Resolved window-grid dimensions for a building spec. */
export function countWindowsForBuilding(
  cols: number,
  rows: number,
): { cols: number; rows: number; count: number } {
  return { cols, rows, count: cols * rows };
}
