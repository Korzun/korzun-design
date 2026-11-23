# 0.4.0: Menu and the Escape layer stack

The fourth 0.1.x-series round, after 0.3.0 (Dialog, ErrorMessage, Spinner).
It was split off from 0.3.0 at the user's request.

## Why

The user plans to convert all of their applications (Bookplate, aviary,
Scribe) to `@korzun/design` and build new features on it. They want a stable
base of existing interface pieces, so that they and their coding agents build
faster and never hand-assemble a common piece. Nothing outside Bookplate uses a
menu yet. This round makes sure that the first time an agent needs one, the
library already has a correct one.

What exists today:

- **`ActionMenuList`** (internal, not exported) draws the menu items: danger,
  disabled, separators, `glass` or `solid` surface.
- **`PageActionsMenu`** (exported; the mobile round "⋯" button) and
  **`PageActionsBar`** (exported; the desktop "More…" overflow) each wire it
  up by hand with `useDismiss` and CSS `position: absolute`.
- **There is no keyboard support** beyond Tab: no arrow keys, and focus does
  not move into the menu when it opens or back to the trigger when it closes.
- **Escape closes the wrong layer.** Each open `Popover` adds its own
  `document` keydown listener, and the first one added runs first. With one
  popover inside another, the outer one closes first. `useDismiss` has the
  same problem and also ignores `defaultPrevented`.

## Goals

- **A public `Menu`.** An agent writes a menu with one component and an array
  of items: `<Menu trigger={…} items={[…]} />`. There is no style file and no
  wiring.
- **Three item kinds** (the user's choice): actions, links (a real
  react-router `<Link>`, so middle-click and open-in-new-tab work), and an
  optional leading icon on either kind.
