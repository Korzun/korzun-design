# 0.3.0 Dialog, ErrorMessage, Spinner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `Dialog` (with `ConfirmModal` rebuilt on it), `ErrorMessage`, `Spinner`, and a Popover that works inside an open dialog, as `@korzun/design@0.3.0`.

**Architecture:** `Spinner` and `ErrorMessage` are small display components in `src/component/`, styled with static react-jss classes like `Text`. `Dialog` lives in `src/control/dialog/`, is built on `useModalDialog`, draws the modal recipes itself, and wraps `footer` in an internal Button radius context so footer Buttons default to `radius="modal"`. `ConfirmModal` becomes a thin wrapper on `Dialog`. `Popover` portals into `anchor.closest('dialog[open]')` when there is one.

**Tech Stack:** React 19, react-jss (`createUseStyles` from `src/theme`), classnames, vitest + jsdom + Testing Library, oxlint/oxfmt.

**Spec:** `docs/superpowers/specs/2026-11-22-dialog-error-spinner-design.md`

## Global Constraints

- Tokens only; no literal values in the new components (keywords like `0` and `1em` excepted).
- No visual change to `ConfirmModal` or any existing component.
- `useModalDialog` stays exported and unchanged.
- Relative imports to a module folder only, never the `control`/`component` barrels (stories may import `@gallery/*`).
- No runtime `dependencies`.
- Every new module has `index.tsx`, `style.ts` (if styled), `index.test.tsx`, `<name>.stories.tsx`, and `docs/<area>/<name>.md` listed in the AGENTS.md docs index; `<Name>Props` exported from the barrel with JSDoc on every prop.
- New components accept `className` (override with `'&&'`); pass-through HTML attributes exclude `style`.
- Tests use `renderWithProviders` from `src/test-utils.js`; dialogs stub `HTMLDialogElement.prototype.showModal`/`close` with `vi.fn()` as `src/control/confirm-modal/index.test.tsx` does; Escape is `fireEvent(dialog, new Event('cancel', { cancelable: true }))`.
- Before every commit: `npm test`, `npm run lint` (includes oxfmt check and `tsc --noEmit`).

## Review Focus

1. **Dialog mounted already open** (`open` true on first render): `showModal` must be called on mount, not only on a later change. Test in Task 3.
2. **`canDismiss` flipping while open** (a save starts after the dialog opened): Escape must be blocked from the rerender onward. Test in Task 3.
3. **ErrorMessage given `0`** (a numeric count as content): `0` is content, not "empty"; it must render. Test in Task 2.
4. **A Button nested in the footer inside another wrapper** (e.g. `<Inline>` around the footer buttons): it still gets the modal radius, while a Button in the body never does. Test in Task 3.
5. **Popover anchor inside a closed `<dialog>`** (no `open` attribute): must portal to `document.body`, not into the closed dialog. Test in Task 5.

---

### Task 1: Spinner

**Files:**
- Create: `src/component/spinner/index.tsx`, `src/component/spinner/style.ts`, `src/component/spinner/index.test.tsx`, `src/component/spinner/spinner.stories.tsx`, `docs/component/spinner.md`
- Modify: `src/component/index.ts` (alphabetical, after `Page`/`ProgressIndicator`, before `Stack`), `AGENTS.md` docs index `[docs/component]` list

**Interfaces:**
- Consumes: `SpinnerIcon` from `src/icon/spinner.js` (via `../../icon/index.js`); `TextSize` from `../text/style.js`; `theme.recipe.spinner`.
- Produces: `Spinner`, `SpinnerProps = { size?: TextSize; label?: string; decorative?: boolean; className?: string }`.

- [ ] **Step 1: Write failing tests** in `src/component/spinner/index.test.tsx`:
  - `has role="status" named "Loading" by default`: `getByRole('status', { name: 'Loading' })` exists.
  - `uses a custom label`: `<Spinner label="Loading books" />` → `getByRole('status', { name: 'Loading books' })`.
  - `decorative hides it from assistive tech`: `<Spinner decorative label="x" />` → `queryByRole('status')` is null; the svg has `aria-hidden="true"`.
  - `size resolves the font-size token`: `<Spinner size="xl" />` → computed `fontSize` equals `lightTheme.fontSize.xl`.
  - `unset size sets no font size`: inside `<div style={{ fontSize: '20px' }}>`, computed `fontSize` is `20px`.
  - `applies className`.
