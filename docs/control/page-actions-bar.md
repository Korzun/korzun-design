# PageActionsBar

`import { PageActionsBar } from '@korzun/design/control'`

The **desktop** page-actions row: `primary` items render as inline Buttons and
the rest collapse into a "More…" overflow menu. It is hidden at 640px and
below, where `PageActionsMenu` shows the same items. Usually you don't render
it yourself: pass `headerActions` (and `actionsLabel`) to `Page`, which puts it
in the header row.

Use something else for: mobile (`PageActionsMenu`), bottom-of-page form actions
(`PageFooterActions`), a one-off button inside a card (`Button`). For any
other actions-behind-a-button, use `Menu`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `PageActionItem[]` | (required) | See [page-actions-menu](page-actions-menu.md#pageactionitem) for the item shape. |
| `actionsLabel` | `string` | `'More…'` | Visible text and accessible name of the overflow trigger (default accessible name: "More actions"). Pass `'Actions'` when every item is overflow. |

No `className`.

## How items are placed

- `primary: true` → an inline `Button` (`type="default"`, default
  `radius="background"`, because the bar sits on the page background).
  `align: 'leading'` puts it at the left; anything else is trailing, at the
  right. `danger` and `disabled` apply.
- Not primary → the overflow menu (solid card surface, `radius.md`, items
  `radius.sm`), opened by the trigger at the far right. `separatorBefore`
  draws a divider there.
- No overflow items → no trigger.
- **`intentProps` only work on overflow items**; primary Buttons drop them.
- Items are keyed by `label`, so labels must be unique.

## Behaviour to know

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
  `aria-expanded` and `aria-controls`. The menu renders in a `Popover`,
  `space.sm` under the trigger, right-aligned to it.

## Example

```tsx
<Page
  headerActions={[
    { label: 'Read', onClick: read, primary: true, align: 'leading' },
    { label: 'Edit', onClick: edit, primary: true },
    { label: 'Download', onClick: download },
    { label: 'Delete', onClick: remove, danger: true, separatorBefore: true },
  ]}
>
  …
</Page>

// Every action in the menu, trigger labelled "Actions".
<Page headerActions={uploadActions} actionsLabel="Actions">…</Page>
```

## Do / don't

- Do mark at most two or three items `primary`; the rest belong in the menu.
- Do use `Page headerActions` so the mobile menu gets the same items.
- Don't rely on `intentProps` for a primary item.
