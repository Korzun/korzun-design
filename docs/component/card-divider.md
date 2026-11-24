# CardDivider

`import { CardDivider } from '@korzun/design/component'`

A horizontal rule that splits one `Card` body into sections, optionally with a
label ("Devices", "Validation") and/or actions sitting on the line. It is
full-bleed: it cancels the card body's padding so the line meets the card
borders. Renders `role="separator"`.

Use something else for: separating whole features (use separate `Card`s),
separating menu items (`PageActionItem.separatorBefore`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `ReactNode` | | Optional label. Without a label and without actions it is a plain full-width line. |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Label position. `left`/`right` hug that edge with a short stub of line poking past it; `center` leaves equal line on both sides. |
| `actions` | `ReactNode` | | Optional controls rendered on the line (e.g. a bulk-action button). |
| `actionsAlign` | `'left' \| 'center' \| 'right'` | `'right'` | Actions position. If it equals `align`, label and actions share one group, label first. |

No `className`. `null`, `undefined` and `false` count as absent for both
`children` and `actions`.

## Surprising behaviour

- **Assumes a `space.xl` parent padding.** The full-bleed is a fixed
  `margin: 0 -space.xl`, which matches a `size="large"` Card body. Inside
  `Card size="small"` (1px padding) or any other container it overhangs.
- It always reserves one label line of height, labelled or not, so swapping a
  plain divider for a labelled one does not shift the layout.
- The label does not wrap (`white-space: nowrap`); keep it to a word or two.
- The exported type names `CardDividerProps` / `CardDividerAlign` are not
  re-exported from the `component` barrel.

## Examples

```tsx
// A plain rule between a form's fields and its submit button.
<Card title="New request">
  <form action={create}>
    <TextInput … />
    <CardDivider />
    <Button type="primary" submit>Request</Button>
  </form>
</Card>

// A labelled section inside a card.
<Card title="Notifications">
  …
  <CardDivider>Devices</CardDivider>
  <ul>{devices.map(…)}</ul>
</Card>

// Label left, an action on the right end of the same line.
<CardDivider actions={<Button type="link" onClick={clearAll}>Clear all</Button>}>
  Pending
</CardDivider>
```

## Do / don't

- Do use it directly inside a large Card body, not wrapped in a padded `div`
  (the negative margin would then overshoot your wrapper instead).
- Do use `type="link"` Buttons or small `Tag`s as `actions`; the line is one
  text line tall.
- Don't use it for the gap between Cards on a page; `Page` already spaces them.