- [ ] **Step 2: Run** `npx vitest run src/component/spinner` → FAIL (module missing).
- [ ] **Step 3: Implement.** A `span` root carrying `role="status"` + `aria-label={label}` (or `aria-hidden` and no role when `decorative`), `display: inline-flex`, size classes `size-<key>` built from `theme.fontSize` like Text's `useTypography` (one static class per key). The `SpinnerIcon` inside gets `recipe.spinner` (`1em` square, `currentColor`) and is always `aria-hidden`. JSDoc each prop; component doc comment.
- [ ] **Step 4: Stories** `spinner.stories.tsx`: every size, labelled, decorative inline with text in an `Inline`, and a loading-page recipe (`<Stack align="center">`).
- [ ] **Step 5: Doc** `docs/component/spinner.md` in the house format (import line, when to use, props table, examples incl. the loading-page recipe, do/don't: don't hand-write `role="status"`; use `decorative` when adjacent text names the load; Button/Select/Switch draw their own). Add `spinner` to the AGENTS.md `[docs/component]` list and the barrel export.
- [ ] **Step 6: Run** `npm test && npm run lint` → all pass.
- [ ] **Step 7: Commit** `feat(component): Spinner`.

### Task 2: ErrorMessage

**Files:**
- Create: `src/component/error-message/{index.tsx,style.ts,index.test.tsx,error-message.stories.tsx}`, `docs/component/error-message.md`
- Modify: `src/component/index.ts` (after `EmptyState`), AGENTS.md `[docs/component]` list

**Interfaces:**
- Produces: `ErrorMessage`, `ErrorMessageProps` = `{ as?: 'p' | 'div' | 'span'; children?: ReactNode; className?: string; ref?: Ref<HTMLElement> }` plus `Omit<HTMLAttributes<HTMLElement>, 'style' | 'children'>`.

- [ ] **Step 1: Write failing tests:**
  - `renders a p with role="alert"`: tag `P`, `role="alert"`, text content.
  - `renders nothing when empty`: for each of `null`, `undefined`, `false`, `''`, `container` is empty (`container.firstChild` null).
  - `renders 0`: `<ErrorMessage>{0}</ErrorMessage>` renders an alert with text `0`.
  - `uses the danger colour and small size`: computed `color` channels equal `lightTheme.color.danger.default`; `fontSize` equals `lightTheme.fontSize.sm` (reuse the `channels` helper pattern from `src/component/text/index.test.tsx`).
  - `has no margin or padding`: computed `margin`/`padding` are `0px` for `as="p"`.
  - `as renders the element`: `div`, `span`.
  - `passes id and aria attributes through`; `applies className`.
- [ ] **Step 2: Run** `npx vitest run src/component/error-message` → FAIL.
- [ ] **Step 3: Implement** with `createElement(as, …)`. Empty check: `children == null || children === false || children === ''` → `return null`. Root style: `margin: 0`, `padding: 0`, `fontSize: theme.fontSize.sm`, `color: theme.color.danger.default`.
- [ ] **Step 4: Stories:** under a `TextInput` in a `Stack gap="sm"`, and empty (renders nothing, with a caption saying so).
- [ ] **Step 5: Doc** `docs/component/error-message.md`: when to use ErrorMessage (a failure the user must notice, announced) vs `<Text tone="danger">` (static red copy, darker chip red); empty renders nothing so leave it mounted; spacing from `Stack`; `aria-describedby` example with `id`. Barrel + AGENTS.md index.
- [ ] **Step 6: Run** `npm test && npm run lint`.
- [ ] **Step 7: Commit** `feat(component): ErrorMessage`.

### Task 3: Button radius context and Dialog

**Files:**
- Create: `src/control/button/radius-context.ts`, `src/control/dialog/{index.tsx,style.ts,index.test.tsx,dialog.stories.tsx}`, `docs/control/dialog.md`
- Modify: `src/control/button/index.tsx:85` (radius default), `src/control/index.ts` (after `DateTimeInput`), AGENTS.md `[docs/control]` list, `docs/control/button.md` (radius row: "in a Dialog footer defaults to `modal`")

**Interfaces:**
- Consumes: `useModalDialog(isOpen, onDismiss, canDismiss)` from `../use-modal-dialog/index.js`; `ButtonRadius` from `../button/style.js`.
- Produces:
  - `ButtonRadiusContext: React.Context<ButtonRadiusValue | undefined>` in `src/control/button/radius-context.ts` — internal, NOT re-exported from `src/control/button/index.tsx`'s public surface or any barrel.
  - `Dialog`, `DialogProps = { open: boolean; onClose: () => void; title: ReactNode; children?: ReactNode; footer?: ReactNode; canDismiss?: boolean; className?: string }`.