- **Tight types** (the user's point). An item is a discriminated union. An
  action item requires `onClick`, a link item requires `to`, and TypeScript
  rejects an item with both or neither.
- **Standard keyboard behaviour** (WAI-ARIA menu button pattern):
  - Opening the menu focuses the first enabled item.
  - Up and Down move through enabled items and wrap. Home and End jump to the
    first and last enabled item.
  - Enter and Space activate an item.
  - Escape closes the menu and returns focus to the trigger.
  - Tab closes the menu and lets focus move on naturally.
- **Innermost-first dismissal for every floating layer.** One shared layer
  stack replaces the per-popover listeners:
  - Escape closes only the topmost layer.
  - A pointer-down closes layers from the top down until it reaches one that
    contains the target. A click inside a child layer counts as inside its
    parents.
  - `Popover` (so Select's and ChipsInput's lists), `Menu` and an open `Dialog`
    all take part.
- **`PageActionsMenu` and `PageActionsBar` rebuilt on `Menu`.** They keep
  their exact public API and look, and gain the keyboard behaviour. This
  repeats the ConfirmModal-on-Dialog move from 0.3.0.

## Non-goals

- **Checkable items and submenus.** The user deferred them until a screen
  needs them. The item union is shaped so that a third kind can be added
  later without breaking anything.
- **Typeahead** (jumping to an item by typing its first letter). It can be
  added later without changing the API.
- **New icons.** Items take any `IconProps` component. Apps bring their own
  until a later round adds an edit or trash icon.
- **Context menus** (right-click) and **menubars**.
- **Migrating apps.**

## Anti-goals

- **Two ways to build a menu.** There are no `MenuItem` or `MenuSeparator`
  child components beside the `items` prop.
- **Arbitrary content inside the menu.** Only the item kinds above.
- **A visual change** to `PageActionsMenu`, `PageActionsBar`, `Select`,
  `ChipsInput` or `Dialog`.
- **Literal values** in new styles.

## Approaches

The main choice was how an app describes a menu.

- **A. Items array (chosen).**
  - `items: MenuItem[]`, with each item plain data. It matches
    `PageActionItem` and `NavItem` and Dialog's one-prop-per-part style.
  - Agents can't nest the wrong thing or forget a role.
  - It allows tight discriminated-union types.
  - Conditional items are an array filter.
- **B. Child components** (`<MenuItem>`, `<MenuLink>`, `<MenuSeparator>`).
  - It reads naturally in JSX.
  - Rejected: it means more exports, it lets arbitrary content in (the drift
    the user wants to stop), and keyboard navigation has to discover items
    among unknown children.
- **C. A bare `useMenu` hook.** Rejected: too low-level for the
  agents-shouldn't-hand-build goal.

The layer stack had one sensible design: a module-level stack of open layers
with one `document` listener (see below).

## Design

### Types (`src/control/menu/`)

```ts
interface MenuItemBase {
  /** Visible text. Must be unique within the menu: it is the React key. */
  label: string;
  /** Leading icon component (`HomeIcon`), not an element. */
  Icon?: ComponentType<IconProps>;
  danger?: boolean;
  disabled?: boolean;
  /** Divider above this item (ignored on the first). */
  separatorBefore?: boolean;
  /** Spread onto the item element, e.g. to prefetch. */
  intentProps?: MenuIntentProps; // same shape as today's PageActionIntentProps
}
interface MenuActionItem extends MenuItemBase { onClick: () => void; to?: never; }
interface MenuLinkItem   extends MenuItemBase { to: string; onClick?: never; }
type MenuItem = MenuActionItem | MenuLinkItem;
```

- `PageActionItem` becomes `MenuActionItem & { primary?; align? }`. Its fields
  and meaning are unchanged, so it remains an action-only item. Existing
  consumers compile unchanged. `PageActionIntentProps` stays exported as an
  alias of `MenuIntentProps`.
- An action item's `onClick` receives no event. The menu closes first, then
  calls it (as today).
- A link item renders react-router `<Link to>` with `role="menuitem"`.
  Activating it closes the menu and navigates. A disabled link renders
  `aria-disabled="true"`, is skipped by arrow keys, and does not navigate.
  The disabled-link markup is the builder's call.

### Menu props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `trigger` | `(props: MenuTriggerProps) => ReactNode` | required | Spread `props` onto the element that opens the menu. |
| `items` | `MenuItem[]` | required | In order. |
| `surface` | `'solid' \| 'glass'` | `'solid'` | Existing `ActionMenuList` surfaces. |
| `side` | `PopoverSide` | `'bottom'` | Passed to Popover. |
| `align` | `PopoverAlign` | `'start'` | Passed to Popover. |
| `ariaLabel` | `string` | none | Accessible name for the `role="menu"` element. Without it the menu is labelled by the trigger (`aria-labelledby`). |

- **Trigger props.** `MenuTriggerProps` is shaped for `Button`:
  `{ ref, onClick, ariaExpanded, ariaControls, ariaHasPopup: 'menu' }`.
  - `Button` therefore gains `ref` (a React 19 plain prop, forwarded to the
    `<button>`) and `ariaHasPopup`. Both are additive.
  - So `trigger={(p) => <Button {...p}>Sort</Button>}` works with no glue.
  - The internal plain-`<button>` triggers in PageActionsMenu and
    PageActionsBar map these props to `aria-*` themselves.
- **Positioning.** The menu renders in a `Popover` anchored to the trigger,
  with `matchWidth={false}`. So it is dialog-aware, flips, and portals out of
  clipping ancestors.
- **Styles.** Item, separator and surface styles come from `ActionMenuList`'s
  style file, unchanged. The Icon sits before the label at `1em` with a
  token gap. Icon sizing and gap are the builder's call, using tokens.

### Layer stack (internal, `src/control/layer-stack/`; not exported)

- Each layer registers while it is open with these callbacks:
  - `onEscape`, which can be omitted.
  - `contains(node)`, which can be omitted.
  - `onOutsidePointerDown`, which can be omitted.
- Registration order is the stack order. One `document` keydown listener and
  one `mousedown` listener serve the whole stack.
- **Escape.** It is ignored when the keydown is already `defaultPrevented`, so
  Select's and ChipsInput's own input handlers keep working. Otherwise only
  the top layer handles it, and the listener calls `preventDefault` so an
  enclosing native `<dialog>` does not also cancel.
  - A layer with no `onEscape` (Dialog's entry) means "the browser handles
    this". The stack does nothing and does not `preventDefault`. Dialog keeps
    its `cancel`-event path unchanged.
  - Result: a Dialog opened over a still-open popover closes first, and a
    popover inside a Dialog closes before the Dialog.
- **Pointer-down.** Walk from the top. Each layer whose `contains` does not
  include the target gets `onOutsidePointerDown`. Stop at the first layer that
  does contain it.
  - A Popover's `contains` covers its anchor and its content.
  - A Dialog's entry covers the dialog element, and does nothing on outside
    pointer-down (its backdrop logic is unchanged). It still stops the walk, so
    clicks inside a dialog never close popovers beneath it.
- **Who joins:**
  - `Popover` registers when it has an `onClose`, replacing its own listeners.
    Its public behaviour stays as documented: it closes on Escape and on
    outside pointer-down, now innermost first.
  - `Dialog` (via `useModalDialog`) registers while it is open.
  - `useDismiss` is deleted. Its two callers move to `Menu`.

### Focus

- Opening focuses the first enabled item, whether opened by mouse or
  keyboard.
- Closing by Escape or by activating an item returns focus to the trigger
  (through the trigger `ref`). Closing by Tab or an outside click does not
  move focus.
- Items use roving focus: `tabIndex` is `-1` on every item, and arrow keys
  call `.focus()` directly. Either roving technique is acceptable; this one is
  the builder's call.

### Rebuilt controls

- **`PageActionsMenu`**
  - It becomes `<Menu surface="glass" align="end" trigger={…round glass
    button…} items={items}>`.
  - Its trigger keeps `aria-label="More actions"`.
  - The menu's position must match today's within a pixel: right-aligned,
    `space.sm` below. That is today's `popoverAnchor` style, now the Popover
    `gap` and `align`.
  - Verify with before/after screenshots, as with ConfirmModal.
- **`PageActionsBar`**
  - The overflow becomes `<Menu surface="solid" align="end" …>` with today's
    "More…" trigger.
  - Same screenshot check.

## Guidance, docs, release

- **New doc:** `docs/control/menu.md`, listed in the AGENTS.md index.
- **Updated docs:**
  - `page-actions-menu.md` and `page-actions-bar.md`: keyboard behaviour,
    plus a pointer to Menu for anything that isn't page-header actions.
  - `popover.md`: innermost-first dismissal.
  - `button.md`: `ref` and `ariaHasPopup`.
  - `patterns.md`: a menu example using a link item and an icon.
- **AGENTS.md rule:** a list of actions or links behind a button is a `Menu`.
  Never hand-build `role="menu"`.
- **Exports:** `Menu` and the `MenuProps`, `MenuItem`, `MenuActionItem`,
  `MenuLinkItem`, `MenuTriggerProps` and `MenuIntentProps` types, from
  `@korzun/design/control`. Each prop has JSDoc (props-exports test).
- **Stories:**
  - `menu.stories.tsx` with actions, links, icons, danger and separator,
    disabled, glass, and a Menu inside a Dialog.
  - A nested-layer story: a Select inside a Dialog with a Menu, to check
    Escape ordering by hand.
- **Smoke probe:** add the Menu types to `scripts/smoke-exports.sh`.
- **Release:** CHANGELOG 0.4.0 entry; `package.json` and the lockfile set to
  0.4.0.
- **Tests:**
  - Menu keyboard and focus behaviour.
  - Type-level tests: `@ts-expect-error` on an item with both `onClick` and
    `to`, and on one with neither.
  - Layer-stack ordering for Escape and pointer-down, including a Dialog over
    a popover, a popover in a Dialog, and two nested popovers.
  - Existing Popover, Select, ChipsInput, Dialog and PageActions tests stay
    green.

## Calls made after the builder check (not discussed with the user)

1. **Menu gap.** Today's menus sit `space.sm` (`0.375rem`) below the trigger,
   but `Popover.gap` is a pixel number.
   - Popover's `gap` widens to `number | string`.
   - A string is a CSS length in `px` or `rem`, resolved to pixels at each
     measurement (`rem` × the root font size).
   - Menu passes `theme.space.sm`, so there's no literal and the position
     matches.
   - This is an additive Popover API change, documented in `popover.md`.
2. **Stacking.** The Popover wrapper already uses `zIndex.sticky`, the same
   as today's PageActionsBar menu. No new z-index is needed.
3. **Tab.**
   - Pressing Tab in the menu moves focus to the trigger first, then lets the
     browser's Tab proceed.
   - So focus lands on the element after the trigger, not after the portal.
   - Shift+Tab does the same, landing before the trigger.
4. **Router.**
   - `control/menu` imports `Link` from `react-router`, which is already a
     peer and already used by BackButton and the nav components.
   - `Link` renders only for link items, so a Menu with only action items
     works outside a Router.
   - Tests and stories with link items wrap in `MemoryRouter`.
5. **Stack order.**
   - Order is registration time. Dialog registers when `isOpen` becomes true;
     Popover and Menu register when they open.
   - Known edge: a Dialog that mounts already open with a popover that is also
     already open at mount registers the child first, because child effects
     run first. Nothing in the library does this (popovers open from user
     input). It is documented, not handled.
   - Pointer-down needs no parent links. The walk goes top-down by stack
     order, and a popover portalled into a dialog is inside that dialog's
     `contains`.
6. **`PageActionItem` / `intentProps`.** The shapes are unchanged. Primary
   Buttons still ignore `intentProps`, as documented today.
7. **Items changing while open.** The menu stays open. If the focused item
   disappears, focus moves to the first enabled item.

## Left to the builder

- Internal file layout.
- The disabled-link markup.
- The roving-focus technique.
- Icon size and gap tokens.
- Whether Menu's id comes from `useId`.
