---
title: Heading
description: A heading whose level sets the element and a default look, with size, tone and weight to override it.
category: Typography
---
# Heading

<!-- generated:import -->

`import { Heading, type HeadingProps } from '@korzun/design/component'`

<!-- /generated:import -->

A heading. `level` is the semantics (which `h1` to `h4` element renders) and
also picks a default look; `size`, `tone` and `weight` are the look and
override those defaults. Use it for a page title, a section title, a card
title.

Use something else for: body or meta text (`Text`), a collapsible section
header (`CollapsibleSection`), an empty-state title (`EmptyState`).

## Usage

### Level defaults

| `level` | Element | `size` | `weight`   |
| ------- | ------- | ------ | ---------- |
| 1       | `h1`    | `xxl`  | `bold`     |
| 2       | `h2`    | `xl`   | `bold`     |
| 3       | `h3`    | `lg`   | `semibold` |
| 4       | `h4`    | `md`   | `semibold` |

Tone is `primary` at every level. A `size` or `weight` you set wins over the
level default.

### Behaviour

- **Level is the semantics, props are the look.** Pick `level` for the document
  outline (one `h1` per page, no skipped levels), then use `size`, `weight` and
  `tone` to change how it looks. Never pick a level for its size.
- The margin is reset to 0 and the line height is the theme's `tight` value;
  space headings with `Stack` `gap`.
- `truncate` adds `overflow: hidden`, an ellipsis, `white-space: nowrap` and
  `min-width: 0` and `max-width: 100%`, so a truncated Heading clips inside an
  `Inline` or `Stack` with any `align`.
- Every other HTML attribute (`id`, `aria-*`, `data-*`, event handlers) passes
  through. There is no `style` prop and no `as` prop.
- Override with `className` at `'&&'` specificity, never `!important`.

## Do / don't

- Do keep the outline in order: `h1`, then `h2`, then `h3`.
- Do override `size` and `weight` for a different look at the same level.
- Do put `truncate` on the Heading itself, not on a wrapper.
- Don't pick a level to get a size; set `size`.
- Don't use `Heading` for body text; use `Text`.
- Don't add margins to space headings; use `Stack`.

<!-- generated:examples -->

## Examples

### Basic

A section title with its action on the right. `level` is the outline
position; `Inline` with `justify="between"` spreads the row.

```tsx
import { Heading, Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [books, setBooks] = useState(3);
  return (
    <Stack gap="md">
      <Inline justify="between">
        <Heading level={2}>Library</Heading>
        <Button type="primary" onClick={() => setBooks((n) => n + 1)}>
          Add book
        </Button>
      </Inline>
      <Text as="p" size="sm" tone="muted">
        {books} books, updated yesterday
      </Text>
    </Stack>
  );
}
```

### Levels

`level` picks the element, `h1` to `h4`, and a default size and weight.
Keep the outline in order: one `h1` per page, no skipped levels.

```tsx
import { Heading, Stack } from '@korzun/design/component';

export default function Levels() {
  return (
    <Stack gap="sm">
      <Heading level={1}>Level 1: h1</Heading>
      <Heading level={2}>Level 2: h2</Heading>
      <Heading level={3}>Level 3: h3</Heading>
      <Heading level={4}>Level 4: h4</Heading>
    </Stack>
  );
}
```

### Sizes

`size` changes the look without changing the level: every heading here is
an `h2`.

```tsx
import { Heading, Stack } from '@korzun/design/component';

const sizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

export default function Sizes() {
  return (
    <Stack gap="sm">
      {sizes.map((size) => (
        <Heading key={size} level={2} size={size}>
          {`size="${size}"`}
        </Heading>
      ))}
    </Stack>
  );
}
```

### Tones

`tone` sets the text colour. `danger` and `success` are for inline error
and confirmation text.

```tsx
import { Heading, Stack } from '@korzun/design/component';

const tones = [
  'primary',
  'secondary',
  'muted',
  'faint',
  'description',
  'danger',
  'success',
] as const;

export default function Tones() {
  return (
    <Stack gap="sm">
      {tones.map((tone) => (
        <Heading key={tone} level={3} tone={tone}>
          {`tone="${tone}"`}
        </Heading>
      ))}
    </Stack>
  );
}
```

