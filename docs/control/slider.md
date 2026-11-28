---
title: Slider
description: A single-value slider with detents at any positions, labels under them and the ends, and an optional custom thumb.
category: Inputs
---
# Slider

<!-- generated:import -->

```ts
import {
  Slider,
  type SliderDetent,
  type SliderProps,
  type SliderThumbState,
} from '@korzun/design/control';
```

<!-- /generated:import -->

A track with a draggable thumb that picks one number between `min` and `max`.
It snaps to multiples of `step`, or with `step={null}` to `detents` only,
which can sit at any positions (chapters in a book, not just even steps).
Detents draw ticks, filled up to the value, with optional labels under them;
`startLabel` and `endLabel` sit under the ends. `thumb` draws your own handle.

Use something else for: one of a few named options (`SegmentedControl`), an
exact number the user types (`NumberInput`), showing progress the user does
not set (`ProgressCircle`).

## Usage

### Behaviour

- Controlled: the thumb shows `value`. `onChange` fires with each new snapped
  value (during a drag, on a track press, on a key press); `onChangeEnd`
  fires once when the interaction ends (pointer release, or right after
  `onChange` for a key). Save in `onChangeEnd`.
- While dragging, the thumb and fill follow the pointer exactly and the ticks
  colour from the snapped value; on release the thumb slides to the value
  (instantly under reduced motion).
- `value` is a position, never a detent index: give each detent the value it
  stands for, and map the value back yourself (`ariaValueText` names it).
- A value between snap points is drawn where it is; the next arrow key moves
  it to the nearest snap point in that direction.
- A detent at exactly `min` or `max` draws no tick; its label still shows.
  Detent labels are centred on their tick (lined up with the track end at
  `min` and `max`) and may overlap when detents crowd.
- Left to right only.

### Keyboard

On the focused thumb: ArrowRight/ArrowUp and ArrowLeft/ArrowDown move to the
next snap point; Page Up/Page Down move 10% of the range (with `step={null}`,
one detent); Home and End go to the first and last snap point.

### Forms

`name` adds a hidden input, so the value submits with a surrounding `<form>`
as `name=value`.

### Styling

`className` lands on the outer element; override with `'&&'`. The default
thumb is an 18px brand circle; a custom `thumb` replaces all of it, while the
slider keeps a focusable target of at least 24px with the focus ring.

## Do / don't

- Do write an `ariaLabel` that says what the slider sets, and an
  `ariaValueText` when the number alone means nothing ("Chapter 3").
- Do save in `onChangeEnd`, not `onChange`, to avoid a request per stop.
- Don't use detent labels for more than a few short words; they do not wrap.
- Don't make a custom thumb focusable or clickable itself; the slider already is.

<!-- generated:examples -->

## Examples

### Basic

A controlled value from 0 to 100 in steps of 1. Drag the thumb, press anywhere on the track, or focus it and use the arrow keys, Page Up/Down, Home and End. `onChange` gets the new number, not an event.

```tsx
import { Space, Text } from '@korzun/design/component';
import { Slider } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [volume, setVolume] = useState(40);
  return (
    <Space direction="vertical">
      <Slider value={volume} onChange={setVolume} ariaLabel="Volume" />
      <Text tone="muted">Volume: {volume}</Text>
    </Space>
  );
}
```

### Detents with labels

`detents` draw ticks, filled up to the value, each with an optional label under it. With a `step` the thumb still stops between them; `startLabel` and `endLabel` sit under the ends.

```tsx
import { Space, Text } from '@korzun/design/component';
import { Slider } from '@korzun/design/control';
import { useState } from 'react';

const SIZES = [
  { value: 12, label: 'S' },
  { value: 16, label: 'M' },
  { value: 20, label: 'L' },
  { value: 24, label: 'XL' },
];

export default function Detents() {
  const [size, setSize] = useState(16);
  return (
    <Space direction="vertical">
      <Slider
        value={size}
        onChange={setSize}
        min={10}
        max={28}
        step={1}
        detents={SIZES}
        startLabel="10px"
        endLabel="28px"
        ariaLabel="Text size"
        ariaValueText={(v) => `${v} pixels`}
      />
      <Text tone="muted">Text size: {size}px</Text>
    </Space>
  );
}
```

