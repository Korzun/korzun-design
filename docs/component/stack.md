# Stack

`import { Stack, type StackProps } from '@korzun/design/component'`

A vertical flex column with a themed gap between children. Use it to space
things on a screen instead of writing a style file: a form's fields, the
sections of a page, the rows of a list.

Use something else for: a horizontal row (`Inline`), a bordered surface
(`Card`), a divider line between items (`CardDivider`), text styling (`Text`,
`Heading`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `gap` | `keyof Theme['space'] \| 'none'` | `'md'` | Space between children, from the theme's `space` tokens. |
| `align` | `'stretch' \| 'start' \| 'center' \| 'end'` | `'stretch'` | Cross-axis (horizontal) alignment. `start`/`end` map to `flex-start`/`flex-end`. |
| `as` | `'div' \| 'section' \| 'ul' \| 'ol' \| 'li'` | `'div'` | The element to render. |
| `className` | `string` | | Added last on the root. |
| `children` | `ReactNode` | | |
| `ref` | `Ref<HTMLElement>` | | Ref to the root element. |

Every other HTML attribute (`id`, `aria-*`, `data-*`, event handlers) passes
through. There is no `style` prop.

## Behaviour

- `gap="none"` emits `gap: 0`, for children that supply their own spacing.
- `as="ul"` and `as="ol"` also reset the list's margin, padding and bullets.
  Children should be `li` (`<Stack as="li">` works).
- Override with `className` at `'&&'` specificity, never `!important`.
- No `style` prop: spacing comes from tokens only.
- `as="form"` is not offered. Put a `<form>` around the Stack instead.

## Examples

```tsx
// A form's fields.
<form noValidate onSubmit={onSubmit}>
  <Stack gap="md">
    <TextInput name="title" label="Title" value={title} onChange={setTitle} />
    <TextInput name="author" label="Author" value={author} onChange={setAuthor} />
    <Button type="primary" submit>Save</Button>
  </Stack>
</form>

// A semantic list.
<Stack as="ul" gap="xs">
  {items.map((i) => <Stack as="li" key={i.id} gap="none">{i.name}</Stack>)}
</Stack>

// Children sized to their content, left aligned.
<Stack align="start">
  <Tag>One</Tag>
  <Tag>Two</Tag>
</Stack>
```

## Do / don't

- Do pick `gap` from the scale (`xs` tight, `md` default, `xxl` between
  sections) so spacing is the same everywhere.
- Do nest a Stack in a Stack for sections with different gaps.
- Do use `align="start"` when children (buttons, tags) should not stretch.
- Don't add margins to children to space them; use `gap`.
- Don't reach for `className` to set a gap; use the prop.
- Don't use a Stack for a row; use `Inline`.
