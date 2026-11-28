---
title: SegmentedControl
description: A row of equal-width radio segments in a track, with a lens that slides to the checked one.
category: Inputs
---
# SegmentedControl

<!-- generated:import -->

```ts
import {
  SegmentedControl,
  type SegmentedControlProps,
  type SegmentedOption,
} from '@korzun/design/control';
```

<!-- /generated:import -->

A row of equal-width radio segments in a track, with a lens that slides to the
checked one. Options can be text, or an icon over a small caption. Optionally
clearable, and read-only when `onChange` is omitted. Generic over the value
type: `V extends string`.

Use something else for: many options or long labels (`Select`), on/off
(`Switch`), actions (`Button`).

## Usage

### Behaviour

No `className`, no `name` (not a form field). Type options with the exported
`SegmentedOption<V>` (and props with `SegmentedControlProps<V>`).

### Keyboard

On the group: ArrowRight/ArrowUp and ArrowLeft/ArrowDown step one option and do
not wrap; Home/End jump to the ends; digits 1–9 pick that option; Backspace and
Delete clear when `clearable`. Modified keys (Ctrl/Cmd/Alt) are left alone.

### Choosing a surface

The track and lens take the radius of the surface depth they sit at (see
[corners](../corners.md)): `md` in a card or modal, `lg` directly on a `Page`,
`sm` two or more levels in.

- Directly in a `Card` body: omit `surface` (`'card'`).
- Inside a shaded `bg.cardHeader` row you built (label left, control right):
  `surface="row"`, so the row itself is the track and the lens is flush with it.

## Do / don't

- Do keep it to a handful of short options; segments are equal columns.
- Do pass `clearable` whenever `null` is a valid answer, or the user can never
  get back to it.
- Don't pass `onChange={() => {}}` to show a value; omit `onChange` for read-only.

<!-- generated:examples -->

## Examples

### Basic

A few short text options. Declare them `as const` so `value` and `onChange`
are typed to the option values. The `label` names the group for assistive tech
and is not drawn, so put a visible label beside the control yourself.

```tsx
import { Space, Text } from '@korzun/design/component';
import { SegmentedControl } from '@korzun/design/control';
import { useState } from 'react';

const SORTS = [
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'added', label: 'Added' },
] as const;

export default function Basic() {
  const [sort, setSort] = useState<(typeof SORTS)[number]['value']>('title');
  return (
    <Space direction="vertical" align="start">
      <Text tone="muted">Sort by</Text>
      <SegmentedControl label="Sort by" options={SORTS} value={sort} onChange={setSort} />
      <Text tone="muted">Sorted by: {sort}</Text>
    </Space>
  );
}
```

### Icons

An option with an `Icon` draws it above its label, which becomes a small
caption. `showLabels={false}` drops the captions and leaves icons only; the
`label` stays each segment's accessible name. `Icon` takes a component
(`ThumbDownIcon`), not an element.

```tsx
import { Space, Text } from '@korzun/design/component';
import { SegmentedControl } from '@korzun/design/control';
import { HandLoveYouIcon, HandOkIcon, ThumbDownIcon } from '@korzun/design/icon';
import { useState } from 'react';

const RATINGS = [
  { value: 'bad', label: 'Bad', Icon: ThumbDownIcon },
  { value: 'ok', label: 'Okay', Icon: HandOkIcon },
  { value: 'great', label: 'Great', Icon: HandLoveYouIcon },
] as const;

export default function Icons() {
  const [rating, setRating] = useState<(typeof RATINGS)[number]['value']>('ok');
  return (
    <Space direction="vertical" gap="xl" align="start">
      <Space direction="vertical" gap="xs" align="start">
        <Text size="sm" tone="muted">
          With captions
        </Text>
        <SegmentedControl label="Rating" options={RATINGS} value={rating} onChange={setRating} />
      </Space>
      <Space direction="vertical" gap="xs" align="start">
        <Text size="sm" tone="muted">
          {'showLabels={false}'}
        </Text>
        <SegmentedControl
          label="Rating"
          options={RATINGS}
          value={rating}
          onChange={setRating}
          showLabels={false}
        />
      </Space>
      <Text tone="muted">Rating: {rating}</Text>
    </Space>
  );
}
```

### Clearable

With `clearable`, clicking the checked segment, Backspace or Delete calls
`onChange(null)`. Once the value is `null` nothing is checked and no lens is
drawn. Without `clearable`, `onChange` never receives `null`.

```tsx
import { Space, Text } from '@korzun/design/component';
import { SegmentedControl } from '@korzun/design/control';
import { HandLoveYouIcon, HandOkIcon, ThumbDownIcon } from '@korzun/design/icon';
import { useState } from 'react';

const RATINGS = [
  { value: 'bad', label: 'Bad', Icon: ThumbDownIcon },
  { value: 'ok', label: 'Okay', Icon: HandOkIcon },
  { value: 'great', label: 'Great', Icon: HandLoveYouIcon },
] as const;

export default function Clearable() {
  const [rating, setRating] = useState<(typeof RATINGS)[number]['value'] | null>('great');
  return (
    <Space direction="vertical" align="start">
      <SegmentedControl
        label="Rating"
        options={RATINGS}
        value={rating}
        onChange={setRating}
        clearable
        showLabels={false}
      />
      <Text tone="muted">Rating: {rating ?? 'none'}</Text>
    </Space>
  );
}
```

### Read-only

Omit `onChange` to show a value without letting it change: the segments are
marked `aria-disabled` and ignore clicks and keys. A `null` value checks
nothing and draws no lens.