### Weights

`weight` sets the font weight, whatever the level.

```tsx
import { Heading, Stack } from '@korzun/design/component';

const weights = ['regular', 'medium', 'semibold', 'bold', 'extrabold'] as const;

export default function Weights() {
  return (
    <Stack gap="sm">
      {weights.map((weight) => (
        <Heading key={weight} level={3} weight={weight}>
          {`weight="${weight}"`}
        </Heading>
      ))}
    </Stack>
  );
}
```

### In a card

A small, muted `h2` inside a `Card`: the level stays 2 for the outline,
`size`, `weight` and `tone` shrink the look.

```tsx
import { Card, Heading, Stack, Text } from '@korzun/design/component';

export default function InACard() {
  return (
    <Card>
      <Stack gap="xs">
        <Heading level={2} size="sm" weight="medium" tone="muted">
          Details
        </Heading>
        <Text>Middlemarch, George Eliot, 1871.</Text>
      </Stack>
    </Card>
  );
}
```

### Truncate

`truncate` clips a long title to one line with an ellipsis. Beside an
action in an `Inline`, the title shrinks and the button keeps its width.

```tsx
import { Heading, Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

const title =
  'Middlemarch: A Study of Provincial Life, in Eight Books, with a Prelude and a Finale, Followed by an Extended Note on the Text, a Chronology, a Map of the Midlands, and a Glossary of Provincial Terms';

export default function Truncate() {
  const [opened, setOpened] = useState(0);
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          Without truncate
        </Text>
        <Heading level={3}>{title}</Heading>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          With truncate, beside an action
        </Text>
        <Inline justify="between">
          <Heading level={3} truncate>
            {title}
          </Heading>
          <Button type="primary" onClick={() => setOpened((n) => n + 1)}>
            Open
          </Button>
        </Inline>
        <Text size="sm" tone="muted">
          Opened: {opened}
        </Text>
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
| `children` | `ReactNode` |  | The heading text. |
| `className` | `string` |  | Extra class on the root. Override with `'&&'` specificity, never `!important`. |
| `level` (required) | `1 \| 2 \| 3 \| 4` |  | The heading level, rendered as `h1` to `h4`. Also sets the default size and weight, see [Level defaults](#level-defaults). |
| `ref` | `Ref<HTMLHeadingElement>` |  | Ref to the root element. |
| `size` | `'xxs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` |  | Font size, from the theme's `fontSize` tokens. Unset, it follows `level`: 1 `xxl`, 2 `xl`, 3 `lg`, 4 `md`. A size you set wins over the level default. |
| `tone` | `'primary' \| 'secondary' \| 'muted' \| 'faint' \| 'description' \| 'danger' \| 'success'` | `'primary'` | Text colour. `danger` and `success` are for inline error and confirmation text. |
| `truncate` | `boolean` | `false` | Clips to one line with an ellipsis. Also sets `min-width: 0` and `max-width: 100%`, so it clips inside an `Inline` or `Stack` with any `align`. |
| `weight` | `'regular' \| 'medium' \| 'semibold' \| 'bold' \| 'extrabold'` |  | Font weight, from the theme's `fontWeight` tokens. Unset, it follows `level`: 1 and 2 `bold`, 3 and 4 `semibold`. A weight you set wins over the level default. |

Also accepts: `HTMLAttributes`.

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.lineHeight.tight` | `1` | `1` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.2.0** (2026-11-21): New `Stack` (vertical flex column; `gap`, default `md`), `Inline` (horizontal row; `gap` default `sm`, `justify` including `between`), `Text` (`size`, `tone`, `weight`; unset props inherit), and `Heading` (`level` 1–4), so layout and text are set with props instead of style files.
- **0.2.0** (2026-11-21): `truncate` on `Text` and `Heading` clips inside `Stack` (any `align`), `Inline`, and a `Stack` nested in an `Inline`; `Stack` and `Inline` roots have `min-width: 0`.

<!-- /generated:changelog -->
