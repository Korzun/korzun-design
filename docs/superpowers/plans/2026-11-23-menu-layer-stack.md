# Menu and Layer Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 0.4.0 of `@korzun/design`. It adds a public `Menu` (actions, links, icons, standard keyboard behaviour) and an internal layer stack so Escape and outside clicks close the innermost floating layer first. `PageActionsMenu` and `PageActionsBar` are rebuilt on `Menu`.

**Architecture:**
- **Layer stack.** A module-level stack in `src/control/layer-stack/` with one `document` keydown listener and one mousedown listener replaces the per-component listeners in `Popover` and `useDismiss`. `useModalDialog` registers a pass-through layer so dialogs take part.
- **Menu.** `Menu` renders its trigger through a render prop and its list inside `Popover`, using `ActionMenuList`'s styles moved byte-for-byte.
- **Page actions.** The two page-actions controls keep their APIs and are rewired onto `Menu`.

**Tech Stack:** React 19, react-jss through `createUseStyles`, react-router 8 (peer), vitest with Testing Library and user-event, oxlint/oxfmt, tsc.

**Spec:** `docs/superpowers/specs/2026-11-23-menu-layer-stack-design.md`

## Global Constraints

- No runtime `dependencies`, only peers. `react-router` is already a peer.
- Relative imports only, pointing at a module folder (`../popover/index.js`), never at the `control`/`component` barrel. Stories may import `@gallery/*`.
- Every new or changed control gets a test and a `<module>.stories.tsx` beside it. `gallery/stories.test.tsx` fails when one is missing.
- Every exported control gets `docs/control/<module>.md`, listed in the `AGENTS.md` docs index, and every exported component exports `<Name>Props` with JSDoc on every prop (`scripts/props-exports.test.mjs`).
- No literal colours, spacing, font sizes or `borderRadius` in new styles. Use theme tokens. `0` and `1em` are allowed.
- No visual change to `PageActionsMenu`, `PageActionsBar`, `Select`, `ChipsInput` or `Dialog`. Moved styles are byte-identical apart from import lines.
- The public APIs of `PageActionsMenu`, `PageActionsBar`, `PageActionItem`, `PageActionIntentProps`, `Popover` (additive only) and `Button` (additive only) stay compatible.
- No `MenuItem`/`MenuSeparator` child components; the only way to build a menu is the `items` array.
- Run `npm run lint` (oxlint, the oxfmt check, `tsc --noEmit`, which also checks `@ts-expect-error` lines in tests) before every commit. CI fails on formatting.
- Version `0.4.0`, set in `package.json`, `package-lock.json` and CHANGELOG.

## Review Focus

1. **A Select open inside a Dialog, then Escape:** the list closes, the Dialog stays. Pressed again, the Dialog closes. Select's input handler `preventDefault`s first, and the stack must still skip that event. Task 1 pins this with an existing test plus a new one.
2. **A Menu open, then a click on another Menu's trigger:** the first closes, the second opens, and neither ends up stuck open. Task 3 test.
3. **A disabled or all-disabled menu:** arrow keys skip disabled items, and a menu with every item disabled opens with focus on the menu element itself, not on nothing. Task 3 test.
4. **A link item activated with Enter:** it navigates once and closes the menu. It must not navigate twice through both the keydown and the click. Task 3 test.
5. **A Menu unmounted while open** (its page navigates away): the layer is removed from the stack, so the next Escape reaches the right layer. Task 1 tests the stack; Task 3 tests Menu.

---

### Task 1: Layer stack, with Popover and Dialog joining it

**Files:**
- Create: `src/control/layer-stack/index.ts`, `src/control/layer-stack/index.test.tsx`
- Modify: `src/control/popover/index.tsx` (replace the `useEffect` holding `handleMouseDown`/`handleKeyDown`; widen `gap`), `src/control/popover/index.test.tsx`, `docs/control/popover.md`
- Modify: `src/control/use-modal-dialog/index.ts` (register while open), `src/control/use-modal-dialog/` test if one exists, otherwise add cases to `src/control/dialog/index.test.tsx`
- No stories file: layer-stack is internal and not exported. If `gallery/stories.test.tsx` demands one for every `src/control/*` folder, check how it treats `action-menu-list` (also internal) and follow that.

