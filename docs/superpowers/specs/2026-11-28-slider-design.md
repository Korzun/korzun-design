# Slider design

Date: 2026-11-28. Status: approved in conversation.

## Intent

A general-purpose `Slider` control for korzun-design, as versatile as Ant
Design Mobile's and MUI's sliders, that Bookplate's reading-progress picker
(`ProportionalChapterSlider` in `~/code/bookplate/app/client/src/control/`)
will later be rebuilt from. The owner asked for:

- optional detents, each with an optional label;
- optional start and end labels;
- custom handles.

Success: Bookplate's chapter picker can be expressed as one `<Slider>` with no
behaviour lost, and the library slider is accessible where Bookplate's is not.

## Goals, non-goals, anti-goals

- Goals: single value; detents at arbitrary (uneven) positions; snapping to a
  step or to detents only; labels under detents and under the two ends; a
  caller-drawn thumb; full keyboard and screen-reader support; a native form
  value.
- Non-goals (now): two thumbs / ranges, vertical orientation, a value bubble
  over the thumb. Each must be addable later without breaking the API (a range
  would widen `value` to `number | [number, number]`).
- Anti-goals: a slider that can only be used with a pointer; a styled native
  `<input type="range">` (it cannot snap to uneven detents, and its thumb
  cannot hold arbitrary content); anything Bookplate-specific (chapters,
  "Not started") inside the library.

## What Bookplate's slider does today (the replacement target)

- Value is a chapter index 0…count+1; detents sit at each chapter's start
  position in the book (uneven), plus a "Completed" detent at 100%.
- During a drag the thumb follows the pointer freely; on release it snaps to
  the nearest detent with a 0.15s ease transition (thumb `left`, fill `width`).
- `onDragChange(dragging)` lets the modal hide the chapter name mid-drag.
- "Not started" / "Completed" labels are hard-coded under the ends.
- Look: 40px tall hit area, 4px track in `border.light` with 2px radius, brand
  fill, 2×14px ticks (`border.light`, brand once at or below the value), 18px
  brand circular thumb with `0 1px 4px rgba(0,0,0,.2)` shadow, disabled thumb
  `text.faint`; labels `fontSize.xs` in `text.faint`, `space.xs` above.
- No `role="slider"`, no keyboard, no focus.

## Approaches

1. **Custom element with `role="slider"` (chosen).** Divs for track, fill,
   ticks and thumb; pointer events with capture for dragging; the focusable
   thumb carries `role="slider"` and the ARIA values; keyboard handled in code.
   Supports uneven detents, snap-on-release, and arbitrary thumb content.
2. Styled native `<input type="range">`: accessibility for free, but `step`
   only snaps to even multiples (a `<datalist>` draws marks but does not snap),
   and the thumb is a pseudo-element that cannot hold React content. Ruled out
   by the detent and custom-handle requirements.
3. Wrapping a third-party slider: ruled out by the no-runtime-dependencies rule.

## The design (decided with the owner)

Placement: `src/control/slider/`, exported from `@korzun/design/control`.

Props:

- `value: number`, `min = 0`, `max = 100`.
- `onChange(value)`: fires whenever the snapped value changes during a drag,
  on a track click, and on each key press. `onChangeEnd(value)`: fires once
  when an interaction ends (pointer release, or after a key press), with the
  final value. Controlled only: the thumb shows `value`.
- `step: number | null = 1`. A number snaps to `min + k·step` (and to detent
  values too, so a detent off the step grid stays reachable). `null` snaps to
  detents only (Bookplate's case).
- `detents?: { value: number; label?: ReactNode }[]`: drawn as ticks at their
  positions, filled (brand) at or below the value; labels centred under their
  tick, the first and last aligned to the track ends so they do not overflow.
- `startLabel?: ReactNode`, `endLabel?: ReactNode`: under the two ends.
- `thumb?: (state: { value: number; dragging: boolean; focused: boolean; disabled: boolean }) => ReactNode`:
  replaces the default circle's content. The slider still owns positioning,
  focus, the ARIA attributes and dragging; the returned node is drawn centred
  on the value.
- `ariaLabel: string` (required, as ProgressCircle), `ariaValueText?: (value) => string`
  (e.g. "Chapter 3" instead of "31").
- `disabled = false`.
- `name?: string`: a hidden input carries the value into form data (AGENTS
  rule 6).
- `className`, `ref` per the new-component skill.

Keyboard (on the focused thumb):

- Arrow Right/Up: next step; Arrow Left/Down: previous step. With
  `step={null}`: next/previous detent.
- Page Up/Page Down: 10% of the range (snapped); with `step={null}`, next /
  previous detent.
- Home/End: `min`/`max` (with `step={null}`: first/last detent).

Pointer: pointer-down anywhere on the track jumps the thumb under the
pointer and starts a drag (pointer capture, `touch-action: none`). While
dragging, the thumb and fill follow the pointer exactly (unsnapped), and
`onChange` reports the snapped value as it changes. On release the thumb
animates to the snapped value and `onChangeEnd` fires. Pointer cancel ends
the drag without `onChangeEnd`, and the thumb returns to `value`.

Default look: Bookplate's geometry and colours above, mapped to tokens where
one exists; the remaining literals are listed at the top of `style.ts`.

Bookplate consequence (owner agreed): no separate "dragging" callback; the
progress modal will show the chapter name updating live during the drag
instead of hiding it.

## Calls made after the builder check (author's calls, not the owner's)

- `value` is a position between `min` and `max`, never a detent index.
  Bookplate passes each chapter's position (0–100) and maps the value back to
  a chapter itself (`ariaValueText` gives "Chapter 3").
- `thumb` replaces the whole visible thumb, not just what's inside the circle.
  The slider keeps an invisible wrapper centred on the value. That wrapper is
  focusable and carries `role="slider"` and the focus ring. It's at least 24px
  square (WCAG 2.5.8 target size), whatever size the custom content is.
  Callers who want a brand circle with an icon in it draw both.
- A `value` that isn't on a snap point is drawn exactly where it is. An arrow
  key moves it to the next snap point in that direction, not by a full step.
- A detent at exactly `min` or `max` draws no tick, as in Bookplate, but its
  label still shows. If that detent also has a `startLabel` or `endLabel`,
  both render in the same spot, and that's the caller's problem.
- For keys, `onChangeEnd` fires right after `onChange` on every press that
  changes the value. There's no debounce.
- During a drag, the thumb and fill follow the pointer exactly. Ticks are
  coloured by the snapped value, which is what `onChange` reports, as in
  Bookplate. If the parent ignores `onChange`, the thumb goes back to `value`
  on release.
- Crowded detent labels may overlap. Spacing them out is the caller's job.
- Left-to-right only for now. Right-to-left support can be added later
  without changing the API.

## Left to the builder

- Exact token choices and the focus ring (per the new-component skill:
  `recipe.focusRing` on the thumb, distinct from hover).
- Whether the unfilled track needs a stronger colour than `border.light` to be
  visible in dark mode (check the dark screenshot).
- Examples beyond: basic, detents with labels, detents-only snapping (an uneven
  chapter-like set with start/end labels), custom thumb, disabled, in a form.
- How the snap transition respects `prefers-reduced-motion` (it should not
  animate when reduced motion is set).