### Detents only: a chapter picker

`step={null}` stops only at the detents, which can sit anywhere: here each chapter's start in the book. The value is a position (0–100), mapped back to a chapter for the heading and `ariaValueText`. `onChange` updates the chapter as you drag; `onChangeEnd` fires once on release, the place to save.

```tsx
import { Space, Text } from '@korzun/design/component';
import { Slider } from '@korzun/design/control';
import { useState } from 'react';

// Where each chapter starts, as a percentage of the book; 100 is "finished".
const STARTS = [8, 19, 33, 52, 71];
const DETENTS = [{ value: 0 }, ...STARTS.map((value) => ({ value })), { value: 100 }];

const describe = (v: number) => {
  if (v <= 0) return 'Not started';
  if (v >= 100) return 'Completed';
  return `Chapter ${STARTS.indexOf(v) + 1}`;
};

export default function DetentsOnly() {
  const [position, setPosition] = useState(33);
  const [saved, setSaved] = useState(33);
  return (
    <Space direction="vertical">
      <Text weight="semibold">{describe(position)}</Text>
      <Slider
        value={position}
        onChange={setPosition}
        onChangeEnd={setSaved}
        step={null}
        detents={DETENTS}
        startLabel="Not started"
        endLabel="Completed"
        ariaLabel="Reading progress"
        ariaValueText={describe}
      />
      <Text tone="muted">Saved: {describe(saved)}</Text>
    </Space>
  );
}
```

### Custom thumb

`thumb` draws the handle from its state (`value`, `dragging`, `focused`, `disabled`). The slider keeps the focusable, 24px target around it and centres it on the value, so the node is only what you see. This one is a pill showing the value, which grows while dragging.

```tsx
import { Space } from '@korzun/design/component';
import { Slider } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

// In your app this goes in a sibling style.ts.
const useStyle = createUseStyles((theme: Theme) => ({
  pill: {
    padding: `${theme.space.xxs} ${theme.space.md}`,
    borderRadius: theme.radius.pill,
    background: theme.color.brand.default,
    color: theme.color.text.onPrimary,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    fontVariantNumeric: 'tabular-nums',
    transition: `transform ${theme.transition.fast}`,
  },
  dragging: { transform: 'scale(1.15)' },
}));

export default function CustomThumb() {
  const styles = useStyle();
  const [value, setValue] = useState(60);
  return (
    <Space direction="vertical">
      <Slider
        value={value}
        onChange={setValue}
        step={5}
        ariaLabel="Brightness"
        thumb={(s) => (
          <span className={`${styles.pill} ${s.dragging ? styles.dragging : ''}`}>{s.value}</span>
        )}
      />
    </Space>
  );
}
```

### Disabled

`disabled` ignores the pointer and keys, leaves the tab order and greys the thumb. A switch toggles it.

```tsx
import { Space } from '@korzun/design/component';
import { Slider, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Disabled() {
  const [disabled, setDisabled] = useState(true);
  const [value, setValue] = useState(30);
  return (
    <Space direction="vertical">
      <Switch name="disabled" label="Disabled" checked={disabled} onChange={setDisabled} />
      <Slider
        value={value}
        onChange={setValue}
        detents={[{ value: 25 }, { value: 50 }, { value: 75 }]}
        disabled={disabled}
        ariaLabel="Volume"
      />
    </Space>
  );
}
```

### In a form

`name` submits the value with the form through a hidden input. Submit shows what the form sent.

```tsx
import { Card, Space, Text } from '@korzun/design/component';
import { Button, Slider } from '@korzun/design/control';
import { type FormEvent, useState } from 'react';

export default function InAForm() {
  const [goal, setGoal] = useState(20);
  const [sent, setSent] = useState<string | null>(null);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(String(new FormData(e.currentTarget).get('goal')));
  };
  return (
    <Card title="Reading goal">
      <form onSubmit={submit}>
        <Space direction="vertical">
          <Text>Books this year: {goal}</Text>
          <Slider
            value={goal}
            onChange={setGoal}
            min={0}
            max={52}
            name="goal"
            startLabel="0"
            endLabel="52"
            ariaLabel="Books this year"
          />
          <Space justify="end">
            <Button type="primary" submit>
              Save
            </Button>
          </Space>
          {sent !== null && <Text tone="muted">Sent goal={sent}</Text>}
        </Space>
      </form>
    </Card>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` (required) | `string` |  | Accessible name of the slider: say what it sets ("Reading progress for Middlemarch"). |
