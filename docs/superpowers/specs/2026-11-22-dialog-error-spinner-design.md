# 0.3.0: Dialog, ErrorMessage, Spinner

The third 0.1.x-series round, after 0.2.0 (Stack, Inline, Text, Heading).
Menu, with an Escape layer stack, is the next round (0.4.0).

## Why

The aim is the same as last round: coding agents that build screens with
`@korzun/design` should not hand-assemble common pieces. What they assemble
by hand today, in Bookplate:

- **Modals:** nine, all with the same shape: a title, a body, and a footer of
  one or two Buttons. Each one repeats:
  - a native `<dialog>` wired through `useModalDialog`
  - two click-swallowing `onClick` handlers
  - `recipe.modal.dialog`, `.header` and `.footer` in its own style file
  - `radius="modal"` on every footer Button
- **Error lines:** 18 style files define an `error:` block. Nearly every one is
  a line of small red text (`color.danger.default`, `fontSize.sm`) with its own
  padding or margin. None has `role="alert"`, so screen readers stay silent.
- **Spinners:** seven hand assemblies of `SpinnerIcon` plus `recipe.spinner`.
  The standalone ones hand-write `role="status" aria-label="Loading"`.

A bug also becomes urgent once there is a general Dialog. `Popover` portals
to `document.body`. Inside a modal `<dialog>` opened with `showModal()`, that
portal sits under the dialog's top layer, so a `Select` or `ChipsInput`
dropdown in a modal is hidden and inert. No Bookplate modal has a Select
today, but a general Dialog invites forms.

## Goals

- An agent writes a modal with one component and no style file:
  `<Dialog open onClose title footer>body</Dialog>`.
- `ConfirmModal` is rebuilt on `Dialog` and keeps its exact public API.
- An error line is `<ErrorMessage>{error}</ErrorMessage>`, which is announced.
- A loading indicator is `<Spinner />`, which is announced with a label
  unless marked decorative.
- `Select` and `ChipsInput` work inside a `Dialog`.

## Non-goals

- **The tinted Alert box** (tone, title, border). The user's call: build it
  when a screen needs it.
- **Menu and the Escape layer stack.** They come in 0.4.0.
- **Moving `Button`, `Select`, and `Switch` onto `Spinner`.** Their internal
  spinners stay untouched, so nothing shifts visually.
- **Buttons inside a `Card` picking up `radius="card"`** by the same mechanism
  as the Dialog footer. It would work, but it's left for a later round so
  this one only changes modals.
- **Migrating Bookplate,** aviary, or Scribe.
- **Size variants for Dialog.** Every modal stays `layout.modalWidth`, as
  today.

## Anti-goals

- **Two ways to write a modal.** No `Dialog.Header` / `Dialog.Body` /
  `Dialog.Footer` building blocks beside the props.
- **A visual change** to `ConfirmModal` or any existing component.
- **Literal values** in the new components (keywords like `0` and `1em`
  excepted).
- **Breaking `useModalDialog`.** It stays exported and unchanged for modals
  that don't fit `Dialog`.

## Approaches

### What "Alert" is this round

Decided: **A**.

- **A. An error message component (picked).** It draws the red line Bookplate
  already uses and adds `role="alert"`. It matches all 18 cases, so migrating
  them is a straight swap.
- **B. A tinted box with tone and title.** A new look Bookplate doesn't use
  yet. Deferred until a screen needs it.

### How Dialog is put together

Decided: **A**.

- **A. Props for each part (picked).** `title`, `children`, and `footer`.
  `Dialog` draws the header, body padding, and footer bar. Footer Buttons pick
  up `radius="modal"` automatically. This matches last round's props-first
  rule: one obvious way, nothing to forget. Cost: a modal with an unusual
  layout can't rearrange parts. Bookplate has none.
- **B. Separate building blocks** (`Dialog.Header` etc.). Rejected: agents
  can leave out or misorder parts, and a modal can be written several ways.
- **Dropped: only improving `useModalDialog` and the recipes.** Agents would
  keep hand-building modals.

## Design

### Dialog

`src/control/dialog/`, exported from `@korzun/design/control` with
`DialogProps`.

```tsx
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Fixes waiting for this book"
  canDismiss={!saving}
  footer={
    <>
      <Button type="text" onClick={close}>Cancel</Button>
      <Button type="primary" onClick={save} loading={saving}>Save</Button>
    </>
  }
>
  This book has metadata fixes you haven't reviewed yet.
</Dialog>
```

