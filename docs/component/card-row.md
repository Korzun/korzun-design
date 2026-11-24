# CardRow

`import { CardRow, type CardRowProps } from '@korzun/design/component'`

A compact card-shell row (card background, border, stacked shadow, 6px
padding) that sits on the page or in a Card, for a stack of list items. Optionally
clickable.

Use something else for: rows inside a `Card` body (a shaded row built on
`theme.recipe.row`), a section split (`CardDivider`), a key/value line
(`MetadataList`). Bookplate itself lists items with `<Card size="small" onClick>`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `ReactNode` | | Row content. |
| `onClick` | `() => void` | | Adds a pointer cursor; fires on click and on Enter/Space. See the keyboard caveat. |

No `className`, no `ariaLabel`, no `role`.

## Surprising behaviour

- **Not keyboard-reachable.** With `onClick` it still gets no `role="button"`
  and no `tabIndex`, so it cannot be focused; the Enter/Space handler only
  fires for keys bubbling from a focused child, and Space is not
  `preventDefault`ed (the page scrolls). For a keyboard-accessible clickable
  row, put a real control (`Button type="link"`) inside it.
- Bookplate itself does not use `CardRow`; it is the least-exercised layout
  primitive here.

## Corners

Follows depth: 16px (`radius.lg`) on the page, 8px (`md`) in a Card, `sm`
deeper. Content inside it steps down one level. See [corners](../corners.md).

## Examples

```tsx
<Page documentTitle="Uploads">
  {uploads.map((u) => (
    <CardRow key={u.id} onClick={() => open(u.id)}>
      {u.fileName}
    </CardRow>
  ))}
</Page>

// Accessible alternative: the action is a real control.
<CardRow>
  {u.fileName} <Button type="link" onClick={() => open(u.id)} ariaLabel={`Open ${u.fileName}`}>Open</Button>
</CardRow>
```

## Do / don't

- Place it on the page or inside a `Card`; its corners follow.
- Don't rely on `onClick` as the only way to reach an action from the keyboard.
