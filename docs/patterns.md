# Patterns

How screens are put together from the library, as Bookplate does it.

## A screen

A screen is a `Page` holding a vertical stack of `Card`s, one card per feature.
Page-level buttons sit between the cards with no `radius` prop, because they are
on the page background.

```tsx
import { Page, Card, ThemeSetting } from '@korzun/design/component';
import { Button, Switch } from '@korzun/design/control';

export const SettingsPage = () => (
  <Page back="/" documentTitle="Settings">
    <ThemeSetting />
    <Card title="Notifications">
      <Switch name="digest" label="Email digests" checked={digest} onChange={setDigest} />
    </Card>
    <Button danger onClick={logOut}>Log out</Button>
  </Page>
);
```

## A form in a card

- Fields go in the card body, in a column with `gap: theme.space.md`. Keep each
  input's default `horizontal` layout (label and control on one shaded row).
- Every field needs a `name`. It is required, and it is the key passed to
  `onValidChange`.
- The submit button goes in the `footer`: `type="primary"`, `radius="card"`,
  `submit`, and `form` set to the id of the `<form>` in the body.

```tsx
<Card
  title="Change password"
  footer={
    <Button type="primary" radius="card" submit form="change-password">Save</Button>
  }
>
  <form id="change-password" className={styles.fields} action={save}>
    <TextInput name="current" label="Current" password value={current} onChange={setCurrent} />
    <TextInput name="next" label="New" password value={next} onChange={setNext} />
  </form>
</Card>
```

## A confirmation

Use `ConfirmModal` for yes/no confirmations. Pass `loading` while the request
is in flight; it disables Cancel and blocks Escape and backdrop dismissal.

```tsx
<ConfirmModal
  isOpen={confirming}
  title="Delete book?"
  confirmText="Delete"
  danger
  loading={deleting}
  onCancel={() => setConfirming(false)}
  onConfirm={remove}
>
  This can't be undone.
</ConfirmModal>
```

## A custom modal

There is no general `Dialog` component yet. Build one on `useModalDialog` and
the modal recipes:

```tsx
const ref = useModalDialog(isOpen, onClose, !saving); // canDismiss = !saving
return (
  <dialog ref={ref} className={styles.dialog} onClick={(e) => e.stopPropagation()}>
    <div className={styles.header}>Edit progress</div>
    <div className={styles.body}>…</div>
    <div className={styles.footer}>
      <Button type="text" radius="modal" onClick={onClose} disabled={saving}>Cancel</Button>
      <Button type="primary" radius="modal" loading={saving} onClick={save}>Save</Button>
    </div>
  </dialog>
);
// style.ts:
// dialog: { ...theme.recipe.modal.dialog }, header: { ...theme.recipe.modal.header },
// body: { padding: `0 ${theme.space.xxl} ${theme.space.xxl}` },
// footer: { ...theme.recipe.modal.footer }
```

- `useModalDialog` owns open and close. Never call `showModal()` or `close()`
  yourself, and never render the `<dialog>` conditionally: it must stay mounted.
- Escape and backdrop clicks call `onDismiss`, unless `canDismiss` is false.

## Notifications

`const toast = useToast()` inside `ToastProvider`. See [toast](toast.md).

## Overriding a library style

Pass `className` (only some components accept it; each module doc says so) and
win specificity with `'&&'`:

```ts
searchButton: { '&&': { borderRadius: theme.radius.md } },
```

Never use `!important`, and never target the library's internal class names.

## Layout and text

There are no `Stack`, `Text`, or `Heading` components yet. Write a small
`createUseStyles` rule using tokens: `display: 'flex'`, `gap: theme.space.*`,
`fontSize: theme.fontSize.*`, `fontWeight: theme.fontWeight.*`,
`color: theme.color.text.*`. Don't use inline `style={{…}}` objects with
literal values.