**Interfaces:**
- Produces:
  ```ts
  export interface Layer {
    /** Omit for a pass-through layer (a native dialog): the stack neither handles nor preventDefaults Escape. */
    onEscape?: () => void;
    /** Whether a pointer-down on `node` is inside this layer. Omit = never inside. */
    contains?: (node: Node) => boolean;
    /** Called when a pointer-down lands outside this layer and every layer above it. */
    onOutsidePointerDown?: () => void;
  }
  /** Registers `layer` while `active`. Push on activation, removal on deactivation or unmount. The latest callbacks are always used (keep them in a ref), so re-renders do not reorder the stack. */
  export function useLayer(active: boolean, layer: Layer): void;
  ```
- `Popover` `gap?: number | string`. A string is a CSS length in `px` or `rem`, resolved to pixels at each measurement (`rem` × `parseFloat(getComputedStyle(document.documentElement).fontSize)`).

**Stack algorithm** (the only part the tests below don't fully determine):
- **Keydown.** If `key !== 'Escape'` or the event is `defaultPrevented`, do nothing. Take the top layer. If it has `onEscape`, call `preventDefault()` and then `onEscape()`. If not, do nothing, so the native dialog `cancel` proceeds.
- **Mousedown.** For each layer from the top down: if `contains?.(target)` is true, stop. Otherwise call `onOutsidePointerDown?.()` and continue.
- **Listeners.** Attach both to `document` when the stack becomes non-empty and detach them when it empties.

- [ ] **Step 1: Write failing stack tests** in `layer-stack/index.test.tsx`, using a small harness component that calls `useLayer` with props:
  - `Escape calls only the top layer's onEscape and preventDefaults`: two active layers A (first) and B; Escape gives B 1 call, A 0, and `defaultPrevented === true`.
  - `Escape already defaultPrevented reaches no layer`.
  - `a pass-through top layer swallows nothing`: top layer has no `onEscape`; the layer below gets 0 calls and `defaultPrevented === false`.
  - `deactivating the top layer hands Escape to the next`: B goes `active=false`, then Escape calls A.
  - `unmounting a layer removes it`: same as above via unmount.
  - `mousedown inside the top layer closes nothing`.
  - `mousedown inside a lower layer closes only the layers above it`: three layers, target inside the middle one; the top gets `onOutsidePointerDown`, the middle and bottom do not.
  - `mousedown outside everything reaches every layer, top first` (record the call order).
  - `re-rendering a lower layer with new callbacks keeps its position and uses the new callback`.
  - `no document listener while the stack is empty` (spy on `document.addEventListener`).
- [ ] **Step 2: Run** `npx vitest run src/control/layer-stack` and expect FAIL (module missing).
- [ ] **Step 3: Implement `useLayer`** in `src/control/layer-stack/index.ts` per the algorithm above. Register in `useLayoutEffect`, so a popover opened by a click registers before the next keydown.
- [ ] **Step 4: Run it** and expect PASS.
- [ ] **Step 5: Move Popover onto the stack.**
  - Replace Popover's listener effect with `useLayer(open && !!onClose, { onEscape: onClose, contains: (n) => anchor or content contains n, onOutsidePointerDown: onClose })`.
  - Widen `gap` to `number | string` and resolve it inside `updatePosition` before `computePosition`, which keeps its numeric `gap`.
  - Update the JSDoc and `docs/control/popover.md`: the `gap` type and units, and "Escape and outside pointer-down close the innermost open layer first".
- [ ] **Step 6: Add Popover tests** to `popover/index.test.tsx`:
  - `nested popovers: Escape closes the inner one only`: inner popover anchored inside outer content; Escape gives inner onClose 1 call and outer 0.
  - `nested popovers: a mousedown in the inner content closes neither`.
  - `gap accepts a rem string`: with `gap="0.375rem"` and the root font size at 16px, the popover `top` is `anchor.bottom + 6`.
  - The existing tests (`ignores an Escape a control already handled`, `calls preventDefault…`, `adds no listener when closed`, `adds no listener without onClose`, outside-click, and the Dialog cases `Escape closes the popover and not the Dialog`, `clicking popover content does not close the Dialog`) must stay green unchanged.
- [ ] **Step 7: Make Dialogs join.**
  - In `useModalDialog`, call `useLayer(isOpen, { contains: (n) => ref.current?.contains(n) ?? false })`: no `onEscape`, no `onOutsidePointerDown`. The `cancel` and backdrop handling are untouched.
  - Tests in `dialog/index.test.tsx`:
    - `a Dialog opened over an open Popover: Escape does not close the popover`: popover outside the dialog, opened first, then dialog opened. Escape gives popover onClose 0 calls and `defaultPrevented === false`, so the native cancel would run.
    - `a mousedown inside an open Dialog does not close a popover beneath it`.
    - `a Select list inside a Dialog: first Escape closes the list, Dialog onClose not called`, using the real `Select`. This covers Review Focus 1. If jsdom can't drive the native `cancel`, assert the keydown's `defaultPrevented` as the 0.3.0 test did.
- [ ] **Step 8: Run** `npx vitest run src/control` and expect all green. Then `npm run lint`.
- [ ] **Step 9: Commit:** `feat(layer-stack): innermost-first Escape and outside-click for popovers and dialogs`.

### Task 2: Button `ref` and `ariaHasPopup`

**Files:** Modify `src/control/button/index.tsx`, `src/control/button/index.test.tsx`, `docs/control/button.md`, `src/control/button/button.stories.tsx` (only if the props panel lists props explicitly).

**Interfaces:**
- Produces `ButtonProps.ref?: Ref<HTMLElement>`. It is forwarded to the root element in both branches: the `<div role="button">` and the submit `<button>`. It's a React 19 plain prop with no `forwardRef`.
- Produces `ButtonProps.ariaHasPopup?: 'menu' | 'listbox' | 'dialog' | boolean`, rendered as `aria-haspopup` in both branches.
- Both props get JSDoc.

- [ ] **Step 1: Write failing tests:**
  - `forwards ref to the root element`: `ref.current` is the element with `role="button"`.
  - `forwards ref in submit mode`: it is the `<button type="submit">`.
  - `renders aria-haspopup`: with `ariaHasPopup="menu"`, the attribute is `menu`.
- [ ] **Step 2: Run** `npx vitest run src/control/button` and expect FAIL.
- [ ] **Step 3: Implement**, then update `docs/control/button.md`'s prop table.
- [ ] **Step 4: Run** the tests and `npm run lint`, expecting PASS.
- [ ] **Step 5: Commit:** `feat(button): ref and ariaHasPopup`.

### Task 3: `Menu`

**Files:**
- Create `src/control/menu/`:
  - `index.tsx`: Menu.
  - `types.ts`: the item and prop types.
  - `list.tsx`: the item list, moved from `action-menu-list/index.tsx` and generalised.
  - `style.ts`: a byte-for-byte copy of `action-menu-list/style.ts`, plus new icon and link rules.
  - `index.test.tsx`, `types.test.ts`, `menu.stories.tsx`.
- Create `docs/control/menu.md`.
- Modify:
  - `src/control/index.ts`: export `Menu` and its types.
  - `AGENTS.md`: the docs index entry only; the rule comes in Task 5.
- Leave `action-menu-list/` in place for now; Task 4 deletes it.

**Interfaces:**
- Consumes `useLayer` only through `Popover` (Task 1): pass Menu's close function as `onClose`. Consumes Popover `gap: string` (Task 1), and Button `ref` and `ariaHasPopup` (Task 2).
- Produces, exactly as the spec's Types section:
  - `MenuIntentProps` with the same three handlers as `PageActionIntentProps`.
  - `MenuItemBase`, `MenuActionItem` (`onClick: () => void; to?: never`), `MenuLinkItem` (`to: string; onClick?: never`) and `MenuItem`.
  - `MenuTriggerProps = { ref: RefObject<HTMLElement | null>; onClick: () => void; ariaExpanded: boolean; ariaControls: string; ariaHasPopup: 'menu' }`.
  - `MenuProps = { trigger: (props: MenuTriggerProps) => ReactNode; items: MenuItem[]; surface?: 'solid' | 'glass'; side?: PopoverSide; align?: PopoverAlign; ariaLabel?: string }`, with JSDoc on every field.
  - `export function Menu(props: MenuProps): ReactElement`.
- Rendering:
  - The trigger is wrapped in nothing. Menu passes the `ref` straight through, and the Popover anchor is that same ref.
  - `<Popover anchorRef={triggerRef} open matchWidth={false} gap={theme.space.sm} side align onClose={close}>`. Read `theme` via `useTheme()` from `../../theme/index.js`.
  - The list root has `role="menu"`, `id` from `useId()` (that id is `ariaControls`), and either `aria-label` or `aria-labelledby` pointing at the trigger. A trigger with no `id` gets one from Menu, set on `ref.current` in a layout effect.
- Each item:
  - An action item is a `<button type="button" role="menuitem" tabIndex={-1}>`.
  - A link item is a react-router `<Link role="menuitem" tabIndex={-1}>`.
  - A disabled link renders `aria-disabled="true"` and `preventDefault`s its click.
  - `Icon` renders before the label with `aria-hidden`, sized `1em`, with a `theme.space.sm` gap. The gap goes on the item as `display: flex; alignItems: center; gap`, in a new `itemWithIcon` class, so items without icons stay byte-identical.

- [ ] **Step 1: Write the failing type test** `menu/types.test.ts`. It runs under `tsc --noEmit` in lint, and needs one trivial vitest `it` so vitest accepts the file.
  ```ts
  const ok: MenuItem[] = [{ label: 'A', onClick: () => {} }, { label: 'B', to: '/b' }];
  // @ts-expect-error both onClick and to
  const both: MenuItem = { label: 'C', onClick: () => {}, to: '/c' };
  // @ts-expect-error neither
  const neither: MenuItem = { label: 'D' };
  const page: MenuActionItem = {} as PageActionItem; // PageActionItem stays assignable (Task 4 makes this real; until then import it from action-menu-list)
  ```
- [ ] **Step 2: Write failing behaviour tests** in `menu/index.test.tsx`, rendering with `renderWithProviders` (it includes a `MemoryRouter`) and the trigger `(p) => <Button {...p}>Sort</Button>`:
  - `closed: trigger has aria-haspopup="menu" and aria-expanded="false"; no menu`.
  - `click opens; focus is on the first enabled item; aria-controls equals the menu id`.
  - `the menu is labelled by the trigger by default and by ariaLabel when given`.
  - `ArrowDown/ArrowUp move focus, skipping disabled items, and wrap`.
  - `Home/End focus the first/last enabled item`.
  - `Enter on an action item: menu closes, then onClick is called once, focus returns to the trigger`. Assert the order with a spy that checks `queryByRole('menu')` is null at call time.
  - `Space on an action item activates it`.
  - `Escape closes and returns focus to the trigger`.
  - `Tab closes and focus lands on the element after the trigger`: render `<Menu/><button>Next</button>`, press Tab while an item has focus, and assert focus is on "Next". `Shift+Tab` lands on an element placed before the trigger.
  - `a mousedown outside closes without moving focus`.
  - `link item renders an <a href> with role menuitem and navigates once on Enter`: render a `Routes` with a `/b` route showing "B page"; after Enter, "B page" shows once. Spy `navigate`-equivalent by counting renders of the route element. Covers Review Focus 4.
  - `a disabled link does not navigate and is skipped by arrows`.
  - `icon renders aria-hidden before the label`.
  - `separatorBefore renders role="separator" between items, never before the first`.
  - `danger item has the danger class`, matching how the `ActionMenuList` test checks it.
  - `opening a second Menu's trigger closes the first`: two Menus; open A, click B's trigger; A's menu is gone and B's is open. Covers Review Focus 2.
  - `all items disabled: opening focuses the menu element`, with the menu at `tabIndex={-1}`. Covers Review Focus 3.
  - `items change while open: the focused item removed moves focus to the first enabled item`.
  - `unmounting while open removes its layer`: render Menu next to a `Dialog`-free Popover harness opened first. Unmount the open Menu, then Escape calls the Popover's onClose. Covers Review Focus 5.
  - `Menu with only action items renders outside any Router`: use plain `render` with a ThemeProvider and no router, and expect no throw.
- [ ] **Step 3: Run** `npx vitest run src/control/menu` and expect FAIL.
- [ ] **Step 4: Implement** `types.ts`, `style.ts`, `list.tsx` and `index.tsx`.
  - State: `open`.
  - Toggle on trigger click.
  - `close({ restoreFocus })`.
  - Focus the first enabled item in a layout effect after open.
  - The keydown handler on the `role="menu"` element handles ArrowUp/Down/Home/End/Tab and Escape.
    - Escape there calls `preventDefault()`, then `close({ restoreFocus: true })`, so the stack skips the already-handled event.
    - Popover's `onClose`, which the stack calls for an outside pointer-down (or an Escape when focus has left the menu), is `close({ restoreFocus: false })`.
  - On Tab: call `preventDefault()`, close, focus the trigger, then move focus to the next or previous tabbable element relative to the trigger. Collect tabbables from `document` with the selector `a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])`, filtered to elements outside the menu.
- [ ] **Step 5: Run** the tests and expect PASS. Then `npm run lint`, which checks the `@ts-expect-error` lines.
- [ ] **Step 6: Stories** in `menu.stories.tsx`, following the shape of `popover.stories.tsx`:
  - actions
  - links with icons, using `to` values that are existing gallery hash routes (for example the Menu story's own path), so clicking never leaves the gallery and no nested Router is needed
  - danger + separator
  - disabled
  - glass
  - inside a Dialog
  - "Layers": a Dialog containing a Select and a Menu, to check Escape order by hand
- [ ] **Step 7: Doc** `docs/control/menu.md`, in the format of `docs/control/dialog.md`:
  - import line, props table, item tables for both kinds, keyboard table
  - "Use something else for": Select for choosing a value, PageActionsBar and Menu for page-header actions
  - an example with a link and an icon
  - Add its line to the AGENTS.md docs index.
- [ ] **Step 8: Export** from `src/control/index.ts`: `Menu`, `type MenuProps`, `type MenuItem`, `type MenuActionItem`, `type MenuLinkItem`, `type MenuTriggerProps`, `type MenuIntentProps`.
- [ ] **Step 9: Run** `npm test` and `npm run lint` and expect green. That includes `scripts/props-exports.test.mjs` and `scripts/docs.test.mjs`.
- [ ] **Step 10: Commit:** `feat(menu): Menu with action and link items, icons, keyboard`.

### Task 4: Rebuild `PageActionsMenu` and `PageActionsBar` on `Menu`

**Files:**
- Modify: `src/control/page-actions-menu/index.tsx`, `style.ts` (drop `popoverAnchor`), and `index.test.tsx`; `src/control/page-actions-bar/index.tsx`, `style.ts` (drop `popoverAnchor` and its `zIndex` if it is only for the menu), and `index.test.tsx`; `docs/control/page-actions-menu.md`, `docs/control/page-actions-bar.md`.
- Create: `src/control/page-actions-menu/item.ts`, which holds `PageActionItem` (`MenuActionItem & { primary?: boolean; align?: 'leading' | 'trailing' }`) with the field JSDoc copied verbatim from `action-menu-list/index.tsx`, and `export type PageActionIntentProps = MenuIntentProps`.
- Delete: `src/control/action-menu-list/` (index, style, test, use-dismiss), once nothing imports it.

**Interfaces:**
- Consumes `Menu` and `MenuTriggerProps` (Task 3).
- `PageActionsMenu` and `PageActionsBar` props are unchanged. The barrel keeps exporting `PageActionItem` and `PageActionIntentProps`.

- [ ] **Step 1: Take "before" screenshots.**
  - Run `npm run gallery`.
  - With `playwright screenshot`, open the PageActionsMenu and PageActionsBar stories in their open state. If no story opens the menu, add a temporary click through a small playwright script under the scratchpad.
  - Shoot desktop width for the bar and 390px width for the mobile menu, in light and dark.
  - Save the screenshots under the scratchpad.
- [ ] **Step 2: Add the failing keyboard tests** to both test files:
  - `opening focuses the first item`
  - `ArrowDown moves focus`
  - `Escape returns focus to the trigger`
- [ ] **Step 3: Run** `npx vitest run src/control/page-actions-menu src/control/page-actions-bar` and expect the new tests to FAIL.
- [ ] **Step 4: Rewire both controls.**
  - **The trigger.** Each control's trigger is its existing element, a plain `<button>` with its existing class and labels, with `MenuTriggerProps` mapped to `ref`, `onClick`, `aria-expanded`, `aria-controls` and `aria-haspopup`.
  - **`PageActionsMenu`** is `surface="glass" align="end"`.
  - **`PageActionsBar`** is `surface="solid" align="end"`, with the overflow items only.
  - **Selecting an item.** `onClick` is called after the menu closes (Menu does this).
  - **`intentProps`** still spread onto overflow items.
  - Remove `useDismiss` and the `popoverAnchor` wrappers, then delete `action-menu-list/`.
  - Point Task 3's `types.test.ts` `PageActionItem` import at `../page-actions-menu/item.js`.
- [ ] **Step 5: Run** `npm test` and `npm run lint`. Expect everything green, including every existing PageActions test, unchanged.
- [ ] **Step 6: Take "after" screenshots** with the same commands, and compare them with the "before" set.
  - The menu box, its items and its position must match. The position must agree within 1px; the Popover is `fixed` where the old menu was `absolute`.
  - Fix any drift in styles, not by changing the spec's values. Note the comparison in the report.
- [ ] **Step 7: Update the docs.**
  - In `page-actions-menu.md` and `page-actions-bar.md`, the "Behaviour to know" section now lists the arrow keys, Home/End, Escape-returns-focus and innermost-first dismissal. Remove "No arrow-key navigation".
  - Add "For any other actions-behind-a-button, use `Menu`."
- [ ] **Step 8: Commit:** `refactor(page-actions): rebuild PageActionsMenu and PageActionsBar on Menu`.

### Task 5: Guidance and release

**Files:** Modify `AGENTS.md`, `docs/patterns.md`, `scripts/smoke-exports.sh`, `CHANGELOG.md`, `package.json`, `package-lock.json`.

- [ ] **Step 1: Add an AGENTS.md rule** next to the Dialog rule, in the same voice: "A list of actions or links behind a button is a `Menu` (`items` array; `to` for links, `onClick` for actions). Never hand-build `role="menu"` or a dropdown of buttons."
- [ ] **Step 2: Add a `docs/patterns.md` recipe** "Row or card actions menu": a `Menu` with a `Button` trigger, one link item with an `Icon`, and a danger item with `separatorBefore`.
- [ ] **Step 3: Extend the smoke probe** in `scripts/smoke-exports.sh`. Add `Menu`, `type MenuItem` and `type MenuProps` to the `@korzun/design/control` import, and add
  `export const menuProbe: [MenuItem, MenuProps['surface']] = [{ label: 'Open', to: '/x' }, 'glass'];`
  together with a reference to `Menu` so the value import is used, following how `Button` is referenced there.
- [ ] **Step 4: Write the CHANGELOG 0.4.0 entry**, in the style of the 0.3.0 entry:
  - Menu
  - the innermost-first layer stack (behaviour change: nested popovers and popovers under dialogs)
  - Popover `gap` accepting a CSS length
  - Button `ref`/`ariaHasPopup`
  - PageActions keyboard support
  - Set the version to `0.4.0` in `package.json`, then run `npm install --package-lock-only` so the lockfile matches.
- [ ] **Step 5: Run** `npm test`, `npm run lint` and `npm run smoke`. Expect all green and `smoke: ok`.
- [ ] **Step 6: Commit:** `docs: Menu guidance; 0.4.0`.
