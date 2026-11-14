# Design: extracting the Bookplate design system into `korzun-design`

**Date:** 2026-11-14
**Status:** draft, awaiting approval

## Intent

Bookplate (`~/code/bookplate`) grew a complete, opinionated UI system: a themed
token set with light and dark palettes, JSS "recipes" for inputs, cards, modals
and glass chrome, a library of generic controls and components, an icon set, a
toast system, and a written design philosophy scattered through comments and the
brand README. Scribe (`~/code/scribe-server`) needed the same look and got it by
copying files. Its copy of the theme is byte-identical to Bookplate's today, but
`Page`, `EmptyState`, `CardRow` and the icon set have already drifted.

This repository becomes the single home of that system. It is managed, expanded
and curated here, and every project that wants the look depends on it as an npm
package instead of carrying a copy.

**Why:** one source of truth. A fix or refinement lands once and reaches every
app on its next dependency bump. Drift between apps stops being possible by
accident.

## Goals

1. `@korzun/design` is a public npm package built from this repo, consumable by
   any React 19 + react-jss app.
2. Everything generic in Bookplate's UI layer lives here: theme, recipes,
   controls, components, icons, toast, and the small hooks they need.
3. Scribe depends on the package and deletes its copied UI modules. Its tests
   stay green and the app looks identical.
4. The design philosophy is written down in this repo so a person or an agent
   working in any consumer knows the rules without reading Bookplate.
5. There is a way to look at every control and component in both modes without
   booting a consumer app, so curation happens here.

## Non-goals (this project)

- Migrating Bookplate. That follows as a separate effort once the package shape
  is proven on Scribe.
- Redesigning, renaming or "cleaning up" tokens, recipes or components. Some
  tokens are domain-flavored (the `chip` palette keyed by author/series/subject,
  `size.metadataValue`). They move as-is. Curation is what the repo is *for*,
  but it starts after extraction, on a stable base.
- Multi-brand theming (a different accent colour per app). The brand blue stays
  the default. Making the brand pluggable is the obvious first curation task.
- Storybook or any third-party documentation framework.
- Publishing the Bookplate brand kit (crest, mark, icon generator). That is
  Bookplate's identity, not the system.

## Anti-goals

Even if the package technically works, it has failed if:

- The look changes during extraction. Rendered styles must be equivalent to what
  Bookplate ships today. Extraction is a move, not an edit.
- A consumer ends up with two React instances or two JSS instances.
  Hooks break, themes vanish. React, react-dom, react-jss and classnames must be
  peer dependencies, never bundled.
- Scribe's migration is a copy with a new name. Its copied modules must be
  deleted, not left beside the package.
- Day-to-day work in a consumer requires reading the package's compiled output
  to understand a component. The package ships source maps and declaration
  files, and the docs explain intent.

## Constraints

- **Toolchain.** Both consumers are React 19.2, react-jss 10, react-router 8,
  classnames 2, Vite 8, vitest 4, TypeScript 7, Node 24, oxlint and oxfmt. The
  package matches all of these.
- **Both consumer repos are public** on GitHub under `Korzun`. Bookplate's
  Docker build runs a plain `npm install` / `npm ci` in its build stage with no
  registry auth, so the package must be on the public npm registry.
- **The `@korzun` npm scope has no packages yet** (registry returns 404 for
  `@korzun/design`). An npm account owning that scope is a prerequisite for the
  first publish.
- **This machine has no `node`, `npm` or `docker`.** Bookplate and Scribe are
  developed in a devcontainer (Node 24 Alpine) on another host. The builder will
  need a Node 24 toolchain to run lint and tests; see "Open to the owner" below.
- **Consumers' internal imports use a `~/` alias.** The package cannot: `tsc`
  does not rewrite path aliases, and consumers resolve the package by subpath.
  Internal imports inside the package are relative.
- Bookplate's test-utils rely on Apollo. The package has no Apollo and needs its
  own, smaller test harness.

## Approaches considered

Three ways to get the system from this repo into consumers were weighed:

