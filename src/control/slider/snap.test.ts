import { describe, expect, it } from 'vitest';

import { clampRange, nearest, nextPoint, snapPoints } from './snap.js';

describe('snapPoints', () => {
  it('a step gives every multiple from min, plus max', () => {
    expect(snapPoints(0, 10, 5, [])).toEqual([0, 5, 10]);
    expect(snapPoints(0, 10, 3, [])).toEqual([0, 3, 6, 9, 10]);
  });

  it('a fractional step lands on clean values, not floating-point drift', () => {
    expect(snapPoints(0, 1, 0.1, [])).toEqual([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
  });

  it('keeps the decimals of a fractional min', () => {
    expect(snapPoints(0.05, 0.3, 0.1, [])).toEqual([0.05, 0.15, 0.25, 0.3]);
  });

  it('a step keeps detents off its grid reachable', () => {
    expect(snapPoints(0, 100, 50, [12])).toEqual([0, 12, 50, 100]);
  });

  it('step null gives the detents only, sorted, deduplicated and in range', () => {
    expect(snapPoints(0, 100, null, [80, 12, 12, 150])).toEqual([12, 80]);
  });

  it('step null with no detents falls back to the two ends', () => {
    expect(snapPoints(0, 100, null, [])).toEqual([0, 100]);
  });

  it('a zero, negative or non-finite step counts as null', () => {
    expect(snapPoints(0, 100, 0, [40])).toEqual([40]);
    expect(snapPoints(0, 100, -5, [])).toEqual([0, 100]);
    expect(snapPoints(0, 100, Number.NaN, [])).toEqual([0, 100]);
  });
});

describe('nearest', () => {
  it('picks the closest point', () => {
    expect(nearest([0, 12, 80], 40)).toBe(12);
    expect(nearest([0, 12, 80], 50)).toBe(80);
  });
});

describe('nextPoint', () => {
  it('moves to the first point strictly beyond the value', () => {
    expect(nextPoint([0, 5, 10], 7, 1)).toBe(10);
    expect(nextPoint([0, 5, 10], 7, -1)).toBe(5);
    expect(nextPoint([0, 5, 10], 5, 1)).toBe(10);
  });

  it('stays at the end when there is nothing beyond', () => {
    expect(nextPoint([0, 5, 10], 10, 1)).toBe(10);
    expect(nextPoint([0, 5, 10], 0, -1)).toBe(0);
  });
});

describe('clampRange', () => {
  it('widens an empty or inverted range to one unit', () => {
    expect(clampRange(5, 5)).toEqual([5, 6]);
    expect(clampRange(5, 2)).toEqual([5, 6]);
    expect(clampRange(0, 10)).toEqual([0, 10]);
  });
});
