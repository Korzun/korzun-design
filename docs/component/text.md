---
title: Text
description: A run of text with themed size, tone and weight; unset props inherit from the surrounding text.
category: Typography
---
# Text

<!-- generated:import -->

`import { Text, type TextProps } from '@korzun/design/component'`

<!-- /generated:import -->

A run of text with themed size, tone and weight. Use it to set text style by
prop instead of a style file: a body line, a meta line, a caption, an inline
error.

**Unset props inherit.** A bare `<Text>` adds no size, tone or weight, so it
looks exactly like the text around it. This keeps the look inside a `Tag`, a
`Button` or an error block: set only what you want to change.

Use something else for: a heading (`Heading`), a single chip (`Tag`), a line
of small metadata (`MetaLine`), a boxed alert (`Alert`).

## Usage

### Behaviour

- `tone` is not `Tag`'s `TagTone` union. `primary` to `description` map to the
  theme's `color.text.*`; `danger` and `success` use the chip text colours.
- `danger` and `success` are for inline error and confirmation text. For a
  boxed message use `Alert`.
- `truncate` adds `overflow: hidden`, an ellipsis, `white-space: nowrap`,
  `min-width: 0` and `max-width: 100%`, so a truncated Text clips inside an
  `Inline` or `Stack` with any `align`, and a `Stack` or `Inline` nested in a
  row shrinks too (both roots have `min-width: 0`).
- On `span`, `strong`, `em` and `label`, `truncate` also makes the element
  `inline-block`, because inline elements ignore overflow. `p` and `div` keep their block display.
- `as="p"` has its margin reset to 0; space paragraphs with `Stack` `gap`.
- Every other HTML attribute (`id`, `aria-*`, `data-*`, event handlers) passes
  through. There is no `style` prop.
- Override with `className` at `'&&'` specificity, never `!important`.

## Do / don't

- Do set only the props you need; leave the rest to inherit.
- Do use the recipes: body `<Text>`, meta `size="sm" tone="muted"`, caption
  `size="xs" tone="faint"`.
- Do put `truncate` on the Text itself, not on a wrapper.
- Don't use `Text` for headings; use `Heading`.
- Don't set `tone="danger"` to build a box; it only colours text.
- Don't add margins to space text; use `Stack`.

<!-- generated:examples -->

## Examples

### Basic

Body text sets nothing and inherits; a meta line is `size="sm"` with
`tone="muted"`; a caption is `size="xs"` with `tone="faint"`.

```tsx
import { Stack, Text } from '@korzun/design/component';

export default function Basic() {
  return (
    <Stack gap="sm">
      <Text as="p">Welcome back.</Text>
      <Text as="p" size="sm" tone="muted">
        3 books, updated yesterday
      </Text>
      <Text as="p" size="xs" tone="faint">
        Cover art by the publisher
      </Text>
    </Stack>
  );
}
```

### Sizes

`size` takes a key of the theme's `fontSize` scale.

```tsx
import { Stack, Text } from '@korzun/design/component';

const sizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

export default function Sizes() {
  return (
    <Stack gap="xs">
      {sizes.map((size) => (
        <Text key={size} as="div" size={size}>
          {`size="${size}"`}
        </Text>
      ))}
    </Stack>
  );
}
```

### Tones

`primary` to `description` step down in emphasis. `danger` and `success`
colour inline error and confirmation text.

```tsx
import { Stack, Text } from '@korzun/design/component';

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
    <Stack gap="xs">
      {tones.map((tone) => (
        <Text key={tone} as="div" tone={tone}>
          {`tone="${tone}"`}
        </Text>
      ))}
    </Stack>
  );
}
```

### Weights

`weight` takes a key of the theme's `fontWeight` scale.

```tsx
import { Stack, Text } from '@korzun/design/component';

const weights = ['regular', 'medium', 'semibold', 'bold', 'extrabold'] as const;

export default function Weights() {
  return (
    <Stack gap="xs">
      {weights.map((weight) => (
        <Text key={weight} as="div" weight={weight}>
          {`weight="${weight}"`}
        </Text>
      ))}
    </Stack>
  );
}
```

### Inherit

A bare `Text` adds no size, tone or weight, so it looks like the text
around it. Set only what should change: the first inner `Text` matches the
large, muted `Text` that holds it, and the second overrides only `weight`.

```tsx
import { Text } from '@korzun/design/component';

export default function Inherit() {
  return (
    <Text as="p" size="lg" tone="muted">
      Outer text, large and muted. <Text>A bare Text inherits both.</Text>{' '}
      <Text weight="bold">This one only adds weight.</Text>
    </Text>
  );
}
```

### Elements

`as` picks the element: `span` for a run inside a line, `p` and `div` for
blocks, `strong` and `em` for emphasis, `label` for a control.

```tsx
import { Stack, Text } from '@korzun/design/component';

const elements = ['span', 'p', 'div', 'strong', 'em', 'label'] as const;

export default function Elements() {
  return (
    <Stack gap="xs">
      {elements.map((as) => (
        <Text key={as} as={as}>
          {`as="${as}"`}
        </Text>
      ))}
    </Stack>
  );
}
```

### Label and error

