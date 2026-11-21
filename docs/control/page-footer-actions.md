# PageFooterActions

`import { PageFooterActions, type FooterAction } from '@korzun/design/control'`

A row of Buttons for the bottom of a page, typically Cancel / Save for a form
that spans several cards. Leading items sit left, trailing items right. It is
a plain flex row (not sticky, shown at every width). `Page` renders it after
its children when you pass `footerActions`; you can also render it directly
after your form.

Use something else for: header actions (`PageActionsBar` / `PageActionsMenu`
via `Page headerActions`), a Card's own submit (`Button` in the Card `footer`),
modal buttons (`Button radius="modal"`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `FooterAction[]` | (required) | Rendered in order within each side. |

No `className`.

## FooterAction

| Field | Type | Notes |
|---|---|---|
| `label` | `string` | Button text; may change between renders (`Save` → `Saving…`) without remounting. |
| `onClick` | `() => void` | **Required even for a submit item, and ignored there** (the form submits). Pass `() => {}`. Receives no event. |
| `emphasis` | `boolean` | `type="primary"`; otherwise `type="default"`. |
| `danger` | `boolean` | Red treatment. |
| `disabled` | `boolean` | |
| `loading` | `boolean` | Spinner; blocks clicks. |
| `align` | `'leading' \| 'trailing'` | Default trailing. |
| `submit` | `boolean` | Native submit button. |
| `form` | `string` | Id of the `<form>` to submit; needed because the row sits outside the form. |

Buttons use the default `radius` (`background`, `radius.lg`), correct because
the row sits on the page background below the cards; see
[corners](../corners.md). Don't put PageFooterActions inside a `Card`.

## Example

```tsx
<form id={formId} action={save}>
  <Card title="Details">…</Card>
  <Card title="Identifiers">…</Card>
</form>
<PageFooterActions
  items={[
    { label: 'Cancel', onClick: () => navigate(path.book(book.id)), disabled: isPending },
    {
      label: isPending ? 'Saving…' : 'Save',
      onClick: () => {},
      submit: true,
      form: formId,
      emphasis: true,
      loading: isPending,
      disabled: hasInvalidFields,
    },
  ]}
/>
```

## Do / don't

- Do give exactly one item `emphasis`.
- Do pair `submit` with `form` when the row is outside the `<form>`.
- Don't put a destructive action beside Save without `danger` and
  `align: 'leading'`.
