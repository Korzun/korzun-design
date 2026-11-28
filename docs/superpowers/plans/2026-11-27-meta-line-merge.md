# MetaLine merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `MetaLine` draws both the dotted line and the labelled-pairs look; `MetadataList` is removed.

**Architecture:** `src/component/meta-line` gains labelled items and an optional `separator` character (gap look when unset). The `metadata` and `metadata-list` folders and `theme.size.metadataValue` go, with no alias.

**Tech Stack:** React 19, react-jss, Vitest + Testing Library, docs generator `scripts/docs-gen`, oxfmt.

**Spec:** `docs/superpowers/specs/2026-11-27-meta-line-merge-design.md`

## Global Constraints

- Worktree `~/code/korzun-design-r6`, branch `org/5-meta-line` (stacked on `org/4-table-code`, PR #27). Stage with `git add -A -- . ':!node_modules'`; never commit the `node_modules` symlink. No force-push.
- Relative imports from module folders in `src`; examples import from `@korzun/design/component`.
- CHANGELOG bullets under the existing `## 0.7.0 — 2026-11-26` heading; version stays 0.7.0.
- After API/JSDoc/example/CHANGELOG changes: `npx oxfmt <files>`, `npm run docs:gen`. Before each commit: focused tests and `npm run lint`.
- Separator: one character, drawn by CSS in a `1em` cell, never in DOM text; any string (including `"`, `\`, newline) is escaped for CSS `content`.
- No separator: `columnGap: theme.space.lg`, `rowGap: theme.space.sm`, no `::before`.

## Review Focus

1. A pair whose `value` is `null`/`undefined`/`false` is skipped; `0` and `''` are kept (Task 1 test).
2. A separator of `'"'` or `'\\'` renders as that character and does not break the stylesheet (Task 1 test).
3. Mixed plain items and pairs in one line, with and without a separator (Task 1 test).
4. Nothing in `src`, `docs`, `gallery`, `scripts` or `AGENTS.md` still names `MetadataList`, `Metadata` (the type) or `metadataValue`, except CHANGELOG history (Task 2 grep).
5. React keys: two pairs sharing a label or holding elements don't warn (Task 1 test, spy `console.error`).

---

### Task 1: MetaLine takes labelled items and an optional separator

**Files:** Modify `src/component/meta-line/{index.tsx,style.ts,index.test.tsx}`, `src/component/meta-line/examples/*`, `docs/component/meta-line.md` (non-generated parts), `CHANGELOG.md`, `src/component/index.ts` (export `MetaLineItem`), `scripts/smoke-exports.sh`.

**Interfaces — Produces:**
```ts
export type MetaLinePair = { label: string; value: ReactNode };
export type MetaLineItem = ReactNode | MetaLinePair;
export type MetaLineProps = { items: MetaLineItem[]; separator?: string; className?: string };
```
JSDoc on every field. A pair is detected as a non-null, non-element object with a `label` key (`isValidElement` false).

- [ ] **Step 1: Failing tests** (`index.test.tsx`; keep existing tests, update the two that assume dots by default to pass `separator="·"`):
  - `with no separator, items are spaced by gaps and draw no separator` — item computed/CSS has no `::before` content rule applied (assert the item lacks the separated class), root list `columnGap` = `lightTheme.space.lg`, `rowGap` = `lightTheme.space.sm`.
  - `separator draws that character between items, outside the DOM text` — `separator="|"`: textContent has no `|`; the stylesheet contains a `content` rule resolving to `"|"` for the item (read via the custom property or the `<style>` text, whichever the implementation uses).
  - `separator escapes quotes and backslashes` — `'"'` and `'\\'` each produce valid CSS (`content` value equals the JSON/CSS-escaped string) and no console error.
  - `renders a pair as a faint label followed by its value` — `{ label: 'cover fit', value: 'Contain' }`: item text `cover fitContain` (label element and value element), the label element computed color `lightTheme.color.text.faint`, `textTransform: capitalize`.
  - `skips a pair whose value is null, undefined or false, keeps 0 and ''`.
  - `mixes plain items and pairs` — order preserved, `metaItems` returns each item's text.
  - `pairs sharing a label or holding elements do not warn about keys`.
- [ ] **Step 2:** `npx vitest run src/component/meta-line` fails.
- [ ] **Step 3: Implement.** Style: `list` gets the gap look by default; a `separated` class on the list adds `marginLeft: -1em` and `columnGap: 0`, and on items the `::before` cell. Pass the character through a CSS custom property set inline on the list (`--meta-separator: <CSS string literal>`), `content: 'var(--meta-separator)'`; build the literal with a small `cssString(s)` helper that escapes `\`, `"` and newlines. Item keys: index-based (the list is positional). Labels: `<span className={styles.label}>` + `<span>` value, `gap: theme.space.xs` inside the item.
- [ ] **Step 4:** Examples: update `01-basic`… to pass `separator="·"` where they show the dotted line; add `05-labelled-pairs.tsx` (Bookplate device: Slug, Cover size, Grayscale cover, Status `Tag`) and `06-separator-choices.tsx` (`·`, `|`, `/`). Preview: one dotted line and one labelled line. Doc: Usage covers both looks, `separator`, pairs, skipping, wrapping/ellipsis; Do/don't (use a `Table` for many fields). CHANGELOG: `- [MetaLine] **Breaking:** without \`separator\` the items are spaced by gaps, not dots; pass \`separator="·"\` for the old look. New labelled items (\`{ label, value }\`), shown with a faint capitalized label, and \`separator\` takes any one character. Absorbs \`MetadataList\`.`
- [ ] **Step 5:** oxfmt, docs:gen, `npx vitest run src/component/meta-line gallery/examples.test.tsx`, `npm run test:scripts`, lint; commit `feat(meta-line): labelled items and an optional separator character`.

### Task 2: Remove MetadataList

**Files:** Delete `src/component/metadata/`, `src/component/metadata-list/`, `docs/component/metadata-list.md`. Modify `src/component/index.ts`, `scripts/docs-gen/categories.mjs` (drop `metadata-list`), `scripts/docs-gen/inventory.test.mjs:54-55` (no `metadata-list` module; keep the check that no internal folder is listed), `AGENTS.md`, `scripts/smoke-exports.sh`, `src/theme/theme.ts` (remove `size.metadataValue`, and the `size` group if empty; its tests), `CHANGELOG.md`, any non-generated `docs/**/*.md` text or gallery code naming them (grep).

- [ ] **Step 1:** Delete and update the files above; the theme tests change only where they asserted `size`.
- [ ] **Step 2:** `grep -rn "MetadataList\|metadataValue\|metadata-list" src docs gallery scripts AGENTS.md` finds nothing outside `CHANGELOG.md`, `docs/superpowers/` and generated changelog regions.
- [ ] **Step 3:** CHANGELOG: `- [MetadataList] **Breaking:** removed; use \`MetaLine\` with \`{ label, value }\` items (no \`separator\` for the gap look).` and `- [lightTheme, darkTheme] **Breaking:** \`size.metadataValue\` is removed (MetadataList was its only user).`
- [ ] **Step 4:** oxfmt, docs:gen, `npm test`, `npm run lint`, `npm run smoke`; screenshot `#/components/meta-line` at 1440 and 390 (light, dark) on the dev server at 5207 and check both looks. Commit `feat!: remove MetadataList; MetaLine covers labelled pairs`.

### Task 3: PR

- [ ] Push `org/5-meta-line`; `gh pr create --base org/4-table-code` titled `MetaLine absorbs MetadataList`; wait for CI green.
