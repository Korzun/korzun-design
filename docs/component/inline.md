---
title: Inline
description: A horizontal row with a themed gap between children, vertically centred by default.
category: Layout
---
# Inline

<!-- generated:import -->

`import { Inline, type InlineProps } from '@korzun/design/component'`

<!-- /generated:import -->

A horizontal flex row with a themed gap between children, vertically centred
by default. Use it for a button group, a header with an action on the right,
or a row of chips that wraps.

Use something else for: a vertical column (`Stack`), a single chip
(`Tag`), a line of small metadata (`MetaLine`).

## Usage

### Choosing a gap

Pick `gap` from the theme's `space` scale so spacing is the same everywhere:
`xs` for tight groups such as chips, `sm` for most rows, `xl` between links.
`gap="none"` emits `gap: 0`, for children that supply their own spacing.

### Behaviour

- `as="ul"` and `as="ol"` also reset the list's margin, padding and bullets.
  Children should be `li`.
- Without `wrap`, children stay on one line and may overflow or shrink.
- Every other HTML attribute (`id`, `aria-*`, `data-*`, event handlers) passes
  through. There is no `style` prop: spacing comes from tokens only.
- Override with `className` at `'&&'` specificity, never `!important`.

## Do / don't

- Do use `justify="between"` for a title-and-action row.
- Do add `wrap` for rows of chips or buttons that may not fit on a phone.
- Do use `align="baseline"` to line up text of different sizes.
- Don't add margins to children to space them; use `gap`.
- Don't use an Inline for a column; use `Stack`.
- Don't nest `Inline` just to push one child right; use `justify="between"`.

<!-- generated:examples -->

## Examples

### Basic

The spread row: a title on the left and its action on the right, with
`justify="between"`. Children are vertically centred.

```tsx
import { Heading, Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [books, setBooks] = useState(3);
  return (
    <Stack gap="xs">
      <Inline justify="between">
        <Heading level={2}>Library</Heading>
        <Button type="primary" onClick={() => setBooks((n) => n + 1)}>
          Add book
        </Button>
      </Inline>
      <Text size="sm" tone="muted">
        Books: {books}
      </Text>
    </Stack>
  );
}
```

### Gaps

`gap` takes a key of the theme's `space` scale, or `none` for children
that bring their own spacing. Five steps of the scale are shown.

```tsx
import { Inline, Tag, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { Fragment } from 'react';

const gaps = ['none', 'xs', 'md', 'xl', 'xxxl'] as const;

// Two columns, so every row of tags starts at the same x.
const useStyles = createUseStyles((theme: Theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr',
    alignItems: 'center',
    gap: `${theme.space.md} ${theme.space.xl}`,
  },
}));

export default function Gaps() {
  const styles = useStyles();
  return (
    <div className={styles.grid}>
      {gaps.map((gap) => (
        <Fragment key={gap}>
          <Text size="sm" tone="muted">
            {`gap="${gap}"`}
          </Text>
          <Inline gap={gap}>
            <Tag>One</Tag>
            <Tag>Two</Tag>
            <Tag>Three</Tag>
          </Inline>
        </Fragment>
      ))}
    </div>
  );
}
```

### Align

`align` sets the vertical placement of children of different heights.
`center` is the usual choice; `baseline` lines up text of different sizes.

```tsx
import { Inline, Stack, Tag, Text } from '@korzun/design/component';

const aligns = ['center', 'start', 'end', 'baseline', 'stretch'] as const;

export default function Align() {
  return (
    <Stack gap="lg">
      {aligns.map((align) => (
        <Stack key={align} gap="xs">
          <Text size="sm" tone="muted">
            {`align="${align}"`}
          </Text>
          <Inline align={align}>
            <Text size="sm">Small</Text>
            <Text size="xxl">Large</Text>
            <Tag>Chip</Tag>
          </Inline>
        </Stack>
      ))}
    </Stack>
  );
}
```

### Justify

`justify` distributes children along the row. `between` pushes the first
and last child to opposite edges.

```tsx
import { Inline, Stack, Tag, Text } from '@korzun/design/component';

const justifies = ['start', 'center', 'end', 'between'] as const;

export default function Justify() {
  return (
    <Stack gap="lg">
      {justifies.map((justify) => (
        <Stack key={justify} gap="xs">
          <Text size="sm" tone="muted">
            {`justify="${justify}"`}
          </Text>
          <Inline justify={justify}>
            <Tag>One</Tag>
            <Tag>Two</Tag>
            <Tag>Three</Tag>
          </Inline>
        </Stack>
      ))}
    </Stack>
  );
}
```

