---
name: new-component
description: Use when adding a new control, component or hook to korzun-design (src/control, src/component, src/hooks), such as "add a Checkbox", "build a Tooltip", "ship a new Tabs component", or when a module is created that has no doc, examples or export yet.
---

# Add a component

The output is a module that ships like Button and Select: typed, JSDoc'd,
tested, exported, documented on the docs site, probed by the smoke test, and
announced in the CHANGELOG. Every section below is REQUIRED. The report in §8
has one checklist slot per section; an empty slot means the work is not done.

Below, `<area>` is `control` or `component`, `<slug>` the kebab-case folder
(`checkbox`), `<Name>` the exported value (`Checkbox`).

**Examples replace stories (CLAUDE.md: a test and examples).** Write no
`*.stories.tsx` (nothing reads it). The doc format is the one from the
`document-component` skill, not the old `# Name` + Props table.

Read the red flags (§9) before you start. Then read, end to end:
`AGENTS.md` (rules 1, 2, 6, 9, 10, 11), `src/control/button/` and
`src/control/select/` (`index.tsx`, `style.ts`, `index.test.tsx`, `examples/`),
their docs, and `src/component/surface/index.tsx`. Modules are the reference.
When a module disagrees with an AGENTS rule, the rule wins.

## 1. Scaffold

`src/<area>/<slug>/index.tsx`:
- `export type <Name>Props = { … }` with a `/** */` JSDoc on **every** prop,
  written to `document-component` §2's rules (behaviour only, no defaults in
  prose, links as markdown). A JSDoc on `<Name>` itself, one or two sentences
  saying what it renders.
- Defaults as literals in the destructuring (`disabled = false`), so the
  generated Default column fills itself.
