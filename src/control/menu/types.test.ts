import { describe, expect, it } from 'vitest';

import type { PageActionItem } from '../page-actions-menu/item.js';
import type { MenuActionItem, MenuItem } from './types.js';

// Type-level checks; `tsc --noEmit` (in lint) enforces the @ts-expect-error lines.
const ok: MenuItem[] = [
  { label: 'A', onClick: () => {} },
  { label: 'B', to: '/b' },
];
// @ts-expect-error both onClick and to
const both: MenuItem = { label: 'C', onClick: () => {}, to: '/c' };
// @ts-expect-error neither
const neither: MenuItem = { label: 'D' };
// PageActionItem stays assignable to an action item.
const page: MenuActionItem = {} as PageActionItem;

describe('MenuItem types', () => {
  it('compiles the item shapes above', () => {
    expect([ok, both, neither, page]).toHaveLength(4);
  });
});