| `ariaValueText` | `(value: number) => string` |  | Turns the value into words for screen readers (`(v) => \`Chapter ${n}\``); without it they hear the number. |
| `className` | `string` |  | On the outer element. Override with `'&&'` specificity, never `!important`. |
| `detents` | [SliderDetent](#sliderdetent)`[]` | `[]` | Stops drawn as ticks, filled up to the value, each with an optional label. A detent at exactly `min` or `max` draws no tick, but its label shows. Labels may overlap when detents crowd; space them yourself. |
| `disabled` | `boolean` | `false` | Ignores pointer and keys, leaves the tab order, and greys the default thumb. |
| `endLabel` | `ReactNode` |  | Under the end of the track ("Completed", "100"). |
| `max` | `number` | `100` | The highest value. A `max` not above `min` is treated as `min + 1`. |
| `min` | `number` | `0` | The lowest value. |
| `name` | `string` |  | Submits the value with a surrounding `<form>`, through a hidden input. Not submitted while `disabled`, like a native field. |
| `onChange` (required) | `(value: number) => void` |  | Receives the new snapped value (not an event) each time it changes: during a drag, on a track press, and on each key press. |
| `onChangeEnd` | `(value: number) => void` |  | Receives the final value once an interaction ends: on pointer release, and right after `onChange` for a key press. Save here rather than in `onChange` to avoid a request per pixel. |
| `ref` | `Ref<HTMLDivElement>` |  | The outer element. |
| `startLabel` | `ReactNode` |  | Under the start of the track ("Not started", "0"). |
| `step` | `number \| null` | `1` | A number snaps to `min + k·step` (and to every detent). `null` snaps to the detents only, which suits uneven stops such as chapters; with no detents it then snaps to the two ends. |
| `thumb` | `(state:` [SliderThumbState](#sliderthumbstate)`) => ReactNode` |  | Draws your own thumb in place of the default circle. The slider keeps the focusable, at least 24px target around it, centred on the value, so the node is only the visible part. |
| `value` (required) | `number` |  | The value, between `min` and `max`. Controlled: the thumb shows this, so update it from `onChange`. Out-of-range values are clamped; a value that is not a finite number shows as `min`. |

### SliderDetent

A stop on the track: a tick at `value`, with an optional label under it.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | Shown under the tick, centred on it (or lined up with the track end at `min` or `max`). |
| `value` (required) | `number` |  | Where the detent sits, between `min` and `max`. Any value: detents need not be evenly spaced. |

### SliderThumbState

What a custom `thumb` is drawn for.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` (required) | `boolean` |  | The slider is disabled. |
| `dragging` (required) | `boolean` |  | A pointer is dragging the thumb. |
| `focused` (required) | `boolean` |  | The thumb has keyboard focus. |
| `value` (required) | `number` |  | The value the thumb shows: the snapped value under the pointer while dragging. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.border.focus` | `#0758d9` | `#3696fe` |
| `theme.color.border.strong` | `#DDDDDD` | `#48494F` |
| `theme.color.brand.default` | `#1777FF` | `#3696fe` |
| `theme.color.text.faint` | `#9ca3af` | `#6E7480` |
| `theme.fontSize.xs` | `0.7rem` | `0.7rem` |
| `theme.radius.circle` | `50%` | `50%` |
| `theme.recipe.focusRing` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.space.xs` | `0.25rem` | `0.25rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): New `Slider` (control): one value between `min` and `max` on a draggable, keyboard-operable track. It snaps to `step`, or with `step={null}` only to `detents`, which can sit at any positions and draw ticks with optional labels. `startLabel` and `endLabel` go under the ends, `thumb` draws a custom handle from its state, `onChange` reports each snapped value and `onChangeEnd` the final one, `ariaValueText` names the value, and `name` submits it with a form.

<!-- /generated:changelog -->
