# Menu

`import { Menu, type MenuItem, type MenuProps } from '@korzun/design/control'`

A button that opens a list of actions and links (the WAI-ARIA menu button
pattern). You render the trigger; Menu gives it the props it needs, draws the
list in a [`Popover`](popover.md) anchored to it, and handles focus and the
keyboard. Describe the items as data in `items`. There are no child
components and no style file to write.

Use something else for: choosing a value ([`Select`](select.md)), page-header
actions ([`PageActionsBar`](page-actions-bar.md) on desktop,
[`PageActionsMenu`](page-actions-menu.md) on mobile).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `trigger` | `(props: MenuTriggerProps) => ReactNode` | (required) | Renders the element that opens the menu. Spread `props` onto it: `(p) => <Button {...p}>Sort</Button>`. |
| `items` | `MenuItem[]` | (required) | In order. Labels must be unique (they are the React key). Filter the array for conditional items. |
| `surface` | `'solid' \| 'glass'` | `'solid'` | `solid`: card background, border, shadow. `glass`: the frosted glass recipe. |
| `side` | `'bottom' \| 'top'` | `'bottom'` | Preferred side of the trigger; flips when there is no room. |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment to the trigger's start edge, centre, or end edge. Use `'end'` for a trigger at the right edge. |
| `ariaLabel` | `string` | | Accessible name for the menu. Without it the menu is labelled by the trigger. |

The props type is exported as `MenuProps`.

`MenuTriggerProps` is `{ ref, onClick, ariaExpanded, ariaControls, ariaHasPopup: 'menu' }`,
shaped for [`Button`](button.md), so `{...p}` needs no glue. For any other
element, attach `ref`, call `onClick` on click, and map the rest to
`aria-expanded`, `aria-controls` and `aria-haspopup`.

## Items

An item is either an action or a link. TypeScript rejects an item with both
`onClick` and `to`, or with neither.

Fields on both kinds:

| Field | Type | Notes |
|---|---|---|
| `label` | `string` | Visible text. Unique within the menu. |
| `Icon` | `ComponentType<IconProps>` | Leading icon component (`HomeIcon`), not an element. Drawn at the text size, hidden from assistive tech. |
| `danger` | `boolean` | Red text. Styling only; it does not add a separator. |
| `disabled` | `boolean` | Greyed out, cannot be activated, skipped by arrow keys. |
| `separatorBefore` | `boolean` | Divider above this item. Ignored on the first item. |
| `intentProps` | `MenuIntentProps` | `{ onMouseEnter, onFocus, onTouchStart }`, spread onto the item, e.g. to prefetch. |

Action item (`MenuActionItem`):

| Field | Type | Notes |
|---|---|---|
| `onClick` | `() => void` | Receives no event. The menu closes first, then this is called. |

Link item (`MenuLinkItem`):

| Field | Type | Notes |
|---|---|---|
| `to` | `string` | Router path. Renders a react-router `<Link>`, so middle-click and open-in-new-tab work. Needs a router above the Menu; a Menu of action items only does not. |

## Keyboard

| Key | Does |
|---|---|
| Click, Enter or Space on the trigger | Opens the menu and focuses the first enabled item. |
| Down / Up | Next / previous enabled item, wrapping. |
| Home / End | First / last enabled item. |
| Enter, Space (or a click) | Activates the item: the menu closes, focus returns to the trigger, then the action runs or the link navigates. |
| Escape | Closes the menu and returns focus to the trigger. |
| Tab / Shift+Tab | Closes the menu; focus moves to the element after / before the trigger. |
| Pointer-down outside | Closes the menu without moving focus. |

## Behaviour to know

- Escape and outside presses go to the innermost open layer first: a Select
  list opened over the menu closes before it, and a Menu inside a
  [`Dialog`](dialog.md) closes before the Dialog.
- Opening another Menu closes the first (the press on its trigger is outside).
- If the focused item disappears while the menu is open, focus moves to the
  first enabled item. With every item disabled, the menu itself takes focus.
- The menu sits `space.sm` from the trigger and portals out of clipping
  ancestors (into an open `<dialog>` when inside one).

## Example

```tsx
import { Button, Menu } from '@korzun/design/control';
import { BookIcon, SettingsIcon } from '@korzun/design/icon';

<Menu
  align="end"
  trigger={(p) => <Button {...p}>Book</Button>}
  items={[
    { label: 'Open reader', to: `/books/${id}/read`, Icon: BookIcon },
    { label: 'Edit metadata', onClick: openEditor, Icon: SettingsIcon },
    { label: 'Delete book', onClick: confirmDelete, danger: true, separatorBefore: true },
  ]}
/>
```

## Do / don't

- Do use Menu for any list of actions or links behind a button.
- Do pass icon components (`Icon: BookIcon`), not elements.
- Don't hand-build `role="menu"`, or wire a Popover and buttons yourself.
- Don't wrap the trigger in another `<button>`; spread the props onto it.
- Don't use a Menu to pick a value that stays shown; that is a `Select`.
