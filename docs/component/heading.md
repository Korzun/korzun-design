# Heading

`import { Heading, type HeadingProps } from '@korzun/design/component'`

A heading. `level` is the semantics (which `h1` to `h4` element renders) and
also picks a default look; `size`, `tone` and `weight` are the look and
override those defaults. Use it for a page title, a section title, a card
title.

Use something else for: body or meta text (`Text`), a collapsible section
header (`CollapsibleSection`), an empty-state title (`EmptyState`).

## Props

| Prop        | Type                                                                                       | Default      | Notes                                                 |
| ----------- | ------------------------------------------------------------------------------------------ | ------------ | ----------------------------------------------------- |
| `level`     | `1 \| 2 \| 3 \| 4`                                                                         | required     | Renders `h1` to `h4`.                                 |
| `size`      | `keyof Theme['fontSize']`                                                                  | from `level` | `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`.           |
| `tone`      | `'primary' \| 'secondary' \| 'muted' \| 'faint' \| 'description' \| 'danger' \| 'success'` | `'primary'`  | Text colour.                                          |
| `weight`    | `keyof Theme['fontWeight']`                                                                | from `level` | `regular`, `medium`, `semibold`, `bold`, `extrabold`. |
| `truncate`  | `boolean`                                                                                  | `false`      | One line, clipped with an ellipsis.                   |
| `className` | `string`                                                                                   |              | Added last on the root.                               |
| `children`  | `ReactNode`                                                                                |              |                                                       |
| `ref`       | `Ref<HTMLHeadingElement>`                                                                  |              | Ref to the root element.                              |

Every other HTML attribute (`id`, `aria-*`, `data-*`, event handlers) passes
through. There is no `style` prop and no `as` prop.

## Level defaults

| `level` | Element | `size` | `weight`   |
| ------- | ------- | ------ | ---------- |
| 1       | `h1`    | `xxl`  | `bold`     |
| 2       | `h2`    | `xl`   | `bold`     |
| 3       | `h3`    | `lg`   | `semibold` |
| 4       | `h4`    | `md`   | `semibold` |

Tone is `primary` at every level. A `size` or `weight` you set wins over the
level default.

## Behaviour

- **Level is the semantics, props are the look.** Pick `level` for the document
  outline (one `h1` per page, no skipped levels), then use `size`, `weight` and
  `tone` to change how it looks. Never pick a level for its size.
- The margin is reset to 0 and the line height is the theme's `tight` value;
  space headings with `Stack` `gap`.
- `truncate` adds `overflow: hidden`, an ellipsis, `white-space: nowrap` and
  `min-width: 0` and `max-width: 100%`, so a truncated Heading clips inside an
  `Inline` or `Stack` with any `align`.
- Override with `className` at `'&&'` specificity, never `!important`.

## Examples

```tsx
// Page title.
<Heading level={1}>Library</Heading>

// Section title in a recipe.
<Stack gap="md">
  <Inline justify="between">
    <Heading level={2}>Library</Heading>
    <Button type="primary">Add book</Button>
  </Inline>
  <Text as="p" size="sm" tone="muted">3 books, updated yesterday</Text>
</Stack>

// A small h2 inside a card: the level stays 2, the look shrinks.
<Heading level={2} size="sm" weight="medium" tone="muted">Details</Heading>

// A title that shrinks next to an action.
<Inline justify="between">
  <Heading level={3} truncate>{book.title}</Heading>
  <Button type="primary">Open</Button>
</Inline>
```

## Do / don't

- Do keep the outline in order: `h1`, then `h2`, then `h3`.
- Do override `size` and `weight` for a different look at the same level.
- Do put `truncate` on the Heading itself, not on a wrapper.
- Don't pick a level to get a size; set `size`.
- Don't use `Heading` for body text; use `Text`.
- Don't add margins to space headings; use `Stack`.
