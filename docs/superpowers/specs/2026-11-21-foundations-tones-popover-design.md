# 0.1.0 foundations: semantic tones and Popover placement

Short design (small change). First round of the 0.1.x components; Stack/Inline,
Text/Heading, Dialog, Alert, Spinner and Menu follow in later rounds and build on
these two pieces.

## Why

- Apps have no status colours. aviary shows "Overdue" in the amber `subject`
  tone (a label colour) and "Published" in the green `author` tone. Agents
  reading the docs can't tell which tone means "warning".
- Popover always opens below, left-aligned, never flips, and ignores Escape.
  Menu and Tooltip, coming next, need `top`, `end` alignment and flipping.

## Goals

- `Tag tone="success" | "warning" | "danger" | "info"`, distinct at a glance
  from the nine domain tones in light and dark mode.
- Popover takes `side` and `align`, flips when there's no room, and closes on
  Escape.
- No visible change for current users of `Tag`. `Popover` (Select,
  ChipsInput) keeps today's position on the defaults whenever there is room
  below; near the bottom of the viewport it now opens upward.

## Non-goals

- Alert, Toast restyling, Menu, Tooltip: later rounds.
- Shift along the edge, arrows, `left`/`right` sides, focus management.
- Migrating aviary or Bookplate (they adopt the tones after release).

## Anti-goals

- A second prop for status (`status="warning"`) beside `tone`: agents would
  have to guess between two near-synonyms.
- A runtime or peer dependency for positioning.

## Approaches (decided)

**Tones.**
- **A (picked): four keys in `theme.color.chip`.** Same `{text, bg, border}`
  shape as `neutral`, so `Tag` needs no new code path and Alert can reuse the
  tokens.
- B: a separate `theme.color.status` group and a `status` prop on Tag. Turned
  down because of the second-prop anti-goal.

**Popover.**
- **A (picked): hand-rolled `side`/`align`/flip/Escape in Popover.** About 60
  lines and no dependency.
- B: `@floating-ui/react-dom` as a peer. Better edge handling, but every app
  would have to install it. Turned down.
- CSS anchor positioning: not supported widely enough yet.

## Design

### Colours (picked from mockups)

The user chose these from side-by-side mockups.

- **warning: yellow, with a stronger fill than the other chips.** It reads as
  a signal, not a label, and stays distinct from the `subject` amber.
  - Light: text `#854d0e`, bg `rgba(234,179,8,0.16)`, border `rgba(202,138,4,0.40)`.
  - Dark: text `#FDE047`, bg `rgba(234,179,8,0.20)`, border `rgba(234,179,8,0.42)`.
- **info: brand blue.**
  - Light: text `blue[700]`, bg `applyTransparency(blue[500], 0.08)`, border
    `applyTransparency(blue[500], 0.24)`.
  - Dark: text `blue[300]`, bg `applyTransparency(blue[400], 0.18)`, border
    `applyTransparency(blue[400], 0.36)`.
  - It shares a hue with links and primary buttons. That is accepted for
    status tags; docs say to use it for neutral notices, not as a link look.
- **success: from the existing theme `success`.**
  - Light: text `#15803d`, bg and border `#16a34a` at 0.08 / 0.22.
  - Dark: text `#86EFAC`, bg and border `#22C55E` at 0.16 / 0.30.
- **danger: from `red[500]`.**
  - Light: text `red[700]`, bg and border at 0.08 / 0.22.
  - Dark: text `red[400]`, bg and border at 0.16 / 0.30.
- **Solid colours:** new top-level `color.warning` (light `#ca8a04`, dark
  `#EAB308`) and `color.info` (`brand.default` of each mode), beside the
  existing `color.success`. These are for icons and Alert accents.
  `color.danger` already exists.

### Tag

- `TagTone` grows to 13 values. The default stays `subject`.
- The tone union is derived from the chip keys, so the type, the styles and
  the theme can't drift apart.
- Docs (`docs/component/tag.md`, `docs/theme.md`, `docs/tokens.md`) split the
  tones into **status** (`success`, `warning`, `danger`, `info`, plus
  `neutral`) and **label** (the domain tones).
- New rule: a tag that reports state uses a status tone. A tag that names a
  thing uses a label tone. `status` is a legacy label tone despite its name;
  for a state use `success`/`warning`/`danger`/`info`, or `neutral` when it
  carries no meaning.

### Popover

New props:

- `side?: 'bottom' | 'top'`, default `'bottom'`.
- `align?: 'start' | 'center' | 'end'`, default `'start'`. Measured against
  the anchor's left edge, centre and right edge.

Behaviour:

- **Flip.** After the content renders, measure its height. If the preferred
  side doesn't fit in the viewport and the other side has more room, use the
  other side.
  - Recompute on scroll (capture phase) and resize, as today, and on content
    resize through a `ResizeObserver` on the content (guarded where the
    browser lacks it, disconnected on close).
  - The chosen side is exposed as `data-side` on the wrapper, for styling.
  - When neither side fits and both have equal room, keep the preferred side.
- **Anchoring.** The bottom side is positioned with CSS `top`
  (`anchor.bottom + gap`); the top side with CSS `bottom`
  (`viewport.height - anchor.top + gap`), never a computed `top`. So content
  that grows or shrinks while open stays attached to the anchor instead of
  detaching or overlapping it. Exactly one of `top` / `bottom` is set.
- **First render.** Rendered at 0,0 with `opacity: 0` until the layout effect
  measures it (never painted). Not `visibility: hidden`, which would stop an
  `autoFocus` child from taking focus on mount.
- **Horizontal clamp.** Only when `matchWidth` is false: clamp `left` so the
  content stays inside the viewport with a small margin (`gap`). With
  `matchWidth` the anchor is on screen, so the popover lines up with it
  exactly. This is not full "shift" logic.
- **Escape.** While open with `onClose`, Escape calls `onClose`.
  - Listen on `document` in the bubble phase. Skip the key if it is already
    `defaultPrevented`: a control that handles Escape itself (Select does)
    calls `preventDefault`, so `onClose` is not called twice.
  - When Popover consumes the key, it calls `preventDefault`, so an enclosing
    `<dialog>` doesn't close too. `preventDefault` on keydown is what stops a
    native `<dialog>`'s `cancel`; `stopPropagation` from a document listener
    would not.
- **Defaults** reproduce today's position exactly when there is room below:
  below, left-aligned, `gap` 4, `matchWidth`. Near the viewport bottom they
  now flip upward.

### Release

- Version `0.1.0`, with CHANGELOG entries for both pieces.
- Tests:
  - theme: every chip has text, bg and border in both modes.
  - Tag: the new tones render.
  - Popover: its first test file, covering placement for each side/align,
    flip, clamp, Escape, outside click, and that the defaults are unchanged.
- Stories:
  - Tag: status-tone stories in both themes.
  - Popover: side/align stories, plus a flip story near the viewport bottom.
- Docs updated per CLAUDE.md. `npm run smoke` passes before tagging.

## Left to the builder

- Exact flip comparison when neither side fits: pick the side with more room.
- Whether `align="center"` with `matchWidth` is meaningful: it's identical to
  `start`, so leave it as-is.
- How the Tag style generator iterates tones.
