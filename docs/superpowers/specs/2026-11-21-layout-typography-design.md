# 0.2.0: Stack, Inline, Text, Heading

The second 0.1.x-series round, after the 0.1.0 foundations (status tones and
Popover placement). Dialog, Alert, Spinner, and Menu come next.

## Why

Coding agents that write screens with `@korzun/design` hand-roll two things:
flex layout and text styling. Every hand-rolled block is a chance to drift off
the theme. In Bookplate, the app the library came from, there are:

- **Flex blocks:** 199 across 80 style files.
  - 93 are columns, and 77 are rows centred vertically.
  - Gaps are mostly `space.md` (66), then `sm` (23), `xs` (17), and `xxl` (13).
  - `flexWrap` appears 14 times and `space-between` 9 times.
- **Font sizes:** 161, mostly `sm` (65) and `md` (30). The text colours used
  are `primary`, `muted`, and `faint`, in roughly equal numbers.
- **Copied ellipsis block:** 11 copies.

The user's direction: **props first. Reducing custom styling is key to this
working.** Layout and text style move from `style.ts` files into component
props. Style files remain for colour, padding, borders, and real one-offs.

## Goals

- An agent can lay out a screen and set its text with no `style.ts`.
  - `<Stack gap="md">` and `<Inline gap="sm" justify="between">` for layout.
  - `<Text size="sm" tone="muted" truncate>` for text.
  - `<Heading level={2}>` for headings.
- Every prop value comes from a theme token, typed from the theme's keys, so a
  wrong value is a type error.
- AGENTS.md and the docs say: use these props for layout and text, and don't
  write flex blocks or font sizes in style files.

## Non-goals

- A general `Box` with padding, margin, or background props. Padding stays in
  style files this round.
- Responsive props, such as a different gap at a breakpoint.
- Rebuilding existing library components on the new primitives. Internals are
  unchanged, so nothing shifts visually.
- Multi-line clamp (`lines={2}`). `truncate` is single-line only.
- Migrating Bookplate, aviary, or Scribe.

## Anti-goals

- **Two ways to say one thing.** There are no named text roles beside the token
  props, and no `direction` prop on `Stack` that duplicates `Inline`.
- **Per-instance stylesheets** or inline `style` values. Either would break the
  `className` + `'&&'` override rule, or cost performance in long lists.
- **Literal values** anywhere in the new components.

## Approaches

### Where styling lives

Decided: **A**.

- **A. Props first (picked).** Layout and text go in component props, and
  AGENTS.md rule 1 changes to match.
- **B. Style files stay primary.** The components would only be a convenience.
  Rejected: agents would keep hand-rolling, because the rule tells them to.

### How Text chooses its style

Decided: **A**.

- **A. Token props (picked).** Separate `size`, `tone`, and `weight` props, each
  mapping one-to-one onto the theme. Bookplate's real combinations are too
  varied for a short list of roles. The docs list the common recipes instead,
  such as "a meta line is `size="sm" tone="muted"`".
- **B. Named roles** (`variant="meta"`). Rejected: one-off styles would need
  style files or ever more roles.

### How props become CSS

Decided: **A**.

- **A. One static class per token value (picked).** Each component's
  `style.ts` generates one rule per key, for example `gap-md` and `size-sm`.
  Props pick classes with `classnames`. This is the pattern `Tag` already uses
  for tones (`src/component/tag/style.ts`). It is fast, keeps `className` +
  `'&&'` overrides working, and derives its unions from the theme.
- **B. react-jss function values.** Rejected: per-instance stylesheets.
- **C. Inline `style`.** Rejected: it beats `className` overrides and
  contradicts AGENTS.md.

## Design

All four components live in `src/component/<name>/`. Each has
`index.tsx`, `style.ts`, `index.test.tsx`, `<name>.stories.tsx`, and
`docs/component/<name>.md`. Each is exported with `<Name>Props` and JSDoc on
every prop.

### Shared props

These apply to all four components:

- **`as`:** the element to render. Defaults are given per component below.
  The allowed elements are a small union per component, not any
  `ElementType`, so agents can't pick something semantically wrong.
- **`className`:** for overrides with `'&&'`.
- **Pass-through** (builder check; my call): the props extend the element's HTML attributes minus `style`, plus `ref`. That covers `id`, `role`, `aria-*`, `data-*`, `title`, and event handlers. `style` is left out so the no-inline-style rule holds.
- **`children`.**

### Space keys

- `gap` takes any `keyof Theme['space']`, plus `'none'`.
- The space keys run from `xxxs` to `xxxxxl`, and there is no zero token, hence
  `'none'`.

### Stack (vertical)

- **`gap`:** defaults to `'md'`, the most common value in Bookplate.
- **`align`:** `'stretch'` (default), `'start'`, `'center'`, or `'end'`. This
  is cross-axis alignment.
- **`as`:** `'div'` (default), `'section'`, `'ul'`, `'ol'`, or `'li'`.
  `form` is not offered (my call): a form needs `noValidate`, `action`, and
  other attributes, so the docs show a real `<form>` wrapping a `Stack`.
  Lists reset their margin, padding, and list style.

### Inline (horizontal)

