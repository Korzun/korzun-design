/**
 * `[min, max]`, safe to divide by and to step through: a non-finite `min` is
 * 0, and a non-finite, empty or inverted `max` is `min + 1` (an infinite
 * `max` would otherwise make the step grid endless).
 */
export const clampRange = (min: number, max: number): [number, number] => {
  const lo = Number.isFinite(min) ? min : 0;
  return [lo, Number.isFinite(max) && max > lo ? max : lo + 1];
};

/**
 * Every value the slider can rest on, sorted and deduplicated, within
 * `[min, max]`. A step gives `min + k·step` and `max`, plus every detent (so a
 * detent off the step grid stays reachable). A `null` (or unusable) step gives
 * the detents alone, or the two ends when there are none.
 */
export const snapPoints = (
  min: number,
  max: number,
  step: number | null,
  detents: number[]
): number[] => {
  const points = detents.filter((d) => Number.isFinite(d) && d >= min && d <= max);
  if (step !== null && Number.isFinite(step) && step > 0) {
    // Each point from min + k·step, rounded to the step's (or min's) decimals, so 0.1
    // steps give 0.3, not 0.30000000000000004.
    const places = (n: number) => (String(n).split('.')[1] ?? '').length;
    const decimals = Math.max(places(step), places(min));
    for (let k = 0; min + k * step < max; k++)
      points.push(Number((min + k * step).toFixed(decimals)));
    points.push(max);
  } else if (points.length === 0) {
    points.push(min, max);
  }
  return [...new Set(points)].sort((a, b) => a - b);
};

/** The point closest to `v`; the lower one on a tie. */
export const nearest = (points: number[], v: number): number =>
  points.reduce((best, p) => (Math.abs(p - v) < Math.abs(best - v) ? p : best), points[0]!);

/** The first point strictly beyond `v` in `dir`, or the end point in that direction when none is. */
export const nextPoint = (points: number[], v: number, dir: 1 | -1): number => {
  if (dir === 1) return points.find((p) => p > v) ?? points[points.length - 1]!;
  return [...points].reverse().find((p) => p < v) ?? points[0]!;
};
