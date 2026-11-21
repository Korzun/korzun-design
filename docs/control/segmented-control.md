# SegmentedControl

`import { SegmentedControl } from '@korzun/design/control'`

A row of equal-width radio segments in a track, with a lens that slides to the
checked one. Options can be text, or an icon over a small caption. Optionally
clearable, and read-only when `onChange` is omitted. Generic over the value
type: `V extends string`.

Use something else for: many options or long labels (`Select`), on/off
(`Switch`), actions (`Button`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | (required) | The group's accessible name (`aria-label`). **Not rendered visibly**; put a visible label beside it yourself. |
| `options` | `ReadonlyArray<{ value: V; label: string; Icon?: (props: IconProps) => JSX.Element }>` | (required) | `label` is each segment's accessible name. `Icon` is a component (`Icon: SearchIcon`). |
| `value` | `V \| null` | (required) | `null`, or a value no option has, checks nothing and draws no lens. |
| `onChange` | `(value: V) => void`, or `(value: V \| null) => void` with `clearable` | | **Omit for read-only**: segments get `aria-disabled` and ignore clicks and keys. |
| `clearable` | `boolean` | `false` | Clicking the checked segment, Backspace or Delete call `onChange(null)`. Without it, clicking the checked segment does nothing. |
| `showLabels` | `boolean` | `true` | `false` hides captions, **only for options with an `Icon`**; text-only options always show their label. |
| `surface` | `'card' \| 'row'` | `'card'` | `card`: paints its own `bg.track` rail. `row`: transparent, for a control sitting inside a shaded field row. |

No `className`, no `name` (not a form field). The segment type is not exported;
declare options `as const` or type them inline.

## Keyboard

On the group: ArrowRight/ArrowUp and ArrowLeft/ArrowDown step one option and do
not wrap; Home/End jump to the ends; digits 1–9 pick that option; Backspace and
Delete clear when `clearable`. Modified keys (Ctrl/Cmd/Alt) are left alone.

## Choosing a surface

The track and lens are always `radius.md` (see [corners](../corners.md)), so the
control belongs inside a card or modal.

- Directly in a `Card` body: omit `surface` (`'card'`).
- Inside a shaded `bg.cardHeader` row you built (label left, control right):
  `surface="row"`, so the row itself is the track and the lens is flush with it.

## Examples

```tsx
const SORTS = [
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'added', label: 'Added' },
] as const;

<SegmentedControl label="Sort by" options={SORTS} value={sort} onChange={setSort} />

// Icon segments, clearable, captions hidden; onChange receives null on clear.
<SegmentedControl
  label="Rating"
  options={RATINGS /* { value: '1', label: 'Bad', Icon: ThumbDownIcon }, … */}
  value={rating}
  onChange={setRating}
  clearable
  showLabels={false}
/>

// Read-only display.
<SegmentedControl label="Rating" options={RATINGS} value={rating} />
```

## Do / don't

- Do keep it to a handful of short options; segments are equal columns.
- Do pass `clearable` whenever `null` is a valid answer, or the user can never
  get back to it.
- Don't pass `onChange={() => {}}` to show a value; omit `onChange` for read-only.
