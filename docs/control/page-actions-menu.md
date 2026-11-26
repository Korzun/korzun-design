---
title: PageActionsMenu
description: The mobile page-actions control: a round glass button that opens a menu of every page action.
category: Actions
---

# PageActionsMenu

<!-- generated:import -->

```ts
import {
  PageActionsMenu,
  type PageActionIntentProps,
  type PageActionItem,
  type PageActionsMenuProps,
} from '@korzun/design/control';
```

<!-- /generated:import -->

The mobile page-actions control: a round glass "More actions" button (⋯)
that opens a glass menu listing every action. It is hidden at 641px and up,
where [`PageActionsBar`](page-actions-bar.md) takes over with the same items.
Usually you don't render it yourself: pass `headerActions` to `Page`, which
renders both.

Use something else for: desktop header actions
([`PageActionsBar`](page-actions-bar.md)), bottom-of-page form actions
(`PageFooterActions`), a single inline action ([`Button`](button.md)). For any
other actions-behind-a-button, use [`Menu`](menu.md).

## Usage

### The trigger

The trigger is always the round "More actions" button: there is no label prop
and no `className`.

### Items

`PageActionItem` is shared with `PageActionsBar`, so one array drives both. It is
[`Menu`](menu.md)'s action item (`MenuActionItem`) plus `primary` and `align`,
which only `PageActionsBar` uses; this menu ignores them. `to` is not allowed:
page actions are actions, not links. The tables under Props list each field.

### Behaviour to know

- It is a `Menu` (`surface="glass" align="end"`), so it has Menu's keyboard
  behaviour. Opening focuses the first enabled item. Up and Down move through
  enabled items and wrap; Home and End jump to the ends; Enter and Space
  activate.
- Selecting an item closes the menu, returns focus to the trigger, then calls
  `onClick`. Escape closes and returns focus to the trigger. Tab closes and
  moves on from the trigger. A mousedown outside closes without moving focus.
- Escape and outside presses go to the innermost open layer first: a Select
  opened over the menu closes before the menu does.
- The menu is a floating layer (`radius.md`, glass, items `radius.sm`) in a
  [`Popover`](popover.md) portalled to the body, `space.sm` under the trigger,
  right-aligned to it; it flips above when there is no room below.
- It doesn't place itself: `Page` puts it in the sticky controls row
  (`margin-left: auto` keeps it at the trailing end, with or without a
  `BackButton`).

## Do / don't

- Do pass the same `items` you give `PageActionsBar` (or just use `Page`).
- Do put destructive items last with `separatorBefore`.
- Don't render it on its own and expect it on desktop; it is hidden there.
- Don't give two items the same `label`; they collide as React keys.

<!-- generated:examples -->

## Examples

### Basic