```tsx
import { Space, Text } from '@korzun/design/component';
import { SegmentedControl } from '@korzun/design/control';

const OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'Review' },
  { value: 'published', label: 'Published' },
] as const;

export default function ReadOnly() {
  return (
    <Space direction="vertical" gap="xl" align="start">
      <Space direction="vertical" gap="xs" align="start">
        <Text size="sm" tone="muted">
          value="review"
        </Text>
        <SegmentedControl label="Status" options={OPTIONS} value="review" />
      </Space>
      <Space direction="vertical" gap="xs" align="start">
        <Text size="sm" tone="muted">
          {'value={null}'}
        </Text>
        <SegmentedControl label="Status" options={OPTIONS} value={null} />
      </Space>
    </Space>
  );
}
```

### Surfaces

In a Card body the control paints its own track. In the shaded Card header the
header is the track, so `surface="row"` paints nothing and only the lens
shows. The corner is the same in both: the control belongs inside a card or
modal.

```tsx
import { Card, Space, Text } from '@korzun/design/component';
import { SegmentedControl } from '@korzun/design/control';
import { useState } from 'react';

const VIEWS = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
] as const;

type View = (typeof VIEWS)[number]['value'];

export default function Surfaces() {
  const [body, setBody] = useState<View>('grid');
  const [header, setHeader] = useState<View>('list');
  return (
    <Space direction="vertical">
      <Card title="surface card, in the body">
        <SegmentedControl label="Body view" options={VIEWS} value={body} onChange={setBody} />
      </Card>
      <Card
        title="surface row, in the header"
        headerAction={
          <SegmentedControl
            label="Header view"
            options={VIEWS}
            value={header}
            onChange={setHeader}
            surface="row"
          />
        }
      >
        <Text>Showing {header}.</Text>
      </Card>
    </Space>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `clearable` | `boolean` | `false` | Clicking (or Space/Enter on) the checked segment, Backspace and Delete clear the value. Without it, clicking the checked segment does nothing and there is no way to clear. |
| `label` (required) | `string` |  | The group's accessible name (`aria-label`), e.g. the setting it edits. Not rendered visibly: put a visible label beside it yourself. |
| `onChange` | `((value: V \| null) => void) \| ((value: V) => void)` |  | Receives `null` (a clear) only when `clearable` is set. Absent means read-only: the control shows the value, and segments get `aria-disabled` and ignore clicks and keys. |
| `options` (required) | `ReadonlyArray<`[SegmentedOption](#segmentedoption)`<V>>` |  | The segments, in order. Declare them `as const` or type them as `SegmentedOption<V>`. |
| `showLabels` | `boolean` | `true` | Render each option's label. Only an option with an `Icon` can go without one; a text-only option always shows its label. |
| `surface` | `'card' \| 'row'` | `'card'` | What the control sits on. `card` paints its own `bg.track` rail. `row` paints nothing: the shaded input row it sits in is the track and only the lens shows, the way the white field shows in a `TextInput` row. |
| `value` (required) | `V \| null` |  | The checked option; `null` (or a value no option has) checks nothing and draws no lens. |

### SegmentedOption

One segment of a `SegmentedControl`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Icon` | `(props: IconProps) => JSX.Element` |  | Icon component (`Icon: SearchIcon`), not an element. Drawn above the label, which then becomes a small caption under it. |
| `label` (required) | `string` |  | The segment's accessible name, and its visible text unless `showLabels` is off. |
| `value` (required) | `V` |  | The value passed to `onChange` when this segment is picked. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.bg.input` | `#FFFFFF` | `#1A1B1E` |
| `theme.color.bg.track` | `#EEEEEE` | `#2C2D31` |
| `theme.color.border.default` | `#D9D9D9` | `#3A3B40` |
| `theme.color.brand.default` | `#1777FF` | `#3696fe` |
| `theme.color.brand.hover` | `#3696fe` | `#87BAFF` |
| `theme.color.brand.outline` | `#91CAFF` | `rgba(54, 150, 254, 0.45)` |
| `theme.color.text.muted` | `#6E6E6E` | `#9CA1AB` |
| `theme.color.text.secondary` | `#5A6375` | `#C8CBD2` |
| `theme.fontFamily.body` | `system-ui, sans-serif` | `system-ui, sans-serif` |
| `theme.fontSize.md` | `0.875rem` | `0.875rem` |
| `theme.fontSize.xs` | `0.7rem` | `0.7rem` |
| `theme.fontWeight.medium` | `500` | `500` |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.recipe.focusRing` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.shadow.cardStack` | `0px 2px 0px rgba(217, 217, 217, 0.2)` | `0px 2px 0px rgba(0, 0, 0, 0.4)` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xl` | `0.75rem` | `0.75rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.space.xxs` | `0.125rem` | `0.125rem` |
| `theme.transition.spring` | `0.35s cubic-bezier(0.4, 0, 0.2, 1)` | `0.35s cubic-bezier(0.4, 0, 0.2, 1)` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): Corners follow surface depth, like `Button` and `Select`: `lg` directly on a `Page`, `md` in a Card or Dialog (unchanged), `sm` two or more levels in (a nested Card, a `CardRow` or `Surface` in a Card, a Popover). A field's shaded row and the field in it take the same radius; `ChipsInput` chips and a horizontal `Switch`'s `inset` track are a step squarer than their box. With no surface above, each keeps its 0.6.0 look. **Visible changes:** fields and Tags placed directly on a Page get 16px corners, and Tags inside a `CardRow` in a Card get 4px. A text field, `ChipsInput` box or field label directly on a Page also moves its text 16px in from the edge (8px elsewhere), the inset `Button` keeps, so it clears the deeper corner.
- **0.7.0** (2026-11-26): Segments set their own font size (`fontSize.md`, the 14px of their labels) instead of the browser's 13.33px button default. Labels look the same; the segment's own text metrics no longer depend on the browser or page.

<!-- /generated:changelog -->
