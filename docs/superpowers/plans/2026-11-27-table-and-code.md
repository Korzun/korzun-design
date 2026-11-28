# Table and code Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `Table`, `CodeBlock`, `Code`, a code colour palette and a Copy button recipe to `@korzun/design`, then rebuild the docs site's tables and code boxes on them.

**Architecture:** Three new modules in `src/component/` (`table`, `code-block`, `code`), theme additions in `src/theme/theme.ts`, a recipe in `recipes/copy-button/` + `docs/recipes/copy-button.md`. The gallery's hand-drawn tables and code boxes (`gallery/part/*`) then render through them; gallery-only behaviour (prop-name styling, union wrapping, type links, swatches) stays in the gallery as `render` functions and `className`s.

**Tech Stack:** React 19, react-jss, Vitest + Testing Library (jsdom), the docs generator in `scripts/docs-gen/`, oxfmt.

**Spec:** `docs/superpowers/specs/2026-11-27-table-and-code-design.md` (read it first; this plan argues from it).

## Global Constraints

- Work in `~/code/korzun-design-r6` on branch `org/4-table-code` (stacked on `org/3-sections`, PR #26). Never commit the `node_modules` symlink: stage with `git add -A -- . ':!node_modules'`. No force-push.
- No runtime `dependencies`; nothing new in `peerDependencies`. Shiki stays a gallery devDependency.
- Library code imports relatively from module folders (`'../surface/index.js'`, `'../../theme/index.js'`), never a barrel. Examples and recipes import from entry points (`@korzun/design/component`, …).
- Each new module follows `.claude/skills/new-component/SKILL.md` §1–§6: `index.tsx`, `style.ts` (literals listed in a top comment), `index.test.tsx`, `examples/NN-*.tsx` + `examples/preview.tsx`, `docs/component/<slug>.md` (front matter `title`, `description`, `category`; generated regions untouched), AGENTS.md docs index line, barrel export of `<Name>` and `<Name>Props` (+ other exported types), smoke probe, JSDoc on every prop.
- Sections in `scripts/docs-gen/categories.mjs`: `table` and `code-block` at the end of **Data display**; `code` after `text` in **Typography**.
- CHANGELOG bullets go under the existing `## 0.7.0 — 2026-11-26` heading (version stays 0.7.0), tagged `[Table]`, `[CodeBlock]`, `[Code]`, `[lightTheme, darkTheme]`, `[General]`.
- These modules draw text surfaces, so their `style.ts` sets `fontFamily`, `fontSize`, `lineHeight` and text colour, which the skill normally forbids; say so in the `style.ts` top comment.
- Corners follow depth: `radiusForDepth(theme.radius, useSurfaceDepth() ?? 0)` via depth classes (`depthClass`), like `CardRow`. `Table` and `CodeBlock` wrap their contents in `SurfaceDepthProvider depth={depth + 1}`.
- "Directly on the page" means `(useSurfaceDepth() ?? 0) === 0`; only then, and only when `theme.colorScheme === 'dark'`, do `CodeBlock` and `Code` add `boxShadow: inset 0 0 0 1px ${theme.color.border.default}`.
- Copy timing and copy: idle label `Copy`; done `Copied` with `CheckIcon` prefix for 2000 ms; failure `Could not copy` for 2000 ms. No toast.
- After any API, JSDoc, example or CHANGELOG change: `npx oxfmt <changed src files>` then `npm run docs:gen`. Before each commit: `npm run lint` and the task's tests; before the PR: `npm test` and `npm run smoke`.

## Review Focus

1. A `Table` cell whose field is `0`, `false` or `''` shows `0`, `false` and an empty cell; only `null`/`undefined` show `–`. (Task 3 test `default cell renders falsy values, dash only for null and undefined`.)
2. A `Table` with `rows=[]` and no `empty` renders the header and no body rows, without crashing; with `empty` it renders one full-width row. (Task 3 tests.)
3. CodeBlock Copy pressed again within 2 s restarts the 2 s timer; unmounting while "Copied" shows leaves no pending timer (no act warning). (Task 4 tests.)
4. No `navigator.clipboard` (insecure context, e.g. the dev server on a LAN IP) shows "Could not copy" and throws nothing. (Task 4 test.)
5. A very long unbroken line in a CodeBlock, or a wide Table, scrolls inside its own box and never widens the page; `minWidth` does not apply on a phone. (Task 3 and Task 4 style tests; screenshot check in Task 7.)

---

### Task 1: Code palette and code style recipes in the theme

**Files:**
- Modify: `src/theme/theme.ts` (type `Theme['color']`, `Theme['recipe']`; light and dark colour builders; `recipe` object)
- Test: `src/theme/theme.test.ts`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Produces: `theme.color.code: { foreground, keyword, string, function, parameter, constant, punctuation, comment, link: string }`; `theme.recipe.codeBlock: Recipe`; `theme.recipe.inlineCode: Recipe`.

- [ ] **Step 1: Write failing tests** in `src/theme/theme.test.ts`:
  - `code palette maps to the highlight colours` — for both `lightTheme` and `darkTheme` (`t`): `t.color.code.foreground === t.color.text.primary`, `keyword === t.color.chip.status.text`, `string === chip.author.text`, `function === chip.series.text`, `parameter === chip.subject.text`, `constant === chip.entryType.text`, `punctuation === text.secondary`, `comment === text.muted`, `link === brand.default`.
  - `recipe.codeBlock is the in-surface code box` — `toMatchObject({ margin: 0, padding: t.space.xl, overflowX: 'auto', fontFamily: t.fontFamily.mono, fontSize: t.fontSize.md, lineHeight: 1.5, borderRadius: t.radius.md, backgroundColor: t.color.bg.cardHeader })`.
  - `recipe.inlineCode is the code span` — `toMatchObject({ fontFamily: t.fontFamily.mono, fontSize: '0.875em', padding: \`0 ${t.space.xxs}\`, borderRadius: t.radius.sm, backgroundColor: t.color.bg.cardHeader, overflowWrap: 'break-word' })`.
- [ ] **Step 2:** `npx vitest run src/theme` — the three tests fail (undefined properties).
- [ ] **Step 3: Implement.** Add the `code` group to the colour type (JSDoc each key: which token kind it colours) and fill it in both builders from the values above (reference the already-built `chip`, `text`, `brand` objects; no new literals). Add `codeBlock` and `inlineCode` to `Theme['recipe']` with JSDoc ("for HTML not rendered through `CodeBlock`/`Code`; carries the in-surface look: no dark-mode page edge") and to the `recipe` object.
- [ ] **Step 4:** `npx vitest run src/theme` passes; `npm run docs:gen` (the theme and tokens docs pick up the new tokens).
- [ ] **Step 5:** CHANGELOG bullet: `- [lightTheme, darkTheme] New \`color.code\` palette (foreground, keyword, string, function, parameter, constant, punctuation, comment, link) for syntax colours, and \`recipe.codeBlock\` and \`recipe.inlineCode\` for code rendered outside \`CodeBlock\` and \`Code\`.` Then `npm run docs:gen`, `npm run lint`, commit `feat(theme): code colour palette and code recipes`.

### Task 2: `Code` (inline)

**Files:**
- Create: `src/component/code/{index.tsx,style.ts,index.test.tsx}`, `src/component/code/examples/{preview.tsx,01-in-text.tsx,02-in-a-heading.tsx}`, `docs/component/code.md`
- Modify: `src/component/index.ts`, `scripts/docs-gen/categories.mjs` (Typography: `heading, text, code`), `AGENTS.md`, `scripts/smoke-exports.sh`, `CHANGELOG.md`

**Interfaces:**
- Consumes: `theme.recipe.inlineCode` (Task 1).
- Produces: `Code({ children, className }: CodeProps)` rendering `<code>`; `export type CodeProps = { children?: ReactNode; className?: string }`.

- [ ] **Step 1: Failing tests** (`index.test.tsx`):
  - `renders a code element with its text` — `container.querySelector('code')` has text `maxLength`.
  - `takes the inline code look` — computed `fontFamily` equals `lightTheme.fontFamily.mono`, `fontSize` `0.875em`.
  - `adds the page edge only in dark mode directly on a Page` — with a dark `ThemeProvider` (see how `renderWithProviders` takes a theme; if it cannot, render with `ThemeProvider` `mode="dark"` directly): on a `Page`, computed `boxShadow` contains `inset`; inside `Page > Card` it does not; in light mode on a `Page` it does not.
  - `merges className on the root`.
- [ ] **Step 2:** run, fails (module missing).
- [ ] **Step 3: Implement.** `style.ts`: `root: { ...theme.recipe.inlineCode }`, `pageEdge` class only populated when `theme.colorScheme === 'dark'`. `index.tsx` reads `useSurfaceDepth()` and adds `pageEdge` when `(depth ?? 0) === 0`.
- [ ] **Step 4:** examples — `01-in-text`: a `Text` sentence with a `Code` prop name; `02-in-a-heading`: a `Heading` containing `Code`, showing it scales. Doc per the document-component skill (Usage: when to use `Code` vs `CodeBlock`; `### Corners` sentence: fixed `sm`, links `../corners.md`). Barrel, categories, AGENTS.md line, smoke probe, CHANGELOG `[Code]` bullet.
- [ ] **Step 5:** oxfmt, `npm run docs:gen`, `npx vitest run src/component/code gallery/examples.test.tsx`, `npm run lint`, commit `feat(code): inline Code`.

### Task 3: `Table`

**Files:**
- Create: `src/component/table/{index.tsx,style.ts,index.test.tsx}`, `src/component/table/examples/{preview.tsx,01-basic.tsx,02-custom-cells.tsx,03-empty.tsx,04-in-a-card.tsx,05-numbers.tsx}`, `docs/component/table.md`
- Modify: `src/component/index.ts`, `scripts/docs-gen/categories.mjs` (Data display: append `table`), `AGENTS.md`, `scripts/smoke-exports.sh`, `CHANGELOG.md`

**Interfaces:**
- Produces (exported from `@korzun/design/component`):
  ```ts
  export type TableColumn<Row> = {
    key: string; title: string; label?: string | false;
    render?: (row: Row, index: number) => ReactNode;
    width?: string; wide?: boolean; nowrap?: boolean; align?: 'start' | 'end';
  };
  export type TableProps<Row> = {
    columns: TableColumn<Row>[]; rows: readonly Row[];
    rowKey: keyof Row | ((row: Row, index: number) => string);
    ariaLabel?: string; empty?: ReactNode; minWidth?: string; className?: string;
  };
  export const Table: <Row>(props: TableProps<Row>) => JSX.Element;
  ```
  JSDoc on every field, as in the spec.

- [ ] **Step 1: Failing tests:**
  - `renders a header cell per column and a row per item` — `getByRole('table', { name: 'Books' })`; `getAllByRole('columnheader')` texts `['Title', 'Author']`; `getAllByRole('row')` length `rows.length + 1`.
  - `default cell renders falsy values, dash only for null and undefined` — rows `{ n: 0 }`, `{ n: false }`, `{ n: '' }`, `{ n: null }`, `{}` → cell texts `'0'`, `'false'`, `''`, `'–'`, `'–'`.
  - `render receives the row and its index`.
  - `labels each value for the phone layout, except label: false` — cell `data-label` equals the column `title`; a custom `label: 'Shelf'` wins; `label: false` leaves no `data-label`.
  - `empty rows show the empty message across all columns` — `rows=[]`, `empty="No books yet"`: one body row, its cell `colSpan === columns.length`, text matches; without `empty`: `tbody` has no rows.
  - `rowKey accepts a field name or a function` — no React key warning (spy `console.error`) for both forms.
  - `wide and nowrap and align land on the cells` — `wide` cell has the wide class (assert by `className` containing the generated `wide` key prefix, as props-table tests do), `align: 'end'` cell computed `textAlign: right`.
  - `width sets the header cell width` — `th` style `width: 35%`.
  - `minWidth sets the table's minimum width on a wide screen` — `minWidth="40rem"`: the `<table>` style has `--table-min-width: 40rem`; the stylesheet rule reading it sits under `theme.breakpoint.normal` only.
  - depth block (copy Button's `radius follows surface depth` pattern): box radius `lg` on a Page, `md` in `Page > Surface`, `sm` two levels in; a `Button` rendered in a cell is one level deeper.
  - `merges className on the root`.
- [ ] **Step 2:** run, fails.
- [ ] **Step 3: Implement.** Move `useTableStyle`'s `scroll` and `table` rules and the `wide` key from `gallery/part/props-table.tsx` into `style.ts` unchanged, except: the root's `borderRadius` comes from depth classes; the hard-coded `minWidth` goes: the prop sets the custom property `--table-min-width` inline on `<table>`, and a `[theme.breakpoint.normal]` rule applies `minWidth: 'var(--table-min-width, 0)'`, so a phone never sees it; add `nowrap: { whiteSpace: 'nowrap' }`, `end: { textAlign: 'right' }`, an `empty` cell style, and a visually-hidden `caption` (same clip rules as the hidden `thead`). Default cell: `(row as Record<string, unknown>)[col.key]`, `null`/`undefined` → `'–'`, else `String(value)`.
- [ ] **Step 4:** examples (Bookplate data): `01-basic` books with Title/Author/Year; `02-custom-cells` a `Tag` status column and a link `Button` (shows the depth step); `03-empty`; `04-in-a-card` the table inside a `Card` (md corners); `05-numbers` right-aligned numbers with `align: 'end'`. Preview: 3 rows of `01-basic`. Doc (Usage: columns, rows, `rowKey`, phone layout and `label`/`wide`, empty, scrolling and `minWidth`, corners; Do/don't: one table per dataset, no layout tables). Barrel exports `Table`, `TableProps`, `TableColumn`. Categories, AGENTS.md, smoke probe, CHANGELOG `[Table]` bullet.
- [ ] **Step 5:** oxfmt, docs:gen, tests (`src/component/table`, `gallery/examples.test.tsx`, `scripts/props-exports.test.mjs` via `npm run test:scripts`), lint, commit `feat(table): generic Table`.

### Task 4: `CodeBlock`

**Files:**
- Create: `src/component/code-block/{index.tsx,style.ts,copy.tsx,scroll-hint.ts,index.test.tsx}`, `src/component/code-block/examples/{preview.tsx,01-basic.tsx,02-copyable.tsx,03-highlighted.tsx,04-wrap.tsx}`, `docs/component/code-block.md`
- Modify: `src/component/index.ts`, `scripts/docs-gen/categories.mjs` (Data display: append `code-block` after `table`), `AGENTS.md`, `scripts/smoke-exports.sh`, `CHANGELOG.md`

**Interfaces:**
- Consumes: `theme.color.code` (Task 1); `Button` from `../../control/button/index.js`; `CheckIcon` from `../../icon/index.js`.
- Produces: `CodeBlock(props: CodeBlockProps)`; `export type CodeBlockProps = { code: string; children?: ReactNode; copyable?: boolean; copyLabel?: string; wrap?: boolean; className?: string }` (defaults `copyable = false`, `copyLabel = 'Copy code'`, `wrap = false`). The CSS variables it sets, documented in the doc's Usage: `--code-foreground`, `--code-token-keyword`, `--code-token-string`, `--code-token-string-expression` (= string), `--code-token-function`, `--code-token-parameter`, `--code-token-constant`, `--code-token-punctuation`, `--code-token-comment`, `--code-token-link`.

- [ ] **Step 1: Failing tests** (use `vi.useFakeTimers()` for the timer cases and stub `navigator.clipboard`):
  - `shows code as plain text in a pre` — `pre` text equals `code`.
  - `children replace the shown text but Copy copies code` — children `<span>highlighted</span>`; after pressing Copy, `writeText` called with `code`.
  - `no Copy button unless copyable`.
  - `Copy shows Copied with a check for 2 seconds` — button name `Copy code` before; after click and resolved promise, text `Copied` and an `svg` prefix; after `vi.advanceTimersByTime(2000)` back to `Copy`.
  - `a second press within 2 seconds restarts the timer` — press, advance 1500, press, advance 1500 → still `Copied`; advance 500 → `Copy`.
  - `unmounting while Copied leaves no timer` — `vi.getTimerCount()` is 0 after unmount.
  - `without a clipboard it says Could not copy` — `navigator.clipboard` undefined: text `Could not copy`, no throw.
  - `announces the result in a status region` — `getByRole('status')` text `Copied`.
  - `sets the code colour variables` — root inline/computed style has `--code-token-keyword` equal to `lightTheme.color.code.keyword`.
  - `wrap switches pre to pre-wrap` — computed `whiteSpace`.
  - `adds the page edge only in dark mode directly on a Page` (as Task 2).
  - depth block (radius `lg`/`md`/`sm`), `className` on the root.
- [ ] **Step 2:** run, fails.
- [ ] **Step 3: Implement.**
  - `scroll-hint.ts`: move `hasMoreRight` and `useScrollHint` from `gallery/layout/scroll-hint.ts` verbatim (internal, not exported from the barrel); the `scrollHint` mask style goes into `style.ts`.
  - `style.ts`: root is a flex row (`pre` grows, Copy top-aligned) with `bg.cardHeader`, depth radius classes, `pageEdge`; `pre` takes `theme.recipe.codeBlock` minus `borderRadius`/`backgroundColor` (the root has them), `flex: '1 1 auto'`, `minWidth: 0`, the scroll-hint mask; `wrap` class `whiteSpace: 'pre-wrap'`, `overflowWrap: 'anywhere'`; the `--code-*` variables on the root from `theme.color.code`.
  - `copy.tsx` (internal `CopyCodeButton({ text, label })`): `type="text"` `Button`; state `'idle' | 'done' | 'failed'`; one timer in a ref, cleared on re-press and on unmount; idle shows `Copy` with `ariaLabel={label}`; done shows `Copied` with `prefix={CheckIcon}`; failed shows `Could not copy`; a visually hidden `role="status"` span carries the done/failed text. Rendered inside `SurfaceDepthProvider depth={depth + 1}`.
- [ ] **Step 4:** examples: `01-basic` a shell command; `02-copyable` an import line with `copyable copyLabel="Copy import"`; `03-highlighted` hand-written token spans using `style={{ color: 'var(--code-token-keyword)' }}` (no Shiki in examples), with a description explaining Shiki's css-variables theme with `variablePrefix: '--code-'`; `04-wrap` a long line wrapped. Doc (Usage: plain vs highlighted, the CSS variables table, Copy behaviour, scrolling and the fade, corners and the dark page edge; Do/don't: use `Code` for inline). Barrel, categories, AGENTS.md, smoke probe, CHANGELOG `[CodeBlock]` bullet.
- [ ] **Step 5:** oxfmt, docs:gen, tests, lint, commit `feat(code-block): CodeBlock with Copy and code colours`.

### Task 5: Copy button recipe

**Files:**
- Create: `recipes/copy-button/01-copy-button.tsx`, `docs/recipes/copy-button.md`
- Modify: `AGENTS.md` (recipes index line, next to Sign in), `CHANGELOG.md`

**Interfaces:**
- Consumes: `Button`, `CheckIcon` from the entry points.

- [ ] **Step 1:** Write the example: an `Inline` with a connection URL in `Code` and a `CopyButton` defined in the file (same state machine and copy as Task 4's `CopyCodeButton`, idle label `Copy`, 2000 ms, status region), and a comment at the top saying "copy this component into your app". Front matter in the example comment like `recipes/login/01-sign-in.tsx` (title `Copy button`, description).
- [ ] **Step 2:** Doc `docs/recipes/copy-button.md` (front matter `category: Recipe`): why there is no Copy component, the three states, why no toast, why the status region, and keeping the width steady (`Copied` must not shift a row: put the button last or give it a `minWidth` in `em`). `npm run docs:gen` fills the examples region.
- [ ] **Step 3:** `npx vitest run gallery/examples.test.tsx` (recipes render there too) and `npm run test:scripts` pass; the recipe shows on `#/recipes`.
- [ ] **Step 4:** CHANGELOG `[General]` bullet (Docs: Copy button recipe), lint, commit `docs(recipes): Copy button`.

### Task 6: Site tables on `Table`

**Files:**
- Modify: `gallery/part/props-table.tsx`, `gallery/part/tokens-table.tsx`, their tests
- Before you start: screenshots (Step 1) for the comparison in Task 7.

**Interfaces:**
- Consumes: `Table`, `TableColumn` (Task 3), `Code` (Task 2).
- Produces: `PropsTable` and `TokensTable` keep their current props and exports; `useTableStyle` shrinks to the gallery-only classes (`code`, `name`, `propName`, `typeText`, `member`, `deprecated`, `link`, `alias`).

- [ ] **Step 1:** With the dev server on 5207 (`org/4-table-code` checked out in r6), capture "before" screenshots with Playwright at 1440 and 390 wide, light and dark (`?theme=` is not a site param; set it with the header's Light/Dark buttons or `localStorage` the way `gallery/frame-url.ts` reads it): `#/components/button` scrolled to Props and Tokens, `#/tokens`, and `#/components/button` with the first example's code shown. Save to the session scratchpad.
- [ ] **Step 2:** Rewrite `PropsTable` to render `<Table ariaLabel={table.name} rowKey="name" columns=… rows={table.rows} />` with columns Name (`label: false`, `nowrap`, renders the existing name cell), Type (`width: '35%'`, existing union renderer), Default (`width: '10%'`), Description (`wide`). Rewrite `TokensTable` as two `Table`s: value tokens (Token `wide`, `label: false`; Light; Dark) and, when any, recipe tokens (`ariaLabel="Recipe tokens"`: Token `wide`, `label: false`; Properties, the existing `Recipe` cell).
- [ ] **Step 3:** Update `props-table.test.tsx` and `tokens-table.test.tsx` only where structure legitimately changed (recipe rows now in the second table); every other assertion must pass unchanged. Run `npx vitest run gallery`.
- [ ] **Step 4:** lint, commit `refactor(site): props and tokens tables render through Table`.

### Task 7: Site code on `CodeBlock`, `Code` and the recipes

**Files:**
- Modify: `gallery/part/example-block.tsx`, `gallery/page/component.tsx` (import line), `gallery/part/props-table.tsx` (alias box), `gallery/part/markdown.tsx`, `gallery/part/copy-button.tsx`, `gallery/part/icon-grid.tsx`, `gallery/part/highlight.ts`, `gallery/layout/type.ts`, their tests
- Delete: `useHighlightStyle` (from `highlight.ts`), `codeBlock`, `inlineCode`, `pageCodeEdge` (from `layout/type.ts`) once unused; keep `gallery/layout/scroll-hint.ts` for markdown's `pre`s.

**Interfaces:**
- Consumes: `CodeBlock`, `Code`, `theme.recipe.codeBlock`, `theme.recipe.inlineCode`, `theme.color.code`.

- [ ] **Step 1:** `ExampleBlock`: the code becomes `<CodeBlock code={example.code} className={styles.code}>` with Shiki output as children (`<code dangerouslySetInnerHTML={{ __html: highlight(example.code) }} />`); `styles.code` keeps it flush at the card's bottom (radius 0, `borderTop: border.light`). The meta row's Copy stays a gallery `CopyButton`.
- [ ] **Step 2:** Import line (`component.tsx`): `<CodeBlock code={mod.importLine} copyable copyLabel="Copy import" className={styles.importBox}>` with highlighted children; drop the hand-built `Inline`/`Surface`/`CopyButton`. Alias box: `<CodeBlock code={…} wrap>`.
- [ ] **Step 3:** Markdown: `& pre` spreads `theme.recipe.codeBlock`, `& :not(pre) > code` and inline runs spread `theme.recipe.inlineCode`; the page-level markdown adds the dark page edge itself (`theme.colorScheme === 'dark'` inset shadow); highlight colours come from a class that sets the `--code-*` variables from `theme.color.code` (replacing `useHighlightStyle`).
- [ ] **Step 4:** Rebuild `gallery/part/copy-button.tsx` on the recipe's state machine (Copied/Could not copy in the button, status region, no toast); `IconGrid` keeps using it. Update `example-block.test.tsx`, `icon-grid.test.tsx`, `markdown.test.tsx`, `component.test.tsx` where they asserted the toast or the old structure.
- [ ] **Step 5:** `npx vitest run gallery`, then "after" screenshots identical to Task 6 Step 1's set. Compare pairwise; allowed differences: Copy feedback, code padding now `space.xl` everywhere. Fix anything else.
- [ ] **Step 6:** CHANGELOG `[General]` bullet (site tables and code now use the library; Copy feedback is in the button), oxfmt, docs:gen, lint, commit `refactor(site): code boxes render through CodeBlock and Code`.

### Task 8: Verify and open the PR

- [ ] **Step 1:** `npm test` (expect all vitest and script tests passing, `docs:check: ok`), `npm run lint`, `npm run smoke` (`smoke: ok`).
- [ ] **Step 2:** Screenshot the three new module pages and the recipe at 1440 and 390, light and dark; check the phone layout of a Table (labels, `wide` cells) and a long CodeBlock line (scrolls in its box, fade at right).
- [ ] **Step 3:** `git push -u origin org/4-table-code`; `gh pr create --base org/3-sections` titled `Table, CodeBlock, Code and a Copy button recipe`, body summarising the modules, the theme additions, the site migration and the Copy feedback change, ending with the attribution lines from the session's system reminder if any.
- [ ] **Step 4:** Wait for CI ("Lint, test, smoke pass") to go green; fix and push on failure.