`as="label"` with `htmlFor` names a native or third-party control. While the field is empty an
inline error shows: `as="div"` with `tone="danger"` and `aria-live="polite"`.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function LabelAndError() {
  const [title, setTitle] = useState('');
  return (
    <Stack gap="xs">
      <Text as="label" htmlFor="book-title" size="sm" weight="medium">
        Title
      </Text>
      <input
        id="book-title"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <Text as="div" size="sm" tone="danger" aria-live="polite">
        {title === '' ? 'Title is required.' : null}
      </Text>
    </Stack>
  );
}
```

### Truncate

`truncate` clips to one line with an ellipsis. Beside an action in an
`Inline`, the title shrinks and the button keeps its width; a title above
a meta line in a `Stack` shrinks with the row.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

const title =
  'Middlemarch: A Study of Provincial Life, in Eight Books, with a Prelude and a Finale, Followed by an Extended Note on the Text, a Chronology, a Map of the Midlands, and a Glossary of Provincial Terms';

export default function Truncate() {
  const [opened, setOpened] = useState(0);
  return (
    <Stack gap="xl">
      <Inline justify="between">
        <Text truncate weight="semibold">
          {title}
        </Text>
        <Button type="primary" onClick={() => setOpened((n) => n + 1)}>
          Open
        </Button>
      </Inline>
      <Inline justify="between">
        <Stack gap="none">
          <Text truncate weight="semibold">
            {title}
          </Text>
          <Text size="sm" tone="muted">
            George Eliot. Opened: {opened}
          </Text>
        </Stack>
        <Button type="primary" onClick={() => setOpened((n) => n + 1)}>
          Open
        </Button>
      </Inline>
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The text. |
| `as` | `'span' \| 'p' \| 'div' \| 'label' \| 'strong' \| 'em'` | `'span'` | The element to render. `p` has its margin reset to 0; space paragraphs with `Stack` `gap`. |
| `className` | `string` |  | Extra class on the root. Override with `'&&'` specificity, never `!important`. |
| `htmlFor` | `string` |  | The id of the control this label describes. Only for `as="label"`. |
| `ref` | `Ref<HTMLElement>` |  | Ref to the root element. |
| `size` | `'xxs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` |  | Font size, from the theme's `fontSize` tokens. Unset, it inherits from the parent. |
| `tone` | `'primary' \| 'secondary' \| 'muted' \| 'faint' \| 'description' \| 'danger' \| 'success'` |  | Text colour. `primary` to `description` use the theme's `color.text` tokens; `danger` and `success` use the chip text colours, for inline error and confirmation text. Unset, it inherits from the parent. |
| `truncate` | `boolean` | `false` | Clips to one line with an ellipsis. Also sets `min-width: 0` and `max-width: 100%`, so it clips inside an `Inline` or `Stack` with any `align`. On `span`, `strong`, `em` and `label` it also makes the element `inline-block`, because inline elements ignore overflow. |
| `weight` | `'regular' \| 'medium' \| 'semibold' \| 'bold' \| 'extrabold'` |  | Font weight, from the theme's `fontWeight` tokens. Unset, it inherits from the parent. |

Also accepts: `HTMLAttributes`.

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.chip.danger.text` | `#D9373e` | `#FF8E8E` |
| `theme.color.chip.success.text` | `#15803d` | `#86EFAC` |
| `theme.color.text.description` | `#585863` | `#A8ADB6` |
| `theme.color.text.faint` | `#9ca3af` | `#6E7480` |
| `theme.color.text.muted` | `#6E6E6E` | `#9CA1AB` |
| `theme.color.text.onDanger` | `#FFFFFF` | `#FFFFFF` |
| `theme.color.text.onPrimary` | `#FFFFFF` | `#FFFFFF` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.color.text.secondary` | `#5A6375` | `#C8CBD2` |
| `theme.fontSize.lg` | `1rem` | `1rem` |
| `theme.fontSize.md` | `0.875rem` | `0.875rem` |
| `theme.fontSize.sm` | `0.75rem` | `0.75rem` |
| `theme.fontSize.xl` | `1.25rem` | `1.25rem` |
| `theme.fontSize.xs` | `0.7rem` | `0.7rem` |
| `theme.fontSize.xxl` | `1.75rem` | `1.75rem` |
| `theme.fontSize.xxs` | `0.6rem` | `0.6rem` |
| `theme.fontWeight.bold` | `700` | `700` |
| `theme.fontWeight.extrabold` | `800` | `800` |
| `theme.fontWeight.medium` | `500` | `500` |
| `theme.fontWeight.regular` | `400` | `400` |
| `theme.fontWeight.semibold` | `600` | `600` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.2.0** (2026-11-21): New `Stack` (vertical flex column; `gap`, default `md`), `Inline` (horizontal row; `gap` default `sm`, `justify` including `between`), `Text` (`size`, `tone`, `weight`; unset props inherit), and `Heading` (`level` 1–4), so layout and text are set with props instead of style files.
- **0.2.0** (2026-11-21): `truncate` on `Text` and `Heading` clips inside `Stack` (any `align`), `Inline`, and a `Stack` nested in an `Inline`; `Stack` and `Inline` roots have `min-width: 0`.

<!-- /generated:changelog -->
