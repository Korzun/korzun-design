# Design System Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish Bookplate's generic UI layer as the `@korzun/design` npm package from this repo, and switch Scribe to it.

**Architecture:** A flat TypeScript source tree (`src/theme`, `src/control/*`, `src/component/*`, `src/icon`, `src/toast`, `src/hooks`) mirroring Bookplate's `app/client/src`, compiled per-file by `tsc` to `dist/` and exposed through seven subpath exports. Modules are copied from Bookplate with `~/` alias imports rewritten to relative paths; three props (`identity`, `documentTitle`, `bottomNav`) replace the only app-layer couplings. A dev-only Vite gallery renders every export in both modes.

**Tech Stack:** TypeScript 7, React 19, react-jss 10, react-router 8, classnames 2, Vite 8, vitest 4, jsdom, Testing Library, oxlint, oxfmt, Node 24, GitHub Actions, npm registry.

**Spec:** `docs/superpowers/specs/2026-11-14-design-system-extraction-design.md`

## Global Constraints

- Node `>=24`; `.node-version` and `engines.node` both say `24`.
- Peer dependencies, never bundled: `react ^19`, `react-dom ^19`, `react-jss ^10`, `classnames ^2`, `react-router ^8`. `dependencies` stays empty.
- Styles move byte-equivalent. Diff every copied `style.ts` against its Bookplate source: the only permitted differences are import paths, and in `component/page/style.ts` the `bottomNav` split described in Task 8.
- Internal imports are relative and point at a module folder (`../../control/button`), never at a barrel (`../../control`). Bookplate's circular-import note in its `test-utils.tsx` is why.
- Source of truth for copied code is `~/code/bookplate/app/client/src` at commit `10cfbe6` (`main`, identical to `origin/main` on 2026-11-14). Where Scribe's copy differs only in comments or local names, Bookplate's text wins.
- Lint and format are Bookplate's: `.oxfmtrc.json` and `.oxlintrc.json` copied, with `internalPattern` removed and `src/gql/**` ignores dropped.
- Every behaviour change bumps `version` and gets a `CHANGELOG.md` line. v0.1.0 is the first release.
- Commit messages end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Precondition for every task that runs `npm`: a Node 24 toolchain on the machine (`node -v` prints `v24.x`). The owner installs it (fnm or nvm, user-local) before execution starts; tasks do not install it.
- Precondition for Task 13 only: the `@korzun` npm scope is owned and `NPM_TOKEN` is set as a repository secret on `Korzun/korzun-design`.
- Branching: Tasks 1–12 are done on a branch `extraction` off `main` and land through one or more PRs so `ci.yml` (Task 10) runs on them before Task 13 tags `main`. Task 14 has its own branch in the Scribe repo.

## Review Focus

1. A signed-in user chooses dark, then signs out: `identity` goes to `null`, the setting must return to `auto`, and nothing may be written to `localStorage`. Pinned in Task 2.
2. A consumer that manages `document.title` itself renders `<Page>` without `documentTitle`: the title must be left alone. Pinned in Task 8.
3. A consumer imports `createUseStyles` from `@korzun/design/theme` while its own `ThemeProvider` comes from the same package: both must resolve to one `react-jss` instance or every `useStyle` sees an empty theme. Pinned by the smoke test in Task 9 (`npm ls react-jss` shows one copy).
4. A consumer type-checks an import from every subpath with `moduleResolution: bundler`: each `exports` entry must carry a `types` condition that resolves. Pinned in Task 9.
5. Scribe renders `<Page type="minimal">` on mobile without `bottomNav`: no nav clearance must be added, or every Scribe page grows ~96px of dead space. Pinned in Task 8.

---

