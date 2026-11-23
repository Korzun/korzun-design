# Button

`import { Button } from '@korzun/design/control'`

A clickable action with a visual variant, optional icons, and a loading state.
Renders a `<div role="button">` (keyboard: Enter and Space, which it
preventDefaults, so Space does not scroll the page) unless `submit` is
set, in which case it renders a native `<button type="submit">`.

Use something else for: navigating back (`BackButton`), page-level actions in
the header (`PageActionsBar`, `PageActionsMenu`), sticky footer actions
(`PageFooterActions`), picking one of several options (`SegmentedControl`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `ReactNode` | | Label. |
| `type` | `'default' \| 'primary' \| 'text' \| 'link' \| 'dashed'` | `'default'` | **Visual variant, not the HTML `type`.** Use `submit` for a submit button. |
| `radius` | `'background' \| 'card' \| 'inset' \| 'modal'` | `'background'` | The surface the button sits on; see [corners](../corners.md). In a `Dialog` footer it defaults to `modal`. |
| `danger` | `boolean` | `false` | Red treatment. Mutually exclusive with `success` (type error). |
| `success` | `boolean` | `false` | Green treatment. Mutually exclusive with `danger`. |
| `loading` | `boolean` | `false` | Shows a spinner in place of the icons; blocks clicks. |
| `disabled` | `boolean` | `false` | |
| `onClick` | `() => void` | no-op | **Ignored when `submit` is set**; the form submits instead. Receives no event. |
| `submit` | `boolean` | `false` | Render a native submit button. Also shows the spinner while the enclosing form action is pending (`useFormStatus`). |
| `form` | `string` | | Id of the `<form>` to submit, for a submit button outside its form (e.g. in a `Card` footer). |
| `prefix` / `suffix` | `ComponentType<IconProps>` | | An icon **component** (`prefix={SearchIcon}`), not an element. |
| `ariaLabel` | `string` | | Required when the label alone is ambiguous, e.g. repeated "Remove" buttons in a list. |
| `ariaExpanded` / `ariaControls` | `boolean` / `string` | | For disclosure buttons. |
| `ariaHasPopup` | `'menu' \| 'listbox' \| 'dialog'` / `boolean` | | Announces the popup the button opens (`'menu'` for a menu trigger). Rendered in both modes. |
| `ref` | `Ref<HTMLElement>` | | Ref to the root element (the `<div role="button">`, or the `<button>` in submit mode), e.g. to `.focus()` it. A plain prop; no `forwardRef`. |
| `className` | `string` | | Override with `'&&'` specificity in your sheet, never `!important`. |
| `title` | `string` | | Passed through. |
| `tabIndex` | `number` | `0` (div mode) | The div-mode button is keyboard-focusable by default; an explicit value wins, except it is forced to `-1` while `disabled` or `loading`. Submit mode uses the native `<button>`, so it is passed through. |

## Choosing a variant

- `primary`: the one main action of a card, modal, or page (Save, Confirm).
- `default`: secondary actions; bordered.
- `text`: Cancel in a modal footer.
- `link`: inline row actions (Remove, Load more). It has no padding, so `radius`
  doesn't matter for it.
- `dashed`: an "add a row" affordance (as in `FieldList`).
- Add `danger` for destructive actions (Delete, Log out), on `primary` in a
  confirm or on `default` otherwise.

## Examples

```tsx
// On the page background: omit radius (defaults to 'background').
<Button danger onClick={logOut}>Log out</Button>

// In a Card footer, submitting a form that lives in the card body.
<Card
  title="Change password"
  footer={
    <Button type="primary" radius="card" submit form="change-password">
      Save
    </Button>
  }
>
  <form id="change-password" action={save}>…</form>
</Card>

// A modal footer.
<Button type="text" radius="modal" onClick={onCancel}>Cancel</Button>
<Button type="primary" danger radius="modal" loading={deleting} onClick={onConfirm}>
  Delete
</Button>
```

## Do / don't

- Do set `radius="card"` on every Button inside a `Card` (body or footer) and
  `radius="modal"` inside a modal, except `type="link"`.
- Do give repeated row actions a distinguishing `ariaLabel` ("Remove Kindle").
- Don't pass `type="submit"`: it is not a valid variant. Use `submit`.
- Don't pass `onClick` to a submit button and expect it to run.
- Don't pass an element to `prefix`/`suffix` (`prefix={<SearchIcon />}`); pass
  the component.
- Don't wrap Button in a `<button>` or `<a>`: it is already interactive.
