# Docs site: Ant-style overview and component pages

Date: 2026-11-25. Status: design, awaiting approval. Builder-check calls are marked "(builder-check call)".

## Intent

`@korzun/design` has a story gallery (dev workbench) and hand-written LLM docs
(`AGENTS.md`, `docs/<area>/<module>.md`). The owner wants one documentation
site modelled on Ant Design's: an overview of every component and a page per
component, for **the owner and their coding agents** (Bookplate, Scribe,
aviary). The pressing need is durability: as components are added or changed,
every page, table, example and LLM doc must stay correct with little effort,
and new components must be documented the same way every time. Skills carry
the judgment work; generators and tests carry the mechanical work.

## Goals

Overview (site root):

1. Lists every exported component and control, grouped by category.
2. A visual reference (live thumbnail) per component.
3. Simple search.
4. Changelog page (the full `CHANGELOG.md`).
5. LLM overview: `llms.txt` (index) and `llms-full.txt` (everything) served
   from the site.

Component page:

6. How to import (the exact import line).
7. Link to the component's LLM doc (the raw `.md`, served by the site).
8. Per-component changelog.
9. Usage guide (when to use, what to use instead, choosing variants).
10. Interactive examples: live, clickable demos.
11. The code of each example, shown verbatim with a copy button; what is shown
    is exactly what runs.
12. Props table: name, type, default, required, description.
13. Design tokens the component uses, with resolved light and dark values.

Durability:

14. Props, example code, tokens and per-component changelog are generated from
    source, never hand-maintained.
15. The site and the shipped LLM docs come from the same files and cannot
    disagree.
16. Tests fail when anything is missing or stale.
17. Two tested skills (`new-component`, `document-component`) make adding and
    documenting a component consistent; the second is then used to document
    every existing module.

## Non-goals

- Public polish: no landing page, getting-started guide, marketing copy,
  versioned docs, i18n or SEO. (Later, if the audience grows.)
- A props playground. The stories and props panel are **removed**; examples
  replace them by showing every meaningful way a component renders.
- Redesigning components. JSDoc and docs change; component behaviour does not.

## Anti-goals

- A props table, example snippet or token list that is typed by hand and can
  drift from the code.
- Example code on the page that differs from what renders (Storybook-style
  `{...args}` spreads that cannot be pasted).
- The site saying one thing and `docs/*.md` (what agents read in
  `node_modules`) saying another.
- Adding `typescript@5` or a Go toolchain to extract types.

## Constraints

- TypeScript 7 (tsgo) has no JavaScript compiler API; its Go packages are
  `internal/` and cannot be imported. Type information comes from the `.d.ts`
  files `npm run build` already emits (JSDoc preserved), parsed with
  `oxc-parser` (dev dependency, same toolchain as oxlint/oxfmt).
- No runtime `dependencies`; dev dependencies only.
- Nothing site-related ships: `files`, `tsconfig.build.json` and the smoke test
  exclude `src/**/examples/**` (as they excluded `*.stories.*`).
- Hosted where the gallery is today: GitHub Pages via `.github/workflows/gallery.yml`,
  hash routing, base `/korzun-design/`.
- Every behaviour change bumps the version and adds a CHANGELOG line. Shipped
  docs and JSDoc change here, so this ships as a patch release (0.5.1).

## Approaches considered

1. **Extend the existing gallery app** (chosen). Keep the small Vite + React
   app in `gallery/`, replace the story shell with overview and component
   pages, add one generator. Written content stays in `docs/<area>/<module>.md`;
   the generator fills marked sections. We build search and layout ourselves,
   which is modest for ~45 modules.
