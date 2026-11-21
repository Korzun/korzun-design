# Stack, Inline, Text, Heading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 0.2.0 with four props-first primitives (`Stack`, `Inline`, `Text`, `Heading`) so agents lay out screens and set text without `style.ts`.

**Architecture:** Each component lives in `src/component/<name>/` and renders a restricted `as` element. Every prop value maps to one static class per token value (the `Tag` `toneRules` pattern in `src/component/tag/style.ts`), picked with `classnames`. `Inline` reuses `Stack`'s gap rules from `src/component/stack/gap.ts`; `Heading` reuses `Text`'s size/tone/weight rules from `src/component/text/style.ts`.

**Tech Stack:** React 19 (`ref` as a prop), react-jss via `createUseStyles` from `src/theme`, `classnames`, Vitest + Testing Library on jsdom.

**Spec:** `docs/superpowers/specs/2026-11-21-layout-typography-design.md`

## Global Constraints

- Peers only, no runtime `dependencies`. Relative imports to module folders only, never the `control`/`component` barrels (stories may import `@gallery/*`).
- No literal hex/px/rem values in the new components; every value is a theme token. Keywords (`0`, `'100%'`, `'bottom'`, `'none'`, `'flex'`) are fine.
- Props extend the element's HTML attributes **minus `style`**, plus `ref`, `className`, `children`. No inline `style` anywhere in the components.
- Every module: `index.tsx`, `style.ts`, `index.test.tsx`, `<name>.stories.tsx`, `docs/component/<name>.md`; added to `src/component/index.ts` as `export { X, type XProps }`; doc added to the `[docs/component]` line of `AGENTS.md`. `XProps` has JSDoc on every prop.
- Prop unions are derived from theme keys: `gap: keyof Theme['space'] | 'none'`, `size: keyof Theme['fontSize']`, `weight: keyof Theme['fontWeight']`.
- Text: **unset props inherit.** No size, tone, or weight class is emitted when the prop is unset.
- Text `tone`: `primary secondary muted faint description` → `color.text.*`; `danger` → `color.chip.danger.text`; `success` → `color.chip.success.text`.
- Version `0.2.0`, CHANGELOG entry, `npm run smoke` passes.

## Review Focus

1. **Truncated text inside an `Inline` row** must actually ellipsize instead of widening the row: the truncate rule carries `minWidth: 0`. Test in Task 3.
2. **A bare `<Text>` inside a coloured or smaller parent** keeps the parent's look: no size/tone/weight class. Test in Task 3.
3. **`Heading` overrides beat the level defaults** (e.g. `level={2} size="sm"` gives `sm`, not `xl`; `weight="regular"` gives 400). Test in Task 4.
4. **`Stack as="ul"` / `Inline as="ul"`** render with no bullets, margin, or padding. Test in Task 2.
5. **Pass-through props reach the DOM**: `id`, `aria-*`, `data-*`, `onClick`, and `ref` land on the rendered element. Test in Tasks 2 and 3.

---

### Task 1: `fontWeight.regular` token

**Files:**
- Modify: `src/theme/theme.ts` (type at `fontWeight: {…}` ~line 179; value at `const fontWeight` ~line 511)
- Modify: `src/theme/theme.test.ts`
- Modify: `docs/theme.md` (fontWeight row ~line 73), `docs/tokens.md` (`## fontWeight`)

**Interfaces:**
- Produces: `Theme['fontWeight']` = `{ regular: number; medium: number; semibold: number; bold: number; extrabold: number }`, `regular: 400`.

- [ ] **Step 1: Write the failing test** in `src/theme/theme.test.ts`:

```ts
it('has a regular font weight of 400', () => {
  expect(lightTheme.fontWeight.regular).toBe(400);
  expect(darkTheme.fontWeight.regular).toBe(400);
});
```

- [ ] **Step 2:** Run `npx vitest run src/theme/theme.test.ts`. Expected: FAIL (type error / undefined).
- [ ] **Step 3:** Add `regular` first in the type and `regular: 400` first in the value. Docs: theme.md row becomes `` `regular` 400, `medium` 500, `semibold` 600, `bold` 700, `extrabold` 800 ``; tokens.md becomes `` `regular medium semibold bold extrabold` (400, 500, 600, 700, 800) ``.
- [ ] **Step 4:** Run `npx vitest run src/theme && npx tsc --noEmit`. Expected: PASS, no type errors.
- [ ] **Step 5: Commit** `feat(theme): fontWeight.regular token`.

