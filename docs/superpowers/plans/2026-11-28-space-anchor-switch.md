# Space, Anchor and the squared Switch spinner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A squared loading ring for `inset` Switches, a `Space` layout component that replaces `Stack` and `Inline`, and a new `Anchor` page outline with `list` and `minimap` looks.

**Architecture:** Switch gains a ring element used only while loading with `radius="inset"`. `Space` lives in `src/component/space` and absorbs Stack's and Inline's styles (the `Gap` type and `gapRules` move with it); every call site migrates, then the old folders go. `Anchor` lives in `src/control/anchor`: one `<nav><ul>` of links, a window scroll-spy hook, and CSS for the two looks.

**Tech Stack:** React 19, react-jss, Vitest + Testing Library (jsdom), docs generator `scripts/docs-gen`, oxfmt, oxlint.

**Spec:** `docs/superpowers/specs/2026-11-28-space-anchor-switch-design.md`

## Global Constraints

- Worktree `~/code/korzun-design-r10`, branch `release/0.7.0` (PR #36). Stage with `git add -A -- . ':!node_modules'`; never commit the `node_modules` symlink. No force-push. Do not push (the controller pushes).
- Follow `CLAUDE.md`: relative imports to module folders in `src`; examples import from public entry points; every exported component exports `<Name>Props` with JSDoc on every prop; every module has `docs/<area>/<module>.md` (front matter `title`, `description`, `category`), `examples/NN-slug.tsx` and `examples/preview.tsx`, and is listed in `AGENTS.md`. New modules: use `.claude/skills/new-component/SKILL.md`; changed docs: `.claude/skills/document-component/SKILL.md`.
- `scripts/docs-gen/categories.mjs` sections must stay alphabetical by doc title (a test enforces it).
- Overview previews are block-drawn like `src/component/stack/examples/preview.tsx` (brand.light fill, brand.outline border), never sample content.
- CHANGELOG: bullets under the existing `## 0.7.0 — 2026-11-26` heading, newest at the top, tagged with exported names. Version stays 0.7.0.
- After any API/JSDoc/example/CHANGELOG change: `npx oxfmt <changed files only>` (never a whole directory), `npm run docs:gen`. Before each commit: `npm test`, `npm run lint`; Space/Anchor tasks also `npm run smoke`.
- Screenshots: the docs server on port 5207 serves this worktree (hot reload). A frame URL is `http://localhost:5207/#/frame/<module>/<example-slug>?theme=light|dark`; shoot with `playwright screenshot --wait-for-timeout 2500 --viewport-size "W,H" <url> out.png` into the scratchpad and look at it.

## Review Focus

1. `Space` with `split` and children that are `null`/`false` or a fragment: no leading, trailing or doubled separator (Task 2 test).
2. `<Space as="ul" split=…>`: every child of the `ul` is an `li` (Task 2 test).
3. Migration is drop-in: a `<Stack>` with no props and an `<Inline>` with no props render with the same computed gap/align/direction as `<Space direction="vertical">` / `<Space>` (Task 2 test on defaults).
4. Anchor at the bottom of a page whose last section is shorter than the viewport: the last item is current (Task 4 test).
5. Anchor items whose element is missing, and an empty `items`: no crash, nothing current / nothing rendered (Task 4 test).

---

### Task 1: Switch — squared loading ring for `radius="inset"`

**Files:** `src/control/switch/{index.tsx,style.ts,index.test.tsx}`, `src/control/switch/examples/05-loading-and-disabled.tsx` (show both radii loading), `docs/control/switch.md` (non-generated text if it describes the spinner), `CHANGELOG.md`.

- [ ] **Step 1: Failing tests** in `index.test.tsx` (use fake timers to pass the 150ms delay, as existing loading tests do):
  - `an inset switch shows a squared ring, not the round spinner, while loading` — default radius, `loading`, after 150ms: an element with `data-testid="switch-ring"` exists and no `svg` is inside the track.
  - `a pill switch keeps the round spinner while loading` — `radius="pill"`: an `svg` is inside the track, no `switch-ring`.
  - `the ring sits where the thumb would` — checked inset loading: the ring has the thumb class's position (assert it carries the same class as the thumb for position/radius, e.g. both have `styles.thumb`'s class name, by checking the ring's `className` includes the thumb element's class from a non-loading render).
