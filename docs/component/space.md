---
title: Space
description: One layout primitive: a row or a column with a themed gap between children and an optional separator.
category: Layout
---
# Space

<!-- generated:import -->

`import { Space, type Gap, type SpaceProps } from '@korzun/design/component'`

<!-- /generated:import -->

A flex row or column with a themed gap between children. Use it to space
things on a screen instead of writing a style file: a button group, a form's
fields, a header with an action on the right, a line of items split by dots.

Use something else for: a bordered surface (`Card`), a divider line between
items (`Divider`), text styling (`Text`, `Heading`).

## Usage

### Direction and defaults

`direction` is `'horizontal'` (a row, the default) or `'vertical'` (a column).
Each direction has its own defaults:

| | `gap` | `align` |
| --- | --- | --- |
| `horizontal` | `sm` | `center` |
| `vertical` | `md` | `stretch` |

### Choosing a gap

Pick `gap` from the theme's `space` scale so spacing is the same everywhere:
`xs` for tight groups such as chips, `sm` for most rows, `md` for most
columns, `xxl` between sections. `gap="none"` emits `gap: 0`, for children
that supply their own spacing.

### Split

`split` draws a separator between each pair of children, never before the
first or after the last. Children that render nothing (`null`, `false`, `''`, an
empty fragment) get no separator, and a fragment's children count as separate
items. The separator is hidden from screen readers. Inside `as="ul"` or
`as="ol"` it is an `li` with `role="presentation"`, so the list stays valid.

### Wrap and justify

- `wrap` lets children flow onto further lines. Without it they stay on one
  line and may overflow or shrink.
- `justify="between"` pushes the first and last child to opposite edges: a
  title with an action on the right.

### Behaviour

- `as="ul"` and `as="ol"` also reset the list's margin, padding and bullets.
  Children should be `li`.
- `align` is the cross axis: vertical placement in a row, horizontal in a
  column. `start` keeps buttons and tags at their own width in a column.
- Every other HTML attribute (`id`, `aria-*`, `data-*`, event handlers) passes
  through. There is no `style` prop: spacing comes from tokens only.
- Override with `className` at `'&&'` specificity, never `!important`.
- `as="form"` is not offered. Put a `<form>` around the Space instead.

### Coming from Stack or Inline

`<Stack …>` is `<Space direction="vertical" …>`, and `<Inline …>` is
`<Space …>`. Every other prop and default is the same.

## Do / don't

- Do use `direction="vertical"` for a form's fields or a page's sections.
- Do use `justify="between"` for a title-and-action row.
- Do add `wrap` for rows of chips or buttons that may not fit on a phone.
- Do use `split` for separators instead of inserting your own between items.
- Don't add margins to children to space them; use `gap`.
- Don't nest a row just to push one child right; use `justify="between"`.

<!-- generated:examples -->

## Examples

### Basic

A row of buttons, spaced with no `gap` prop. Children sit on one line and
are centred vertically.

```tsx
import { Space } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [saved, setSaved] = useState(0);
  return (
    <Space>
      <Button type="primary" onClick={() => setSaved((n) => n + 1)}>
        Save
      </Button>
      <Button onClick={() => setSaved(0)}>Reset</Button>
      <span>Saved: {saved}</span>
    </Space>
  );
}
```

### Vertical

`direction="vertical"` stacks children in a column. The gap defaults to
`md` and children stretch to the full width; put the `<form>` around the
Space.

```tsx
import { Space } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Vertical() {
  const [title, setTitle] = useState<string | undefined>('Middlemarch');
  const [author, setAuthor] = useState<string | undefined>('George Eliot');
  return (
    <form noValidate onSubmit={(event) => event.preventDefault()}>
      <Space direction="vertical">
        <TextInput name="title" label="Title" value={title} onChange={setTitle} />
        <TextInput name="author" label="Author" value={author} onChange={setAuthor} />
      </Space>
    </form>
  );
}
```

### Split

`split` draws a separator between each pair of children, never at the ends,
and hides it from screen readers. Items that render nothing (`false`,
`null`) get no separator. In a list (`as="ul"`) the separator is an `li`.