Props:

- **`open`:** `boolean`, required. `true` calls `showModal()`, `false` calls
  `close()`. The `<dialog>` stays mounted, as `useModalDialog` does today.
- **`onClose`:** `() => void`, required. Called on Escape and on a backdrop
  click (press and release both on the backdrop, as `useModalDialog` does).
  It closes nothing itself.
- **`canDismiss`:** `boolean`, default `true`. When `false`, Escape and
  backdrop clicks do nothing. Pass `!loading`.
- **`title`:** `ReactNode`, required. Rendered in the header with
  `recipe.modal.header`. The dialog's `aria-labelledby` points at it. The
  title wrapper stays a `<div>` (builder check; my call): a heading element
  would bring its own margin and font and change ConfirmModal's look.
- **`children`:** the body.
- **`footer`:** `ReactNode`, optional. Rendered in the footer bar with
  `recipe.modal.footer`. With no `footer`, no footer bar is drawn.
- **`className`:** applied to the `<dialog>`; override with `'&&'`.

Behaviour:

- Built on `useModalDialog`, so Escape and backdrop handling stay in one
  place.
- Clicks inside the dialog stop propagating, as all nine Bookplate modals do
  by hand, so a dialog inside a clickable `Card` doesn't click the card.
- **Look:** byte-equivalent to `ConfirmModal`'s current look:
  `recipe.modal.dialog` on the `<dialog>`, a `color.bg.card` column inside it,
  the header recipe, a body padded `space.xxl` on the sides and `space.xxxxl`
  below in `color.text.secondary`, and the footer recipe.
- **Focus:** left to the native `<dialog>`. `showModal()` focuses the first
  focusable element (or the one with `autoFocus`), and closing returns focus
  to where it was. No extra focus code.

### Footer Buttons pick up `radius="modal"`

- `Button` gains an internal context holding a default radius. When a Button
  has no `radius` prop, it uses the context's value, and without a context it
  falls back to `background`, as today.
- `Dialog`'s footer provides `modal`. An explicit `radius` prop still wins.
- The context is internal: not exported from any barrel, and not documented
  as public API. A later round can reuse it for `Card`.
- Buttons in the body are unaffected. The context is provided only around
  `footer`.

### ConfirmModal on Dialog

- Same props, same defaults, same behaviour, same look. Its tests and stories
  must pass unchanged, apart from implementation details they may assert on.
- `title` plus the optional `icon` (tinted red when `danger`) become the
  Dialog `title`. Cancel and Confirm become the `footer`. `loading` maps to
  `canDismiss={!loading}`.
- The footer Buttons may drop their explicit `radius="modal"`, since the
  context supplies it.

### Popover inside a Dialog

- When the anchor is inside an open `<dialog>`, `Popover` portals into that
  `<dialog>` instead of `document.body`. Otherwise it portals to
  `document.body`, as today. The target is resolved each time it opens, with
  `anchor.closest('dialog[open]')`.
- That puts the dropdown in the dialog's top layer, so it shows and takes
  clicks. Positioning stays `position: fixed` against the viewport.
- `Select` and `ChipsInput` get this for free.
- Escape on an open popover inside a dialog already calls `preventDefault`,
  so it closes the popover and not the dialog. A test pins that.
- A click inside the portalled content isn't a backdrop click (the target
  is the content, not the `<dialog>`), so the dialog stays open. A test pins
  that.
- The `popover.md` caveat about `showModal()` is replaced with the new
  behaviour.
- **Inherited text styles** (builder check; my call): portalled into the
  dialog, the content inherits `recipe.modal.dialog`'s `fontSize.lg`, line
  height, and cursor. Check the Select-in-Dialog story and pin Popover's own
  font only if the dropdown looks wrong there.
- **Non-modal dialogs** (builder check; my call): `closest('dialog[open]')`
  also matches a dialog opened with `show()`. Portalling into it is harmless;
  `popover.md` mentions it.

### ErrorMessage

`src/component/error-message/`, exported from `@korzun/design/component` with
`ErrorMessageProps`.

```tsx
<Stack gap="sm">
  <TextInput … />
  <ErrorMessage>{saveError}</ErrorMessage>
</Stack>
```