1. **Public npm package, built here, published on tag.** Fast installs, no
   special handling in Docker or CI, semver forces thought about breaking
   changes. Costs an npm account and a publish token. **Chosen.**
2. **Git tag dependency** with a `prepare` build on install. No registry, but
   every `npm ci` (including each architecture of a Docker build) clones and
   compiles TypeScript, the build image needs git, and lockfiles pin SHAs.
   Rejected for build cost and noise.
3. **Vendor sync CLI** that copies modules into a consumer's `src/design/`.
   Keeps consumers dependency-free and debuggable in place, but it is still
   copying: local tweaks get clobbered or become drift. Rejected because it
   weakens "manage from here" into "manage here, then remember to push".

Order of work, decided by the owner: extract here first, migrate Scribe
immediately as the proof, Bookplate afterwards.

## The design

### Package identity

- Name: `@korzun/design`. Public, MIT or "all rights reserved" to match
  Bookplate (owner's call; the package.json `license` field follows it).
- Version: starts at `0.1.0`. Pre-1.0 semver: minor bumps may break.
- Repository: `github.com/Korzun/korzun-design`, public, default branch `main`.

### Repository layout

```
korzun-design/
  package.json            the publishable package (root = package)
  tsconfig.json           build config (emits dist/)
  tsconfig.gallery.json   gallery app config (noEmit)
  src/
    index.ts              re-exports everything below
    theme/                tokens, recipes, ThemeProvider, GlobalStyles, hooks
    control/<name>/       one folder per control: index.tsx, style.ts, index.test.tsx
    component/<name>/     same shape
    icon/                 one file per icon + props.ts + index.ts
    toast/                ToastProvider, useToast, Toast
    hooks/                use-minimize-on-scroll, use-pull-to-refresh, is-standalone
    utils.ts              applyTransparency, isNumeric (only what src needs)
    test-utils.tsx        renderWithProviders (theme + toast + MemoryRouter); not exported
  gallery/                Vite dev app that renders every export; never published
  docs/
    philosophy.md         the design principles (see below)
    tokens.md             token groups and what each is for
    superpowers/          specs and plans
  .github/workflows/
    ci.yml                lint + test + build on push to main and every PR
    publish.yml           on tag v*.*.*: lint, test, build, npm publish
  CLAUDE.md               working rules for this repo
  README.md               install + usage, with the subpath map
  CHANGELOG.md
```

The `src/` layout deliberately mirrors Bookplate's `app/client/src/` so a module
moves by `git mv` plus import rewrites, and so the later Bookplate migration is
mechanical.

### Public surface (package exports)

Subpath exports, each with its own `types` entry:

| Import | Contents |
| --- | --- |
| `@korzun/design` | everything |
| `@korzun/design/theme` | `ThemeProvider`, `useTheme`, `useThemeSetting`, `GlobalStyles`, `createUseStyles` (re-exported from react-jss, typed), `lightTheme`, `darkTheme`, types `Theme`, `ThemeMode`, `ThemeSetting` |
| `@korzun/design/control` | the controls listed below |
| `@korzun/design/component` | the components listed below |
| `@korzun/design/icon` | all icons, `IconProps`, the default prop sets |
| `@korzun/design/toast` | `ToastProvider`, `useToast` |
| `@korzun/design/hooks` | `useMinimizeOnScroll`, `usePullToRefresh`, `isStandalone` |

Consumers that used `~/provider/theme`, `~/control`, `~/component`, `~/icon`,
`~/provider/toast` rewrite to the matching subpath. That one-to-one mapping is
the whole migration recipe.

### What moves (v0.1.0)

**Rule:** a module moves if nothing in its props, name or imports refers to a
Bookplate domain concept (books, libraries, uploads, fixes, ratings, users,
devices, auth). The builder verifies the list below against the rule with a
grep for `~/gql`, `~/graphql`, `~/provider/{apollo,auth,config,library-target,upload}`,
`~/router`, `~/page` and `~/lib/{token,api-fetch,...}` before moving anything.

Controls: `action-menu-list`, `back-button`, `button`, `chips-input`,
`confirm-modal`, `date-time-input`, `field-list`, `number-input`,
`page-actions-bar`, `page-actions-menu`, `page-footer-actions`, `popover`,
`segmented-control`, `select`, `switch`, `text-area`, `text-input`,
`use-modal-dialog`.

Components: `card`, `card-divider`, `card-row`, `collapsible-section`,
`empty-state`, `meta-line`, `metadata`, `metadata-list`, `nav-desktop`,
`nav-mobile` (with the `NavItem` type from `nav/types.ts`), `page`,
`progress-indicator`, `tag`, `theme-setting`, `top-fade`.

Not `pull-to-refresh`: the component calls `useApolloClient()` and refetches
active queries, so by the rule above it is domain-bound and stays in Bookplate.
Only its `usePullToRefresh` hook moves. (Builder's check; my call.)

Icons: every file in `icon/` except `bookplate.tsx` and `bookplate-crest.tsx`,
which are brand marks and stay in Bookplate.

Providers: `provider/theme` → `src/theme`, `provider/toast` → `src/toast`.

Hooks: `lib/use-minimize-on-scroll`, `lib/use-pull-to-refresh`,
`lib/is-standalone`.

Utils: only `applyTransparency` and `isNumeric` (the two functions the moved
modules import). Bookplate keeps its own `utils.ts`.

Each module's tests move with it. Scribe's extra tests for `empty-state` and
`card-row` (Bookplate has none) move into the package too.

**Stays in Bookplate** (domain-bound): the `nav` shell (queries users, pending
fixes, upload queue), `book-*`, `cover*`, `rating-*`, `chapter-progress`,
`upload-*`, `fix-review`, `severity-counts`, `validation-detail-modal`,
`edit-fix-modal`, `set-progress-modal`, `link-*`, `unlink-*`,
`reset-password-button`, `password-result-modal`, `proportional-chapter-slider`,
`pull-to-refresh` (the component; its hook moves), `subject-chips`, `brand-lockup`, `search-bar`, `theme-setting`'s neighbours like
`email-setting`, and everything in `page/`, `router/`, `graphql/`, `gql/`.

### The decouplings the move requires

Only two moved modules reach into Bookplate's app layer; both get a prop. A
third prop reconciles the one place Scribe's fork of `Page` differs in layout.

1. **`ThemeProvider` reads the signed-in identity** from `~/lib/token`
   (`currentIdentity`, `TOKEN_CHANGED_EVENT`) to key the persisted theme
   setting per user (`theme-setting:<identity>`). The package's provider takes
   `identity?: string | null` instead and keys storage exactly as today:
   `theme-setting:<identity>` when signed in, and **no persistence at all when
   `identity` is null**, so a signed-out session is forced back to `auto` and
   the login screen never inherits a previous user's choice (the existing
   "does not leak one user's choice to another" test encodes this and moves
   unchanged). Saved settings keep working because the key format is
   unchanged. Each consumer wraps the provider in a five-line local provider
   that subscribes to its own token lib and passes `identity`. The package's
   `renderWithProviders` takes an `identity` option so the per-user tests can
   drive it.
2. **`Page` sets `document.title` from `useLibraryName()`** (Bookplate) or a
   constant `'Scribe'` (Scribe's fork). The package's `Page` takes
   `documentTitle?: string` and sets `document.title` only when given.
   Everything else in Bookplate's `Page` (back button, header actions, footer
   actions, the held-open header row) moves as-is; Scribe's simpler fork is
   superseded by it. Scribe's test that the document title is set moves into
   the package's `Page` test, asserting against `documentTitle`.
3. **Mobile bottom clearance.** Bookplate's `Page` pads the mobile bottom by
   `layout.navHeightMobile` plus spacing so content clears the floating bottom
   nav; Scribe's fork has no nav and pads only by `space.xxxxxl` plus the safe
   area. The package's `Page` takes `bottomNav?: boolean` (default `false`):
   `true` adds the nav clearance exactly as Bookplate computes it today, `false`
   gives Scribe's padding. Bookplate passes `bottomNav` when it migrates;
   Scribe passes nothing and keeps its current look. My call, prompted by the
   builder check; a CSS variable in the style of the existing
   `--page-top-inset` would also work and the builder may prefer it.

Nothing else changes behaviour. Where the two consumers' copies differ only in
comments or local variable names (`empty-state`, `card-row`), Bookplate's text
is taken. `createUseStyles` on the theme subpath is the existing re-export from
react-jss, not a new wrapper.

### Dependencies

`peerDependencies`: `react ^19`, `react-dom ^19`, `react-jss ^10`,
`classnames ^2`, `react-router ^8`. All five are already in both consumers.
react-router is required rather than optional because `BackButton`,
`NavDesktop` and `NavMobile` import it and both consumers have it; making it
optional would complicate the build for no current beneficiary.

`dependencies`: none.

`devDependencies`: typescript, vite, @vitejs/plugin-react, vitest, jsdom,
@testing-library/{react,jest-dom,user-event}, oxlint, oxfmt, plus the peers
for local builds and tests.

### Build and publish

- `tsc` emits ESM JavaScript, `.d.ts` declarations and source maps from `src/`
  to `dist/`, preserving the folder structure. `jsx: react-jsx`,
  `module: ESNext`, `moduleResolution: bundler`, `declaration: true`,
  `sourceMap: true`, `declarationMap: true`. No bundler: consumers' Vite does
  the bundling, and per-file output keeps stack traces and "go to definition"
  pointing at real files.
- `package.json` `files` is `["dist"]`; `exports` maps each subpath above to
  `dist/<folder>/index.js` with `types` beside it. `sideEffects: false`.
- Tests and the gallery import from `src/`; nothing in the repo imports `dist/`
  except a single `exports` smoke test in CI that packs the tarball, installs it
  into a scratch Vite project and type-checks one import per subpath. That test
  is what catches a broken `exports` map before a consumer does.
- Lint matches Bookplate: oxlint + oxfmt with Bookplate's `.oxfmtrc.json` and
  `.oxlintrc.json` copied over, `internalPattern` dropped since there is no
  alias.
- **CI** (`ci.yml`): on push to `main` and every PR, Node 24, `npm ci`,
  `npm run lint`, `npm test`, `npm run build`, then the exports smoke test.
  Pinned action SHAs as in Bookplate's workflows.
- **Publish** (`publish.yml`): on tag `v*.*.*`, re-run the gate, then
  `npm publish --access public --provenance`. Auth via an npm granular
  automation token stored as the `NPM_TOKEN` repo secret. Upgrading to npm
  trusted publishing (OIDC, no stored token) is a one-line follow-up once the
  package exists on the registry.
- **Release flow**: bump `version` in `package.json` and `CHANGELOG.md` on a
  branch, merge, tag `vX.Y.Z` on `main`, push the tag. Bookplate's two-stage
  prepare/finalize release pipeline is more than a library needs; not copied.

### Gallery

`gallery/` is a Vite app in the repo, run with `npm run gallery`, never
published. It renders a page per export group (theme tokens as swatches and
type scale; each control in its states: default, hover-able, disabled,
loading, danger; each component with representative props; the icon grid) with
a light/dark/auto switch using the real `ThemeProvider` and `ThemeSetting`
component. It exists so a change can be seen in both modes without booting
Scribe or Bookplate. It is plain React pages, hand-written, kept small. It is
the owner's curation surface and is explicitly allowed to be rough.

### Documentation

- `docs/philosophy.md` captures the principles the code already embodies,
  written as rules with the reason attached, lifted from the theme comments
  and the brand README. Among them: ink-on-paper register over glossy chrome;
  one modal width so dialogs read as one system; stacked (`0 2px 0`) card
  shadows rather than blur; translucent hover scrims so hover reads on any
  surface; a 16px floor on mobile form controls so iOS never auto-zooms; glass
  chrome with a solid fallback; a `track` token that must read against both
  `page` and `card`; recipes are spreadable fragments, not components; tokens
  are the only place a measured layout number lives. The builder extracts
  these from the source comments while moving the code, which is when they
  are in front of them.
- `docs/tokens.md` lists each token group (`color.*`, `space`, `radius`,
  `layout`, `fontSize`, `shadow`, `transition`, `zIndex`, `breakpoint`,
  `recipe`) with one line on intent per group and a note on the ones that are
  domain-flavored and slated for curation.
- `README.md`: install, the peer list, the provider wiring snippet (theme →
  toast, with the identity wrapper pattern), the subpath table, and how to run
  the gallery.
- `CLAUDE.md`: this repo's rules. Extraction before curation. Styles move
  byte-equivalent. Every control and component has a test and a gallery entry.
  Bump the version and changelog with every behaviour change. Relative
  imports only.

### Scribe migration (part of this project)

1. Add `@korzun/design@^0.1.0` to `app/client/package.json`.
2. Delete `src/provider/theme`, `src/provider/toast`, `src/control/{button,
   text-input,switch,confirm-modal,use-modal-dialog}`,
   `src/component/{card,card-row,empty-state,page}`, `src/icon` (all of it:
   Scribe's six icons are a subset of the package's).
3. Add `src/provider/theme/index.tsx`: the five-line identity wrapper around
   the package's `ThemeProvider`, reading Scribe's token lib.
4. Rewrite imports: `~/provider/theme` → `@korzun/design/theme` (except the
   wrapper), `~/provider/toast` → `@korzun/design/toast`, `~/control` →
   `@korzun/design/control` for the deleted controls (Scribe-only controls
   `codes-sheet` and `password-prompt-modal` keep `~/control`), `~/component`
   likewise, `~/icon` → `@korzun/design/icon`.
5. Every `<Page>` gains `documentTitle="Scribe"`. No `<Page>` passes
   `bottomNav`.
6. Scribe's `test-utils.tsx` wraps with the package providers.
7. `npm run lint && npm test` green; the app is visually unchanged in both
   modes on the login, setup and dashboard pages.

### Bookplate (deferred, but designed for)

The identity wrapper, `documentTitle` and `bottomNav` are the only seams
Bookplate needs. Its migration is the same recipe as Scribe's over a larger file set, and
its brand icons, `nav` shell and domain controls stay put. Nothing in this
project blocks or complicates it.

## Left to the builder

- Exact `exports`/`typesVersions` shape, as long as the subpath table holds and
  the smoke test passes.
- Gallery routing and visual arrangement.
- Whether `src/index.ts` re-exports with namespaces or flat; flat is fine
  unless two names collide.
- Vitest setup details (jest-dom matchers, jsdom), copied from Bookplate.
- Order of moving modules, so long as each commit leaves lint and tests green.
- Wording of the philosophy doc, provided every rule carries its reason and
  nothing is invented that the code does not do.

## Open to the owner

Resolved before building; recorded here once answered.

0. **Which Scribe branch the migration lands on.** The local checkout is
   `plan-2-mcp-and-jobs` (open PR #3, five commits ahead of `main`) and its new
   files also import the shared UI. Basing the migration on `main` forces PR #3
   to rebase through deleted directories; basing it on PR #3 stacks it behind
   unmerged work.
0a. **The GitHub repository** `Korzun/korzun-design` does not exist yet. CI,
   the publish workflow and the `NPM_TOKEN` secret all hang off it.
1. **Toolchain on this machine.** No Node here. Options: install Node 24
   user-locally (fnm or nvm, no sudo), or do all building in CI and the
   devcontainer. The former lets the builder run tests while working;
   recommended.
2. **npm account and the `@korzun` scope.** Someone has to own the scope and
   create the `NPM_TOKEN` secret before the first tag. Can be done any time
   before step "publish 0.1.0".
3. **License** for the package: MIT, or all rights reserved like Bookplate.
