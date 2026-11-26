---
title: ProgressIndicator
description: A small pie-style progress mark with a "Not started", percentage or "Completed" label.
category: Feedback
---
# ProgressIndicator

<!-- generated:import -->

`import { ProgressIndicator, type ProgressIndicatorProps } from '@korzun/design/component'`

<!-- /generated:import -->

A small pie-style progress mark (a brand-coloured sector inside a ring) followed
by a text label: "Not started" at 0, "N%" in between, "Completed" at 100%. The
SVG is a `role="progressbar"` with `aria-valuenow` 0–100.

Use something else for: an indeterminate wait (`Spinner`, or `loading` on
a `Button`), a pull-to-refresh indicator (`usePullToRefresh`).

## Usage

### Surprising behaviour

- **No SVG at exactly 0 or 1**: only the text label renders, so there is then
  no `role="progressbar"` and `ariaLabel` is not used. The visible text
  ("Not started" / "Completed") carries the meaning.
- The label is `Math.round`ed, so values just inside the range show "0%" or
  "100%" next to a sliver or near-full pie (e.g. `0.996` shows "100%", not
  "Completed").
- Passing a percentage (`42`) clamps to 1 and shows "Completed".

### Styling

No `className`.

## Do / don't

- Do pass a 0–1 fraction.
- Do write an `ariaLabel` that names the thing in progress.
- Don't render your own "42%" next to it; it already prints the label.
- Don't use it for indeterminate loading.

<!-- generated:examples -->

## Examples

### Basic

`value` is a fraction from 0 to 1, not a percentage: `0.42` shows "42%". `ariaLabel` names the progress for assistive tech. The buttons step the value by a tenth.

```tsx
import { Inline, ProgressIndicator, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [value, setValue] = useState(0.4);
  return (
    <Stack>
      <ProgressIndicator value={value} ariaLabel="Reading progress for Middlemarch" />
      <Inline>
        <Button onClick={() => setValue((v) => Math.max(0, Math.round((v - 0.1) * 10) / 10))}>
          Less
        </Button>
        <Button onClick={() => setValue((v) => Math.min(1, Math.round((v + 0.1) * 10) / 10))}>
          More
        </Button>
        <Text tone="muted">value: {value}</Text>
      </Inline>
    </Stack>
  );
}
```

### Label states

The label reads "Not started" at 0, "N%" in between and "Completed" at 1. At exactly 0 or 1 only the label renders, with no pie. The label is rounded, so `0.996` shows "100%" next to a near-full pie, not "Completed". Each is labelled with its `value`.

```tsx
import { Inline, ProgressIndicator, Stack, Text } from '@korzun/design/component';

export default function LabelStates() {
  return (
    <Stack gap="sm">
      <Inline>
        <ProgressIndicator value={0} ariaLabel="Upload progress" />
        <Text tone="muted">value 0</Text>
      </Inline>
      <Inline>
        <ProgressIndicator value={0.42} ariaLabel="Upload progress" />
        <Text tone="muted">value 0.42</Text>
      </Inline>
      <Inline>
        <ProgressIndicator value={0.996} ariaLabel="Upload progress" />
        <Text tone="muted">value 0.996</Text>
      </Inline>
      <Inline>
        <ProgressIndicator value={1} ariaLabel="Upload progress" />
        <Text tone="muted">value 1</Text>
      </Inline>
    </Stack>
  );
}
```

### Sizes

`size` is the width and height of the pie in px. The label's font size does not scale with it. Each is labelled with its `size`.

```tsx
import { Inline, ProgressIndicator, Stack, Text } from '@korzun/design/component';

export default function Sizes() {
  return (
    <Stack gap="sm">
      <Inline>
        <ProgressIndicator value={0.6} ariaLabel="Reading progress, 14" size={14} />
        <Text tone="muted">size 14</Text>
      </Inline>
      <Inline>
        <ProgressIndicator value={0.6} ariaLabel="Reading progress, 24" size={24} />
        <Text tone="muted">size 24</Text>
      </Inline>
      <Inline>
        <ProgressIndicator value={0.6} ariaLabel="Reading progress, 40" size={40} />
        <Text tone="muted">size 40</Text>
      </Inline>
      <Inline>
        <ProgressIndicator value={0.6} ariaLabel="Reading progress, 64" size={64} />
        <Text tone="muted">size 64</Text>
      </Inline>
    </Stack>
  );
}
```

### From a percentage

A 0–100 API value is divided by 100 before it is passed; passing `42` itself would clamp to 1 and show "Completed". Pick a percent and the indicator follows.

```tsx
import { Inline, ProgressIndicator, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function FromPercent() {
  const [percent, setPercent] = useState(42);
  return (
    <Stack>
      <ProgressIndicator value={percent / 100} ariaLabel="Upload progress" />
      <Inline>
        <Button onClick={() => setPercent(0)}>0%</Button>
        <Button onClick={() => setPercent(42)}>42%</Button>
        <Button onClick={() => setPercent(100)}>100%</Button>
        <Text tone="muted">API percent: {percent}</Text>
      </Inline>
    </Stack>
  );
}
```

### In a row

A small indicator beside a title in a list row. It prints its own label, so the row adds no "42%" next to it, and `ariaLabel` names the book.

```tsx
import { Card, Inline, ProgressIndicator, Stack, Text } from '@korzun/design/component';

export default function InARow() {
  return (
    <Card title="Reading">
      <Stack gap="sm">
        <Inline justify="between">
          <Text weight="semibold">Middlemarch</Text>
          <ProgressIndicator value={0.42} ariaLabel="Reading progress for Middlemarch" size={14} />
        </Inline>
        <Inline justify="between">
          <Text weight="semibold">Persuasion</Text>
          <ProgressIndicator value={1} ariaLabel="Reading progress for Persuasion" size={14} />
        </Inline>
      </Stack>
    </Card>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` (required) | `string` |  | Accessible name of the progressbar: say what progress it is (`Reading progress for ${title}`), because a bare "42%" means nothing out of context. Not used at exactly 0 or 1, where no progressbar renders. |
| `size` | `number` | `40` | Width and height of the SVG in px. The label's font size is fixed (`fontSize.sm`) and does not scale. |
| `value` (required) | `number` |  | A **fraction from 0 to 1**, not a percentage (`0.42` shows "42%"). Clamped to 0–1, so `42` shows "Completed". |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.brand.default` | `#1777FF` | `#3696fe` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.fontSize.sm` | `0.75rem` | `0.75rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

No changes yet.

<!-- /generated:changelog -->
