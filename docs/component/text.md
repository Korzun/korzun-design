# Text

`import { Text, type TextProps } from '@korzun/design/component'`

A run of text with themed size, tone and weight. Use it to set text style by
prop instead of a style file: a body line, a meta line, a caption, an inline
error.

**Unset props inherit.** A bare `<Text>` adds no size, tone or weight, so it
looks exactly like the text around it. This keeps the look inside a `Tag`, a
`Button` or an error block: set only what you want to change.

Use something else for: a heading (`Heading`), a single chip (`Tag`), a line
of small metadata (`MetaLine`), a boxed alert (an Alert component comes later).

## Props

| Prop        | Type                                                                                       | Default  | Notes                                                 |
| ----------- | ------------------------------------------------------------------------------------------ | -------- | ----------------------------------------------------- |
| `as`        | `'span' \| 'p' \| 'div' \| 'label' \| 'strong' \| 'em'`                                    | `'span'` | The element to render.                                |
| `size`      | `keyof Theme['fontSize']`                                                                  | inherit  | `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`.           |
| `tone`      | `'primary' \| 'secondary' \| 'muted' \| 'faint' \| 'description' \| 'danger' \| 'success'` | inherit  | Text colour.                                          |
| `weight`    | `keyof Theme['fontWeight']`                                                                | inherit  | `regular`, `medium`, `semibold`, `bold`, `extrabold`. |
| `truncate`  | `boolean`                                                                                  | `false`  | One line, clipped with an ellipsis.                   |
| `htmlFor`   | `string`                                                                                   |          | Only for `as="label"`.                                |
| `className` | `string`                                                                                   |          | Added last on the root.                               |
| `children`  | `ReactNode`                                                                                |          |                                                       |
| `ref`       | `Ref<HTMLElement>`                                                                         |          | Ref to the root element.                              |

Every other HTML attribute (`id`, `aria-*`, `data-*`, event handlers) passes
through. There is no `style` prop.

## Behaviour

- `tone` is not `Tag`'s `TagTone` union. `primary` to `description` map to the
  theme's `color.text.*`; `danger` and `success` use the chip text colours.
- `danger` and `success` are for inline error and confirmation text. A boxed
  Alert comes later.
- `truncate` adds `overflow: hidden`, an ellipsis, `white-space: nowrap` and
  `min-width: 0`, so a truncated Text can shrink inside an `Inline` or `Stack`.
- On `span`, `strong`, `em` and `label`, `truncate` also makes the element
  `inline-block` with `max-width: 100%`, because inline elements ignore
  overflow. `p` and `div` keep their block display.
- `as="p"` has its margin reset to 0; space paragraphs with `Stack` `gap`.
- Override with `className` at `'&&'` specificity, never `!important`.

## Examples

```tsx
// Body text: inherits everything.
<Text>Welcome back.</Text>

// Meta line.
<Text as="p" size="sm" tone="muted">3 books, updated yesterday</Text>

// Caption.
<Text as="p" size="xs" tone="faint">Cover art by the publisher</Text>

// Inline error under a field.
<Text as="div" size="sm" tone="danger" aria-live="polite">{error}</Text>

// A title that shrinks next to an action.
<Inline justify="between">
  <Text truncate weight="semibold">{book.title}</Text>
  <Button type="primary">Open</Button>
</Inline>

// A label for a control.
<Stack gap="xs">
  <Text as="label" htmlFor="title" size="sm" weight="medium">Title</Text>
  <input id="title" name="title" />
</Stack>
```

## Do / don't

- Do set only the props you need; leave the rest to inherit.
- Do use the recipes: body `<Text>`, meta `size="sm" tone="muted"`, caption
  `size="xs" tone="faint"`.
- Do put `truncate` on the Text itself, not on a wrapper.
- Don't use `Text` for headings; use `Heading`.
- Don't set `tone="danger"` to build a box; it only colours text.
- Don't add margins to space text; use `Stack`.
