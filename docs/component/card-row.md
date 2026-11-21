# CardRow

`import { CardRow, type CardRowProps } from '@korzun/design/component'`

A compact bordered row (card background, 6px padding) for stacking items inside
a `Card` body. Optionally clickable.

Use something else for: a list of rows each sitting on the page background
(Bookplate uses `<Card size="small" onClick>` per row), a section split
(`CardDivider`), a key/value line (`MetadataList`).

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

Hard-codes `borderRadius: '12px'` (its own source comment says "10px"), off
the radius scale. By the [corner rule](../corners.md) a row inside a card
should be `radius.md`. Known inconsistency, don't copy the value.

## Examples

```tsx
<Card title="Recent uploads">
  {uploads.map((u) => (
    <CardRow key={u.id} onClick={() => open(u.id)}>
      {u.fileName}
    </CardRow>
  ))}
</Card>

// Accessible alternative: the action is a real control.
<CardRow>
  {u.fileName} <Button type="link" onClick={() => open(u.id)} ariaLabel={`Open ${u.fileName}`}>Open</Button>
</CardRow>
```

## Do / don't

- Do use it only inside a `Card` body.
- Don't rely on `onClick` as the only way to reach an action from the keyboard.
- Don't copy its 12px radius into your own styles; use `theme.radius.md`.