- **`gap`:** defaults to `'sm'`.
- **`align`:** `'center'` (default, matching Bookplate's rows), `'start'`,
  `'end'`, `'baseline'`, or `'stretch'`.
- **`justify`:** `'start'` (default), `'center'`, `'end'`, or `'between'`.
- **`wrap`:** boolean, default `false`.
- **`as`:** `'div'` (default), `'span'`, `'ul'`, `'ol'`, `'li'`, or `'nav'`.

### Text

- **Unset props inherit** (decided). A bare `<Text>` sets no size, colour, or
  weight of its own, so inside a Tag, a Button, or error text it keeps the
  surrounding look. On a plain surface it already reads as body text, because
  the page's base text is `md` `primary`. Docs say "unset props inherit".
- **`size`:** `keyof Theme['fontSize']`, from `xxs` to `xxl`. No default.
- **`tone`:** `'primary'`, `'secondary'`, `'muted'`, `'faint'`,
  `'description'`, `'danger'`, or `'success'`. No default.
  - The first five map to `color.text.*`.
  - `danger` maps to `color.chip.danger.text` and `success` to `color.chip.success.text` (builder check; my call). The solid `color.danger.default` and `color.success` are only about 3.4:1 on a light card, below AA for small text. The chip text colours are darker and already used by `Tag`.
    These are for inline error and confirmation text. Alert, the bordered box,
    comes in a later round.
  - The name matches `Tag`'s `tone` prop, but this is a different union.
    Docs say so.
- **`weight`:** any `keyof Theme['fontWeight']`. This round adds a
  `fontWeight.regular: 400` token (builder check; my call), so `<Heading weight="regular">` can beat a heading's bold without a literal. An unset `weight` sets nothing.
- **`truncate`:** boolean. Applies a single-line ellipsis (`overflow: hidden`,
  `textOverflow: ellipsis`, `whiteSpace: nowrap`). A truncated `span` becomes
  `display: block` or `inline-block` so the ellipsis works. The builder picks
  which and documents it.
- **`as`:** `'span'` (default), `'p'`, `'div'`, `'label'`, `'strong'`, or
  `'em'`.
  - When `as="label"`, `htmlFor` passes through.
  - `p` resets the browser margin so spacing comes from `Stack`.

### Heading

- **`level`:** `1 | 2 | 3 | 4`, required. Renders `h1` to `h4`.
- **Default look by level:**

  | `level` | Size | Weight |
  | --- | --- | --- |
  | 1 | `xxl` | `bold` |
  | 2 | `xl` | `bold` |
  | 3 | `lg` | `semibold` |
  | 4 | `md` | `semibold` |

  The tone is `primary` at every level.
  Line height is `lineHeight.tight`, and the browser margin is reset to 0.
- **Overrides:** optional `size`, `tone`, and `weight`, with the same unions as
  `Text`, so the semantic level and the look can differ. For example, a
  visually small `h2` in a card.
- **`truncate`:** same as `Text`.
- **`as`:** not offered. `level` decides the element.

### Docs and guidance

- **AGENTS.md rule 1:** keep the tokens-only rule and add "Lay out with
  `Stack`/`Inline` and set text with `Text`/`Heading`. Don't write
  `display: 'flex'`, `gap`, `fontSize`, `fontWeight`, or text `color` in style
  files for that. Style files are for padding, borders, backgrounds, and
  one-offs."
- **AGENTS.md rule 10:** remove `Stack`, `Text`, and `Heading` from the list of
  missing pieces.
- **Imports table:** add the four components to the `/component` row.
- **Docs index:** add the four doc files.
- **`docs/patterns.md`:** examples use `Stack` for card bodies and `Inline` for
  rows. The line "Fields go in the card body, in a column with
  `gap: theme.space.md`" becomes `<Stack gap="md">`.
- **Each doc** carries a short "recipes" list mapping Bookplate's common
  clusters to props:
  - body: `<Text>`
  - meta line: `size="sm" tone="muted"`
  - caption: `size="xs" tone="faint"`
  - section title: `<Heading level={2}>`
  - spread row: `<Inline justify="between">`

### Release

- **Version:** `0.2.0`, with a CHANGELOG entry.
- **Smoke probe:** imports `StackProps`, `InlineProps`, `TextProps`, and `HeadingProps`.
- **Stories:**
  - `Stack` and `Inline`: every gap, plus align, justify, and wrap.
  - `Text`: a size, tone, and weight matrix, plus truncate in a narrow box.
  - `Heading`: levels 1 to 4 and an override example.
- **Tests:**
  - Each prop picks the right class and resolves to the right token value (see
    `Tag`'s `expectTone` helper).
  - Defaults are applied (`Stack`, `Inline`, `Heading`).
  - A `Text` with no props carries no size, tone, or weight class.
  - `as` renders the element.
  - Pass-through attributes arrive.
  - `className` is applied.
  - `Heading` renders the right `h` tag.

## Left to the builder

- The `'none'` gap emits `gap: 0` (a keyword, not a token).
- `min-width: 0` on truncated text inside `Inline`.
- Exact class naming inside each `style.ts`.
- How truncate handles the `span` display.
- Whether `Stack` and `Inline` share a small internal helper for gap classes.
  Fine if it stays inside `src/component`, with no barrel import.
- Story layout.