A round "More actions" button that opens a glass menu of every item, right-aligned
to the button. Choosing an item closes the menu and calls its `onClick`, which
takes no arguments.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { PageActionsMenu } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack>
      <PageActionsMenu
        items={[
          { label: 'Edit', onClick: () => setChosen('Edit') },
          { label: 'Download', onClick: () => setChosen('Download') },
          { label: 'Share', onClick: () => setChosen('Share') },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
```

### Item options

The same `items` array drives `PageActionsBar`, so items carry `primary` and
`align`; this menu lists every item in order and ignores both. Edit and Read
are marked `primary` and still appear. `Icon` takes an icon component (Read
shows a book), `intentProps` runs when the pointer, focus or a touch reaches Download,
Archive is `disabled`, and Delete is `danger` with a `separatorBefore`.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { PageActionsMenu } from '@korzun/design/control';
import { BookIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function ItemOptions() {
  const [chosen, setChosen] = useState('nothing yet');
  const [prefetched, setPrefetched] = useState('nothing yet');
  const prefetch = () => setPrefetched('Download');
  return (
    <Stack>
      <PageActionsMenu
        items={[
          { label: 'Edit', onClick: () => setChosen('Edit'), primary: true },
          {
            label: 'Read',
            onClick: () => setChosen('Read'),
            primary: true,
            align: 'leading',
            Icon: BookIcon,
          },
          {
            label: 'Download',
            onClick: () => setChosen('Download'),
            intentProps: { onMouseEnter: prefetch, onFocus: prefetch, onTouchStart: prefetch },
          },
          { label: 'Archive', onClick: () => setChosen('Archive'), disabled: true },
          {
            label: 'Delete',
            onClick: () => setChosen('Delete'),
            danger: true,
            separatorBefore: true,
          },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
      <Text tone="muted">Prefetched: {prefetched}</Text>
    </Stack>
  );
}
```

### In a Page

The usual way to get it: pass `headerActions` to `Page`, which renders this
menu at phone width and `PageActionsBar` on desktop from the same array. With
`back` the back button leads the row and the menu sits at the trailing end.
Read is `primary` and `leading` and Download carries `intentProps`; the menu
lists them all in order. Delete is `danger`, set apart by `separatorBefore`.

```tsx
import { Card, Page, Stack, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function InPage() {
  const [message, setMessage] = useState('Nothing chosen yet.');
  const [prefetched, setPrefetched] = useState('nothing yet');
  const prefetch = () => setPrefetched('Download');
  return (
    <Page
      back="/library"
      headerActions={[
        { label: 'Edit', onClick: () => setMessage('Edit chosen'), primary: true },
        {
          label: 'Read',
          onClick: () => setMessage('Read chosen'),
          primary: true,
          align: 'leading',
        },
        {
          label: 'Download',
          onClick: () => setMessage('Download chosen'),
          intentProps: { onMouseEnter: prefetch, onFocus: prefetch, onTouchStart: prefetch },
        },
        {
          label: 'Delete',
          onClick: () => setMessage('Delete chosen'),
          danger: true,
          separatorBefore: true,
        },
      ]}
    >
      <Card title="Dune">
        <Stack>
          <Text>{message}</Text>
          <Text tone="muted">Prefetched: {prefetched}</Text>
        </Stack>
      </Card>
    </Page>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

### PageActionsMenuProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | [PageActionItem](#pageactionitem)`[]` |  | All items appear in the menu, in order; `primary` and `align` are ignored here. Labels must be unique: they are the React keys. |

### PageActionIntentProps

Hover, focus and touch handlers spread onto a menu item; see `MenuIntentProps`. Not applied to `PageActionsBar`'s primary items: its `Button`s take no pointer handlers.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onFocus` (required) | `() => void` |  | The item took focus (arrow keys or opening the menu). |
| `onMouseEnter` (required) | `() => void` |  | Pointer entered the item. |
| `onTouchStart` (required) | `() => void` |  | A touch started on the item. |

### PageActionItem

One page action, shared by `PageActionsBar` and `PageActionsMenu`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `'leading' \| 'trailing'` |  | `PageActionsBar` primary items only: side of the bar; anything but `'leading'` is trailing. `PageActionsMenu` ignores it. |
| `danger` | `boolean` |  | Red text. Styling only; it does not add a separator. |
| `disabled` | `boolean` |  | Greyed out, cannot be activated, skipped by arrow keys. A disabled link renders without `href`, so middle-click cannot open it either. |
| `Icon` | `ComponentType<IconProps>` |  | Leading icon component (`HomeIcon`), not an element. Drawn at the text size, hidden from assistive tech. |
| `intentProps` | `MenuIntentProps` |  | Handlers spread onto the item element, e.g. to prefetch. |
| `label` (required) | `string` |  | Visible text. Must be unique within the menu: it is the React key. |
| `onClick` (required) | `() => void` |  | Receives no event. The menu closes first, then this is called. |
| `primary` | `boolean` |  | `PageActionsBar` only: render as an inline Button instead of in the overflow menu; `PageActionsMenu` ignores it. The Button ignores `Icon` and `intentProps`. |
| `separatorBefore` | `boolean` |  | Divider above this item. Ignored on the first item. |
| `to` | `never` |  | Not allowed on an action item: an item is an action or a link, never both. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.breakpoint.normal` | `@media (min-width: 641px)` | `@media (min-width: 641px)` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.radius.circle` | `50%` | `50%` |
| `theme.recipe.glass` | `recipe` | `recipe` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.4.0** (2026-11-23): `PageActionsMenu` and `PageActionsBar` are rebuilt on `Menu`: arrow keys, Home and End move between actions, and Escape returns focus to the trigger. `PageActionItem` is now `MenuActionItem & { primary?, align? }`: it gains an optional `Icon` (shown in the menus, ignored by the bar's primary Buttons), and `to` is not allowed.

<!-- /generated:changelog -->