2. **dumi** (Ant's own doc tool). Ant's conventions out of the box, but a
   heavy Umi-based framework with its own markdown dialect, React 19/react-jss
   risk, and the LLM docs would become a second source to keep in sync.
3. **Storybook autodocs.** Story-centric; dropped because stories are going.

Props extraction: `typescript@5` alias and Go were rejected (constraints
above); parsing emitted `.d.ts` with oxc was chosen by the owner.

## Design

### Sources of truth

| What | Source | Who writes it |
|---|---|---|
| Title, one-line description, category | front matter of `docs/<area>/<module>.md` | skill / human |
| Intro, usage guide, "use something else for" | body of the doc, outside generated regions | skill / human |
| Prop descriptions | JSDoc in the component's TS types | skill / human |
| Prop names, types, required | emitted `dist/**/*.d.ts` | generated |
| Defaults | destructuring defaults in `index.tsx`, else `@default` JSDoc tag | generated |
| Examples | `src/<area>/<module>/examples/*.tsx` | skill / human |
| Tokens | `theme.*` member accesses in the module's `style.ts` | generated |
| Per-component changelog | tagged bullets in `CHANGELOG.md` | human, at release |
| Docs index in `AGENTS.md`, `llms.txt`, `llms-full.txt` | front matter of all docs | generated |

### Doc file format

```md
---
title: Button
description: A clickable action with a visual variant, optional icons, and a loading state.
category: Actions
---
# Button

`import { Button, type ButtonProps } from '@korzun/design/control'`

<hand-written intro and "Use something else for">

## Usage
<hand-written: when to use, choosing a variant, gotchas>

<!-- generated:examples -->…<!-- /generated:examples -->
<!-- generated:props -->…<!-- /generated:props -->
<!-- generated:tokens -->…<!-- /generated:tokens -->
<!-- generated:changelog -->…<!-- /generated:changelog -->
```

The import line is generated too (from the barrel that exports the module),
inside its own `generated:import` region. Generated regions contain plain
markdown, so an agent reading the doc in `node_modules` gets the examples,
props table, tokens and changelog without the site. The existing hand-written
props tables carry notes richer than today's JSDoc: during migration those
notes move **into the JSDoc** so nothing is lost, then the table is replaced by
the generated one.

**A page is a module folder** (builder-check call). A module's page covers
every public value its folder exports: `surface` documents `Surface` and
`useSurfaceRadius`; `menu` documents `Menu` and its item types. Route keys
and changelog tag names are the exported value names (`[Surface]`,
`[useSurfaceRadius]`), each mapped to its module.

**Supporting types get generated tables too** (builder-check call). Any type
the barrel exports that a props table references (`MenuItem`, `SelectOption`,
`PageActionItem`, `NavItem`, `FieldRow`, …) gets its own generated table in
the same module's `generated:props` region, and the props table links to it.
Hand-written "Items" type tables are replaced by these.

**Prose code blocks stay allowed** outside the generated regions (builder-check
call): "Do / don't" snippets and short in-sentence fragments are teaching
material, and a "don't" cannot be a runnable example. Every runnable "do"
example moves into `examples/`. The `document-component` skill enforces that
split; prose blocks are not type-checked.

Categories (fixed list, validated by the test): Layout, Typography, Actions,
Inputs, Overlays, Feedback, Data display, Navigation, Theme.

The `theme`, `toast` and `icon` entry points get pages like components
(builder-check call): `ThemeProvider` (plus `useTheme`, `useThemeSetting`) and
`ThemeSetting` under Theme, `ToastProvider`/`useToast` under Feedback, and
`icon` as the Icons page (`IconProps` table plus the grid of every icon). The
generator reads those barrels too. The remaining docs (`corners`, `patterns`,
`tokens`, `philosophy`, `hooks`) are guides: front matter with
`category: Guide`, rendered as pages, no generated regions.

Hooks take no props: their section keeps a hand-written signature (arguments
and return value); they get examples and changelog lines like components.

### Examples

- One file per example: `src/<area>/<module>/examples/<nn>-<slug>.tsx`, e.g.
  `01-basic.tsx`, `02-with-icons.tsx`. The numeric prefix sets the order; the
  first example is the overview thumbnail.
- Each file default-exports a React component taking no props, and starts with
  a doc comment: first line is the example's title, the rest its description.
  The comment is shown as text above the demo and stripped from the displayed
  code.
- Examples import from the public entry points (`@korzun/design/control`,
  `@korzun/design/component`, …), exactly as a consuming app would, so the
  shown code pastes as-is. (The gallery alias maps these to `src/`.) This is a
  new, stated exception to the "relative imports only" rule.
- State lives inside the example (`useState`), so demos are interactive with
  no harness. Styling inside examples follows AGENTS.md rules (tokens,
  `Stack`/`Inline`, no literals), so examples also teach correct usage.
- Examples cover every meaningful rendering: each `type`/`tone`/`size`
  variant, states (disabled, loading, error, empty), and composition with the
  components it is normally used with.

### Generator: `scripts/docs-gen.mjs`

`npm run docs:gen` (runs `npm run build` first for fresh `.d.ts`):

1. Reads the `control` and `component` barrels to find each exported value and
   its `<Name>Props`.
2. Parses the module's `dist/.../index.d.ts` with `oxc-parser`, finds
   `<Name>Props`, and flattens it: follows the package's own relative imports
   to inline local type aliases (`ButtonTypeValue` → `'default' | 'primary' | …`),
   flattens `&` intersections, `PropsWithChildren` (adds `children`), `Omit`/
   `Pick` with literal keys, and unions of object types (props that appear in
   some branches only are listed once, with the branch note from JSDoc). A type
   it cannot flatten is printed as written. React and DOM types stay by name.
3. Reads defaults from the component's parameter destructuring in
   `src/.../index.tsx` (literal defaults only); a JSDoc `@default` tag wins.
4. Collects `theme.<path>` accesses (including `theme.recipe.*`) from
   `style.ts` and resolves them against `lightTheme`/`darkTheme`.
5. Filters `CHANGELOG.md` bullets by tag.
6. Rewrites the generated regions of each doc, the docs index in `AGENTS.md`,
   and writes `gallery/generated/site-data.json` (page metadata, props, tokens,
   changelog, example list) for the site.

`npm run docs:check` runs the same generation into memory and fails, listing
files, if any doc or `AGENTS.md` differs. It runs in `npm test` (after build)
and so in CI and before publish.

### Changelog tags

Every bullet in `CHANGELOG.md` starts with the components it touches:
`- [Button, Menu] Button takes a ref…`, or `[General]` for package-wide items.
Existing entries 0.0.1–0.5.0 are backfilled. The test fails on an untagged
bullet or an unknown name. The site's changelog page renders the file with
tags as small chips; component pages show their filtered lines with version and date.

### Site (`gallery/`)

Routes (hash):

- `#/` Overview: search box, then categories, each a grid of cards (live
  thumbnail of example 01, title, description). Search filters by title,
  description, category and prop names, client-side, no library.
- `#/components/<module>` Component page: title, description, import line with
  copy button, "LLM doc" link to `docs/<area>/<module>.md` on the site, usage
  guide, examples (demo, description, collapsible code with copy), props
  table, tokens table (path, light value, dark value, swatch for colours),
  changelog.
- `#/guides/<name>` Guide pages rendered from the guide docs.
- `#/tokens` the existing tokens page; `#/icons` a grid of every icon with its
  import name (new, small); `#/changelog`.
- Light/dark toggle in the header; it applies to all demos.

Demos render in iframes (as stories do today) so `Page`, navs, `TopFade`,
popovers and `documentTitle` behave as in an app and cannot affect the shell.
Overview thumbnails are the same iframes, lazily loaded, scaled down and
non-interactive. The rendered markdown uses a small markdown renderer
(dev dependency, e.g. `marked`).

Build output adds `llms.txt` (llmstxt.org format: title, summary from
AGENTS.md, one link per doc with its description, grouped by category),
`llms-full.txt` (AGENTS.md followed by every doc) and the raw `docs/**/*.md`
files.

### Removed

All 42 `*.stories.tsx`, `gallery/story.ts`, `stories.ts`, the story shell
(`sidebar`, `story-view`, `props-panel`, `actions-log`, `toolbar`, `canvas`),
`all.tsx` (contact sheet) and their tests. `gallery/stories.test.tsx` becomes
`gallery/examples.test.tsx`.

### Tests

- `gallery/examples.test.tsx`: every exported component module has at least
  one example; every example has a doc comment title; every example renders in
  jsdom (inside `ThemeProvider`/`ToastProvider`/router) without throwing.
- `scripts/docs.test.mjs` (extended): front matter present with a known
  category; generated regions present; `docs:check` clean.
- `scripts/docs-gen.test.mjs`: unit tests for flattening (alias, intersection,
  union, `PropsWithChildren`, `Omit`), defaults, token collection, changelog
  tags.
- Site: route tests for overview (search filters), a component page (all
  sections present), changelog.
- Packaging: smoke test asserts no `examples/` in the tarball and that docs
  contain no unresolved region markers.

### Skills (`.claude/skills/`)

- **`new-component`**: scaffold `src/<area>/<module>/` (`index.tsx` with typed,
  JSDoc'd `<Name>Props`, `style.ts`, `index.test.tsx`, `examples/01-basic.tsx`),
  barrel export of value and props type, doc with front matter and usage
  sections, tagged CHANGELOG line and version bump, then `docs:gen`, tests,
  lint, and a screenshot of the component page to look at.
- **`document-component`**: for an existing or changed module: enrich JSDoc
  (move notes out of any hand-written table), write front matter and usage
  guide, write examples covering every variant and state, run `docs:gen`,
  tests, lint, screenshot the page and check every example renders correctly.

Both are written and tested with `superpowers:writing-skills`: a baseline run
by a subagent without the skill, then with it, on real modules (document
`Alert` and `Menu`; scaffold a throwaway `Checkbox` in a worktree), iterating
until the output passes `docs:check`, tests and lint and matches the
conventions without correction.

### Phases

All phases land on one branch, `docs-site`, and merge to `main` together as
0.5.1 (owner's choice). The live GitHub Pages site stays the old gallery until
that merge, so no phase needs the story shell and the new site side by side,
and `docs:check` never has to tolerate unmigrated docs on `main`.

1. **Generator and site on pilots.** Generator, doc format, examples, new
   site, tests, done by hand for `Button`, `Alert` and `Stack`.
2. **Skills.** Write and test both skills against the pilots' conventions.
3. **Rollout.** Run `document-component` over every remaining module (in
   batches by area), backfill CHANGELOG tags, delete stories and the story
   shell, update CLAUDE.md rules (examples instead of stories; examples
   import from entry points; docs generated regions), release 0.5.1.

## Left to the builder

- Exact visual design of the site within the library's own components and
  tokens (the site is built with `@korzun/design` itself).
- Markdown renderer choice, iframe sizing, thumbnail scaling.
- The flattening rules beyond those listed, as long as unflattenable types fall
  back to their declared text.
- Which category each module goes in (the skill decides; owner reviews in the
  rollout PR).
