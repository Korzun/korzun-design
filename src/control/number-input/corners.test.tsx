import { describe, expect, it } from 'vitest';

import { SurfaceDepthProvider } from '../../component/surface/index.js';
import { renderWithProviders } from '../../test-utils.js';
import { NumberInput } from './index.js';

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

describe('NumberInput corners follow surface depth', () => {
  it.each(cases)('%s', (_, depth, px) => {
    const { container } = atDepth(depth, <NumberInput name="n" label="Pages" value={1} />);
    expect(radius(container.firstElementChild!)).toBe(px);
    expect(radius(container.querySelector('input')!)).toBe(px);
  });
});

// On the page the text and label clear the lg corner: 16px in (1rem), 8px (0.5rem) elsewhere.
describe('NumberInput insets its text from the corner on a page', () => {
  it.each([
    ['no surface', undefined, '0.5rem'],
    ['depth 0 (page)', 0, '1rem'],
    ['depth 1 (card)', 1, '0.5rem'],
  ] as const)('%s', (_, depth, inset) => {
    const { container } = atDepth(depth, <NumberInput name="n" label="Pages" value={1} />);
    const field = container.querySelector('input')!;
    expect(getComputedStyle(field).paddingLeft).toBe(inset);
    expect(getComputedStyle(field).paddingRight).toBe(inset);
  });
});