```tsx
import { Space, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function Split() {
  const [year, setYear] = useState(false);
  return (
    <Space direction="vertical">
      <Space split="·" wrap>
        <Text tone="muted">George Eliot</Text>
        <Text tone="muted">Fiction</Text>
        {year && <Text tone="muted">1871</Text>}
        <Text tone="muted">Classic</Text>
      </Space>
      <Space as="ul" split="|" gap="xs">
        <li>Reading</li>
        <li>Up next</li>
        <li>Finished</li>
      </Space>
      <label>
        <input type="checkbox" checked={year} onChange={(e) => setYear(e.target.checked)} /> Show
        the year
      </label>
    </Space>
  );
}
```

### Wrap and justify

`justify="between"` pushes the first and last child to opposite edges, as in
a title with an action. `wrap` lets a row of chips flow onto further lines
instead of overflowing.

```tsx
import { Heading, Space, Chip } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function WrapAndJustify() {
  const [all, setAll] = useState(false);
  return (
    <Space direction="vertical" gap="sm">
      <Space justify="between">
        <Heading level={3}>Currently reading</Heading>
        <Button type="link" onClick={() => setAll((value) => !value)}>
          {all ? 'Show less' : 'See all'}
        </Button>
      </Space>
      <Space wrap gap="xs">
        <Chip>Fiction</Chip>
        <Chip tone="author">George Eliot</Chip>
        {all && <Chip>Classic</Chip>}
        {all && <Chip>1871</Chip>}
      </Space>
    </Space>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The children, laid out along `direction`. |
| `align` | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'` |  | Cross-axis alignment of children; `start`/`end` map to `flex-start`/`flex-end`. The default is `'center'` in a row and `'stretch'` in a column. |
| `as` | `'div' \| 'section' \| 'span' \| 'nav' \| 'ul' \| 'ol' \| 'li'` | `'div'` | The element to render. `ul`/`ol` also reset list margin, padding and bullets. |
| `className` | `string` |  | Extra class, added last on the root. Override with `'&&'` specificity, never `!important`. |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | The axis children are laid along: `'horizontal'` is a row, `'vertical'` a column. |
| `gap` | `'xxxs' \| 'xxs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl' \| 'xxxl' \| 'xxxxl' \| 'xxxxxl' \| 'none'` |  | Space between children, from the theme's `space` tokens, or `'none'`. The default is `'sm'` in a row and `'md'` in a column. |
| `justify` | `'start' \| 'center' \| 'end' \| 'between'` | `'start'` | Main-axis distribution of children. `'between'` is `space-between`: it pushes the first and last child to opposite edges. |
| `ref` | `Ref<HTMLElement>` |  | Ref to the root element. |
| `split` | `ReactNode` |  | Drawn between each pair of children, never before the first or after the last. Fragments are unwrapped; `null`, `false`, `''` and empty fragments get none. Hidden from screen readers; inside a `ul`/`ol` it is an `li`. |
| `wrap` | `boolean` | `false` | Lets children wrap onto further lines. Without it they stay on one line and may overflow or shrink. |

Also accepts: `HTMLAttributes`.

### Types

```ts
type Gap = 'xxxs' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl' | 'xxxxxl' | 'none';
```

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

- **0.7.0** (2026-11-26): New `Space`: one layout primitive with a `direction` (default `'horizontal'`), `gap`, `align`, `justify`, `wrap`, `as` and a `split` separator drawn between items (hidden from screen readers, an `li` inside a list). Each direction keeps Stack's or Inline's defaults.
- **0.7.0** (2026-11-26): **Breaking:** `Stack` and `Inline` (and `StackProps`, `InlineProps`) are removed; use `Space`. `<Stack …>` is `<Space direction="vertical" …>` and `<Inline …>` is `<Space …>`, with every prop and default unchanged.
- **0.2.0** (2026-11-21): New `Stack` (vertical flex column; `gap`, default `md`), `Inline` (horizontal row; `gap` default `sm`, `justify` including `between`), `Text` (`size`, `tone`, `weight`; unset props inherit), and `Heading` (`level` 1–4), so layout and text are set with props instead of style files.
- **0.2.0** (2026-11-21): `truncate` on `Text` and `Heading` clips inside `Stack` (any `align`), `Inline`, and a `Stack` nested in an `Inline`; `Stack` and `Inline` roots have `min-width: 0`.

<!-- /generated:changelog -->
