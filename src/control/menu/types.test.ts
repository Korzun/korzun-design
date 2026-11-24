import type { Ref } from 'react';
import { describe, expect, it } from 'vitest';

import type { ButtonProps } from '../button/index.js';
import type { PageActionItem } from '../page-actions-menu/item.js';
import type { MenuActionItem, MenuItem, MenuTriggerProps } from './types.js';

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
// The trigger ref attaches to any element (`<button ref={p.ref}>`,
// `<a ref={p.ref}>`), and the whole object spreads onto a Button.
const triggerProps = {} as MenuTriggerProps;
const onButton: Ref<HTMLButtonElement> = triggerProps.ref;
const onAnchor: Ref<HTMLAnchorElement> = triggerProps.ref;
const onButtonControl: ButtonProps = { ...triggerProps, children: 'Sort' };

describe('MenuItem types', () => {
  it('compiles the item shapes above', () => {
    expect([ok, both, neither, page]).toHaveLength(4);
  });

  it('compiles the trigger prop assignments above', () => {
    expect([onButton, onAnchor, onButtonControl]).toHaveLength(3);
  });
});
