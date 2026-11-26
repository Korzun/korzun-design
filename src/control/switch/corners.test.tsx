import { describe, expect, it } from 'vitest';

import { SurfaceDepthProvider } from '../../component/surface/index.js';
import { renderWithProviders } from '../../test-utils.js';
import { Switch } from './index.js';

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

// The inset track is one step squarer than its row; there is no step below sm.
const trackPx: Record<string, string> = { '16px': '8px', '8px': '4px', '4px': '4px' };

describe('Switch horizontal row corners follow surface depth', () => {
  it.each(cases)('%s: row, and the inset track a step down', (_, depth, px) => {
    const { getByRole } = atDepth(
      depth,
      <Switch name="s" label="Sync" layout="horizontal" checked={false} onChange={() => {}} />
    );
    const sw = getByRole('switch');
    const row = sw.closest('[class*="horizontal"]') ?? sw;
    expect(radius(row)).toBe(px);
    const track = row.querySelector('[class*="track"]')!;
    expect(radius(track)).toBe(trackPx[px]);
  });

  it('a pill track stays a pill at any depth', () => {
    const { container } = atDepth(
      0,
      <Switch
        name="s"
        label="Sync"
        layout="horizontal"
        radius="pill"
        checked={false}
        onChange={() => {}}
      />
    );
    expect(radius(container.querySelector('[class*="track"]')!)).toBe('999px');
  });
});
