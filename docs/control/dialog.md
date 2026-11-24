# Dialog

`import { Dialog, type DialogProps } from '@korzun/design/control'`

A modal on a native `<dialog>` (via `useModalDialog`): a title, a body
(`children`), and an optional `footer` for actions. It is always mounted and
fully controlled by `open`. The title names the dialog for assistive tech.

Use something else for: a yes/no question ([`ConfirmModal`](confirm-modal.md)),
a non-blocking notice (toast).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | (required) | Controls visibility. Keep the element rendered; toggle this. |
| `onClose` | `() => void` | (required) | Called on Escape and a backdrop click, unless `canDismiss` is `false`. Receives no event. Close the dialog in it. |
| `title` | `ReactNode` | (required) | Header content; also the dialog's accessible name. |
| `children` | `ReactNode` | | Body, rendered in secondary text colour. |
| `footer` | `ReactNode` | | Action row. No footer bar is drawn when omitted. |
| `canDismiss` | `boolean` | `true` | When `false`, Escape and backdrop clicks are ignored; pass `!loading`. |
| `className` | `string` | | Extra class on the `<dialog>`; win specificity with `'&&'`, never `!important`. |

The props type is exported as `DialogProps`.

## Behaviour to know

- Escape and a backdrop press-and-release both call `onClose`; it is the
  single dismissal path. `canDismiss={false}` blocks both.
- Escape goes to the innermost open layer first: a `Select` list or other
  popover open inside the dialog closes before the dialog, and a dialog opened
  over a still-open popover closes before that popover.
- Always mounted: toggle `open`, don't render it conditionally.
- Focus is native: `showModal()` moves focus into the dialog and restores it
  on close.
- Clicks inside the dialog do not bubble to clickable ancestors.
- Content is one surface level in: Buttons in the body, header and `footer`
  (including nested ones inside an `Inline`) default to 8px. An explicit
  `radius` on a Button still wins.

## Example

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Review fixes</Button>
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Fixes waiting"
  canDismiss={!saving}
  footer={
    <>
      <Button type="text" onClick={() => setOpen(false)}>Cancel</Button>
      <Button type="primary" loading={saving} onClick={save}>Save</Button>
    </>
  }
>
  <TextInput name="note" label="Note" layout="vertical" value={note} onChange={setNote} />
</Dialog>
```

## Do / don't

- Do use [`ConfirmModal`](confirm-modal.md) for yes/no questions.
- Do pass `canDismiss={!loading}` while a request runs.
- Don't set `radius` on Buttons inside a Dialog by hand; the depth does it.
- Don't write your own modal style files; build on `Dialog`.
- Don't render it conditionally (`{open && <Dialog …/>}`); toggle `open`.