- `className?: string` merged **last** in `cx(styles.root, …, className)`.
- `ref?: Ref<…>` as a plain prop when a caller may need to focus or measure
  the element (no `forwardRef`; see Button's `ref`).
- A form field (it takes a value the user edits) takes `name: string` and puts
  it on the native element so the value submits with a `<form>` (AGENTS
  rule 6). A field built on a native `<input>` gets this for free; never
  document "no `name`, send from state" for one.
- Imports are relative and point at module folders
  (`'../../component/surface/index.js'`, `'../../theme/index.js'`), never the
  `control` or `component` barrel.

`src/<area>/<slug>/style.ts`:
- `createUseStyles((theme: Theme) => …)`; every colour, space, font size,
  radius, shadow, z-index and transition from `theme.*`
  (`transitionDuration: theme.transition.fast`), tints via `applyTransparency`.
  Recipes before hand-written rules: the focus ring is
  `...theme.recipe.focusRing` on the root with only `outlineColor` set on
  `:focus-visible`, never a hand-written `outlineWidth`/`outlineStyle`. No
  literal hex, px, rem or seconds. A size that must track the text uses `em`
  (`'1em'`). A literal a token or recipe already covers is not a needed
  literal. Every literal that remains, with no exception, goes in a comment
  block at the top of the file, one line each with its reason, as Button's
  `style.ts` does.
- Layout is `Stack`/`Inline` and text is `Text`/`Heading`, composed in
  `index.tsx`; `style.ts` never sets `gap`, `alignItems`, `fontSize`,
  `fontWeight` or text `color`. Inside a `<label>` or `<button>` root, wrap the
  children in `<Inline as="span" gap="…">` and set text with
  `<Text as="span">`, or make the root itself `<Text as="label">`. `Inline`
  renders block-level, full-width `flex`, so a root that must hug its content
  (a checkbox row, whose click target would otherwise span the line) keeps
  `display: 'inline-flex'` on the root with a one-line comment saying so; the
  gap still comes from the inner `Inline`. No other `display` on the root.
- Corners follow depth. Read `useSurfaceDepth()` and pick a class with
  `depthClass(depth)` as Button and Select do, or draw a box with
  `useSurfaceRadius()`. A fixed radius is allowed only for a glyph smaller than
  a line of text (a checkbox square, a switch track): `theme.radius.sm`, a
  comment in `style.ts`, and a `### Corners` Usage sentence in the doc saying
  it is fixed and linking `[corners](../corners.md)`.
- States are told apart: `:focus-visible` looks different from `:hover`;
  disabled uses the library's fade (`opacity: 0.5`, as Button). An unchecked
  or empty control's outline reaches 3:1 non-text contrast against `bg.input`
  in both themes (WCAG 1.4.11). No `border.*` token does (`border.default` is
  1.4:1 light, 1.5:1 dark), so use `theme.color.text.muted` (5.1:1 light,
  6.6:1 dark). A disabled unchecked control stays visible: check both in the
  dark screenshot.

`src/<area>/<slug>/index.test.tsx` (`renderWithProviders` from
`../../test-utils.js`). One test per row, named for the behaviour:

| Case | Assertion |
|---|---|
| accessible name | `getByRole('<role>', { name: '<label>' })` finds it |
| main interaction | click calls the handler with the documented argument |
| keyboard | `user.tab()` focuses it; Enter/Space (or arrows) acts as the click does |
| controlled | without a prop change the shown state does not flip |
| disabled | handler not called on click or key; out of the tab order or `aria-disabled` |
| form field | inside a `<form>`, `new FormData(form).get('<name>')` has the value |
| `className` | the class lands on the root |
| `ref` | `ref.current` is the root element |
| depth | radius on a `Page`, in `Page > Surface`, two `Surface`s deep (Button's `radius follows surface depth` block) |

Drop a row only when the module has no such prop or behaviour (no depth row
for a fixed-radius glyph), and say which and why in the report.

Barrel: add `export { <Name>, type <Name>Props } from './<slug>/index.js';` to
`src/<area>/index.ts`, alphabetically, plus any other exported type of the
module. `src/index.ts` re-exports each area with `export *`, so it needs
nothing; check that is still true (`grep "<area>/index" src/index.ts`).

A hook instead: `src/hooks/use-<x>.ts` plus `use-<x>.test.tsx`, exported from
`src/hooks/index.ts`, documented as a section of `docs/hooks.md`, and named in
the `@korzun/design/hooks` row of AGENTS.md. §2 then means that section, not a
module doc.

## 2. Document it (REQUIRED: the `document-component` skill)

Follow `document-component` §1–§4 exactly; verification is §6 below, which
replaces its §6 (and §7 below replaces its §7). Changes for a module that has
no old doc:
- Its §1.1 and §5 do not apply (no old doc, no stories). The audit table's Old
  note column says "none"; the coverage row for the old `## Example` says
  "new module".
- Its §3: create `docs/<area>/<slug>.md` from its template, front matter first
  (`category` verbatim from `scripts/docs-gen/categories.mjs`). Facts like
  "takes `className`", "Space toggles", "submits as `<name>`" are Usage
  sentences under `### Styling`, `### Keyboard`, `### Forms`.
- Its §4: `examples/01-basic.tsx` first, then one per value and state, each
  wired to state.

## 3. AGENTS.md

- Imports table: add `<Name>` to the row for its entry point, matching the
  neighbouring entries in that row (their case and backticks). oxfmt does not
  format Markdown: if the row grows past the column, widen the header, the
  separator and every row by hand so the pipes align.
- Rule 11: if it says `<Name>` does not exist yet, remove `<Name>` from that
  sentence (keep the others).
- The `[docs/…]|…` index lines are written by `docs:gen`; never edit them.

## 4. Smoke probe

In `scripts/smoke-exports.sh`, add `<Name>` to the `@korzun/design/<area>`
import line and to `export const probe = [...]`, and `type <Name>Props` to
the import with a use in one of the `…Probe` tuples (a prop's type, as
`menuProbe` does), so the packed tarball must resolve both.

## 5. Version and CHANGELOG

```
git describe --tags --abbrev=0 --match 'v*'   # latest release, e.g. v0.5.0
node -p "require('./package.json').version"
grep -m1 '^## ' CHANGELOG.md                 # top heading
```
The release is unreleased when `package.json`'s version or the top
`## X.Y.Z` heading is above the tag.
- Unreleased: add the bullet under that version's heading; if the version is
  ahead but there is no heading for it, create
  `## X.Y.Z — $(TZ=America/New_York date +%F)` at the top.
  If the unreleased version is only a patch over the tag (v0.5.0 → 0.5.1),
  raise it to the next minor: `npm version <next minor> --no-git-tag-version`
  and rename the heading to match.
- Not unreleased (version and top heading equal the tag):
  `npm version minor --no-git-tag-version` and add a new
  `## X.Y.0 — $(TZ=America/New_York date +%F)` heading at the top.
- `package.json` and the top heading name the same version when you finish.
- The date is the owner's local date (America/New_York); a UTC shell after
  19:00 local gives tomorrow, so always set `TZ`.

Bullet: ``- [<Name>] New `<Name>` (<area>): <what it renders and its main
props>.`` The tag is the value name, so the site links it.

## 6. Verify (REQUIRED, in order)

1. `npx oxfmt src/<area>/<slug>`, then `npm run docs:gen`.
2. The module is on the site:
   `node -p "require('./gallery/generated/site-data.json').modules.some(m => m.slug === '<slug>')"`
   prints `true`. `false` means the doc has no front matter or the barrel
   export is missing: the generator skips such a doc silently.
3. `document-component` §6.2: the notes check on the generated tables.
4. `npm run lint`.
5. `npm test` once (build, vitest, script tests, docs:check). Fix until green.
6. `npm run smoke` prints `smoke: ok`.
7. Screenshots per `document-component` §6.5, last: the full page
   `#/components/<slug>` light and dark, every overlay example, and the
   reshoot `find` check. The page shows `<Name>`'s title and every example;
   a not-found page means step 2 failed. In the dark shot every unchecked,
   empty and disabled state is visible.

## 7. Commits

- An unrelated fix you needed (a test that hard-codes a module count or a
  version): its own commit first, fixed to assert the real invariant instead of
  the new literal, and named in the report.
- Everything else: one commit, `feat(<slug>): new <Name> <area>`.

## 8. Report

1. Files created and changed.
2. The checklist, one line each with its evidence (path:line or command
   output): §1 props/JSDoc, `className` last, `ref`, `name`, relative imports,
   tokens-only `style.ts` (literals listed), layout via Stack/Inline, corner
   decision, distinct focus; test table rows; barrel line; §2 doc front
   matter, regions, examples; §3 imports row, rule 11; §4 smoke lines; §5 tag,
   version before and after, bullet.
3. `document-component`'s audit table and coverage checklist.
4. Each §6 check with its result (`true`, test counts, `docs:check: ok`,
   `smoke: ok`, lint clean).
5. Screenshot paths and the overlay table.
6. Separate commits for unrelated fixes, and anything left undone.

## 9. Red flags

| Thought | Reality | Do instead |
|---|---|---|
| "Every control gets a stories file." | Examples replace stories (CLAUDE.md asks for a test and examples); a stories file is dead code. | Write `examples/`; no `*.stories.tsx`. |
| "Switch does it this way" (literal px, `display`/`gap`, fixed radius). | Old modules predate the rules; copying them copies the violation. | Follow the AGENTS rule; a needed literal gets a comment with its reason. |
| "I'll write the doc like `switch.md`." | A doc without front matter never reaches the site, and nothing fails. | Use `document-component`'s template; check `site-data.json` (§6.2). |
| "A hand Props table is clearer." | It duplicates the JSDoc and drifts. | JSDoc every prop; the generated region renders it. |
| "It has no `name`; callers can send it from state." | AGENTS rule 6: every field needs a `name`, and a native input submits for free. | Take `name` and test it with `FormData`. |
| "Hover and focus can share the ring." | A keyboard user then cannot see where focus is. | Give `:focus-visible` its own look. |
| "I saw it was faint, but it's the border token Button uses, so I shipped." | Below 3:1 it is invisible to many readers; in dark mode it vanishes, and disabled vanishes in both. | Use `text.muted` for the outline; do not ship until both shots show unchecked and disabled-unchecked boxes. |
| "I'll write the outline and the 0.1s transition by hand." | `recipe.focusRing` and `transition.fast` exist; a hand copy drifts. | Spread the recipe, use the token; list any remaining literal at the top. |
| "The imports table is enough." | Rule 11 still tells consumers it does not exist. | Edit rule 11 too. |
| "Tests and lint pass, so it ships." | Smoke and the page screenshot catch what they cannot. | Run `npm run smoke` and shoot the page. |
| "The count test broke; bump 41 to 42." | The next module breaks it again, and it rides in your commit. | Assert the invariant, in its own commit. |
| "A patch bump is fine; it's small." | A new export is a minor change. | Follow §5. |
| "I'll add it to the docs index line." | `docs:gen` owns those lines. | Leave them; run `docs:gen`. |