### Wrap

A row of chips too long for its container gets `wrap`: children move onto
further lines. Without it they stay on one line and shrink or overflow. Both rows sit
in the same fixed-width box; the box clips with `overflow: hidden`, so the cut-off
tags at its edge are the overflow.

```tsx
import { Inline, Stack, Tag, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const subjects = [
  'Fiction',
  'Victorian',
  'Provincial life',
  'Politics',
  'Marriage',
  'Reform',
  'Medicine',
  'Class',
  'Ambition',
  'Money',
  'Idealism',
  'Society',
  'Education',
  'Religion',
  'Inheritance',
  'Friendship',
  'Scandal',
  'Science',
  'Duty',
  'Gossip',
  'Land',
  'Vocation',
  'Reputation',
  'Charity',
];

// A fixed-width container with a visible edge, so the overflow is plain to see.
const useStyles = createUseStyles((theme: Theme) => ({
  box: {
    width: `calc(${theme.space.xxxxxl} * 12)`,
    maxWidth: '100%',
    overflow: 'hidden',
    padding: theme.space.md,
    border: `1px dashed ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
  },
}));

export default function Wrap() {
  const styles = useStyles();
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          wrap
        </Text>
        <div className={styles.box}>
          <Inline wrap gap="xs">
            {subjects.map((subject) => (
              <Tag key={subject}>{subject}</Tag>
            ))}
          </Inline>
        </div>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          no wrap: clipped at the box edge
        </Text>
        <div className={styles.box}>
          <Inline gap="xs">
            {subjects.map((subject) => (
              <Tag key={subject}>{subject}</Tag>
            ))}
          </Inline>
        </div>
      </Stack>
    </Stack>
  );
}
```

### Elements

`as="nav"` makes a row of links a navigation landmark. `as="ul"` renders a
list and resets its margin, padding and bullets: make each child an `li`. The links
take the brand colour from the theme.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyles = createUseStyles((theme: Theme) => ({
  link: {
    color: theme.color.brand.default,
    fontWeight: theme.fontWeight.medium,
    textDecoration: 'none',
    borderRadius: theme.radius.sm,
    '&:hover': { color: theme.color.brand.linkHover, textDecoration: 'underline' },
  },
}));

export default function Elements() {
  const styles = useStyles();
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          as="nav"
        </Text>
        <Inline as="nav" gap="xl">
          <a className={styles.link} href="/books">
            Books
          </a>
          <a className={styles.link} href="/authors">
            Authors
          </a>
        </Inline>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          as="ul"
        </Text>
        <Inline as="ul" gap="xl">
          <li>
            <Text>Middlemarch</Text>
          </li>
          <li>
            <Text>Bleak House</Text>
          </li>
          <li>
            <Text>Persuasion</Text>
          </li>
        </Inline>
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
| `children` | `ReactNode` |  | The children, laid out left to right. |
| `align` | `'center' \| 'start' \| 'end' \| 'baseline' \| 'stretch'` | `'center'` | Cross-axis (vertical) alignment of children; `start`/`end` map to `flex-start`/`flex-end`. |
| `as` | `'div' \| 'span' \| 'ul' \| 'ol' \| 'li' \| 'nav'` | `'div'` | The element to render. `ul`/`ol` also reset list margin, padding and bullets. |
| `className` | `string` |  | Extra class, added last on the root. Override with `'&&'` specificity, never `!important`. |
| `gap` | `'xxxs' \| 'xxs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl' \| 'xxxl' \| 'xxxxl' \| 'xxxxxl' \| 'none'` | `'sm'` | Space between children, from the theme's `space` tokens, or `'none'`. |
| `justify` | `'start' \| 'center' \| 'end' \| 'between'` | `'start'` | Main-axis (horizontal) distribution of children. `'between'` is `space-between`: it pushes the first and last child to opposite edges. |
| `ref` | `Ref<HTMLElement>` |  | Ref to the root element. |
| `wrap` | `boolean` | `false` | Lets children wrap onto further lines. Without it they stay on one line and may overflow or shrink. |

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
