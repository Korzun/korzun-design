---
title: Spinner
description: A rotating loading indicator that takes the surrounding text colour and size.
category: Feedback
---
# Spinner

<!-- generated:import -->

`import { Spinner, type SpinnerProps } from '@korzun/design/component'`

<!-- /generated:import -->

A rotating loading indicator. It is `1em` square, takes the surrounding text
colour (`currentColor`), and by default the surrounding font size, so it sits
inline with text without any sizing. Use it for a page, panel or inline load
that has no progress value.

Use something else for: a load with a known fraction (`ProgressIndicator`).
`Button` (`loading`), `Select` (`loading`) and `Switch` (`loading`) draw their
own spinner; do not add one beside them.

## Usage

### Behaviour

- By default the root is a `span` with `role="status"` and `aria-label={label}`,
  so a screen reader announces the load. The inner icon is always `aria-hidden`.
- With `decorative`, the root has no role and is `aria-hidden`.
- Override with `className` at `'&&'` specificity, never `!important`.

### Styling

There is no `style` prop and no other attribute passthrough.

## Do / don't

- Do use `decorative` when adjacent text names the load.
- Do give a specific `label` when the spinner stands alone.
- Don't hand-write `role="status"` around it; it already has one.
- Don't add a Spinner inside `Button`, `Select` or `Switch`; they draw their
  own.

<!-- generated:examples -->

## Examples

### Basic

With no props the spinner is `1em` square and takes the colour and font size of the text around it, so it sits inline without any sizing. The text names the load, so the spinner is `decorative`.

```tsx
import { Spinner, Stack, Text } from '@korzun/design/component';

export default function Basic() {
  return (
    <Stack gap="sm">
      <Text>
        Syncing your library <Spinner decorative />
      </Text>
      <Text size="xl" tone="muted">
        Fetching covers <Spinner decorative />
      </Text>
    </Stack>
  );
}
```

### Sizes

`size` takes a `fontSize` token and sets the spinner to that many `em`. Each spinner is labelled with its size.

```tsx
import { Inline, Stack, Spinner, Text } from '@korzun/design/component';

export default function Sizes() {
  return (
    <Stack gap="sm">
      <Inline>
        <Spinner size="xxs" label="Loading, xxs" />
        <Text tone="muted">xxs</Text>
      </Inline>
      <Inline>
        <Spinner size="xs" label="Loading, xs" />
        <Text tone="muted">xs</Text>
      </Inline>
      <Inline>
        <Spinner size="sm" label="Loading, sm" />
        <Text tone="muted">sm</Text>
      </Inline>
      <Inline>
        <Spinner size="md" label="Loading, md" />
        <Text tone="muted">md</Text>
      </Inline>
      <Inline>
        <Spinner size="lg" label="Loading, lg" />
        <Text tone="muted">lg</Text>
      </Inline>
      <Inline>
        <Spinner size="xl" label="Loading, xl" />
        <Text tone="muted">xl</Text>
      </Inline>
      <Inline>
        <Spinner size="xxl" label="Loading, xxl" />
        <Text tone="muted">xxl</Text>
      </Inline>
    </Stack>
  );
}
```

### Decorative

Alone, a spinner needs a `label` that names the load: it is a `role="status"` that a screen reader announces. Beside text that already names the load, set `decorative` so it is hidden from assistive tech; `label` is then ignored.

```tsx
import { Inline, Spinner, Stack, Text } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Decorative() {
  const [decorative, setDecorative] = useState(true);
  return (
    <Stack>
      <Switch name="decorative" label="Decorative" checked={decorative} onChange={setDecorative} />
      <Inline gap="xs">
        <Spinner decorative={decorative} label="Loading books" />
        <Text>Loading books</Text>
      </Inline>
      <Text tone="muted">
        Screen readers: {decorative ? 'the spinner is hidden' : 'announce “Loading books” twice'}
      </Text>
    </Stack>
  );
}
```

### Loading page

A page or panel load with no progress value: a large spinner above a line of text. The text names the load, so the spinner is `decorative`; with no text, give it a specific `label` instead.

```tsx
import { Spinner, Stack, Text } from '@korzun/design/component';

export default function LoadingPage() {
  return (
    <Stack align="center" gap="sm">
      <Spinner size="xxl" decorative />
      <Text tone="muted">Loading your library</Text>
    </Stack>
  );
}
```

### Standalone

With no text beside it, a spinner stands alone and the `label` is what a screen reader announces: make it specific.

```tsx
import { Spinner } from '@korzun/design/component';

export default function Standalone() {
  return <Spinner size="xl" label="Loading books" />;
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` |  | Added last on the root. Override with `'&&'` specificity, never `!important`. |
| `decorative` | `boolean` | `false` | Hides it from assistive tech (no role, `aria-hidden`), for use beside text that already names the load. |
| `label` | `string` | `'Loading'` | Accessible name of the status, announced as the loading state. Ignored when `decorative`. |
| `size` | `'xxs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` |  | Sets the font size from the theme's `fontSize` tokens, so the spinner is that many `em` square. Unset, it takes the surrounding font size. |

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
| `theme.recipe.spinner` | `recipe` | `recipe` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.3.0** (2026-11-22): New `Spinner` (component): a loading indicator that takes the surrounding text colour and size.

<!-- /generated:changelog -->