- Draws `fontSize.sm` text in `color.danger.default`. That is Bookplate's
  current error colour, so migrated screens don't change. Note the difference
  from `<Text tone="danger">`, which uses the darker `color.chip.danger.text`.
  The doc says when to use which: ErrorMessage for a failure the user must
  notice, Text for static red copy.
- `role="alert"`, so it is announced when it appears.
- **Empty renders nothing.** `null`, `undefined`, `false`, and `''` render no
  element, so `<ErrorMessage>{error}</ErrorMessage>` can stay in place.
- No margin or padding of its own. Spacing comes from the parent `Stack`.
- **`as`:** `'p'` (default), `'div'`, or `'span'`. `p` resets its margin.
- **`id`** and other HTML attributes pass through, minus `style`, so a field
  can point `aria-describedby` at it. `className` for overrides.

### Spinner

`src/component/spinner/`, exported from `@korzun/design/component` with
`SpinnerProps`.

```tsx
<Spinner />
<Spinner size="xl" label="Loading books" />
<Inline gap="xs"><Spinner decorative /> Uploading…</Inline>
```

- Renders `SpinnerIcon` with `recipe.spinner`: `1em` square, so it follows the
  surrounding font size, in `currentColor`.
- **`size`:** any `keyof Theme['fontSize']` (the `TextSize` union). It sets
  the font size, so the `1em` icon matches. No default: unset inherits.
- **`label`:** `string`, default `'Loading'`. Rendered as
  `role="status"` with that accessible name.
- **`decorative`:** `boolean`, default `false`. Hides the spinner from screen
  readers (`aria-hidden`, no role) for when nearby text already says what is
  loading. `label` is ignored then.
- **`className`** for overrides. No `as`.
- There is no centred loading block. Centre a Spinner with
  `<Stack align="center">`. The doc shows a loading-page recipe.

### Docs and guidance

- Doc files: `docs/control/dialog.md`, `docs/component/error-message.md`,
  `docs/component/spinner.md`, listed in the AGENTS.md docs index.
- `docs/control/confirm-modal.md`: says it is built on Dialog. Use Dialog for
  anything that isn't yes/no.
- `docs/control/use-modal-dialog.md`: says to reach for Dialog first. The hook
  remains for modals Dialog can't express.
- `docs/control/popover.md` and `docs/control/button.md` updated for the new
  behaviour.
- **AGENTS.md:**
  - Rule 3: Buttons in a Dialog footer get `radius="modal"` automatically.
  - Rule 7: use `ConfirmModal` for yes/no and `Dialog` for everything else.
  - Rule 10: drop `Dialog` and `Alert` from the missing pieces, and point at
    `ErrorMessage` for error lines.
  - Imports table: add the three components.
- `docs/patterns.md`: the modal recipe uses Dialog, and form errors use
  ErrorMessage.

### Release

- **Version:** `0.3.0`, with a CHANGELOG entry covering the three components,
  ConfirmModal's rebuild (no API change), the Popover-in-dialog fix, and the
  footer radius default.
- **Smoke probe:** imports `DialogProps`, `ErrorMessageProps`, `SpinnerProps`.
- **Stories:**
  - Dialog: plain, with footer, no footer, `canDismiss={false}` with a
    loading Save, and a form containing a `Select`.
  - ErrorMessage: under a field, and empty.
  - Spinner: each size, a labelled one, and a decorative one in text.
- **Tests:**
  - Dialog: `open` drives `showModal`/`close`; Escape and backdrop call
    `onClose`; `canDismiss={false}` blocks both; `aria-labelledby` names the
    title; no footer bar without `footer`; a footer Button without `radius`
    gets the modal radius; one with `radius` keeps it; a body Button keeps
    the default.
  - ConfirmModal: its existing tests pass.
  - Popover: inside an open dialog it portals into the dialog; outside, to
    `document.body`; Escape in it leaves the dialog open; clicking its content
    doesn't close the dialog.
  - ErrorMessage: `role="alert"`; renders nothing for each empty value; `as`
    renders the element; pass-through attributes arrive; the token colour and
    size resolve.
  - Spinner: `role="status"` with the default and a custom label;
    `decorative` hides it; `size` resolves the token; unset sets no size.
- Run `npm run lint` before pushing (CI checks formatting).

## Left to the builder

- How `Dialog` wires `aria-labelledby` (for example `useId`).
- The exact Button context shape and where it lives inside
  `src/control/button/`.
- Whether jsdom needs `showModal`/`close` stubs for the tests, and where they
  live.
- Story layout.
