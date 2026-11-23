# PageActionsMenu

`import { PageActionsMenu, type PageActionItem, type PageActionIntentProps } from '@korzun/design/control'`

The **mobile** page-actions control: a round glass "More actions" button (⋯)
that opens a glass menu listing every action. It is hidden at 641px and up,
where `PageActionsBar` takes over with the same items. Usually you don't render
it yourself: pass `headerActions` to `Page`, which renders both.

Use something else for: desktop header actions (`PageActionsBar`), bottom-of-
page form actions (`PageFooterActions`), a single inline action (`Button`).
For any other actions-behind-a-button, use `Menu`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `PageActionItem[]` | (required) | All of them appear in the menu, in order. |

No `className`, no label prop (the trigger is always "More actions").

## PageActionItem

Shared with `PageActionsBar`, so one array drives both. It is `Menu`'s action
item (`MenuActionItem`) plus `primary` and `align`.

| Field | Type | Notes |
|---|---|---|
| `label` | `string` | Menu text. **Must be unique**: it is the React key. |
| `onClick` | `() => void` | Receives no event. The menu closes first. |
| `danger` | `boolean` | Red text. Styling only. |
| `disabled` | `boolean` | Greyed out; cannot be activated, and arrow keys skip it. |
| `Icon` | `ComponentType<IconProps>` | Leading icon component (`HomeIcon`), not an element. Menu only: `PageActionsBar`'s primary Buttons ignore it. |
| `separatorBefore` | `boolean` | Divider above this item (ignored on the first). `danger` does not add one. |
| `intentProps` | `{ onMouseEnter, onFocus, onTouchStart }` | Spread onto the menu item, e.g. to prefetch. |
| `primary` | `boolean` | **Ignored here.** Only `PageActionsBar` uses it. |
| `align` | `'leading' \| 'trailing'` | **Ignored here.** Only `PageActionsBar` uses it. |

## Behaviour to know

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
  `Popover` portalled to the body, `space.sm` under the trigger, right-aligned
  to it; it flips above when there is no room below.
- It doesn't place itself: `Page` puts it in the sticky controls row
  (`margin-left: auto` keeps it at the trailing end, with or without a
  `BackButton`).

## Example

```tsx
const actions: PageActionItem[] = [
  { label: 'Edit', onClick: edit, primary: true },
  { label: 'Read', onClick: read, primary: true, align: 'leading' },
  { label: 'Download', onClick: download, intentProps: prefetchDownload },
  { label: 'Delete', onClick: () => setConfirming(true), danger: true, separatorBefore: true },
];

// Preferred: Page renders PageActionsMenu (mobile) and PageActionsBar (desktop).
<Page back="/library" headerActions={actions}>…</Page>
```

## Do / don't

- Do pass the same `items` you give `PageActionsBar` (or just use `Page`).
- Do put destructive items last with `separatorBefore`.
- Don't render it on its own and expect it on desktop; it is hidden there.
- Don't give two items the same `label`; they collide as React keys.