---

### Task 2: `Stack` and `Inline`

**Files:**
- Create: `src/component/stack/{gap.ts,index.tsx,style.ts,index.test.tsx,stack.stories.tsx}`
- Create: `src/component/inline/{index.tsx,style.ts,index.test.tsx,inline.stories.tsx}`
- Create: `docs/component/stack.md`, `docs/component/inline.md`
- Modify: `src/component/index.ts`, `AGENTS.md` (`[docs/component]` index line only)

**Interfaces:**
- Produces (`src/component/stack/gap.ts`, internal, not barrel-exported):
  - `export type Gap = keyof Theme['space'] | 'none'`
  - `export const gapRules: (theme: Theme) => Record<`gap-${Gap}`, object>` — one rule per space key with `gap: theme.space[key]`, plus `'gap-none': { gap: 0 }`.
- Produces (`StackProps`):
  - `as?: 'div' | 'section' | 'ul' | 'ol' | 'li'` (default `'div'`)
  - `gap?: Gap` (default `'md'`)
  - `align?: 'stretch' | 'start' | 'center' | 'end'` (default `'stretch'`), cross-axis (`alignItems`; `start`→`flex-start`, `end`→`flex-end`)
  - `className?: string`, `children?: ReactNode`, `ref?: Ref<HTMLElement>`, plus `Omit<HTMLAttributes<HTMLElement>, 'style'>`
- Produces (`InlineProps`):
  - `as?: 'div' | 'span' | 'ul' | 'ol' | 'li' | 'nav'` (default `'div'`)
  - `gap?: Gap` (default `'sm'`)
  - `align?: 'center' | 'start' | 'end' | 'baseline' | 'stretch'` (default `'center'`)
  - `justify?: 'start' | 'center' | 'end' | 'between'` (default `'start'`; `between`→`space-between`)
  - `wrap?: boolean` (default `false`)
  - same `className`/`children`/`ref`/HTML-attributes-minus-style as Stack

Both roots: `display: 'flex'`, Stack `flexDirection: 'column'`, Inline `flexDirection: 'row'`. A `list` rule (`margin: 0, padding: 0, listStyle: 'none'`) applies when `as` is `ul` or `ol`. `className` is applied last for `'&&'` overrides. Rendering the `as` union with a `ref` may need a cast on the element type; keep it local.

- [ ] **Step 1: Write the failing tests.** Use `renderWithProviders` from `src/test-utils.tsx`, `lightTheme` from `src/theme/theme.ts`, and `getComputedStyle` (jsdom computes `display`, `flexDirection`, `gap`, `alignItems`, `justifyContent`, `flexWrap`, `margin`, `padding`, `listStyle` from the generated classes).

`src/component/stack/index.test.tsx`:
- `defaults to a column div with gap md and stretch`: `<Stack data-testid="s">` → `tagName === 'DIV'`, `display 'flex'`, `flexDirection 'column'`, `gap === lightTheme.space.md`, `alignItems 'stretch'`.
- `it.each(Object.keys(lightTheme.space))` `gap %s uses the space token` → `gap === lightTheme.space[key]`.
- `gap none emits 0` → `gap` is `'0'` or `'0px'` (accept either).
- `align maps to alignItems`: `start→flex-start`, `center→center`, `end→flex-end`.
- `as="ul" renders a reset list`: `tagName 'UL'`, `margin '0px'`, `padding '0px'`, `listStyle` contains `'none'`.
- `as="section" renders a section`.
- `passes attributes and ref through`: `id`, `aria-label`, `data-x`, `onClick` (fire click → called once), and a `createRef<HTMLElement>()` whose `.current` is the element.
- `applies className` → element `classList.contains('extra')`.

