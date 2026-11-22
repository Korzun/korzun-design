# MetaLine

`import { MetaLine, type MetaLineProps } from '@korzun/design/component'`

A row's secondary line: a few short data ("Frank Herbert", "Book 3", "42%")
separated by middots. When too narrow, it wraps *between* data, never inside
one, and never leaves a separator dangling at a line end or leading the next
line. The separators are CSS (`::before`), not text, so screen readers read
only the data.

Use something else for: labelled key/value pairs (`MetadataList`), a row's
primary title (`Text` or `Heading`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `ReactNode[]` | required | The data, in order. `null`, `undefined` and `false` entries are skipped. |
| `className` | `string` | | On the outer element; the font size and colour you set there reach every item and the separators scale with it (`1em` cells). Override with `'&&'` specificity, never `!important`. |

## Surprising behaviour

- **Renders `null`** when every item is skipped: no empty line is left behind.
- Only `null`/`undefined`/`false` are skipped. `''` and `0` are kept and draw a
  separator with nothing (or `0`) after it; filter them yourself.
- A single datum wider than the line ellipsizes instead of wrapping.
- MetaLine sets no font size or colour of its own except the separator colour
  (`text.muted`); wrap it in `Text` to set the rest.
- Items are keyed by index.

## Examples

```tsx
// A book row's secondary line.
<Text weight="semibold">{book.title}</Text>
<Text as="div" size="sm" tone="faint">
  <MetaLine
    items={[
      book.author,
      book.series && `${book.series.name} #${book.seriesIndex}`,
      book.progress !== undefined && `${Math.round(book.progress * 100)}%`,
    ]}
  />
</Text>

// Elements are fine as items.
<MetaLine items={[<time dateTime={iso}>{formatted}</time>, device.label]} />
```

## Do / don't

- Do pass conditional data as `cond && value`; `false` is skipped.
- Do set typography by wrapping the line in `Text` (`size`, `tone`); the items inherit it.
- Don't join data into one string with your own " · ": wrapping then breaks
  inside a datum and the dots are read aloud.
- Don't pass empty strings; they leave a stray separator.
