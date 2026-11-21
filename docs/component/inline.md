# Inline

`import { Inline, type InlineProps } from '@korzun/design/component'`

A horizontal flex row with a themed gap between children, vertically centred
by default. Use it for a button group, a header with an action on the right,
or a row of chips that wraps.

Use something else for: a vertical column (`Stack`), a single chip
(`Tag`), a line of small metadata (`MetaLine`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `gap` | `keyof Theme['space'] \| 'none'` | `'sm'` | Space between children, from the theme's `space` tokens. |
| `align` | `'center' \| 'start' \| 'end' \| 'baseline' \| 'stretch'` | `'center'` | Cross-axis (vertical) alignment. `start`/`end` map to `flex-start`/`flex-end`. |
| `justify` | `'start' \| 'center' \| 'end' \| 'between'` | `'start'` | Main-axis distribution. `between` is `space-between`. |
| `wrap` | `boolean` | `false` | Wrap children onto more lines. |
| `as` | `'div' \| 'span' \| 'ul' \| 'ol' \| 'li' \| 'nav'` | `'div'` | The element to render. |
| `className` | `string` | | Added last on the root. |
| `children` | `ReactNode` | | |
| `ref` | `Ref<HTMLElement>` | | Ref to the root element. |

Every other HTML attribute (`id`, `aria-*`, `data-*`, event handlers) passes
through. There is no `style` prop.

## Behaviour

- `gap="none"` emits `gap: 0`.
- `as="ul"` and `as="ol"` also reset the list's margin, padding and bullets.
- Override with `className` at `'&&'` specificity, never `!important`.
- No `style` prop: spacing comes from tokens only.
- Without `wrap`, children stay on one line and may overflow or shrink.

## Examples

```tsx
// The spread row: title on the left, action on the right.
<Inline justify="between">
  <Heading level={2}>Library</Heading>
  <Button type="primary">Add book</Button>
</Inline>

// Chips that wrap.
<Inline wrap gap="xs">
  {subjects.map((s) => <Tag key={s}>{s}</Tag>)}
</Inline>

// Navigation links.
<Inline as="nav" gap="xl">
  <a href="/books">Books</a>
  <a href="/authors">Authors</a>
</Inline>
```

## Do / don't

- Do use `justify="between"` for a title-and-action row.
- Do add `wrap` for rows of chips or buttons that may not fit on a phone.
- Do use `align="baseline"` to line up text of different sizes.
- Don't add margins to children to space them; use `gap`.
- Don't use an Inline for a column; use `Stack`.
- Don't nest `Inline` just to push one child right; use `justify="between"`.