- [ ] **Step 2:** `npx vitest run src/control/switch` fails.
- [ ] **Step 3: Implement.** For `radius === 'inset'` and `showSpinner`, render `<div aria-hidden className={cx(style.thumb, style.ring)} data-testid="switch-ring" />` in place of `SpinnerIcon`. `ring`: transparent background; `padding: 2px`; `overflow: hidden`; mask ring via `mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)'`, `maskComposite: 'exclude'`, `-webkit-mask-composite: 'xor'` (and the `-webkit-mask` copy); base ring colour from a `::after`/background at `currentColor` 35% opacity is acceptable via `boxShadow: inset 0 0 0 2px` on a layer with `opacity: .35`; the moving arc is a `::before` sized 200%×200%, centred (`top/left: -50%`), `background: conic-gradient(currentColor 0 25%, transparent 25%)`, `animation: 'theme-rotation 1s infinite linear'` (the keyframes `recipe.spinner` already uses). Only `::before` rotates; the square does not. Keep `cursor: progress` and `color: bg.input` from `$loading`. Pill path unchanged.
- [ ] **Step 4:** Tests pass. Screenshot the loading example (light and dark, ~400×220) and zoom: the ring is a rounded square in the thumb's place, checked and unchecked, and at depth 0 (`layout="horizontal"` directly on a Page) its corners follow the thumb's.
- [ ] **Step 5:** CHANGELOG: `- [Switch] While loading, an \`inset\` (squared) switch shows a rounded-square ring with an arc travelling around it in the thumb's place, instead of the round spinner, which clashed with its square corners. A \`pill\` switch keeps the round spinner.` oxfmt, docs:gen, test, lint; commit `fix(switch): a squared loading ring for inset switches`.

### Task 2: Space component (added beside Stack and Inline)

**Files:** Create `src/component/space/{index.tsx,style.ts,gap.ts,index.test.tsx}`, `examples/{preview.tsx,01-basic.tsx,02-vertical.tsx,03-split.tsx,04-wrap-and-justify.tsx}`, `docs/component/space.md`. Modify `src/component/index.ts`, `scripts/docs-gen/categories.mjs` (Layout, alphabetical), `AGENTS.md`, `scripts/smoke-exports.sh`, `CHANGELOG.md`.

**Interfaces — Produces:**
```ts
export type Gap = keyof Theme['space'] | 'none';            // moved here from stack/gap.ts (stack/gap.ts re-exports it until Task 3)
export interface SpaceProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  direction?: 'horizontal' | 'vertical';                    // default 'horizontal'
  gap?: Gap;                                                // default 'sm' horizontal, 'md' vertical
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'; // default 'center' horizontal, 'stretch' vertical
  justify?: 'start' | 'center' | 'end' | 'between';         // default 'start'
  wrap?: boolean;                                           // default false
  split?: ReactNode;
  as?: 'div' | 'section' | 'span' | 'nav' | 'ul' | 'ol' | 'li'; // default 'div'
  className?: string; children?: ReactNode; ref?: Ref<HTMLElement>;
}
export const Space: (props: SpaceProps) => JSX.Element;
```

- [ ] **Step 1: Failing tests** (`index.test.tsx`):
  - defaults: `<Space>` computed `flexDirection: row`, `alignItems: center`, `gap` = `lightTheme.space.sm`; `<Space direction="vertical">` → `column`, `stretch`, `lightTheme.space.md`; each equals what `<Inline>` / `<Stack>` compute today (render both and compare).
  - every prop maps: `align` each value, `justify` each value, `wrap`, `gap="none"`, `as` each value renders that tag; `ul`/`ol` reset `listStyle`, margin, padding.
  - `split`: `['a', null, false, 'b', <>{'c'}</>]` with `split="·"` → text `a·b·c`, exactly two separators, each `aria-hidden="true"`.
  - `split` in a list: `<Space as="ul" split="|"><li>a</li><li>b</li></Space>` → every child element of the `ul` is an `LI`; the separator `li` has `role="presentation"` and `aria-hidden="true"`.
  - `className`, `ref` and extra HTML attributes (`aria-label`, `data-x`) reach the root.