`src/component/inline/index.test.tsx`:
- `defaults to a row div with gap sm, centred, start, no wrap` → `flexDirection 'row'`, `gap === lightTheme.space.sm`, `alignItems 'center'`, `justifyContent` `'flex-start'` (or `'start'`; assert whichever the implementation emits, but it must be one class from a `justify-start` rule), `flexWrap` not `'wrap'`.
- `justify between` → `justifyContent 'space-between'`; `center`, `end` → `center`, `flex-end`.
- `align` each of `start end baseline stretch` → `flex-start flex-end baseline stretch`.
- `wrap` → `flexWrap 'wrap'`.
- `gap xxl` → `lightTheme.space.xxl`; `gap none` → `0`.
- `as="nav"` and `as="span"` render those tags; `as="ol"` is a reset list.
- pass-through and `className` tests as for Stack.

- [ ] **Step 2:** Run `npx vitest run src/component/stack src/component/inline`. Expected: FAIL (modules missing).
- [ ] **Step 3:** Implement `gap.ts`, both `style.ts` (Tag's `Object.fromEntries` pattern for per-key rules), and both `index.tsx`. Export `Stack, type StackProps` and `Inline, type InlineProps` from `src/component/index.ts` (alphabetical). Export nothing else new from the barrel.
- [ ] **Step 4: Stories.** `stack.stories.tsx`: `Default`, `Gaps` (one Stack per space key plus `none`, each with three small boxes), `Align`, `List` (`as="ul"`). `inline.stories.tsx`: `Default`, `Gaps`, `Justify` (incl. `between` in a full-width box), `Align` (mixed-height children), `Wrap` (narrow box). Story-only demo boxes may use `style` props; components must not.
- [ ] **Step 5: Docs.** `docs/component/stack.md` and `inline.md`, in the Tag doc's shape: import line, one-paragraph purpose, "Use something else for", props table (type, default, notes), behaviour notes (`'none'` gap, list reset, `className` + `'&&'`, no `style` prop), example, do/don't. Stack doc: show a real `<form noValidate>` wrapping a `<Stack gap="md">` and say `as="form"` is not offered. Inline doc: the "spread row" recipe `<Inline justify="between">`. Add `inline` and `stack` to the `[docs/component]` line in `AGENTS.md` (alphabetical).
- [ ] **Step 6:** Run `npm test && npx tsc --noEmit`. Expected: all pass (includes `gallery/stories.test.tsx`, `scripts/docs.test.mjs`, `scripts/props-exports.test.mjs`).
- [ ] **Step 7: Commit** `feat(component): Stack and Inline layout primitives`.

---

### Task 3: `Text`

**Files:**
- Create: `src/component/text/{index.tsx,style.ts,index.test.tsx,text.stories.tsx}`, `docs/component/text.md`
- Modify: `src/component/index.ts`, `AGENTS.md` (`[docs/component]` index line only)

**Interfaces:**
- Consumes: `fontWeight.regular` from Task 1.
- Produces (`src/component/text/style.ts`, used by Heading):
  - `export type TextSize = keyof Theme['fontSize']`
  - `export type TextTone = 'primary' | 'secondary' | 'muted' | 'faint' | 'description' | 'danger' | 'success'`
  - `export type TextWeight = keyof Theme['fontWeight']`
  - `export const useTypography` — a `createUseStyles` hook whose classes include `size-<TextSize>`, `tone-<TextTone>`, `weight-<TextWeight>`, `truncate`, `truncateInline`.
    - `truncate`: `overflow: 'hidden'`, `textOverflow: 'ellipsis'`, `whiteSpace: 'nowrap'`, `minWidth: 0`.
    - `truncateInline` (added with `truncate` when the element is `span`, `strong`, `em`, or `label`): `display: 'inline-block'`, `maxWidth: '100%'`, `verticalAlign: 'bottom'`. Block elements keep their display.
  - Text's own root rule: `margin: 0` (resets `p`).
- Produces (`TextProps`): `as?: 'span' | 'p' | 'div' | 'label' | 'strong' | 'em'` (default `'span'`), `size?: TextSize`, `tone?: TextTone`, `weight?: TextWeight`, `truncate?: boolean`, `htmlFor?: string` (JSDoc: only for `as="label"`), `className`, `children`, `ref?: Ref<HTMLElement>`, plus `Omit<HTMLAttributes<HTMLElement>, 'style'>`. `TextSize`/`TextTone`/`TextWeight` are **not** exported from the barrel (spec names only the Props types); use `TextProps['tone']`.

- [ ] **Step 1: Write the failing tests** in `src/component/text/index.test.tsx` (copy Tag's `channels` helper for colour comparison):
- `renders a span by default`.
- `a bare Text emits no size, tone, or weight class` → `className` does not match `/size-|tone-|weight-/`, and inside `<div style={{ color: 'rgb(1, 2, 3)', fontSize: '20px' }}><Text>x</Text></div>` the computed `color` is `rgb(1, 2, 3)` and `fontSize` is `20px` (test-only inline style on the parent).
- `it.each(Object.keys(lightTheme.fontSize))` `size %s uses the token`.
- `it.each` over `primary secondary muted faint description` → colour equals `lightTheme.color.text[tone]`.
- `danger and success use the chip text colours` → `lightTheme.color.chip.danger.text`, `lightTheme.color.chip.success.text`.
- `weight regular is 400` and `weight bold is 700` (computed `fontWeight` `'400'`, `'700'`).
- `truncate on a span` → `overflow hidden`, `textOverflow ellipsis`, `whiteSpace nowrap`, `minWidth '0px'`, `display 'inline-block'`.
- `truncate on a div keeps block display` → `display` is not `inline-block`.
- `truncated Text inside Inline can shrink` → `<Inline><Text truncate>…</Text></Inline>`: the Text has `minWidth '0px'` (import Inline from `../inline/index.js`).
- `as="p" resets margin` → `tagName 'P'`, `margin '0px'`.
- `as="label" passes htmlFor` → `getAttribute('for') === 'field'`.
- `as` renders `strong`, `em`, `div`.
- pass-through (`id`, `aria-live`, `data-x`, `onClick`, `ref`) and `className`.

- [ ] **Step 2:** Run `npx vitest run src/component/text`. Expected: FAIL.
- [ ] **Step 3:** Implement `style.ts` (tone map built from the theme as in Interfaces; per-key rules via `Object.fromEntries`) and `index.tsx`. Unset `size`/`tone`/`weight` add no class. Barrel: `export { Text, type TextProps }`.
- [ ] **Step 4: Stories** `text.stories.tsx`: `Default`, `Sizes`, `Tones`, `Weights`, `Truncate` (a narrow box, plus a truncated Text inside an `Inline` next to a button-sized sibling), `Recipes` (body, meta line, caption).
- [ ] **Step 5: Docs** `docs/component/text.md`: props table; **"Unset props inherit"** stated near the top with why (keeps the look inside Tag, Button, error text); note `tone` is not `Tag`'s `TagTone` union; `danger`/`success` are for inline error and confirmation text (a boxed Alert comes later); truncate behaviour per element; recipes: body `<Text>`, meta line `size="sm" tone="muted"`, caption `size="xs" tone="faint"`. Add `text` to the AGENTS.md `[docs/component]` line.
- [ ] **Step 6:** Run `npm test && npx tsc --noEmit`. Expected: PASS.
- [ ] **Step 7: Commit** `feat(component): Text`.

---

### Task 4: `Heading`

**Files:**
- Create: `src/component/heading/{index.tsx,style.ts,index.test.tsx,heading.stories.tsx}`, `docs/component/heading.md`
- Modify: `src/component/index.ts`, `AGENTS.md` (`[docs/component]` index line only)

**Interfaces:**
- Consumes: `useTypography`, `TextSize`, `TextTone`, `TextWeight` from `../text/style.js`.
- Produces (`HeadingProps`): `level: 1 | 2 | 3 | 4` (required), `size?: TextSize`, `tone?: TextTone`, `weight?: TextWeight`, `truncate?: boolean`, `className`, `children`, `ref?: Ref<HTMLHeadingElement>`, plus `Omit<HTMLAttributes<HTMLHeadingElement>, 'style'>`. No `as`.
- Level defaults (override wins when set): 1 → `xxl`/`bold`, 2 → `xl`/`bold`, 3 → `lg`/`semibold`, 4 → `md`/`semibold`; tone `primary` at every level. Own root rule: `margin: 0`, `lineHeight: theme.lineHeight.tight`. Truncate uses `truncate` only (headings are block).

- [ ] **Step 1: Write the failing tests** in `src/component/heading/index.test.tsx`:
- `it.each([[1,'H1','xxl','700'],[2,'H2','xl','700'],[3,'H3','lg','600'],[4,'H4','md','600']])` `level %i renders %s with its size and weight` → tag, `fontSize === lightTheme.fontSize[size]`, `fontWeight`.
- `defaults to the primary text colour` → `lightTheme.color.text.primary`.
- `resets margin and uses tight line height` → `margin '0px'`, `lineHeight === String(lightTheme.lineHeight.tight)`.
- `overrides beat the level defaults` → `<Heading level={2} size="sm" weight="regular" tone="muted">` gives `fontSize sm`, `fontWeight '400'`, colour `text.muted`, tag still `H2`.
- `truncate` → `textOverflow ellipsis`, `whiteSpace nowrap`.
- pass-through (`id`, `ref`) and `className`.

- [ ] **Step 2:** Run `npx vitest run src/component/heading`. Expected: FAIL.
- [ ] **Step 3:** Implement. Barrel: `export { Heading, type HeadingProps }`.
- [ ] **Step 4: Stories** `heading.stories.tsx`: `Levels` (1–4), `Overrides` (a small `h2` in a card-like box), `Truncate`.
- [ ] **Step 5: Docs** `docs/component/heading.md`: level table, overrides, "level is the semantics, props are the look", recipe section title `<Heading level={2}>`. Add `heading` to the AGENTS.md `[docs/component]` line.
- [ ] **Step 6:** Run `npm test && npx tsc --noEmit`. Expected: PASS.
- [ ] **Step 7: Commit** `feat(component): Heading`.

---

### Task 5: Guidance, release files, smoke

**Files:**
- Modify: `AGENTS.md` (rule 1, rule 10, imports table `/component` row)
- Modify: `docs/patterns.md` (form-in-card bullet ~line 28, "Layout and text" section ~line 111, examples)
- Modify: `CHANGELOG.md`, `package.json` (`"version": "0.2.0"`), `scripts/smoke-exports.sh` (probe ~line 54-63)

- [ ] **Step 1: AGENTS.md.**
  - Rule 1: keep the tokens-only text and append: "Lay out with `Stack`/`Inline` and set text with `Text`/`Heading`. Don't write `display: 'flex'`, `gap`, `fontSize`, `fontWeight`, or text `color` in style files for that. Style files are for padding, borders, backgrounds, and one-offs."
  - Rule 10: remove `Stack`, `Text`, `Heading` from the missing list (keep `Dialog`, `Tabs`, `Tooltip`, `Checkbox`, `Alert`).
  - Imports table `/component` row: add `Stack`, `Inline`, `Text`, `Heading`.
- [ ] **Step 2: patterns.md.** The form bullet becomes "Fields go in the card body, in a `<Stack gap="md">`." Replace the "Layout and text" section with: use `Stack`/`Inline` for layout and `Text`/`Heading` for text, with the recipes list (body, meta line `size="sm" tone="muted"`, caption `size="xs" tone="faint"`, section title `<Heading level={2}>`, spread row `<Inline justify="between">`), linking the four docs. Update any example that hand-rolls a column/row to use `Stack`/`Inline`.
- [ ] **Step 3: Release files.** `package.json` version `0.2.0`. CHANGELOG `## 0.2.0 — 2026-11-21`: new `Stack`, `Inline`, `Text`, `Heading` (one line each with key props); new `fontWeight.regular` (400) token; AGENTS.md rule 1 now says layout and text go through these props; no visual change to existing components.
- [ ] **Step 4: Smoke probe.** In `scripts/smoke-exports.sh` add `type StackProps, type InlineProps, type TextProps, type HeadingProps` to the `@korzun/design/component` import and a line `export const layoutProbe: [StackProps['gap'], InlineProps['justify'], TextProps['tone'], HeadingProps['level']] = ['none', 'between', 'muted', 2];`.
- [ ] **Step 5:** Run `npm test && npx tsc --noEmit && npm run smoke`. Expected: all pass; smoke prints success.
- [ ] **Step 6:** Grep check: `grep -rn "no \`Stack\`\|There are no \`Stack\`" AGENTS.md docs/` returns nothing.
- [ ] **Step 7: Commit** `docs: layout and text through Stack, Inline, Text, Heading; 0.2.0`.
