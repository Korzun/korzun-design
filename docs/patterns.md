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

- Fields go in the card body, in a `<Stack gap="md">`. Keep each
  input's default `horizontal` layout (label and control on one shaded row).
- Every field needs a `name`. It is required, and it is the key passed to
  `onValidChange`.
- The submit button goes in the `footer`: `type="primary"`, `submit`, and `form` set to the id of the `<form>` in the body.

```tsx
<Card
  title="Change password"
  footer={
    <Button type="primary" submit form="change-password">Save</Button>
  }
>
  <form id="change-password" action={save}>
    <Stack gap="md">
      <TextInput name="current" label="Current" password value={current} onChange={setCurrent} />
      <TextInput name="next" label="New" password value={next} onChange={setNext} />
    </Stack>
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

## Status banner in a card

An `Alert` inside a `Card` is one step squarer than the Card, and its action
Button one step squarer again. No radius props anywhere.

```tsx
<Card title="Frame">
  <Alert tone="warning" title="Frame is overdue" action={<Button onClick={retry}>Retry</Button>}>
    No check-in for 2h 14m.
  </Alert>
</Card>
```

## Row or card actions menu

Use `Menu` for a list of actions or links behind a button. Spread the trigger
props onto a `Button`; put a link first, and a destructive action last behind
a separator.

```tsx
<Menu
  align="end"
  items={[
    { label: 'Open reader', to: `/books/${id}/read`, Icon: BookIcon },
    { label: 'Delete', onClick: () => setConfirming(true), danger: true, separatorBefore: true },
  ]}
  trigger={(p) => <Button {...p} ariaLabel="Book actions">Actions</Button>}
/>
```

## A custom modal

Use `Dialog` for anything that is not a yes/no question: a title, a body, and
an optional footer. Put form errors in the form's `Stack` with `ErrorMessage`,
and show loading with `Spinner` (or `loading` on the Button).

```tsx
const [open, setOpen] = useState(false);
const [saving, setSaving] = useState(false);
const [error, setError] = useState<string>();

async function save(formData: FormData) {
  setSaving(true);
  setError(undefined);
  try {
    await updateProgress(Number(formData.get('page')));
    setOpen(false);
  } catch {
    setError('Could not save. Try again.');
  } finally {
    setSaving(false);
  }
}

<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Edit progress"
  canDismiss={!saving}
  footer={
    <>
      <Button type="text" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
      <Button type="primary" submit form="edit-progress" loading={saving}>Save</Button>
    </>
  }
>
  <form id="edit-progress" action={save}>
    <Stack gap="md">
      <NumberInput name="page" label="Page" value={page} onChange={setPage} />
      <ErrorMessage>{error}</ErrorMessage>
    </Stack>
  </form>
</Dialog>
```

- A panel that loads on its own shows a `Spinner`:
  `<Stack align="center"><Spinner label="Loading books" /></Stack>`.
- Buttons in the footer get Dialog's corners from depth; don't set `radius`.
- `Dialog` stays mounted: toggle `open`, never render it conditionally.
- Escape and backdrop clicks call `onClose`, unless `canDismiss` is false.
- `Select` and `ChipsInput` work inside a `Dialog`.
- Only for a custom native `<dialog>` that `Dialog` can't express, build on
  `useModalDialog` (see [use-modal-dialog](control/use-modal-dialog.md)).

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

Use `Stack` and `Inline` for layout and `Text` and `Heading` for text, not
style files. Recipes:

- Body text: a bare `<Text>`; it takes the surrounding look.
- Meta line: `<Text size="sm" tone="muted">`.
- Caption: `<Text size="xs" tone="faint">`.
- Section title: `<Heading level={2}>`.
- Spread row: `<Inline justify="between">`.

```tsx
<Stack gap="md">
  <Heading level={2}>Devices</Heading>
  <Inline justify="between">
    <Text>Kindle</Text>
    <Text size="sm" tone="muted">Synced today</Text>
  </Inline>
  <Text size="xs" tone="faint">Up to five devices.</Text>
</Stack>
```

See [stack](component/stack.md), [inline](component/inline.md),
[text](component/text.md), and [heading](component/heading.md).
