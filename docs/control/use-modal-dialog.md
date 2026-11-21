# useModalDialog

`import { useModalDialog } from '@korzun/design/control'`

A hook that drives a native `<dialog>` from an `isOpen` boolean: it calls
`showModal()` / `close()` for you and routes Escape and backdrop clicks to
`onDismiss`. It is the base for every modal in the library (`ConfirmModal`
uses it). There is no general `Dialog` component; build custom modals with
this hook plus the `theme.recipe.modal.*` styles.

Use something else for: a plain yes/no confirmation (`ConfirmModal`), a
dropdown or non-modal floating layer (`Popover`).

## Signature

```ts
function useModalDialog(
  isOpen: boolean,
  onDismiss: () => void,
  canDismiss?: boolean, // default true
): RefObject<HTMLDialogElement | null>;
```

| Argument | Type | Default | Notes |
|---|---|---|---|
| `isOpen` | `boolean` | (required) | The single source of truth. `true` calls `showModal()`, `false` calls `close()`. |
| `onDismiss` | `() => void` | (required) | Called on Escape and on a backdrop click. **It does not close anything itself**: set your `isOpen` state to `false` in it. Receives no event. |
| `canDismiss` | `boolean` | `true` | When `false`, Escape and backdrop clicks are swallowed. Pass `!loading` (or `countdown === 0`) so an in-flight request can't be escaped. |

Returns a ref to attach to the `<dialog>`.

## Behaviour to know

- Escape fires the dialog's `cancel` event; the hook always calls
  `preventDefault()` so the browser never closes the dialog behind React's back.
- A backdrop click counts only when **both** mousedown and mouseup land on the
  `<dialog>` element itself (its content lives in a child). Dragging a text
  selection out of an input onto the backdrop does not dismiss.
- The `<dialog>` must stay mounted. Rendering it conditionally (`{isOpen && <dialog…>}`)
  breaks `showModal()`; its children also stay mounted while closed, so reset
  any form state yourself when reopening.
- Never call `showModal()` / `close()` yourself.

## Example

```tsx
const ref = useModalDialog(isOpen, onClose, !saving);

<dialog ref={ref} className={styles.dialog} onClick={(e) => e.stopPropagation()}>
  <div className={styles.header}>Edit progress</div>
  <div className={styles.body}>…</div>
  <div className={styles.footer}>
    <Button type="text" radius="modal" disabled={saving} onClick={onClose}>Cancel</Button>
    <Button type="primary" radius="modal" loading={saving} onClick={save}>Save</Button>
  </div>
</dialog>

// style.ts
dialog: { ...theme.recipe.modal.dialog },   // radius.lg: the dialog sits on the page
header: { ...theme.recipe.modal.header },
body: { padding: `0 ${theme.space.xxl} ${theme.space.xxl}` },
footer: { ...theme.recipe.modal.footer },
```

## Do / don't

- Do pass `canDismiss={!loading}` and also disable the Cancel button while
  loading, so every exit is gated the same way.
- Do keep the `onClick={(e) => e.stopPropagation()}` on the `<dialog>` when it
  is rendered inside a clickable ancestor (a card row); it only stops bubbling,
  dismissal is the hook's job.
- Do use `radius="modal"` on Buttons inside, and `md` corners for any inset
  surface inside (see [corners](../corners.md)).
- Don't put a `Select` or `ChipsInput` in a modal without testing it: their
  dropdowns portal to `document.body`, outside the dialog's top layer (see
  [popover](popover.md)).
