---
title: Menu
description: A button that opens a list of actions and links, described as data, with keyboard handling built in.
category: Overlays
---

# Menu

<!-- generated:import -->

```ts
import {
  Menu,
  type MenuActionItem,
  type MenuIntentProps,
  type MenuItem,
  type MenuLinkItem,
  type MenuProps,
  type MenuTriggerProps,
} from '@korzun/design/control';
```

<!-- /generated:import -->

A button that opens a list of actions and links, described as data, with keyboard
handling built in. It follows the WAI-ARIA menu button pattern. You render the
trigger; Menu gives it the props it needs, draws the
list in a [`Popover`](popover.md) anchored to it, and handles focus and the
keyboard. Pass the items in `items`. There are no child
components and no style file to write.

[`PageActionsBar`](page-actions-bar.md) and [`PageActionsMenu`](page-actions-menu.md)
are built on Menu.

Use something else for: choosing a value ([`Select`](select.md)), page-header
actions ([`PageActionsBar`](page-actions-bar.md) on desktop,
[`PageActionsMenu`](page-actions-menu.md) on mobile).

## Usage

### The trigger

`MenuTriggerProps` is `{ ref, onClick, ariaExpanded, ariaControls, ariaHasPopup: 'menu' }`,
shaped for [`Button`](button.md), so `{...p}` needs no glue. `ref` is a
callback ref (`(node: HTMLElement | null) => void`), so it attaches to any
element without a cast. `ariaControls` is the menu's id while open and
`undefined` while closed. For any other element, pass `ref={p.ref}`, call
`onClick` on click, and map the rest to `aria-expanded`, `aria-controls` and
`aria-haspopup`; the "Other triggers" example shows it.

### Items

An item is either an action or a link. TypeScript rejects an item with both
`onClick` and `to`, or with neither. Every item takes `label`, `Icon`, `danger`,
`disabled`, `separatorBefore` and `intentProps`; actions add `onClick`, links add
`to`. The tables under Props list each field.

### Keyboard

| Key                                  | Does                                                                                                                                                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Click, Enter or Space on the trigger | Opens the menu and focuses the first enabled item.                                                                                                                                                                       |
| Down / Up                            | Next / previous enabled item, wrapping.                                                                                                                                                                                  |
| Home / End                           | First / last enabled item.                                                                                                                                                                                               |
| Enter, Space (or a click)            | Activates the item: the menu closes, focus returns to the trigger, then the action runs or the link navigates.                                                                                                           |
| Escape                               | Closes the menu and returns focus to the trigger.                                                                                                                                                                        |
| Tab / Shift+Tab                      | Closes the menu; focus moves to the tabbable element after / before the trigger, skipping inert and hidden ones. Inside an open `<dialog>` it stays within the dialog; with nothing there, focus returns to the trigger. |
| Pointer-down outside                 | Closes the menu without moving focus.                                                                                                                                                                                    |

### Behaviour to know

- Escape and outside presses go to the innermost open layer first: a Select
  list opened over the menu closes before it, and a Menu inside a
  [`Dialog`](dialog.md) closes before the Dialog.
- Opening another Menu closes the first (the press on its trigger is outside).
- If the focused item disappears while the menu is open, focus moves to the
  first enabled item. With every item disabled, the menu itself takes focus.
- The menu sits `space.sm` from the trigger and portals out of clipping
  ancestors (into an open `<dialog>` when inside one).

## Do / don't

- Do use Menu for any list of actions or links behind a button.
- Do pass icon components (`Icon: BookIcon`), not elements.
- Don't hand-build `role="menu"`, or wire a Popover and buttons yourself.
- Don't wrap the trigger in another `<button>`; spread the props onto it.
- Don't use a Menu to pick a value that stays shown; that is a `Select`.

<!-- generated:examples -->

## Examples

### Basic

