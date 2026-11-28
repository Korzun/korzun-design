import { describe, expect, it } from 'vitest';

import { SurfaceDepthProvider } from '../../component/surface/index.js';
import { renderWithProviders } from '../../test-utils.js';
import { Chip } from './index.js';

// md (8px) with no surface, as before; lg on the page, sm two or more levels in.
const cases: [string, number | undefined, string][] = [
  ['no surface', undefined, '8px'],
  ['depth 0 (page)', 0, '16px'],
  ['depth 1 (card)', 1, '8px'],
  ['depth 2', 2, '4px'],
  ['depth 3', 3, '4px'],
];
const atDepth = (depth: number | undefined, ui: React.ReactElement) =>
  renderWithProviders(
    depth === undefined ? ui : <SurfaceDepthProvider depth={depth}>{ui}</SurfaceDepthProvider>
  );
const radius = (el: Element) => getComputedStyle(el).borderRadius;

describe('Chip corners follow surface depth', () => {
  it.each(cases)('%s', (_, depth, px) => {
    const { getByText } = atDepth(depth, <Chip>Fiction</Chip>);
    expect(radius(getByText('Fiction'))).toBe(px);
  });
});