- [ ] **Step 2:** `npx vitest run src/component/space` fails.
- [ ] **Step 3: Implement.** Styles: union of Stack's and Inline's (`root` flex with `minWidth: 0`; direction classes; align/justify/wrap/list classes; `gapRules`). Move `gap.ts` to `space/gap.ts`; `stack/gap.ts` becomes `export * from '../space/gap.js'` for now. Separators: `Children.toArray(children)` (drops null/false/undefined and flattens fragments' keys) then interleave `split`; wrap each separator in `<span aria-hidden="true">` or, for `as` `ul`/`ol`, `<li role="presentation" aria-hidden="true">`, keyed.
- [ ] **Step 4:** Examples, doc (Usage: direction, defaults per direction, split, wrap/justify, lists; a "Coming from Stack/Inline" note with the one-line mapping), block-drawn preview showing a horizontal row and a vertical column. Export `Space`, `SpaceProps` and `Gap` type from the component barrel; smoke imports `Space` and `type SpaceProps`; AGENTS table lists `Space`. CHANGELOG: `- [Space] New \`Space\`: one layout primitive with a \`direction\` (default \`'horizontal'\`), \`gap\`, \`align\`, \`justify\`, \`wrap\`, \`as\` and a \`split\` separator drawn between items (hidden from screen readers, an \`li\` inside a list). Each direction keeps Stack's or Inline's defaults.`
- [ ] **Step 5:** oxfmt, docs:gen, test, lint, smoke; screenshot `#/components/space` (1280 wide) light and dark; commit `feat(space): Space, one layout primitive with a direction and a split`.

### Task 3: Migrate every call site to Space; remove Stack and Inline

**Files:** Every file under `src`, `gallery`, `recipes`, `docs` (non-generated text), `AGENTS.md` that uses `Stack`/`Inline`/`StackProps`/`InlineProps` (≈230 files; ≈595 `<Stack`, ≈231 `<Inline`). Delete `src/component/{stack,inline}/`, `docs/component/{stack,inline}.md`. Modify `src/component/index.ts`, `scripts/docs-gen/categories.mjs`, `scripts/docs-gen/changelog.mjs` (`FORMER_NAMES`: `Stack: 'Space'`, `Inline: 'Space'`), its test (`currentTags` case), `scripts/docs-gen/inventory.test.mjs` if it names them, `scripts/smoke-exports.sh` (`layoutProbe` uses `SpaceProps`), `CHANGELOG.md`.

- [ ] **Step 1:** A codemod script in the scratchpad (Node, not committed): for each `.tsx/.ts/.md` file, `<Stack` → `<Space direction="vertical"` (keeping all other props), `</Stack>` → `</Space>`, `<Inline` → `<Space`, `</Inline>` → `</Space>`; fix import specifiers (`Stack`, `Inline` → one `Space`, deduplicated); `StackProps`/`InlineProps` → `SpaceProps`; relative imports of `stack`/`inline` folders in `src` → `space`. Prose in docs: rewrite by hand where the sentence names the component (`Lay out with \`Space\``), not blind replace. Never touch `CHANGELOG.md` history, `docs/superpowers/**`, or generated regions (docs:gen rewrites those).
- [ ] **Step 2:** Run it; `npx oxfmt` on the changed files; `npx tsc --noEmit -p tsconfig.json` clean; `grep -rnE "\\b(Stack|Inline)(Props)?\\b" src gallery recipes docs AGENTS.md scripts` finds only CHANGELOG history, `docs/superpowers`, `FORMER_NAMES`, generated changelog regions, and words in prose that are not the component (e.g. "stack" lowercase, `LayerStack`, `layer-stack`, "inline code").
- [ ] **Step 3:** Delete the stack/inline folders and docs; drop them from the barrel and categories; add `FORMER_NAMES`; update the changelog test's `currentTags` case to include `[Stack]`/`[Inline]` → `Space`.
- [ ] **Step 4:** CHANGELOG: `- [Space] **Breaking:** \`Stack\` and \`Inline\` (and \`StackProps\`, \`InlineProps\`) are removed; use \`Space\`. \`<Stack …>\` is \`<Space direction="vertical" …>\` and \`<Inline …>\` is \`<Space …>\`, with every prop and default unchanged.`
- [ ] **Step 5:** docs:gen, `npm test`, lint, smoke. Screenshot three busy pages before/after look identical (e.g. `#/components/card`, `#/components/button`, `#/` overview) at 1280 and 390. Commit `feat!: Space replaces Stack and Inline`.

### Task 4: Anchor

**Files:** Create `src/control/anchor/{index.tsx,style.ts,use-current-section.ts,index.test.tsx}`, `examples/{preview.tsx,01-list.tsx,02-minimap.tsx,03-placement.tsx}`, `docs/control/anchor.md`. Modify `src/control/index.ts`, `scripts/docs-gen/categories.mjs` (Navigation, alphabetical), `AGENTS.md`, `scripts/smoke-exports.sh`, `CHANGELOG.md`.

**Interfaces — Produces:**
```ts
export type AnchorItem = { id: string; title: string; level?: 1 | 2 | 3 };
export type AnchorProps = {
  items: AnchorItem[];
  variant?: 'list' | 'minimap';   // default 'list'
  offset?: number;                // px, default 0
  ariaLabel?: string;             // default 'On this page'
  className?: string;
};
export const Anchor: (props: AnchorProps) => JSX.Element | null;
```

- [ ] **Step 1: Failing tests** (jsdom: stub `getBoundingClientRect` per target and `window.scrollTo`, `innerHeight`, `document.documentElement.scrollHeight`, `scrollY`; fire `scroll`; wrap rAF with fake timers or a sync stub):
  - renders `nav[aria-label="On this page"]` > `ul` > one `a[href="#id"]` per item, titles as text; empty `items` renders nothing.
  - level indents: a level-2 and level-3 link have increasing `paddingInlineStart` (computed) over level 1.
  - current section: tops `[-400, -10, 300]` with `offset=0` → the second link has `aria-current="location"`, others none; above the first (all tops > 1) → first is current; scrolled to the bottom (`scrollY + innerHeight >= scrollHeight - 1`) → last is current even if its top > 1; `offset=64` shifts the boundary (a top of 40 counts as passed? no: top must be ≤ 65).
  - missing element: an item whose id isn't in the document is listed, never current, no throw.
  - click: calls `window.scrollTo({ top: scrollY + rect.top - offset, behavior: 'smooth' })`, prevents default (location.hash unchanged), focuses the target and gives it `tabindex="-1"` if it had none; with `matchMedia('(prefers-reduced-motion: reduce)')` matching, `behavior: 'auto'`.
  - minimap: `variant="minimap"` renders the same links (titles in the DOM, visually hidden via a class at rest), one dash per item; focusing a link adds the open state (the nav has `data-open="true"`), blur out of the nav removes it; mouseenter/mouseleave toggle it; Escape closes it.
  - listeners removed on unmount (spy on `removeEventListener` for `scroll` and `resize`).
- [ ] **Step 2:** `npx vitest run src/control/anchor` fails.
- [ ] **Step 3: Implement** per the spec's Anchor section. `useCurrentSection(ids, offset)` in its own file: reads element tops on scroll/resize via one rAF-throttled handler, returns the current id or `undefined`. List look: `fontSize.sm`, `text.secondary`, `space.lg` indent per level beyond 1, current `brand.default` with a 2px left bar (`boxShadow: inset 2px 0 0 …` or a `::before`), hover `text.primary`, focus ring from `recipe.focusRing`. Minimap look: dashes 2px tall, 6px apart, widths 16/12/8 by level, right-aligned, `border.default`, current `brand.default`; open state shows a panel (`bg.card`, `radius.md`, `shadow.cardStack`, `space.md` padding, `minWidth` 200px, max-height 70vh scroll) positioned to the left of the dashes (`right: 100%`, small gap), containing the list look. Panel and dashes are the same `<ul>`: at rest each link shows its dash and hides its text (visually-hidden), open shows text in the panel.
- [ ] **Step 4:** Examples: `01-list` (a short article with h2/h3 sections beside a sticky list), `02-minimap` (same with the minimap fixed at the right of the example frame; use `@viewport screen`), `03-placement` (sticky side column vs fixed right edge, hidden on phones via `theme.breakpoint.mobile`). Block-drawn preview: dashes column plus an open panel of title bars. Doc covers both looks, `offset`, placement and phones, focus behaviour, no URL change. CHANGELOG: `- [Anchor] New \`Anchor\` (control): a page outline from \`items\` (\`{ id, title, level }\`) that highlights the section in view and scrolls to one on click. \`variant="list"\` is an indented list of titles; \`variant="minimap"\` is a column of dashes that opens the list in a panel on hover or focus, as in Notion. \`offset\` allows for sticky chrome; it never changes the URL.`
- [ ] **Step 5:** oxfmt, docs:gen, test, lint, smoke. Screenshot the component page and both examples (1280 light/dark, 390 light), and hover the minimap (a small Playwright script via `.claude/skills/document-component/open-overlay.mjs` or similar) to check the panel. Commit `feat(anchor): Anchor, a page outline with list and minimap looks`.