A trigger button and a list of actions. Spread the `trigger` props onto the
button; choosing an item closes the menu and calls its `onClick`, which takes
no arguments.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack align="start">
      <Menu
        trigger={(p) => <Button {...p}>Sort by</Button>}
        items={[
          { label: 'Title', onClick: () => setChosen('Title') },
          { label: 'Author', onClick: () => setChosen('Author') },
          { label: 'Date added', onClick: () => setChosen('Date added') },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
```

### Links and icons

An item with `to` is a link and one with `onClick` is an action; one item is
never both. `Icon` takes an icon component (`HomeIcon`), not an element. A link
item needs a router above the Menu, and middle-click opens it in a new tab.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { BooksIcon, HomeIcon, SettingsIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function LinksAndIcons() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack align="start">
      <Menu
        trigger={(p) => <Button {...p}>Go to</Button>}
        items={[
          { label: 'Home', to: '/', Icon: HomeIcon },
          { label: 'Library', to: '/library', Icon: BooksIcon },
          { label: 'Settings', onClick: () => setChosen('Settings'), Icon: SettingsIcon },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
```

### Danger and separator

`danger` turns an item's text red and does nothing else: Archive is red
with no divider. `separatorBefore` draws the divider above an item, so the
destructive item sits apart from the rest.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function DangerAndSeparator() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack align="start">
      <Menu
        trigger={(p) => <Button {...p}>Book</Button>}
        items={[
          { label: 'Edit metadata', onClick: () => setChosen('Edit metadata') },
          { label: 'Archive', danger: true, onClick: () => setChosen('Archive') },
          {
            label: 'Delete book',
            danger: true,
            separatorBefore: true,
            onClick: () => setChosen('Delete book'),
          },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
```

### Disabled and conditional items

A disabled item is greyed out and arrow keys skip it; a disabled link renders
without `href`, so middle-click cannot open it either. For an item that should
not appear at all, filter the `items` array: the button adds the last item.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function DisabledAndConditional() {
  const [chosen, setChosen] = useState('nothing yet');
  const [admin, setAdmin] = useState(false);
  return (
    <Stack>
      <Inline>
        <Menu
          trigger={(p) => <Button {...p}>Devices</Button>}
          items={[
            { label: 'Sync now', onClick: () => setChosen('Sync now') },
            { label: 'Clear editions', disabled: true, onClick: () => setChosen('Clear editions') },
            { label: 'Device settings', to: '/settings', disabled: true },
            ...(admin
              ? [{ label: 'Reset all', danger: true, onClick: () => setChosen('Reset all') }]
              : []),
          ]}
        />
        <Button onClick={() => setAdmin((value) => !value)}>
          {admin ? 'Remove admin item' : 'Add admin item'}
        </Button>
      </Inline>
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
```

### Surface

`solid` draws a card background, border and shadow; `glass` draws the frosted
glass recipe, for a menu over an image or a glass control. Each trigger is
labelled with its value.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function Surface() {
  const [chosen, setChosen] = useState('nothing yet');
  const items = (surface: string) => [
    { label: `Accept (${surface})`, onClick: () => setChosen(`Accept (${surface})`) },
    { label: `Reject (${surface})`, danger: true, onClick: () => setChosen(`Reject (${surface})`) },
  ];
  return (
    <Stack>
      <Inline>
        <Menu
          surface="solid"
          trigger={(p) => <Button {...p}>solid</Button>}
          items={items('solid')}
        />
        <Menu
          surface="glass"
          trigger={(p) => <Button {...p}>glass</Button>}
          items={items('glass')}
        />
      </Inline>
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
```

### Align

`align` lines the menu up with the trigger's start edge, centre or end edge.
The wide triggers show it: each menu is narrower than its trigger. Use `end` for
a trigger at the right edge of the screen.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function Align() {
  const [chosen, setChosen] = useState('nothing yet');
  const items = (align: string) => [
    { label: 'Open', onClick: () => setChosen(`Open (${align})`) },
    { label: 'Close', onClick: () => setChosen(`Close (${align})`) },
  ];
  return (
    <Stack align="start">
      <Text tone="muted">Chosen: {chosen}</Text>
      <Menu
        align="start"
        trigger={(p) => <Button {...p}>align start: menu at the left edge</Button>}
        items={items('start')}
      />
      <Menu
        align="center"
        trigger={(p) => <Button {...p}>align center: menu at the middle</Button>}
        items={items('center')}
      />
      <Menu
        align="end"
        trigger={(p) => <Button {...p}>align end: menu at the right edge</Button>}
        items={items('end')}
      />
    </Stack>
  );
}
```

### Side

`side="top"` opens the menu above the trigger. It flips to the other side when
there is no room, so the trigger sits below other content here.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function Side() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack align="start">
      <Text tone="muted">Chosen: {chosen}</Text>
      <Menu
        side="top"
        trigger={(p) => <Button {...p}>Opens above</Button>}
        items={[
          { label: 'Reply', onClick: () => setChosen('Reply') },
          { label: 'Forward', onClick: () => setChosen('Forward') },
          { label: 'Mark unread', onClick: () => setChosen('Mark unread') },
        ]}
      />
    </Stack>
  );
}
```

### Book actions

The usual full menu: a link item, action items with icons, and a `danger` item
set apart by `separatorBefore`. `align="end"` fits a trigger at the right edge.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { BookIcon, SettingsIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function BookActions() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack>
      <Inline justify="end">
        <Menu
          align="end"
          trigger={(p) => <Button {...p}>Book</Button>}
          items={[
            { label: 'Open reader', to: '/books/1/read', Icon: BookIcon },
            {
              label: 'Edit metadata',
              onClick: () => setChosen('Edit metadata'),
              Icon: SettingsIcon,
            },
            {
              label: 'Delete book',
              onClick: () => setChosen('Delete book'),
              danger: true,
              separatorBefore: true,
            },
          ]}
        />
      </Inline>
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
```

### Other triggers

An icon-only `Button` takes an `ariaLabel` for its name; `ariaLabel` on the Menu
names the list, which is otherwise labelled by the trigger. For any other
element, attach `ref` and `onClick` and map the rest to `aria-*` attributes.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { MoreIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function CustomTrigger() {
  const [chosen, setChosen] = useState('nothing yet');
  const items = [
    { label: 'Rename', onClick: () => setChosen('Rename') },
    { label: 'Duplicate', onClick: () => setChosen('Duplicate') },
  ];
  return (
    <Stack>
      <Inline>
        <Menu
          ariaLabel="Row actions"
          trigger={(p) => <Button {...p} prefix={MoreIcon} ariaLabel="More actions" />}
          items={items}
        />
        <Menu
          trigger={(p) => (
            <button
              ref={p.ref}
              type="button"
              aria-expanded={p.ariaExpanded}
              aria-controls={p.ariaControls}
              aria-haspopup={p.ariaHasPopup}
              onClick={p.onClick}
            >
              Plain button
            </button>
          )}
          items={items}
        />
      </Inline>
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
```

### Intent props

`intentProps` are spread onto the item element: here hovering, focusing or
touching “Open reader” counts a prefetch, which is what a router's prefetch
hook would do.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function IntentProps() {
  const [prefetches, setPrefetches] = useState(0);
  const count = () => setPrefetches((n) => n + 1);
  return (
    <Stack align="start">
      <Menu
        trigger={(p) => <Button {...p}>Book</Button>}
        items={[
          {
            label: 'Open reader',
            to: '/books/1/read',
            intentProps: { onMouseEnter: count, onFocus: count, onTouchStart: count },
          },
          { label: 'Reset count', onClick: () => setPrefetches(0) },
        ]}
      />
      <Text tone="muted">Prefetches: {prefetches}</Text>
    </Stack>
  );
}
```

### In a Card

A Menu in a card's `headerAction`. The list renders in a portal, so the card
does not clip it, and its corners step down by themselves: no `radius` prop.

```tsx
import { Card, Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function InCard() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Card
      title="Reading list"
      headerAction={
        <Menu
          align="end"
          trigger={(p) => <Button {...p}>Manage</Button>}
          items={[
            { label: 'Rename list', onClick: () => setChosen('Rename list') },
            { label: 'Clear list', danger: true, onClick: () => setChosen('Clear list') },
          ]}
        />
      }
    >
      <Stack>
        <Text>Three books queued.</Text>
        <Text tone="muted">Chosen: {chosen}</Text>
      </Stack>
    </Card>
  );
}
```

### In a Dialog

A Menu inside a Dialog opens into the dialog, so it shows above the dialog's
backdrop. Escape closes the menu first and the Dialog on the next press.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, Dialog, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function InDialog() {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack align="start">
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Edit book">
        <Stack align="start">
          <Menu
            trigger={(p) => <Button {...p}>Actions</Button>}
            items={[
              { label: 'Rename', onClick: () => setChosen('Rename') },
              { label: 'Duplicate', onClick: () => setChosen('Duplicate') },
              { label: 'Delete', danger: true, onClick: () => setChosen('Delete') },
            ]}
          />
          <Text tone="muted">Chosen: {chosen}</Text>
        </Stack>
      </Dialog>
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

### MenuProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment to the trigger's start edge, centre or end edge. Use `'end'` for a trigger at the right edge. |
| `ariaLabel` | `string` |  | Accessible name for the menu. Without it the menu is labelled by the trigger. |
| `items` (required) | [MenuItem](#menuitem)`[]` |  | Items in order. Labels must be unique (they are the React key). Filter the array for conditional items. |
| `side` | `'bottom' \| 'top'` | `'bottom'` | Preferred side of the trigger; flips to the other side when there is no room. |
| `surface` | `'solid' \| 'glass'` | `'solid'` | `'solid'` draws a card background, border and shadow; `'glass'` draws the frosted glass recipe. |
| `trigger` (required) | `(props:` [MenuTriggerProps](#menutriggerprops)`) => ReactNode` |  | Renders the element that opens the menu. Spread `props` onto it: `trigger={(p) => <Button {...p}>Sort</Button>}`. |

### MenuIntentProps

Hover, focus and touch handlers spread onto a menu item, e.g. to prefetch what selecting it needs.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onFocus` (required) | `() => void` |  | The item took focus (arrow keys or opening the menu). |
| `onMouseEnter` (required) | `() => void` |  | Pointer entered the item. |
| `onTouchStart` (required) | `() => void` |  | A touch started on the item. |

### MenuTriggerProps

What `trigger` receives; spread it onto the element that opens the menu (a `Button` takes it as-is).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaControls` (required) | `string \| undefined` |  | The id of the `role="menu"` element while open; `undefined` while closed. |
| `ariaExpanded` (required) | `boolean` |  | Whether the menu is open. |
| `ariaHasPopup` (required) | `'menu'` |  | Always `'menu'`. |
| `onClick` (required) | `() => void` |  | Toggles the menu. |
| `ref` (required) | `(node: HTMLElement \| null) => void` |  | Callback ref: attach it to the trigger element (`<button ref={p.ref}>`, `<a ref={p.ref}>`, or a `Button` through the spread). The menu anchors to that element and returns focus to it. |

### MenuActionItem

An item that runs code.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `danger` | `boolean` |  | Red text. Styling only; it does not add a separator. |
| `disabled` | `boolean` |  | Greyed out, cannot be activated, skipped by arrow keys. A disabled link renders without `href`, so middle-click cannot open it either. |
| `Icon` | `ComponentType<IconProps>` |  | Leading icon component (`HomeIcon`), not an element. Drawn at the text size, hidden from assistive tech. |
| `intentProps` | [MenuIntentProps](#menuintentprops) |  | Handlers spread onto the item element, e.g. to prefetch. |
| `label` (required) | `string` |  | Visible text. Must be unique within the menu: it is the React key. |
| `onClick` (required) | `() => void` |  | Receives no event. The menu closes first, then this is called. |
| `separatorBefore` | `boolean` |  | Divider above this item. Ignored on the first item. |
| `to` | `never` |  | Not allowed on an action item: an item is an action or a link, never both. |

### MenuItem

One menu entry: an action (`onClick`) or a link (`to`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `danger` | `boolean` |  | Red text. Styling only; it does not add a separator. |
| `disabled` | `boolean` |  | Greyed out, cannot be activated, skipped by arrow keys. A disabled link renders without `href`, so middle-click cannot open it either. |
| `Icon` | `ComponentType<IconProps>` |  | Leading icon component (`HomeIcon`), not an element. Drawn at the text size, hidden from assistive tech. |
| `intentProps` | [MenuIntentProps](#menuintentprops) |  | Handlers spread onto the item element, e.g. to prefetch. |
| `label` (required) | `string` |  | Visible text. Must be unique within the menu: it is the React key. |
| `onClick` | `() => void` |  | Receives no event. The menu closes first, then this is called. |
| `separatorBefore` | `boolean` |  | Divider above this item. Ignored on the first item. |
| `to` | `string` |  | Router path. Renders a react-router `<Link>`, so middle-click and open-in-new-tab work. Needs a router above the Menu; a Menu of action items only does not. |

### MenuLinkItem

An item that navigates: a react-router `<Link>`, so middle-click and open-in-new-tab work.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `danger` | `boolean` |  | Red text. Styling only; it does not add a separator. |
| `disabled` | `boolean` |  | Greyed out, cannot be activated, skipped by arrow keys. A disabled link renders without `href`, so middle-click cannot open it either. |
| `Icon` | `ComponentType<IconProps>` |  | Leading icon component (`HomeIcon`), not an element. Drawn at the text size, hidden from assistive tech. |
| `intentProps` | [MenuIntentProps](#menuintentprops) |  | Handlers spread onto the item element, e.g. to prefetch. |
| `label` (required) | `string` |  | Visible text. Must be unique within the menu: it is the React key. |
| `onClick` | `never` |  | Not allowed on a link item: an item is an action or a link, never both. |
| `separatorBefore` | `boolean` |  | Divider above this item. Ignored on the first item. |
| `to` (required) | `string` |  | Router path. Renders a react-router `<Link>`, so middle-click and open-in-new-tab work. Needs a router above the Menu; a Menu of action items only does not. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.bg.card` | `#FCFCFC` | `#1A1B1E` |
| `theme.color.bg.hover` | `rgba(0, 0, 0, 0.07)` | `rgba(255, 255, 255, 0.12)` |
| `theme.color.border.strong` | `#DDDDDD` | `#48494F` |
| `theme.color.danger.default` | `#FF4D4F` | `#FF4D4F` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.fontFamily.body` | `system-ui, sans-serif` | `system-ui, sans-serif` |
| `theme.fontSize.md` | `0.875rem` | `0.875rem` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.recipe.glass` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.shadow.cardStack` | `0px 2px 0px rgba(217, 217, 217, 0.2)` | `0px 2px 0px rgba(0, 0, 0, 0.4)` |
| `theme.space.lg` | `0.625rem` | `0.625rem` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.space.xxs` | `0.125rem` | `0.125rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.5.0** (2026-11-24): Surface depth: corners are concentric site-wide with no radius props. `Page` provides depth 0, `Dialog` 1, and `Card`, `CardRow` and `Alert` each provide one level deeper than where they sit; `Popover` (so `Menu` and the `Select` list) provides a fixed 2. Depth 0 is `radius.lg`, 1 is `md`, 2 and deeper is `sm`. `Button`, `Select`, `Card`, `CardRow` and `Alert` follow it; an explicit `Button radius` or `Select surface` still wins. With no `Page`, `Dialog`, `Card`, `CardRow`, `Alert` or `Surface` above it, a component keeps its 0.4.0 look; a bare `Card` (no `Page`) still counts as depth 0 and gives its contents depth 1, so its Buttons and nested Cards change as below.
- **0.5.0** (2026-11-24): **Visible changes:**
  - Buttons in a Card default to 8px (they were 16px unless `radius="card"` was set), and Buttons in a Dialog body are 8px.
  - Selects directly on a Page get the page look (16px and the card shadow); in a Card or Dialog they stay 8px. This includes Selects in your own boxes on a Page (a `useModalDialog` modal, a `recipe.card.shell` or `recipe.row` box), because depth cannot see hand-drawn boxes: wrap their contents in `Surface`, or pass `surface="card"`.
  - Without a Page, a bare `Card` counts as depth 0: its Buttons go from 16px to 8px, a Card nested in it steps down, and a `CardRow` in it is 8px.
  - A Card nested in a Card or Dialog steps down (8px, then 4px), and so do its Buttons and Selects; `size="small"` keeps its extra 1px.
  - `CardRow` is 16px on a Page and 8px inside a Card (it was always 16px).
  - Buttons and Selects inside a Popover or Menu are 4px.
- **0.5.0** (2026-11-24): `theme.space` values are typed as `SpaceValue` (`${number}rem`), so `gap={theme.space.sm}` on `Popover` and `Menu` needs no `as PopoverGap` cast. `Theme['space']` is now typed `${number}rem`, so hand-built Theme objects or mocks with `px` values stop type-checking.
- **0.4.0** (2026-11-23): New `Menu` (control): a button that opens a list of actions and links, described as an `items` array (`onClick` for actions, `to` for links; `Icon`, `danger`, `disabled`, `separatorBefore`, `intentProps`). Arrow keys, Home and End move between items, and Escape returns focus to the trigger. `surface` is `solid` or `glass`.
- **0.4.0** (2026-11-23): `Menu` trigger props: `ref` is a callback ref, so it attaches to a `<button>`, an `<a>` or a `Button` without a cast; `ariaControls` is set only while the menu is open. Tab from an open menu skips inert, hidden and `tabindex="-1"` elements and stays inside an open `<dialog>`. A disabled link item has no `href`.
- **0.4.0** (2026-11-23): `PageActionsMenu` and `PageActionsBar` are rebuilt on `Menu`: arrow keys, Home and End move between actions, and Escape returns focus to the trigger. `PageActionItem` is now `MenuActionItem & { primary?, align? }`: it gains an optional `Icon` (shown in the menus, ignored by the bar's primary Buttons), and `to` is not allowed.

<!-- /generated:changelog -->
