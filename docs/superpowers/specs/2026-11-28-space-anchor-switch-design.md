# Space, Anchor, and the squared Switch spinner

Three changes for 0.7.0, asked for together on 2026-11-28.

## 1. Space replaces Stack and Inline

**Why.** Inspired by Ant Design's `Space`: one layout primitive with a
direction, instead of two near-identical components. Pre-1.0, so the break is
acceptable, on one condition from the owner: nothing Stack or Inline can do is
lost.

**Approaches considered.** (a) A compact group like antd's `Space.Compact`;
(b) `Space` as spacing plus a separator, beside Stack and Inline; (c) `Space`
replaces both. The owner picked (c).

**API** (`@korzun/design/component`, category Layout):

| Prop | Type | Default |
|---|---|---|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` (as antd) |
| `gap` | `Gap` (theme `space` key or `'none'`) | `'sm'` horizontal, `'md'` vertical |
| `align` | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'` | `'center'` horizontal, `'stretch'` vertical |
| `justify` | `'start' \| 'center' \| 'end' \| 'between'` | `'start'` |
| `wrap` | `boolean` | `false` |
| `split` | `ReactNode`, drawn between each pair of present children | none |
| `as` | `'div' \| 'section' \| 'span' \| 'nav' \| 'ul' \| 'ol' \| 'li'` | `'div'` |
| `className`, `ref`, other HTML attributes | as Stack and Inline today | |

- The defaults per direction are exactly Stack's (vertical) and Inline's
  (horizontal), so `<Stack>` → `<Space direction="vertical">` and `<Inline>` →
  `<Space>` are drop-in. `ul`/`ol` still reset list styles.
- `split`: `null`, `undefined` and `false` children are skipped, so no
  separator dangles. Each separator is `aria-hidden`; in a `ul`/`ol` it is
  wrapped in an `li` with `role="presentation"`, so the list stays valid.
- The name `gap` stays (not antd's `size`): it is the existing token-based prop
  and matches CSS.

**Removal.** `Stack`, `Inline`, `StackProps` and `InlineProps` go with no
alias. Every example, doc, recipe and gallery file moves to `Space`. The
CHANGELOG generator maps the old tags to `Space` (`FORMER_NAMES`), so their
history appears on Space's page. One preview shows both directions in blocks.

## 2. Anchor (new, category Navigation)

**Why.** A page outline that tracks where you are and jumps to a section, like
Notion's floating table of contents and Capacities' outline.

**Approaches.** The owner picked both looks behind a prop, with headings passed
in as data (not scraped from the page).

**API** (`@korzun/design/control`, since it handles clicks):

- `items: { id: string; title: string; level?: 1 | 2 | 3 }[]`. `id` is the
  target element's id; `level` (default 1) sets the indent.
- `variant?: 'list' | 'minimap'`, default `'list'`.
- `offset?: number`, in px, default 0: the height of sticky chrome above the
  content. It is used both for where a click lands and for which section counts
  as current.
- `ariaLabel?: string`, default `'On this page'`, on the `<nav>`.
- `className`.

**Behaviour, both variants**
- It renders a `<nav>` with a `<ul>` of `<a href="#id">` links, so a link can
  be middle-clicked or copied.
- A click is intercepted:
  - It scrolls the window so the target sits `offset` px below the top,
    smoothly, or instantly under `prefers-reduced-motion`.
  - It moves focus to the target, adding `tabindex="-1"` if the target isn't
    focusable.
  - It does not change the URL (the docs site uses hash routing).
- **Current section:** the last item whose element top is at or above
  `offset + 1` px. At the bottom of the page it's the last item; above the
  first item, the first. It is recomputed on scroll and resize, throttled to
  animation frames. The current link gets `aria-current="location"`.
- An item whose element is missing is still listed but is never current.
- It scrolls the window only, not an inner scroller; Bookplate pages scroll
  the window.

**`list` look.** Titles indented `space.lg` per level beyond 1, `text.secondary`
and `fontSize.sm`. The current one is `brand.default` with a 2px
`brand.default` bar on its left edge; hover is `text.primary`.

**`minimap` look.**
- **At rest:** a slim column of dashes, one per item, 2px tall, 6px apart.
  They're 16px, 12px or 8px wide by level and right-aligned. The current dash
  is `brand.default`, the rest `border.default`. The titles are visually hidden
  but stay in the DOM (it's the same `<ul>`).
- **Open:** hover, or focus within, opens a panel beside the dashes on the
  side toward the page. The panel is the `list` look in a card (`bg.card`, `md`
  corners, `cardStack` shadow), so keyboard users see titles as they tab.
- **Closing:** it closes when the pointer leaves or focus moves out.
- Anchor never positions itself on the page. The caller places it, for example
  sticky in a side column or fixed at the right edge, and decides whether to
  hide it on phones. The docs show both patterns.

## 3. Switch: a squared loading indicator

**Problem.** With the default `radius="inset"`, the track and thumb are rounded
squares, but while loading the thumb turns into the round `SpinnerIcon`, which
clashes.

**Fix.**
- **The `inset` indicator:**
  - While loading, an `inset` switch keeps a thumb-sized rounded square in the
    thumb's place, with the same radius rules (depth 0 included), position and
    transition.
  - The square is drawn as a 2px ring: the faint ring is `currentColor` at 35%,
    with a quarter-length arc at full `currentColor` travelling around it once
    per second.
  - Only the arc moves; the square never rotates. A rotating conic gradient
    sits inside the ring, clipped by a CSS mask.
- **`pill` is unchanged:** it keeps the round spinner, which already fits.
- **Everything else is unchanged:** the 150ms delay, `aria-busy`, colours and
  the `cursor: progress`.

## Left to the builder
Exact dash and panel spacing within the stated tokens; test names; the example
set (each module gets a preview and examples per the repo rules).
