import { describe, expect, it } from 'vitest';

import { computePosition } from './position.js';

const anchor = { top: 100, bottom: 130, left: 100, right: 300, width: 200 };
const viewport = { width: 1000, height: 800 };
const base = {
  anchor,
  viewport,
  gap: 4,
  matchWidth: true,
  side: 'bottom',
  align: 'start',
  content: { width: 200, height: 150 },
} as const;

describe('computePosition', () => {
  it('defaults match today', () => {
    expect(computePosition(base)).toEqual({ top: 134, left: 100, width: 200, side: 'bottom' });
  });

  it('places on top when side is top', () => {
    const a = { top: 400, bottom: 430, left: 100, right: 300, width: 200 };
    expect(computePosition({ ...base, anchor: a, side: 'top' })).toEqual({
      top: 246,
      left: 100,
      width: 200,
      side: 'top',
    });
  });

  it('flips bottom to top when the bottom does not fit and the top has more room', () => {
    const a = { top: 700, bottom: 730, left: 100, right: 300, width: 200 };
    const r = computePosition({ ...base, anchor: a });
    expect(r.side).toBe('top');
    expect(r.top).toBe(546);
  });

  it('flips top to bottom', () => {
    const a = { top: 50, bottom: 80, left: 100, right: 300, width: 200 };
    const r = computePosition({ ...base, anchor: a, side: 'top' });
    expect(r.side).toBe('bottom');
    expect(r.top).toBe(84);
  });

  it('takes the side with more room when neither fits', () => {
    const v = { width: 1000, height: 300 };
    const content = { width: 200, height: 250 };
    expect(computePosition({ ...base, viewport: v, content }).side).toBe('bottom');
    expect(computePosition({ ...base, viewport: v, content, side: 'top' }).side).toBe('bottom');
  });

  it('aligns center', () => {
    const r = computePosition({
      ...base,
      matchWidth: false,
      align: 'center',
      content: { width: 100, height: 150 },
    });
    expect(r.left).toBe(150);
    expect(r.width).toBeUndefined();
  });

  it('aligns end', () => {
    const r = computePosition({
      ...base,
      matchWidth: false,
      align: 'end',
      content: { width: 100, height: 150 },
    });
    expect(r.left).toBe(200);
  });

  it('clamps at the right edge', () => {
    const a = { top: 100, bottom: 130, left: 900, right: 1000, width: 100 };
    const r = computePosition({
      ...base,
      anchor: a,
      matchWidth: false,
      content: { width: 300, height: 150 },
    });
    expect(r.left).toBe(696);
  });

  it('clamps at the left edge', () => {
    const a = { top: 100, bottom: 130, left: 0, right: 50, width: 50 };
    const r = computePosition({
      ...base,
      anchor: a,
      align: 'end',
      matchWidth: false,
      content: { width: 200, height: 150 },
    });
    expect(r.left).toBe(4);
  });

  it('pins to gap when wider than the viewport', () => {
    const r = computePosition({
      ...base,
      viewport: { width: 320, height: 800 },
      matchWidth: false,
      content: { width: 400, height: 150 },
    });
    expect(r.left).toBe(4);
  });
});
