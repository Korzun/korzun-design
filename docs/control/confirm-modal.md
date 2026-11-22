# ConfirmModal

`import { ConfirmModal } from '@korzun/design/control'`

A ready-made yes/no modal built on [`Dialog`](dialog.md): a
title, a body (`children`), and a footer with a text Cancel and a primary
Confirm button. It is always mounted and fully controlled by `isOpen`.

Use something else for: a modal with its own form or more than two actions
(use [`Dialog`](dialog.md) for anything that is not yes/no), or a non-blocking notice
(toast).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `isOpen` | `boolean` | `false` | Controls visibility. Keep the element rendered; toggle this. |
| `title` | `string` | `'Confirm action'` | Header text. |
| `children` | `ReactNode` | | Body, rendered in secondary text colour. |
| `confirmText` | `string` | `'Confirm'` | |
| `cancelText` | `string` | `'Cancel'` | |
| `onConfirm` | `() => void` | no-op | Receives no event. **Does not close the modal**: set `isOpen` to `false` yourself when done. |
| `onCancel` | `() => void` | no-op | Called by the Cancel button, Escape, and a backdrop click. Receives no event. Close the modal in it. |
| `danger` | `boolean` | `false` | Red Confirm button; also tints `icon` red. |
| `icon` | `ComponentType<IconProps>` | | Icon **component** shown before the title (`icon={AlertOctagonIcon}`), not an element. |
| `loading` | `boolean` | `false` | Spinner on Confirm; disables both buttons; Escape and backdrop clicks are ignored (`canDismiss = !loading`). |
| `confirmDisabled` | `boolean` | `false` | Disables only Confirm (e.g. until a checkbox is ticked). |

No `className`. The props type is exported as `ConfirmModalProps`.

## Behaviour to know

- Footer buttons already get `radius="modal"` from `Dialog`; the dialog uses
  `recipe.modal.dialog` (`radius.lg`, it sits on the page). See
  [corners](../corners.md).
- `onCancel` is the single dismissal path, so whatever you do there runs for
  Escape and backdrop clicks too.

## Example

```tsx
const [confirming, setConfirming] = useState(false);

<Button danger onClick={() => setConfirming(true)}>Delete</Button>
<ConfirmModal
  isOpen={confirming}
  title="Delete book?"
  confirmText="Delete"
  danger
  icon={AlertOctagonIcon}
  loading={deleting}
  onCancel={() => setConfirming(false)}
  onConfirm={async () => {
    await remove();
    setConfirming(false);
  }}
>
  This can't be undone.
</ConfirmModal>
```

## Do / don't

- Do pass `loading` while the request runs, so the user can't dismiss mid-flight.
- Do close the modal in both `onCancel` and (after success) `onConfirm`.
- Don't render it conditionally (`{open && <ConfirmModal …/>}`); toggle `isOpen`.
- Don't pass `icon={<AlertOctagonIcon />}`; pass the component.
