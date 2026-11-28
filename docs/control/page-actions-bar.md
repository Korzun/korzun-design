---
title: PageActionsBar
description: The desktop page-actions row: primary actions as inline buttons and the rest in an overflow menu.
category: Layout
---

# PageActionsBar

<!-- generated:import -->

`import { PageActionsBar, type PageActionsBarProps } from '@korzun/design/control'`

<!-- /generated:import -->

The desktop page-actions row: `primary` items render as inline Buttons and
the rest collapse into a "More…" overflow menu. It is hidden at 640px and
below, where [`PageActionsMenu`](page-actions-menu.md) shows the same items.
Usually you don't render it yourself: pass `headerActions` (and `actionsLabel`)
to `Page`, which puts it in the header row.

Use something else for: mobile ([`PageActionsMenu`](page-actions-menu.md)),
bottom-of-page form actions (`PageFooterActions`), a one-off button inside a
card ([`Button`](button.md)). For any other actions-behind-a-button, use
[`Menu`](menu.md).

## Usage

### How items are placed

`PageActionItem` is the shape [`PageActionsMenu`](page-actions-menu.md) shares:
see its [item table](page-actions-menu.md#pageactionitem).

- `primary: true` → an inline [`Button`](button.md) (`type="default"`, its
  radius following the surface depth, so `radius.lg` on the page background).
  `align: 'leading'` puts it at the left; anything else is trailing, at the
  right. `danger` and `disabled` apply.
- Not primary → the overflow menu (solid card surface, `radius.md`, items
  `radius.sm`), opened by the trigger at the far right. `separatorBefore`
  draws a divider there.
- No overflow items → no trigger.
- **`Icon` and `intentProps` only work on overflow items**; primary Buttons drop
  them.
- Items are keyed by `label`, so labels must be unique.

### Behaviour to know

- The overflow is a `Menu` (`surface="solid" align="end"`), so it has Menu's
  keyboard behaviour. Opening focuses the first enabled item. Up and Down move
  through enabled items and wrap; Home and End jump to the ends; Enter and
  Space activate.
- Selecting an item closes the menu, returns focus to the trigger, then calls
  `onClick`. Escape closes and returns focus to the trigger. Tab closes and
  moves on from the trigger. A mousedown outside closes without moving focus.
- Escape and outside presses go to the innermost open layer first: a Select
  opened over the menu closes before the menu does.
- The trigger is a native `<button>` with `aria-haspopup="menu"`,
  `aria-expanded` and `aria-controls`. The menu renders in a
  [`Popover`](popover.md), `space.sm` under the trigger, right-aligned to it.
- The bar has no `className`.

## Do / don't

- Do mark at most two or three items `primary`; the rest belong in the menu.
- Do use `Page headerActions` so the mobile menu gets the same items.
- Don't rely on `intentProps` for a primary item.

<!-- generated:examples -->

## Examples

### Basic

`primary` items are inline Buttons: `align: 'leading'` puts Read at the left
and the rest sit at the right. Everything else collapses into the overflow
menu, where `danger` turns Delete red and `separatorBefore` sets it apart.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { PageActionsBar } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack>
      <PageActionsBar
        items={[
          { label: 'Read', onClick: () => setChosen('Read'), primary: true, align: 'leading' },
          { label: 'Edit', onClick: () => setChosen('Edit'), primary: true },
          { label: 'Download', onClick: () => setChosen('Download') },
          {
            label: 'Delete',
            onClick: () => setChosen('Delete'),
            danger: true,
            separatorBefore: true,
          },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
```

### Actions label

`actionsLabel` sets the overflow trigger's visible text and accessible name.
Pass "Actions" when every item is in the menu, as here, because "More…"
would promise inline actions that are not there.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { PageActionsBar } from '@korzun/design/control';
import { useState } from 'react';

export default function ActionsLabel() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack>
      <PageActionsBar
        actionsLabel="Actions"
        items={[
          { label: 'Upload file', onClick: () => setChosen('Upload file') },
          { label: 'Upload folder', onClick: () => setChosen('Upload folder') },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
```

### Item options

A primary Button takes `danger` and `disabled`: Remove is red and Publish is
greyed out. Primary Buttons take neither `Icon` nor `intentProps`; the menu
does: Read online shows its `Icon`, Download runs `intentProps` when the
pointer, focus or a touch reaches it, and Archive is `disabled`.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { PageActionsBar } from '@korzun/design/control';
import { BookIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function ItemOptions() {
  const [chosen, setChosen] = useState('nothing yet');
  const [prefetched, setPrefetched] = useState('nothing yet');
  const prefetch = () => setPrefetched('Download');
  return (
    <Stack>
      <PageActionsBar
        items={[
          { label: 'Edit', onClick: () => setChosen('Edit'), primary: true },
          { label: 'Publish', onClick: () => setChosen('Publish'), primary: true, disabled: true },
          { label: 'Remove', onClick: () => setChosen('Remove'), primary: true, danger: true },
          { label: 'Read online', onClick: () => setChosen('Read online'), Icon: BookIcon },
          {
            label: 'Download',
            onClick: () => setChosen('Download'),
            intentProps: { onMouseEnter: prefetch, onFocus: prefetch, onTouchStart: prefetch },
          },
          { label: 'Archive', onClick: () => setChosen('Archive'), disabled: true },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
      <Text tone="muted">Prefetched: {prefetched}</Text>
    </Stack>
  );
}
```

### In a Page

The usual way to get it: pass `headerActions` to `Page`, which puts the bar
in the header row on desktop and `PageActionsMenu` at phone width from the
same array. `primary: true` means shown inline as its own button, not a blue
button: Read (also `align: 'leading'`, so it sits on the left) and Edit get one,
and Download and Delete go in the overflow menu.

```tsx
import { Card, Page, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function InPage() {
  const [message, setMessage] = useState('Nothing chosen yet.');
  return (
    <Page
      headerActions={[
        {
          label: 'Read',
          onClick: () => setMessage('Read chosen'),
          primary: true,
          align: 'leading',
        },
        { label: 'Edit', onClick: () => setMessage('Edit chosen'), primary: true },
        { label: 'Download', onClick: () => setMessage('Download chosen') },
        {
          label: 'Delete',
          onClick: () => setMessage('Delete chosen'),
          danger: true,
          separatorBefore: true,
        },
      ]}
    >
      <Card title="Dune">
        <Text>{message}</Text>
      </Card>
    </Page>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `actionsLabel` | `string` | `'More…'` | Visible label of the overflow trigger, and its accessible name; unset, the accessible name is "More actions". Pass `'Actions'` when every item is in the menu. |
| `items` (required) | [PageActionItem](../control/page-actions-menu.md#pageactionitem)`[]` |  | `primary` items render as inline Buttons (`align: 'leading'` on the left), the rest in the overflow menu; with no overflow items there is no trigger. Labels must be unique: they are the React keys. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.breakpoint.mobile` | `@media (max-width: 640px)` | `@media (max-width: 640px)` |
| `theme.color.bg.input` | `#FFFFFF` | `#1A1B1E` |
| `theme.color.border.default` | `#D9D9D9` | `#3A3B40` |
| `theme.color.brand.active` | `#0758d9` | `#91CAFF` |
| `theme.color.brand.hover` | `#3696fe` | `#87BAFF` |
| `theme.color.brand.outline` | `#91CAFF` | `rgba(54, 150, 254, 0.45)` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.fontFamily.body` | `system-ui, sans-serif` | `system-ui, sans-serif` |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.recipe.focusRing` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.shadow.cardStack` | `0px 2px 0px rgba(217, 217, 217, 0.2)` | `0px 2px 0px rgba(0, 0, 0, 0.4)` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.xxl` | `1rem` | `1rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.4.0** (2026-11-23): `PageActionsMenu` and `PageActionsBar` are rebuilt on `Menu`: arrow keys, Home and End move between actions, and Escape returns focus to the trigger. `PageActionItem` is now `MenuActionItem & { primary?, align? }`: it gains an optional `Icon` (shown in the menus, ignored by the bar's primary Buttons), and `to` is not allowed.

<!-- /generated:changelog -->