### Task 1: Package scaffold, toolchain config, utils, port script

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.build.json`, `vite.config.ts`, `.node-version`, `.gitignore`, `.oxfmtrc.json`, `.oxlintrc.json`, `LICENSE`, `src/setup.ts`, `src/utils.ts`, `src/utils.test.ts`, `src/index.ts`, `scripts/port.mjs`, `scripts/port.test.mjs`
- Reference: `~/code/bookplate/app/client/package.json`, `~/code/bookplate/.oxfmtrc.json`, `~/code/bookplate/app/client/.oxlintrc.json`, `~/code/bookplate/app/client/src/setup.ts`, `~/code/bookplate/app/client/src/utils.ts` (+ `.test.ts`), `~/code/bookplate/.gitignore`

**Interfaces:**
- Produces: `applyTransparency(color: string, alpha: number): string` and `isNumeric(value: string): boolean` in `src/utils.ts` (bodies copied verbatim from Bookplate).
- Produces: `node scripts/port.mjs <bookplate-relative-path> <dest-relative-path>` copies a file or folder from `~/code/bookplate/app/client/src/<path>` into `<dest>` under this repo and rewrites every `from '~/...'` import per the table below to a relative path from the destination file. Exports `rewriteImports(source: string, destFile: string): string` for the test.
- Produces: npm scripts `lint` (`oxlint src gallery scripts && oxfmt --check "src/**/*.{ts,tsx}" "gallery/**/*.{ts,tsx}" && tsc --noEmit`), `lint:fix`, `test` (`vitest run`), `test:watch`, `build` (`rm -rf dist && tsc -p tsconfig.build.json`), `gallery` (`vite --config gallery/vite.config.ts`), `smoke` (added in Task 9).

Alias rewrite table for `port.mjs`. The script copies first, then rewrites every mapped import to a path relative to the destination file; an unmapped import is left as written, reported as `UNMAPPED <file>: <import>`, and makes the script exit 1 after finishing the file, so the builder can see every miss at once.

| Bookplate alias | Resolves to |
| --- | --- |
| `~/provider/theme` | `src/theme` |
| `~/provider/toast` | `src/toast` |
| `~/icon` | `src/icon` |
| `~/utils` | `src/utils` |
| `~/test-utils` | `src/test-utils` |
| `~/lib/use-minimize-on-scroll`, `~/lib/use-pull-to-refresh`, `~/lib/is-standalone` | `src/hooks/<same-name>` |
| `~/control/<name>`, `~/component/<name>` | `src/control/<name>`, `src/component/<name>` |
| bare `~/control`, bare `~/component` (barrels) | UNMAPPED on purpose: hand-rewrite per specifier to the module folder. Only two moved files do this: `component/page/index.tsx` (`BackButton`, `PageActionsBar`, `PageActionsMenu`, `PageFooterActions`, `FooterAction`, `PageActionItem` → `../../control/{back-button,page-actions-bar,page-actions-menu,page-footer-actions}`) and `component/theme-setting/index.tsx` (`SegmentedControl` → `../../control/segmented-control`). |
| anything else under `~/` | UNMAPPED |

- [ ] **Step 1: Write `package.json`** with `"name": "@korzun/design"`, `"version": "0.1.0"`, `"type": "module"`, `"license": "SEE LICENSE IN LICENSE"`, `"files": ["dist"]`, `"sideEffects": false`, `"engines": {"node": ">=24"}`, the peer list from Global Constraints, and devDependencies at Bookplate's client ranges: `typescript ^7.0.2`, `vite ^8.3.5`, `vitest ^4.1.12`, `@vitejs/plugin-react ^6.0.3`, `jsdom ^29.1.1`, `oxlint ^1.74.0`, `oxfmt ^0.74.0`, `@testing-library/react ^16.1.0`, `@testing-library/jest-dom ^6.6.3`, `@testing-library/user-event ^14.5.2`, `@types/react ^19.2.17`, `@types/react-dom ^19.2.3`, plus the five peers at `react ^19.2.8`, `react-dom ^19.2.8`, `react-jss ^10.10.0`, `classnames ^2.5.1`, `react-router ^8.3.0`. The `exports` map is added in Task 9. `LICENSE` reads: `Copyright (c) 2026 Simon Korzun. All rights reserved.`
- [ ] **Step 2: Write `tsconfig.json`** (editor/vitest, `noEmit`, `include: ["src", "gallery", "scripts"]`) copying Bookplate's client compiler options minus `paths` and `allowImportingTsExtensions`, with `types: ["vitest/globals", "vite/client"]`. Write `tsconfig.build.json` extending it with `noEmit: false`, `declaration: true`, `declarationMap: true`, `sourceMap: true`, `outDir: "dist"`, `rootDir: "src"`, `include: ["src"]`, `exclude: ["src/**/*.test.*", "src/test-utils.tsx", "src/setup.ts"]`.
- [ ] **Step 3: Write `vite.config.ts`** from `vitest/config`: `plugins: [react()]`, `test: { environment: 'jsdom', globals: true, setupFiles: ['./src/setup.ts'] }`, no alias. Copy `src/setup.ts` verbatim from Bookplate. Copy `.oxfmtrc.json` (drop `internalPattern`) and `.oxlintrc.json` (drop the `src/gql/**` ignore). `.gitignore`: `node_modules/`, `dist/`, `.worktrees/`, `.claude/settings.local.json`, `**/.DS_Store`.
- [ ] **Step 4: `npm install`**, then write `src/utils.test.ts` with the `applyTransparency` and `isNumeric` cases lifted from Bookplate's `utils.test.ts`.
- [ ] **Step 5: Run `npm test`** — Expected: FAIL, `src/utils.ts` missing.
- [ ] **Step 6: Create `src/utils.ts`** with the two functions copied verbatim; `src/index.ts` exporting `applyTransparency` for now.
- [ ] **Step 7: Run `npm test && npm run lint && npm run build`** — Expected: all pass; `dist/utils.js`, `dist/utils.d.ts` exist.
- [ ] **Step 8: Write `scripts/port.test.mjs`** (`node --test`): `rewriteImports("import { Button } from '~/control/button';\nimport { useTheme } from '~/provider/theme';", 'src/component/page/index.tsx')` returns imports from `'../../control/button'` and `'../../theme'`; `rewriteImports("import { useTheme } from '~/provider/theme';", 'src/control/button/style.ts')` returns `'../../theme'`; `rewriteImports("import { x } from '~/utils';", 'src/theme/theme.ts')` returns `'../utils'`; a bare `~/control` and a `~/gql` import each throw with a message containing `UNMAPPED`.
- [ ] **Step 9: Run `node --test scripts/`** — Expected: FAIL, module missing.
- [ ] **Step 10: Implement `scripts/port.mjs`** with `rewriteImports` and a CLI main (`cp -r` semantics, then rewrite every `.ts`/`.tsx` under the destination). Add `"test:scripts": "node --test scripts/"` and include it in `test`.
- [ ] **Step 11: Run `npm test`** — Expected: PASS.
- [ ] **Step 12: Commit** — `chore: scaffold @korzun/design package, utils and port script`.

### Task 2: Theme

**Files:**
- Create via port: `src/theme/{theme.ts,theme.test.ts,context.ts,global-styles.ts,use-theme.tsx,use-theme-setting.ts,index.ts}` from `provider/theme/*`
- Create (rewritten, not ported): `src/theme/provider.tsx`, `src/theme/provider.test.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: `ThemeProvider({ children, identity = null }: { children: ReactNode; identity?: string | null })`. Storage key `theme-setting:<identity>`; when `identity` is `null` nothing is read or written and the setting is `auto`. When the `identity` prop changes, the setting is re-read for the new identity.
- Produces (unchanged from Bookplate): `useTheme(): Theme`, `useThemeSetting(): [ThemeSetting, (s: ThemeSetting) => void]`, `GlobalStyles`, `createUseStyles` re-export, `lightTheme`, `darkTheme`, types `Theme`, `ThemeMode`, `ThemeSetting`, `ThemeProviderProps`.

- [ ] **Step 1: Port** `provider/theme/theme.ts`, `theme.test.ts`, `context.ts`, `global-styles.ts`, `use-theme.tsx`, `use-theme-setting.ts`, `index.ts` to `src/theme/`. Add `export { lightTheme, darkTheme } from './theme'` and `export type { ThemeProviderProps } from './provider'` to `index.ts`.
- [ ] **Step 2: Write `src/theme/provider.test.tsx`** by porting Bookplate's and replacing the token helpers: `login(sub)` becomes re-rendering `<ThemeProvider identity={sub}>`, `logout()` becomes re-rendering with `identity={null}`. Keep every existing case, including "does not leak one user's choice to another" (now: dark as `alice`, re-render `identity={null}`, probe shows `auto`; re-render `identity="bob"`, probe still `auto`). Add `it('writes nothing to localStorage while signed out')`: with `identity={null}`, click "go dark", assert the probe shows `dark` for the session and `localStorage.length === 0`. That matches Bookplate's current behaviour: `setSetting` updates state and skips the write when there is no key.
- [ ] **Step 3: Run `npx vitest run src/theme`** — Expected: FAIL, `provider.tsx` missing.
- [ ] **Step 4: Write `src/theme/provider.tsx`** from Bookplate's: delete the `~/lib/token` import and the `TOKEN_CHANGED_EVENT` effect; take `identity` as a prop; add `useEffect(() => setSettingState(readSetting(identity)), [identity])`. Everything else verbatim.
- [ ] **Step 5: Run `npx vitest run src/theme && npm run lint`** — Expected: PASS.
- [ ] **Step 6: Commit** — `feat(theme): port theme tokens, recipes and provider with identity prop`.

### Task 3: Icons, toast, test harness

**Files:**
- Create via port: `src/icon/*` (every file in Bookplate's `icon/` except `bookplate.tsx`, `bookplate-crest.tsx`; drop their two lines from `index.ts`), `src/toast/*` from `provider/toast/*`
- Create: `src/test-utils.tsx`

**Interfaces:**
- Produces: `renderWithProviders(ui: ReactElement, options?: { identity?: string | null; initialEntries?: string[] } & Omit<RenderOptions, 'wrapper'>)` wrapping `MemoryRouter` > `ThemeProvider identity` > `ToastProvider`. Not part of the build.
- Produces: `ToastProvider`, `useToast` (unchanged); all icon components and `IconProps`, `defaultFilledIconProps`, `defaultStrokeIconProps`.

- [ ] **Step 1: Port `icon/`** (minus the two brand files). Run `npx vitest run src/icon` — Expected: PASS (`key.test.tsx`, `more.test.tsx`).
- [ ] **Step 2: Write `src/test-utils.tsx`** with the signature above.
- [ ] **Step 3: Port `provider/toast/`** to `src/toast/`. Run `npx vitest run src/toast` — Expected: PASS (its tests use `renderWithProviders` without options).
- [ ] **Step 4: Run `npm run lint`** — Expected: PASS.
- [ ] **Step 5: Commit** — `feat: port icon set, toast provider and test harness`.

### Task 4: Controls, batch one (form primitives and dialogs)

**Files:**
- Create via port: `src/control/{button,switch,text-input,text-area,number-input,use-modal-dialog,confirm-modal}/`

**Interfaces:**
- Produces: the components and types exactly as Bookplate's `control/index.ts` exports them for these seven folders.

- [ ] **Step 1: Port the seven folders** in that order (confirm-modal depends on button and use-modal-dialog).
- [ ] **Step 2: Run `npx vitest run src/control && npm run lint`** — Expected: PASS. If `port.mjs` printed `UNMAPPED`, the module is domain-bound and the spec's list is wrong: stop and report rather than hand-fix.
- [ ] **Step 3: Diff check**: `for f in $(find src/control -name style.ts); do diff <(sed -E "s#from '[^']*'#from X#" $f) <(sed -E "s#from '[^']*'#from X#" ~/code/bookplate/app/client/src/${f#src/}); done` prints nothing.
- [ ] **Step 4: Commit** — `feat(control): port button, switch, inputs, modal dialog hook, confirm modal`.

### Task 5: Controls, batch two (composite and page-action controls)

**Files:**
- Create via port: `src/control/{popover,select,segmented-control,chips-input,date-time-input,field-list,action-menu-list,back-button,page-actions-bar,page-actions-menu,page-footer-actions}/`
- Create: `src/control/index.ts`

**Interfaces:**
- Produces: `src/control/index.ts` exporting, from Bookplate's `control/index.ts`, exactly the lines for the 18 ported folders (value and type exports), nothing else.

- [ ] **Step 1: Port the eleven folders** (popover before select; action-menu-list before page-actions-menu).
- [ ] **Step 2: Run `npx vitest run src/control && npm run lint`** — Expected: PASS. Same `UNMAPPED` rule as Task 4.
- [ ] **Step 3: Repeat the Task 4 diff check** over all of `src/control` — prints nothing.
- [ ] **Step 4: Write `src/control/index.ts`** and add `export * from './control'` to `src/index.ts`.
- [ ] **Step 5: Run `npm run build`** — Expected: PASS; `dist/control/index.d.ts` lists `Button`, `Select`, `SegmentedControl`.
- [ ] **Step 6: Commit** — `feat(control): port popover, select, segmented control, chips, date-time, field list, page actions`.

### Task 6: Components, batch one (surfaces and text)

**Files:**
- Create via port: `src/component/{card,card-divider,card-row,collapsible-section,empty-state,meta-line,metadata,metadata-list,progress-indicator,tag,top-fade,theme-setting}/`
- Create via copy from Scribe: `src/component/empty-state/index.test.tsx`, `src/component/card-row/index.test.tsx` (from `~/code/scribe-server/app/client/src/component/{empty-state,card-row}/index.test.tsx`; rewrite `~/test-utils` to `../../test-utils`)
- Modify: `src/component/theme-setting/index.test.tsx`

**Interfaces:**
- Produces: these twelve components as Bookplate exports them.

- [ ] **Step 1: Port the twelve folders**; copy the two Scribe tests.
- [ ] **Step 2: Rewrite `theme-setting/index.test.tsx`**: drop `makeJwt`/`setToken`; the persistence case renders `renderWithProviders(<ThemeSetting />, { identity: 'alice' })` and still asserts `localStorage.getItem('theme-setting:alice') === 'dark'`.
- [ ] **Step 3: Run `npx vitest run src/component && npm run lint`** — Expected: PASS.
- [ ] **Step 4: Task 4 diff check over `src/component`** — prints nothing.
- [ ] **Step 5: Commit** — `feat(component): port card family, empty state, metadata, tag, top fade, theme setting`.

### Task 7: Hooks and navigation layouts

**Files:**
- Create via port: `src/hooks/{use-minimize-on-scroll.ts,use-minimize-on-scroll.test.tsx,use-pull-to-refresh.ts,use-pull-to-refresh.test.tsx,is-standalone.ts,is-standalone.test.ts}` from `lib/*`, `src/hooks/index.ts`
- Create via port: `src/component/{nav-desktop,nav-mobile}/`, `src/component/nav-types.ts` from `component/nav/types.ts`

**Interfaces:**
- Produces: `src/hooks/index.ts` exporting `useMinimizeOnScroll`, `MINIMIZE_SPEED`, `EXPAND_AFTER`, type `MinimizeOnScroll`, `usePullToRefresh`, `PULL_THRESHOLD`, types `PullPhase`, `PullState`, `isStandalone`.
- Produces: `NavDesktop`, `NavMobile`, type `NavItem` (from `src/component/nav-types.ts`; the two layouts' `from '../nav/types'` imports are rewritten to `'../nav-types'`).

- [ ] **Step 1: Port the three hooks and their tests**; write `src/hooks/index.ts`; add `export * from './hooks'` to `src/index.ts`.
- [ ] **Step 2: Run `npx vitest run src/hooks`** — Expected: PASS.
- [ ] **Step 3: Port `nav-desktop`, `nav-mobile`, and `nav/types.ts` as `nav-types.ts`**; fix the two relative imports.
- [ ] **Step 4: Run `npx vitest run src/component && npm run lint`** — Expected: PASS.
- [ ] **Step 5: Commit** — `feat: port scroll and pull hooks, standalone check, nav layouts`.

### Task 8: Page with `documentTitle` and `bottomNav`

**Files:**
- Create via port, then modify: `src/component/page/{index.tsx,style.ts,index.test.tsx}`
- Create: `src/component/index.ts`

**Interfaces:**
- Produces: `Page` props = Bookplate's (`type`, `back`, `headerActions`, `actionsLabel`, `header`, `footerActions`) plus `documentTitle?: string` and `bottomNav?: boolean` (default `false`).
- Produces: `src/component/index.ts` exporting the 17 ported component folders' lines from Bookplate's `component/index.ts` plus `NavDesktop`, `NavMobile`, `type NavItem`.

- [ ] **Step 1: Port `component/page/`**. It will not compile: `useLibraryName` is unmapped. That is expected here only.
- [ ] **Step 2: Extend `index.test.tsx`** with: `sets document.title when documentTitle is given` (`document.title === 'Scribe'`); `leaves document.title alone when documentTitle is absent` (set `document.title = 'before'` first, assert unchanged); `adds the bottom-nav clearance class only when bottomNav is set` (`main.className` matches `/bottomNav/` with the prop, not without).
- [ ] **Step 3: Run `npx vitest run src/component/page`** — Expected: FAIL (compile error, then the three new cases).
- [ ] **Step 4: Modify `index.tsx`**: remove the `~/provider/config` import; add the two props; `useEffect(() => { if (documentTitle !== undefined) document.title = documentTitle; }, [documentTitle])`; `className={cx(styles[type], { [styles.bottomNav]: bottomNav })}` (import `cx` from classnames).
- [ ] **Step 5: Modify `style.ts`**: in `[PageType.default]`'s mobile block set `paddingBottom` to `calc(${theme.space.xxxxxl} + env(safe-area-inset-bottom))` (Scribe's current value; verify against `~/code/scribe-server/app/client/src/component/page/style.ts`), and add a `bottomNav` rule whose mobile block carries Bookplate's original `paddingBottom: calc(${theme.layout.navHeightMobile} + ${theme.space.xxxxxl} + ${theme.space.xxl} + env(safe-area-inset-bottom))` with its comment moved along. `bottomNav` must be declared after `[PageType.default]` so it wins the cascade.
- [ ] **Step 6: Run `npx vitest run src/component && npm run lint`** — Expected: PASS.
- [ ] **Step 7: Write `src/component/index.ts`**; `export * from './component'` in `src/index.ts`; run `npm run build` — Expected: PASS.
- [ ] **Step 8: Commit** — `feat(component): port Page with documentTitle and bottomNav props`.

### Task 9: Exports map and smoke test

**Files:**
- Modify: `package.json`, `src/index.ts`, `src/theme/index.ts`, `src/icon/index.ts`, `src/toast/index.ts`
- Create: `scripts/smoke-exports.sh`

**Interfaces:**
- Produces: `exports` with `.`, `./theme`, `./control`, `./component`, `./icon`, `./toast`, `./hooks`, each `{ "types": "./dist/<p>/index.d.ts", "default": "./dist/<p>/index.js" }` (root uses `./dist/index.*`). `src/index.ts` re-exports all six subpaths flat.
- Produces: `npm run smoke` exits 0 only when the packed tarball installs into a scratch Vite project, `tsc --noEmit` passes on a file importing one symbol from each subpath (`ThemeProvider`, `Button`, `Page`, `CheckIcon`, `useToast`, `isStandalone`, and `applyTransparency` from the root), and `npm ls react react-jss` reports exactly one version of each.

- [ ] **Step 1: Write `scripts/smoke-exports.sh`** (`set -euo pipefail`; `npm pack --pack-destination "$tmp"`; scratch `package.json` with the five peers, `typescript`, `@types/react`; `npm i`; `tsc --noEmit --moduleResolution bundler --module esnext --jsx react-jsx --strict --skipLibCheck index.ts`; the `npm ls` check). Add `"smoke": "npm run build && bash scripts/smoke-exports.sh"`.
- [ ] **Step 2: Run `npm run smoke`** — Expected: FAIL, subpath not exported.
- [ ] **Step 3: Add the `exports` map**; complete the barrels.
- [ ] **Step 4: Run `npm run smoke`** — Expected: PASS.
- [ ] **Step 5: Commit** — `feat: subpath exports and packaging smoke test`.

### Task 10: CI, publish workflow, repo docs

**Files:**
- Create: `.github/workflows/ci.yml`, `.github/workflows/publish.yml`, `README.md`, `CHANGELOG.md`, `CLAUDE.md`

- [ ] **Step 1: Write `ci.yml`**: triggers `push: branches: [main]` and `pull_request`; one job on `ubuntu-latest`, Node 24 with npm cache, steps `npm ci`, `npm run lint`, `npm test`, `npm run smoke`. Pin `actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0` (v7.0.0) and `actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e` (v6.4.0) as Bookplate does. `permissions: contents: read`.
- [ ] **Step 2: Write `publish.yml`**: trigger `push: tags: ['v*.*.*']`; `permissions: { contents: read, id-token: write }`; same gate steps; `setup-node` with `registry-url: https://registry.npmjs.org`; a step asserting `v$(node -p "require('./package.json').version")` equals `$GITHUB_REF_NAME`; then `npm publish --access public --provenance` with `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}`.
- [ ] **Step 3: Write `README.md`**: install line, peer list, provider wiring (`ThemeProvider identity` wrapper pattern with a seven-line example reading a consumer's token lib, then `ToastProvider`), the subpath table from the spec, `npm run gallery`. `CHANGELOG.md`: `## 0.1.0 — unreleased` with one line per ported group and the three new props. `CLAUDE.md`: the rules from the spec's Documentation section plus "run `npm run smoke` before tagging".
- [ ] **Step 4: Push the branch and open a PR**; CI must be green before merge.
- [ ] **Step 5: Commit** — `ci: lint, test and smoke on PR; publish on tag` and `docs: README, changelog, repo rules`.

### Task 11: Gallery

**Files:**
- Create: `gallery/vite.config.ts`, `gallery/index.html`, `gallery/main.tsx`, `gallery/app.tsx`, `gallery/page/{tokens,controls,components,icons}.tsx`

**Interfaces:**
- Consumes: everything through `@korzun/design/*` imports, resolved by a Vite alias `@korzun/design` → `../src` in `gallery/vite.config.ts` so gallery code reads like consumer code.

- [ ] **Step 1: Write `gallery/vite.config.ts`** (`root: __dirname`, `plugins: [react()]`, the alias, `server.host: true`).
- [ ] **Step 2: Write `main.tsx`/`app.tsx`**: `BrowserRouter` > `ThemeProvider identity="gallery"` > `ToastProvider`; a sidebar of four links; `ThemeSetting` rendered at the top of every page.
- [ ] **Step 3: Write the four pages**: tokens (colour swatches per `color.*` group in a grid with the token path under each; `space`, `radius`, `fontSize`, `shadow` rendered as labelled rows); controls (each of the 18 in default/disabled/loading/danger as applicable, with a toast-firing `Button`); components (each of the 17 with representative props; `Page` shown with and without `bottomNav` inside a 390px-wide frame); icons (grid of every icon with its export name).
- [ ] **Step 4: Run `npm run gallery`**, open it, switch Light/Dark/Auto: every page renders without console errors in both modes. Run `npm run lint` — Expected: PASS (`gallery` is in the lint globs).
- [ ] **Step 5: Commit** — `feat(gallery): dev-only gallery of tokens, controls, components and icons`.

### Task 12: Philosophy and token docs

**Files:**
- Create: `docs/philosophy.md`, `docs/tokens.md`

- [ ] **Step 1: Write `docs/philosophy.md`**: one `##` per rule, each with a **Rule** line and a **Why** paragraph quoting or paraphrasing the source comment and naming its file. Start from the nine rules in the spec's Documentation section, then read every comment block in `src/theme/theme.ts`, `src/control/button/style.ts`, `src/component/page/style.ts`, `src/toast/style.ts` and Bookplate's `brand/README.md`, adding a rule for each principle stated there that the code enforces. Nothing goes in that the code does not do.
- [ ] **Step 2: Write `docs/tokens.md`**: one `##` per token group listed in the spec, one-line intent, then the keys; a final section "Slated for curation" naming `color.chip.*` and `size.metadataValue`.
- [ ] **Step 3: Commit** — `docs: design philosophy and token reference`.

### Task 13: Release 0.1.0

Precondition: `NPM_TOKEN` secret present; owner confirms.

- [ ] **Step 1: Edit `CHANGELOG.md`** heading to `## 0.1.0 — 2026-MM-DD`; `version` is already `0.1.0`. Commit `release: 0.1.0`, merge to `main`.
- [ ] **Step 2: Tag and push**: `git tag v0.1.0 && git push origin v0.1.0`.
- [ ] **Step 3: Verify**: the publish workflow is green and `curl -s https://registry.npmjs.org/@korzun%2Fdesign | grep -o '"latest":"[^"]*"'` prints `"latest":"0.1.0"`.

### Task 14: Scribe migration

**Files** (in `~/code/scribe-server`, branch `design-system` off `plan-2-mcp-and-jobs`):
- Modify: `app/client/package.json`, `app/client/src/control/index.ts`, `app/client/src/component/index.ts`, `app/client/src/test-utils.tsx`, `app/client/src/App.tsx`, every file listed by `grep -rlE "from '~/(provider/theme|provider/toast|control|component|icon)" app/client/src`
- Delete: `app/client/src/provider/theme/*` (replaced by one file), `app/client/src/provider/toast/`, `app/client/src/control/{button,text-input,switch,confirm-modal,use-modal-dialog}/`, `app/client/src/component/{card,card-row,empty-state,page}/`, `app/client/src/icon/`
- Create: `app/client/src/provider/theme/index.tsx`, `app/client/src/provider/theme/index.test.tsx`

**Interfaces:**
- Produces: Scribe's `ThemeProvider({ children })` wrapper: `useState(currentIdentity)`, an effect subscribing to `TOKEN_CHANGED_EVENT` from `~/lib/token` that updates it, rendering `@korzun/design/theme`'s `ThemeProvider` with `identity`.

- [ ] **Step 1: Branch**: `git checkout -b design-system plan-2-mcp-and-jobs`. `npm i -w app/client @korzun/design@^0.1.0`.
- [ ] **Step 2: Write `provider/theme/index.test.tsx`**: `setToken(makeJwt({ owner: true, iat: 1, exp: 9999999999 }))` inside `act`, render the wrapper with a probe using `useThemeSetting`, choose dark, assert `localStorage.getItem('theme-setting:owner') === 'dark'`; `clearToken()` inside `act`, assert the probe reads `auto`.
- [ ] **Step 3: Delete the listed directories**; write the wrapper. Run `npx vitest run src/provider/theme` — Expected: PASS.
- [ ] **Step 4: Rewrite imports** across the grep list: `~/provider/theme` → `@korzun/design/theme` (except `App.tsx` and `test-utils.tsx`, which keep the wrapper), `~/provider/toast` → `@korzun/design/toast`, `~/icon` → `@korzun/design/icon`; in `~/control`/`~/component` import lines, split `Button`, `ConfirmModal`, `Switch`, `TextInput`, `Card`, `CardRow`, `EmptyState`, `Page` out into `@korzun/design/control` / `@korzun/design/component` lines and remove those exports from the two local barrels.
- [ ] **Step 5: Add `documentTitle="Scribe"`** to the seven `<Page` usages (`page/{connect,reset,recover,login,loading,dashboard,setup}/index.tsx`). `test-utils.tsx` imports `ToastProvider` from `@korzun/design/toast` and `ThemeProvider` from `./provider/theme` (the wrapper, so tests keep deriving identity from the token).
- [ ] **Step 6: Run `npm run lint && npm test` in `app/client`** — Expected: PASS. `grep -rn "~/icon\|provider/toast'" src` prints nothing.
- [ ] **Step 7: Visual check** with `make dev` (or the devcontainer): login, setup and dashboard pages in light and dark, desktop and a phone-width viewport, match the `plan-2-mcp-and-jobs` build. The document title reads "Scribe".
- [ ] **Step 8: Commit** `refactor(client): consume @korzun/design instead of copied UI modules`; open a PR against `plan-2-mcp-and-jobs` (or `main` once PR #3 has merged).