- [ ] **Step 1: Write failing tests** in `src/control/dialog/index.test.tsx` (stub `showModal`/`close` in `beforeEach` with fresh `vi.fn()`s so calls are countable):
  - `calls showModal when mounted open` (Review Focus 1) and `calls close when open turns false`.
  - `Escape calls onClose`; `a backdrop press and release calls onClose` (`mouseDown` then `click` on the `<dialog>`).
  - `canDismiss={false} blocks Escape and backdrop`.
  - `blocks Escape after canDismiss flips to false while open` (Review Focus 2): render with `canDismiss`, `rerender` with `canDismiss={false}`, fire cancel → `onClose` not called.
  - `names the dialog by its title`: `getByRole('dialog', { name: 'Fixes waiting', hidden: true })`.
  - `draws no footer bar without footer`, and one with it (query by a `data-` hook or the footer's text).
  - `footer Buttons default to the modal radius`: a footer `<Button>` has the same computed `borderRadius` as a standalone `<Button radius="modal">`; a footer `<Button radius="inset">` keeps inset; a body `<Button>` matches a standalone default Button.
  - `nested footer Button still gets the modal radius` (Review Focus 4): footer `<Inline><Button>…</Button></Inline>`.
  - `a click inside does not bubble to a clickable parent`: wrap in `<div onClick={spy}>`, click the body → spy not called.
  - `applies className to the dialog`.
- [ ] **Step 2: Run** `npx vitest run src/control/dialog` → FAIL.
- [ ] **Step 3: Implement the context.** `radius-context.ts` exports `ButtonRadiusContext = createContext<ButtonRadiusValue | undefined>(undefined)`. In `Button`, drop the destructuring default and use `radius ?? useContext(ButtonRadiusContext) ?? ButtonRadius.Background` (call `useContext` unconditionally at the top).
- [ ] **Step 4: Implement Dialog.** Structure and styles move from `src/control/confirm-modal/{index.tsx,style.ts}` (root = `recipe.modal.dialog`; inner column `display: flex`, `flexDirection: column`, `backgroundColor: color.bg.card`; header = `recipe.modal.header`; body padding `space.xxl` sides / `space.xxxxl` bottom, `color.text.secondary`; footer = `recipe.modal.footer`). Title wrapper is a `<div>` with a `useId()` id referenced by the dialog's `aria-labelledby`. Both `onClick` handlers `stopPropagation`. `footer` is wrapped in `<ButtonRadiusContext.Provider value={ButtonRadius.Modal}>` and omitted entirely when absent.
- [ ] **Step 5: Stories** `dialog.stories.tsx`, each opened by a Button: plain (no footer), with a Cancel/Save footer, `canDismiss={false}` with a loading Save, and a form with a `TextInput` and a `Select` (the Select is expected broken until Task 5; note it in the story).
- [ ] **Step 6: Doc** `docs/control/dialog.md`: props table, the spec's example, behaviour (Escape/backdrop, `canDismiss`, always mounted, native focus, click containment, footer radius default), do/don't (use `ConfirmModal` for yes/no; don't set `radius="modal"` by hand; don't write modal style files). Barrel + AGENTS.md index + `button.md`.
- [ ] **Step 7: Run** `npm test && npm run lint`.
- [ ] **Step 8: Commit** `feat(control): Dialog; footer Buttons default to modal radius`.

### Task 4: ConfirmModal on Dialog

**Files:**
- Modify: `src/control/confirm-modal/index.tsx`, `src/control/confirm-modal/style.ts` (keep only the icon rules), `docs/control/confirm-modal.md`, `docs/control/use-modal-dialog.md`
- Test: `src/control/confirm-modal/index.test.tsx` (unchanged; add the tests below)

**Interfaces:**
- Consumes: `Dialog`, `DialogProps` from `../dialog/index.js` (Task 3).
- Produces: `ConfirmModal`, `ConfirmModalProps` — public API identical to today.

- [ ] **Step 1: Add tests** to the existing file: `is named by its title` (`getByRole('dialog', { name: 'Delete book', hidden: true })`); `footer buttons keep the modal radius` (Cancel's computed `borderRadius` equals a standalone `<Button radius="modal">`'s).
- [ ] **Step 2: Run** `npx vitest run src/control/confirm-modal` → the name test FAILs (no `aria-labelledby` today).
- [ ] **Step 3: Rebuild** `ConfirmModal` as `<Dialog open={isOpen} onClose={onCancel} canDismiss={!loading} title={<>{icon}{title}</>} footer={<>Cancel Confirm</>}>{children}</Dialog>`, keeping the icon wrapper and `iconDanger` rules in its `style.ts` and dropping the explicit `radius="modal"` on its Buttons. Every existing test passes unchanged.
- [ ] **Step 4: Visual check:** run the gallery (`npx vite --config gallery/vite.config.ts --port 5199`), screenshot the ConfirmModal story before (on `main` via `git stash`/worktree, or from the pre-change commit) and after with `playwright screenshot`, and compare; they must match.
- [ ] **Step 5: Docs:** `confirm-modal.md` says it is built on `Dialog` and to use `Dialog` for anything not yes/no; `use-modal-dialog.md` says reach for `Dialog` first, the hook remains for modals Dialog can't express.
- [ ] **Step 6: Run** `npm test && npm run lint`.
- [ ] **Step 7: Commit** `refactor(confirm-modal): build on Dialog`.

### Task 5: Popover inside an open dialog

**Files:**
- Modify: `src/control/popover/index.tsx` (portal target), `src/control/popover/index.test.tsx`, `docs/control/popover.md`, `src/control/dialog/dialog.stories.tsx` (remove the "broken" note)

**Interfaces:**
- Consumes: `Dialog` (Task 3) for one integration test.
- Produces: no API change.

- [ ] **Step 1: Write failing tests:**
  - `portals into an open dialog that contains the anchor`: render `<dialog open><div ref={anchor}/></dialog>` plus an open Popover; content's closest `dialog` is that dialog.
  - `portals to document.body outside a dialog`: content's `parentElement` is `document.body`.
  - `portals to document.body when the containing dialog is closed` (Review Focus 5): `<dialog>` without `open`.
  - `Escape closes the popover and not the Dialog`: inside a `Dialog` (open), a Popover with `onClose`; `fireEvent.keyDown(document, { key: 'Escape' })` → popover `onClose` called and the keydown is `defaultPrevented`; `Dialog`'s `onClose` not called.
  - `clicking popover content does not close the Dialog`: `mouseDown` + `click` on the content → `Dialog` `onClose` not called.
- [ ] **Step 2: Run** `npx vitest run src/control/popover` → the first test FAILs.
- [ ] **Step 3: Implement:** compute the target when rendering open as `anchorRef.current?.closest('dialog[open]') ?? document.body` and pass it to `createPortal`. Update the component doc comment.
- [ ] **Step 4: Visual check:** in the gallery, open the Dialog story's form and its Select; screenshot with the dropdown open. It must show above the dialog and accept a click. If the dropdown's text is visibly larger than outside a dialog (inherited `fontSize.lg`), pin Popover's wrapper to the inherited-safe values (`fontSize.md`, `lineHeight.body`) and note it in the CHANGELOG; otherwise leave it.
- [ ] **Step 5: Doc** `popover.md`: replace the `showModal()` caveat with "inside an open `<dialog>` it portals into that dialog, so it shows in the top layer; also matches a non-modal `show()` dialog". Keep the "close popovers before opening a dialog" note. Drop the broken note from the Dialog story.
- [ ] **Step 6: Run** `npm test && npm run lint`.
- [ ] **Step 7: Commit** `fix(popover): render inside an open dialog`.

### Task 6: Guidance and release

**Files:**
- Modify: `AGENTS.md`, `docs/patterns.md`, `CHANGELOG.md`, `package.json` (`version: 0.3.0`), `scripts/smoke-exports.sh` (probe)

- [ ] **Step 1: AGENTS.md:**
  - Rule 3: "Buttons in a `Dialog` footer get `radius="modal"` automatically."
  - Rule 7: "use `ConfirmModal` for yes/no and `Dialog` for everything else" (keep `useModalDialog` as the escape hatch).
  - Rule 10: drop `Dialog` and `Alert` from the missing list; add "show error lines with `ErrorMessage`, loading with `Spinner`".
  - Imports table: `Dialog` in the `/control` row; `ErrorMessage`, `Spinner` in the `/component` row.
- [ ] **Step 2: `docs/patterns.md`:** the modal recipe uses `Dialog`; form errors use `ErrorMessage` in the form's `Stack`; loading uses `Spinner`.
- [ ] **Step 3: Smoke probe** after `layoutProbe`: `export const feedbackProbe: [DialogProps['canDismiss'], ErrorMessageProps['as'], SpinnerProps['size']] = [false, 'div', 'xl'];` with the matching type imports.
- [ ] **Step 4: CHANGELOG 0.3.0:** the three components; ConfirmModal rebuilt on Dialog (no API or visual change; now named by its title); Popover renders inside an open dialog so Select and ChipsInput work in modals; Buttons in a Dialog footer default to `radius="modal"`; guidance changes. Bump `package.json` to `0.3.0`.
- [ ] **Step 5: Run** `npm test && npm run lint && npm run smoke` → all pass, `smoke: ok`.
- [ ] **Step 6: Commit** `docs: Dialog, ErrorMessage, Spinner guidance; 0.3.0`.
