---
title: ProgressCircle
description: A progress circle, filled like a pie or border-only, in a tone, with its value beside it, inside it or hidden.
category: Feedback
---
# ProgressCircle

<!-- generated:import -->

```ts
import {
  ProgressCircle,
  type ProgressCircleProps,
  type ProgressCircleTone,
} from '@korzun/design/component';
```

<!-- /generated:import -->

A circle that fills as `value` goes from 0 to `max`: a pie inside a thin ring
(`variant="filled"`) or an arc over a faint track (`variant="outline"`), in a
`tone`. The value is written beside it, inside it, or not at all (`label`), as
a percentage or with your own `unit`. The whole thing is one
`role="progressbar"` named by `ariaLabel`, whose `aria-valuetext` is the same
text the label shows.

It shows a number at every value, 0 and `max` included. For words at the ends
("Not started", "Completed"), use the [Reading progress](../recipes/reading-progress.md)
recipe.

Use something else for: an indeterminate wait (`Spinner`, or `loading` on
a `Button`), a pull-to-refresh indicator (`usePullToRefresh`).

## Usage

### Surprising behaviour

- `max` defaults to 1, so `value` is a fraction: passing `42` clamps to 1 and
  shows "100%". Pass `max={100}` for a 0–100 value.
- The percentage is `Math.round`ed, so `0.996` shows "100%" next to a
  near-full circle. Other units show the value to one decimal at most.
- `unit` is appended verbatim: write `" pages"`, with the space, for "3 pages".
- A value that is not a finite number (`NaN`, or `undefined` from a cleared
  field) counts as 0.
- An inside label longer than four characters is squeezed to fit, so keep it
  short (a percentage, or a bare number with `unit=""`), and use `size` 40 or
  more.

### Styling

No `className`. Colour comes from `tone`; a filled circle's ring is
`text.primary` and an outline's track is `border.default`.

## Do / don't

- Do write an `ariaLabel` that names the thing in progress.
- Do pick `outline` with `label="inside"`; text over a filled pie needs its halo.
- Don't render your own "42%" next to it; set `label` instead.
- Don't use it for indeterminate loading.

<!-- generated:examples -->

## Examples

### Basic

By default `value` is a fraction from 0 to 1, not a percentage: `0.42` shows "42%". The circle shows at 0 and 1 too, as "0%" and "100%". `ariaLabel` names the progress for assistive tech. The buttons step the value by a tenth.

```tsx
import { Space, ProgressCircle, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [value, setValue] = useState(0.4);
  return (
    <Space direction="vertical">
      <ProgressCircle value={value} ariaLabel="Reading progress for Middlemarch" />
      <Space>
        <Button onClick={() => setValue((v) => Math.max(0, Math.round((v - 0.1) * 10) / 10))}>
          Less
        </Button>
        <Button onClick={() => setValue((v) => Math.min(1, Math.round((v + 0.1) * 10) / 10))}>
          More
        </Button>
      </Space>
      <Text tone="muted">value: {value}</Text>
    </Space>
  );
}
```

### Filled and outline

`variant="filled"` is a pie inside a ring; `variant="outline"` is border-only, an arc over a faint track. `label` puts the value `'outside'` (the default), `'inside'` the circle, or nowhere (`'none'`, still read by screen readers).

```tsx
import { ProgressCircle, Space, Text } from '@korzun/design/component';

const LABELS = ['outside', 'inside', 'none'] as const;

export default function Variants() {
  return (
    <Space direction="vertical" gap="lg">
      {(['filled', 'outline'] as const).map((variant) => (
        <Space key={variant} gap="xl">
          <Text tone="muted">{variant}</Text>
          {LABELS.map((label) => (
            <ProgressCircle
              key={label}
              value={0.65}
              variant={variant}
              label={label}
              size={48}
              ariaLabel={`Upload progress, ${variant}, label ${label}`}
            />
          ))}
        </Space>
      ))}
    </Space>
  );
}
```

### Tones

`tone` colours the progress: `brand` (the default), a status colour, or a quiet `neutral` grey. The ring of a filled circle stays in the text colour.

```tsx
import { ProgressCircle, Space } from '@korzun/design/component';

const TONES = ['brand', 'success', 'warning', 'danger', 'neutral'] as const;

export default function Tones() {
  return (
    <Space direction="vertical" gap="lg">
      <Space wrap gap="lg">
        {TONES.map((tone) => (
          <ProgressCircle
            key={tone}
            value={0.6}
            tone={tone}
            label="none"
            ariaLabel={`${tone} progress`}
          />
        ))}
      </Space>
      <Space wrap gap="lg">
        {TONES.map((tone) => (
          <ProgressCircle
            key={tone}
            value={0.6}
            tone={tone}
            variant="outline"
            label="inside"
            size={48}
            ariaLabel={`${tone} progress`}
          />
        ))}
      </Space>
    </Space>
  );
}
```

### Max and units

`max` is the value that means done (default 1, a fraction). The default `unit`, `'%'`, shows the percentage of `max`; any other `unit` shows the value itself followed by it, verbatim, so include a leading space when you want one.

