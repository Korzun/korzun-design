# ProgressIndicator

`import { ProgressIndicator } from '@korzun/design/component'`

A small pie-style progress mark (a brand-coloured sector inside a ring) followed
by a text label: "Not started" at 0, "N%" in between, "Completed" at 100%. The
SVG is a `role="progressbar"` with `aria-valuenow` 0–100.

Use something else for: an indeterminate wait (`Spinner`, or `loading` on
a `Button`), a pull-to-refresh indicator (`usePullToRefresh`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number` | required | **A fraction from 0 to 1, not a percentage.** `0.42` shows "42%". Clamped to 0–1. |
| `ariaLabel` | `string` | required | Accessible name of the progressbar: say what progress it is (`Reading progress for ${title}`). A bare "42%" means nothing out of context. |
| `size` | `number` | `40` | Width and height of the SVG in px. The label's font size is fixed (`fontSize.sm`) regardless. |

No `className`.

## Surprising behaviour

- **No SVG at exactly 0 or 1**: only the text label renders, so there is then
  no `role="progressbar"` and `ariaLabel` is not used. The visible text
  ("Not started" / "Completed") carries the meaning.
- The label is `Math.round`ed, so values just inside the range show "0%" or
  "100%" next to a sliver or near-full pie (e.g. `0.996` shows "100%", not
  "Completed").
- Passing a percentage (`42`) clamps to 1 and shows "Completed".

## Examples

```tsx
// In a row, inline with text: Bookplate draws it at 14px.
<div className={styles.progress}>
  <ProgressIndicator
    value={row.percentage}            // 0..1
    ariaLabel={`Reading progress for ${bookTitle}`}
    size={14}
  />
</div>

// Converting from a 0–100 API value.
<ProgressIndicator value={api.percent / 100} ariaLabel="Upload progress" />
```

## Do / don't

- Do pass a 0–1 fraction.
- Do write an `ariaLabel` that names the thing in progress.
- Don't render your own "42%" next to it; it already prints the label.
- Don't use it for indeterminate loading.
