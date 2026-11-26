---
title: Stack
description: A vertical column with a themed gap between children.
category: Layout
---
# Stack

<!-- generated:import -->

`import { Stack, type StackProps } from '@korzun/design/component'`

<!-- /generated:import -->

A vertical flex column with a themed gap between children. Use it to space
things on a screen instead of writing a style file: a form's fields, the
sections of a page, the rows of a list.

Use something else for: a horizontal row (`Inline`), a bordered surface
(`Card`), a divider line between items (`CardDivider`), text styling (`Text`,
`Heading`).

## Usage

### Choosing a gap

Pick `gap` from the theme's `space` scale so spacing is the same everywhere:
`xs` for tight groups, `md` for most content, `xxl` between sections.
`gap="none"` emits `gap: 0`, for children that supply their own spacing.

### Behaviour

- `align` is the horizontal (cross-axis) alignment. `stretch` makes children
  full width; `start` keeps buttons and tags at their own width.
- `as="ul"` and `as="ol"` also reset the list's margin, padding and bullets.
  Children should be `li` (`<Stack as="li">` works).
- Every other HTML attribute (`id`, `aria-*`, `data-*`, event handlers) passes
  through. There is no `style` prop: spacing comes from tokens only.
- Override with `className` at `'&&'` specificity, never `!important`.
- `as="form"` is not offered. Put a `<form>` around the Stack instead.

## Do / don't

- Do nest a Stack in a Stack for sections with different gaps.
- Do use `align="start"` when children (buttons, tags) should not stretch.
- Don't add margins to children to space them; use `gap`.
- Don't reach for `className` to set a gap; use the prop.
- Don't use a Stack for a row; use `Inline`.

<!-- generated:examples -->

## Examples

### Basic

A form's fields, spaced with no `gap` prop. Put the `<form>` around the
Stack; children stretch to the full width.

```tsx
import { Stack } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [title, setTitle] = useState<string | undefined>('Middlemarch');
  const [author, setAuthor] = useState<string | undefined>('George Eliot');
  return (
    <form noValidate onSubmit={(event) => event.preventDefault()}>
      <Stack>
        <TextInput name="title" label="Title" value={title} onChange={setTitle} />
        <TextInput name="author" label="Author" value={author} onChange={setAuthor} />
      </Stack>
    </form>
  );
}
```

### Gaps

`gap` takes a key of the theme's `space` scale: `xs` for tight groups, `md`
for most content, `xxl` between sections. `none` is for children that bring
their own spacing.

```tsx
import { Inline, Stack, Tag, Text } from '@korzun/design/component';

const gaps = ['none', 'xs', 'md', 'xxl'] as const;

export default function Gaps() {
  return (
    <Inline gap="xxl" align="start" wrap>
      {gaps.map((gap) => (
        <Stack key={gap} gap="xs" align="start">
          <Text size="sm" tone="muted">
            {`gap="${gap}"`}
          </Text>
          <Stack gap={gap} align="start">
            <Tag>One</Tag>
            <Tag>Two</Tag>
            <Tag>Three</Tag>
          </Stack>
        </Stack>
      ))}
    </Inline>
  );
}
```

### Alignment

`align` sets the horizontal (cross-axis) placement. `stretch` makes every
child full width; use `start` so buttons and tags keep their own width.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

const aligns = ['stretch', 'start', 'center', 'end'] as const;

export default function Align() {
  const [added, setAdded] = useState(0);
  return (
    <Stack gap="lg">
      {aligns.map((align) => (
        <Stack key={align} gap="xs" align={align}>
          <Text size="sm" tone="muted">
            {`align="${align}"`}
          </Text>
          <Button onClick={() => setAdded((n) => n + 1)}>Add a book</Button>
        </Stack>
      ))}
      <Text tone="muted">Books added: {added}</Text>
    </Stack>
  );
}
```

### A semantic list

`as="ul"` renders a list and resets its margin, padding and bullets. Make each
child an `li`; `<Stack as="li">` works.

```tsx
import { Stack, Text } from '@korzun/design/component';

const books = [
  { id: 1, title: 'Middlemarch', author: 'George Eliot' },
  { id: 2, title: 'Bleak House', author: 'Charles Dickens' },
  { id: 3, title: 'Persuasion', author: 'Jane Austen' },
];

export default function List() {
  return (
    <Stack as="ul" gap="sm">
      {books.map((book) => (
        <Stack as="li" key={book.id} gap="none">
          <Text weight="semibold">{book.title}</Text>
          <Text size="sm" tone="muted">
            {book.author}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
```

### Nested with Inline

Nest Stacks for sections with different gaps, and use `Inline` for each row.
The outer `xxl` gap separates sections; the inner `sm` gap groups a heading
with its content.

```tsx
import { Heading, Inline, Stack, Tag, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function NestedWithInline() {
  const [all, setAll] = useState(false);
  return (
    <Stack gap="xxl">
      <Stack as="section" gap="sm">
        <Inline justify="between">
          <Heading level={3}>Currently reading</Heading>
          <Button type="link" onClick={() => setAll((value) => !value)}>
            {all ? 'Show less' : 'See all'}
          </Button>
        </Inline>
        <Inline wrap>
          <Tag>Fiction</Tag>
          <Tag tone="author">George Eliot</Tag>
          {all && <Tag>Classic</Tag>}
          {all && <Tag>1871</Tag>}
        </Inline>
      </Stack>
      <Stack as="section" gap="sm">
        <Heading level={3}>Up next</Heading>
        <Text tone="muted">Nothing queued yet.</Text>
      </Stack>
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The children, laid out top to bottom. |
| `align` | `'stretch' \| 'start' \| 'center' \| 'end'` | `'stretch'` | Cross-axis (horizontal) alignment of children; `start`/`end` map to `flex-start`/`flex-end`. |
| `as` | `'div' \| 'section' \| 'ul' \| 'ol' \| 'li'` | `'div'` | The element to render. `ul`/`ol` also reset list margin, padding and bullets. |
| `className` | `string` |  | Extra class, added last on the root. Override with `'&&'` specificity, never `!important`. |
| `gap` | `'xxxs' \| 'xxs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl' \| 'xxxl' \| 'xxxxl' \| 'xxxxxl' \| 'none'` | `'md'` | Space between children, from the theme's `space` tokens, or `'none'`. |
| `ref` | `Ref<HTMLElement>` |  | Ref to the root element. |

Also accepts: `HTMLAttributes`.

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.space.lg` | `0.625rem` | `0.625rem` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xl` | `0.75rem` | `0.75rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.space.xxl` | `1rem` | `1rem` |
| `theme.space.xxs` | `0.125rem` | `0.125rem` |
| `theme.space.xxxl` | `1.25rem` | `1.25rem` |
| `theme.space.xxxs` | `0.1rem` | `0.1rem` |
| `theme.space.xxxxl` | `1.5rem` | `1.5rem` |
| `theme.space.xxxxxl` | `2rem` | `2rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.2.0** (2026-11-21): New `Stack` (vertical flex column; `gap`, default `md`), `Inline` (horizontal row; `gap` default `sm`, `justify` including `between`), `Text` (`size`, `tone`, `weight`; unset props inherit), and `Heading` (`level` 1–4), so layout and text are set with props instead of style files.
- **0.2.0** (2026-11-21): `truncate` on `Text` and `Heading` clips inside `Stack` (any `align`), `Inline`, and a `Stack` nested in an `Inline`; `Stack` and `Inline` roots have `min-width: 0`.

<!-- /generated:changelog -->