```tsx
import { ProgressCircle, Space, Text } from '@korzun/design/component';

export default function Units() {
  return (
    <Space direction="vertical" gap="sm">
      <Space>
        <ProgressCircle value={42} max={100} ariaLabel="Upload progress" />
        <Text tone="muted">value 42, max 100</Text>
      </Space>
      <Space>
        <ProgressCircle value={3} max={12} unit=" of 12" ariaLabel="Chapters read" />
        <Text tone="muted">value 3, max 12, unit " of 12"</Text>
      </Space>
      <Space>
        <ProgressCircle value={180} max={320} unit=" pages" ariaLabel="Pages read" />
        <Text tone="muted">value 180, max 320, unit " pages"</Text>
      </Space>
      <Space>
        <ProgressCircle
          value={7}
          max={10}
          unit=""
          label="inside"
          variant="outline"
          size={48}
          ariaLabel="Steps done"
        />
        <Text tone="muted">value 7, max 10, unit "", inside</Text>
      </Space>
    </Space>
  );
}
```

### Sizes

`size` is the width and height of the circle in px. An outside label keeps its font size; an inside one scales with the circle. Each is labelled with its `size`.

```tsx
import { Space, ProgressCircle, Text } from '@korzun/design/component';

export default function Sizes() {
  return (
    <Space direction="vertical" gap="sm">
      <Space>
        <ProgressCircle value={0.6} ariaLabel="Reading progress, 14" size={14} />
        <Text tone="muted">size 14</Text>
      </Space>
      <Space>
        <ProgressCircle value={0.6} ariaLabel="Reading progress, 24" size={24} />
        <Text tone="muted">size 24</Text>
      </Space>
      <Space>
        <ProgressCircle value={0.6} ariaLabel="Reading progress, 40" size={40} />
        <Text tone="muted">size 40</Text>
      </Space>
      <Space>
        <ProgressCircle value={0.6} ariaLabel="Reading progress, 64" size={64} />
        <Text tone="muted">size 64</Text>
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
| `ariaLabel` (required) | `string` |  | Accessible name of the progressbar: say what progress it is (`Reading progress for ${title}`), because a bare "42%" means nothing out of context. |
| `label` | `'outside' \| 'inside' \| 'none'` | `'outside'` | Where the value is written: `'outside'` beside the circle, `'inside'` centred in it (suits `variant="outline"`, and sizes of 40 or more), or `'none'` (screen readers still hear it). The text is never "Not started" or "Completed"; see the Reading progress recipe for those. |
| `max` | `number` | `1` | The value that means done. The default, 1, takes a fraction (`0.42`); pass `100` for a percentage or `12` for 12 chapters. |
| `size` | `number` | `40` | Width and height of the circle in px. An outside label keeps its `fontSize.sm`; an inside one scales with the circle. |
| `tone` | `'brand' \| 'success' \| 'warning' \| 'danger' \| 'neutral'` | `'brand'` | Colour of the progress: `'brand'` (default), a status colour (`'success'`, `'warning'`, `'danger'`) or `'neutral'` grey. No `'info'`: it would be the same blue as `'brand'`. |
| `unit` | `string` | `'%'` | How the value is written. `'%'` (the default) shows the percentage of `max`, rounded to a whole number. Anything else shows the value itself followed by `unit`, verbatim: `unit=" of 12"` shows "3 of 12", `unit=""` the bare number. Screen readers hear the same text. |
| `value` (required) | `number` |  | Progress from 0 to `max`. Clamped to that range; a value that is not a finite number (`NaN`, `undefined`, `Infinity`) counts as 0. |
| `variant` | `'filled' \| 'outline'` | `'filled'` | `'filled'` is a pie: a sector inside a thin ring. `'outline'` is border-only: an arc over a faint track, with the middle empty. |

### Types

```ts
/** The colour of the progress: brand, a status colour, or a quiet grey. There is no `info`: it is the brand blue. */
type ProgressCircleTone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.bg.card` | `#FCFCFC` | `#1A1B1E` |
| `theme.color.border.default` | `#D9D9D9` | `#3A3B40` |
| `theme.color.brand.default` | `#1777FF` | `#3696fe` |
| `theme.color.danger.default` | `#FF4D4F` | `#FF4D4F` |
| `theme.color.success` | `#16a34a` | `#22C55E` |
| `theme.color.text.muted` | `#6E6E6E` | `#9CA1AB` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.color.warning` | `#ca8a04` | `#EAB308` |
| `theme.fontSize.sm` | `0.75rem` | `0.75rem` |
| `theme.fontWeight.semibold` | `600` | `600` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): **Breaking:** `ProgressIndicator` is renamed `ProgressCircle` (`ProgressIndicatorProps` → `ProgressCircleProps`). It always draws the circle and writes a number, 0 and 1 included; "Not started" and "Completed" are gone from the component and live in the new Reading progress recipe. The whole mark, label included, is now one `progressbar` with `aria-valuetext`.
- **0.7.0** (2026-11-26): New props: `tone` (`brand`, `success`, `warning`, `danger`, `neutral`; new `ProgressCircleTone` type; no `info`, which is the brand blue), `variant="outline"` for a border-only arc instead of the filled pie, `label` (`outside`, `inside`, `none`) for where the value is written, and `max` and `unit` for values that are not fractions (`value={3} max={12} unit=" of 12"` shows "3 of 12").
- **0.5.2** (2026-11-26): A `value` that is not a finite number (`NaN`, `undefined`, `Infinity`) shows "Not started" instead of "NaN%".

<!-- /generated:changelog -->
