# EmptyState

`import { EmptyState } from '@korzun/design/component'`

The centred "nothing here" block a screen shows in place of a list: a title
line and an optional faint second line, with generous vertical padding
(`4rem`). Also used for a list's loading and error states.

Use something else for: an empty message *inside* a `Card` (a plain
left-aligned line of card content reads right there), transient feedback
(`useToast`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | required | The one line that says what is not here. |
| `children` | `ReactNode` | | Optional second line: what to do about it, or why it is empty. Rendered only when not `undefined`. |
| `danger` | `boolean` | `false` | Tints the title red. For a load **failure**, not for an honestly empty list. |

No `className`. Renders plain `div`s with no `role`; it is not a live region.

## Examples

```tsx
let list;
if (loading) {
  list = <EmptyState title="Loading..." />;
} else if (error && rows.length === 0) {
  list = <EmptyState title="Error loading requests" danger />;
} else if (rows.length === 0) {
  list = <EmptyState title="No requests yet">Fill in the form above to ask for a book.</EmptyState>;
} else {
  list = rows.map((r) => <RequestRow key={r.id} row={r} />);
}

<Page>
  <Card title="New request">…</Card>
  {list}
</Page>
```

## Do / don't

- Do use it directly on the page background, as a sibling of the Cards.
- Do keep `title` short; put the explanation or next step in `children`.
- Don't set `danger` for "no results"; that is not an error.
- Don't pass `null` as `children` expecting no second line: only `undefined`
  omits it (`null` renders an empty second line).
