/**
 * Single source of truth for the road's rendered height, so the CSS that
 * draws `.road` and the traffic layer's vertical car placement can't drift
 * apart into two independently-chosen numbers.
 */
export const ROAD_HEIGHT_VH = 9;

/** Fraction of ROAD_HEIGHT_VH cars are placed within, biased toward the near lane. */
const CAR_MIN_FRACTION = 0.09;
const CAR_RANGE_FRACTION = 0.27;

export function randomCarBottomVh(): number {
  return (
    ROAD_HEIGHT_VH * (CAR_MIN_FRACTION + Math.random() * CAR_RANGE_FRACTION)
  );
}

/** Fixed lane positions for the reduced-motion "parked" cars. */
export const PARKED_CAR_BOTTOMS_VH = {
  sedan: ROAD_HEIGHT_VH * 0.156,
  van: ROAD_HEIGHT_VH * 0.267,
};
