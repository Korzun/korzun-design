# Story-based gallery for `@korzun/design`

**Date:** 2026-11-17
**Status:** approved by the owner 2026-11-17
**Builds on:** `docs/superpowers/specs/2026-11-14-design-system-extraction-design.md` (the package and its current `gallery/`)

## Intent

Turn the hand-written `gallery/` into a story-based component explorer in the spirit of [Ladle](https://ladle.dev): every control and component rendered in isolation, its props adjustable live, light and dark switchable, phone/tablet/desktop widths selectable, each story reachable by URL. It is the owner's way of looking at the library before and during the Scribe and Bookplate migrations, and it gives the assistant (who has no browser on the Pi) a mechanical check that every story still mounts.

The gallery is a development tool of this repo. Nothing from it enters the npm tarball.

## Why now

0.0.2 is published and validated. The next step is migrating Scribe onto the package. The owner wants to see and interact with what they are about to depend on first, and wants visual checks to be cheaper for both of them from here on.

## Goals

- One stories file per control, component, the icon set, and toast, colocated with the module like its test.
- A shell that lists stories, renders one at a time, and offers: light/dark/auto, width presets, a props panel generated from the story's declared arg types, an action log for callback props, and an "all stories" contact sheet.
- Stories addressable by URL, so a link identifies exactly what to look at.
- A jsdom test that mounts every discovered story and fails on a throw or a `console.error`.
- A static build, deployed to GitHub Pages on each push to `main`, so the gallery opens from any device without the Pi's dev server.
- The existing tokens page kept as a reference page beside the stories.

## Non-goals

- Accessibility audits, source-code view, mock service worker, MDX docs pages: Ladle extras we don't need now.
- Lazy loading / code splitting of stories; the library is small.
- Visual snapshot testing; a later round once Chromium on the Pi is confirmed possible.
- Any change to shipped component code to suit the gallery. Styles stay byte-equivalent to Bookplate (CLAUDE.md rule).
- A version bump or release: nothing shipped changes.

## Anti-goals

- Adding Ladle or Storybook as a dependency (the owner chose to avoid a new dependency; Ladle's latest release pins Vite 6 beside our Vite 8).
- Stories or gallery code appearing in `dist/` or the tarball.
- Stories importing the `control` or `component` barrels (circular-import rule in CLAUDE.md).

## Constraints

- Toolchain as-is: Vite 8, Vitest 4, React 19, react-jss 10, react-router 8 (already a peer and used by the gallery), TypeScript 7, oxlint/oxfmt. No new runtime or dev dependencies.
- No browser on the build machine. The all-stories jsdom test is the assistant's verification; the owner does the visual pass via the Pages URL or `npm run gallery`.
- `npm run lint`, `npm test`, `npm run smoke` stay green; CI runs them on every PR.
- `files`, `tsconfig.build.json`, and the `smoke` tarball check must exclude stories exactly as they exclude tests today.

## Approaches considered

| | Approach | Trade-off | Decision |
|---|---|---|---|
| A | Grow the existing gallery into a story runner on our Vite 8 setup, using the package's own controls for the shell | We own a few hundred lines of explorer code and skip Ladle's extras | **Chosen by the owner** |
| B | Ladle 5.1.1 | Least code, polished UI; but ships its own Vite 6 and plugin-react 4 beside our Vite 8, needs a separate config, has an open HMR bug with newer Vite, and its last release is from November 2025 (main moved to Vite 8 in June 2026, unreleased) | Rejected: new frozen dependency |
| C | Storybook 10 | Current and rich (interaction tests, a11y); heavy dependency tree and its own build pipeline | Rejected: too heavy for a one-person library |

## Design

### Story files

- Location: `src/<group>/<module>/<module>.stories.tsx`, e.g. `src/control/button/button.stories.tsx`. Icons: `src/icon/icons.stories.tsx`. Toast: `src/toast/toast.stories.tsx`. Hooks get no stories in this round.
- Excluded from the package the same way tests are: `!src/**/*.stories.*` in `package.json` `files`, and `src/**/*.stories.*` in `tsconfig.build.json` `exclude`. The smoke test's tarball listing must show none.
- Format mirrors Ladle's CSF subset so a later move would be a file move:

```tsx
import type { Story, StoryDefault } from '@gallery/story';

import { Button, type ButtonProps } from './index.js';

export default {
  title: 'Control / Button',
  args: { variant: 'primary', disabled: false, children: 'Save' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    onClick: { control: 'action' },
  },
} satisfies StoryDefault<ButtonProps>;

export const Primary: Story<ButtonProps> = (args) => <Button {...args} />;
export const Loading: Story<ButtonProps> = (args) => <Button {...args} loading />;
Loading.storyName = 'Loading state';
```

- A story is a component receiving the merged args (file-level `args`, then `Story.args`). Story-level `args`/`argTypes` override file-level ones.
- Story id = kebab-cased title segments joined with `/`, plus the export name: `control/button/primary`. Title and export name must be string literals. Duplicate ids are a test failure.
- Stories import their own module relatively (`./index.js`), like tests. The only non-relative import allowed in a story is `@gallery/*` (types and small story helpers). **Assistant's call:** a `@gallery` alias rather than `../../../gallery/story.js` paths, because the relative form is fragile and ugly in forty files. The alias is declared in three places that must agree: `gallery/alias.ts` (consumed by both `gallery/vite.config.ts` and the root `vite.config.ts` for Vitest) and `tsconfig.json` `paths`. Stories are type-checked by `tsc --noEmit` against `gallery/` through that path; `tsconfig.build.json` excludes them so `rootDir: src` is unaffected. CLAUDE.md's "relative imports only" rule gets this one exception written in.
- **Controlled components** (`TextInput`, `Select`, `Switch`, `ChipsInput`, `SegmentedControl`, `FieldList`, `DateTimeInput`, `NumberInput` and the like) keep their `value` in story-local `useState`, seeded once from args, exactly as the current gallery pages do. `value` and `onChange` are **not** exposed as arg types; the panel drives the surrounding props (label, placeholder, disabled, error, variant). **Assistant's call:** the alternative, the shell owning `value` and every keystroke travelling through `postMessage` and the URL, makes typing in the story laggy and complicates every story file for no gain. A small `useArgState(args.value)` helper in `@gallery/story` may wrap the pattern.
- **Complex props** (`string[]` chips, `FieldRow[]`, option objects with icons, `NavItem[]`) are fixed story-local fixtures with no arg control; they live in the story file or in `gallery/fixtures.ts` (`@gallery/fixtures`) when shared.
- **Stories without adjustable props** (toast via `useToast`; `ConfirmModal`, `Popover`, `PageActionsMenu` that open from a trigger) are a small wrapper with a trigger button and empty `argTypes`. The panel then shows its empty-state text.

### Arg types (the props panel)

Supported `control` kinds, each rendered with the package's own control: `boolean` (Switch), `text` (TextInput), `number` (NumberInput, with optional `min`/`max`/`step`), `select` (Select, with `options`), `action` (a logged callback, no input). Anything else (`radio`, `background`, `object`) is out of scope; the type definition rejects it.

Changing a control updates the rendered story live and is reflected in the URL (`?args=` JSON, so a link reproduces the state). `action` args append a line to an **Actions** log beside the props panel: timestamp, arg name, and a JSON of the call's arguments (DOM events reduced to their `type`).

### Discovery

`gallery/stories.ts` collects stories with `import.meta.glob('../src/**/*.stories.tsx', { eager: true })`, validates each module (default export with a string `title`; every other export a function), and produces a flat list of `{ id, title, group path, name, component, args, argTypes }`. Eager loading keeps the jsdom test and the contact sheet simple; code splitting is a non-goal.

### Shell

Hash-based routing (`HashRouter`), so the static build works on GitHub Pages without a 404 rewrite. Routes:

- `#/` → redirects to the first story.
- `#/story/<id>?theme=&width=&args=` → the main view (below).
- `#/preview/<id>?theme=&args=` → the bare story with providers only, no shell. Used inside the main view's iframe and handy for screenshots.
- `#/all` → contact sheet: every story rendered inline at natural width with its title, grouped as in the sidebar. No iframes here. A stories file whose components take over the viewport or depend on media-query layout (`Page`, `NavMobile`, `NavDesktop`, `TopFade`) sets `sheet: false` in its default export and is listed on the sheet as a link to its story view instead of being rendered. Trigger-opened stories (modals, popovers) render closed, so they stay on the sheet.
- `#/tokens` → the existing tokens page, unchanged in content.

Main view layout, desktop:

```
┌──────────────┬──────────────────────────────────────┬──────────────────┐
│ @korzun/     │  Control / Button / Primary          │ Props            │
│ design       │  [Light|Dark|Auto]  [Fill|414|768|1024] │ variant  [select]│
│ [search…]    │ ┌──────────────────────────────────┐ │ disabled [switch]│
│ ▾ Control    │ │                                  │ │ children [text]  │
│   ▾ Button   │ │   <iframe: #/preview/…>          │ │                  │
│     Primary  │ │                                  │ │ Actions          │
│     Loading  │ │                                  │ │ 12:01 onClick    │
│   TextInput  │ └──────────────────────────────────┘ │   {type:"click"} │
│ ▸ Component  │                                      │                  │
│ Icon · Toast │                                      │                  │
│ All · Tokens │                                      │                  │
└──────────────┴──────────────────────────────────────┴──────────────────┘
```

- **Sidebar:** brand, a search box filtering by title and story name, a collapsible tree built from title segments, and links to All and Tokens. Current story highlighted. Built with the package's `TextInput`, `CollapsibleSection`, and theme tokens.
- **Toolbar:** breadcrumb of the story, `ThemeSetting`-style segmented control for light/dark/auto, segmented control for width presets Fill, 414 (phone), 768 (tablet), 1024 (desktop).
- **Canvas:** an `<iframe>` pointing at `#/preview/<id>` sized to the width preset and filling the available height. **Assistant's call:** iframe rather than an inline sized container, because `Page`, `NavMobile`/`NavDesktop` and others switch layout on CSS media queries, which only an iframe's own viewport triggers. The preview reads `theme` and `args` from its URL on load and then receives live updates from the shell via `postMessage` (same origin), so typing in the props panel does not reload the frame. The shell and preview run two React trees with **different theme identities**: the shell keeps `identity="gallery"`, the preview uses `identity="gallery-preview"`, so the two `ThemeProvider`s write different `localStorage` keys and cannot fight. A small component inside the preview calls `useThemeSetting()`'s setter whenever the `theme` URL parameter or a theme message from the shell changes. Shipped `src/` code is untouched; the provider's existing `identity` prop is enough.
- **Props panel:** generated from `argTypes` as above; empty state text when a story declares none. The **Actions** log sits below it with a Clear button.
- Mobile layout of the shell itself (sidebar collapses behind a button) is left to the builder; the gallery is used mostly on a laptop.

### Tests

- `gallery/stories.test.tsx`: for every discovered story, including those with `sheet: false`, render it inline (no iframe) inside `ThemeProvider identity="gallery"`, `ToastProvider`, and `MemoryRouter`, with the same jsdom `HTMLDialogElement` stubs the current gallery test uses. Assert no throw and `console.error` not called. Also assert story ids are unique and every `argTypes` key exists in `args` (so the panel never shows an undefined control).
- `scripts/smoke-exports.sh` gains one assertion: the packed tarball's file list contains no `*.stories.*` and no `*.test.*` entry. That is the mechanism behind "the tarball must show none".
- `gallery/app.test.tsx`: shell routes render (`/`, `/story/<first>`, `/all`, `/tokens`), the search filters the tree, changing a boolean control updates the URL.
- Existing `src/**` tests untouched.

### Build and deploy

- `npm run gallery` unchanged (dev server, host exposed on the LAN as today).
- `npm run gallery:build`: `vite build --config gallery/vite.config.ts`, output `gallery-dist/` (gitignored). `base` comes from `GALLERY_BASE` env (default `/`; Pages sets `/korzun-design/`).
- `.github/workflows/gallery.yml`: on push to `main` and on `workflow_dispatch`, `npm ci`, `npm run gallery:build` with `GALLERY_BASE=/korzun-design/`, then `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages` with pinned SHAs like the other workflows. `permissions: pages: write, id-token: write`. The repo is public, so Pages is available on the free plan. **Owner step, before the PR merges:** enable Pages in the repo settings with source "GitHub Actions"; otherwise the first run on `main` fails and `main` shows red until it is enabled and the workflow is re-dispatched. URL: `https://korzun.github.io/korzun-design/`.
- **Assistant's call:** Pages is in scope as the last task because it is the piece that makes "look at it from anywhere" true; it can be dropped by skipping that task.

### Migration of the current gallery

- Each `<Section>` in `gallery/page/controls.tsx` and `gallery/page/components.tsx` becomes one or more stories in the module's stories file, carrying over the sample data (`FRUITS`, `SEGMENTS`, `NAV_ITEMS`, `metaItems`, etc.) into the story file or a shared `gallery/fixtures.ts` imported via `@gallery/fixtures`.
- `gallery/page/icons.tsx` becomes `src/icon/icons.stories.tsx` (one story rendering the grid of all icons; a second with the filled/stroke default prop sets).
- `gallery/page/tokens.tsx` stays as the Tokens page.
- The three replaced page files and the old routes are deleted in the same change, so there is never two ways to show a component.

### Docs and rules

- README "Gallery" section: how to run, how to add a story, the Pages URL.
- CLAUDE.md: the rule "Every new or changed control and component gets a test and a gallery entry" becomes "…a test and a stories file (`*.stories.tsx` beside it)"; the `@gallery/*` exception to the relative-imports rule; `gallery/` description updated.
- `docs/philosophy.md` and `docs/tokens.md` unchanged.
- No CHANGELOG entry and no version bump: nothing published changes. The tarball exclusions are verified by the smoke test rather than described to consumers.

## What's left to the builder

- Exact id derivation and sorting of the tree (alphabetical within a group is fine).
- Panel component layout and spacing, using existing tokens.
- How the shell and preview exchange messages (a small typed message union is expected).
- The shell's mobile layout.
- Which stories each module gets beyond one default, guided by what the current gallery sections show (variants, states, with/without optional props).
- Width preset numbers may follow the package's own `breakpoint` tokens if they map cleanly.

## Open items for the owner

None blocking. Enabling GitHub Pages in the repo settings (source: GitHub Actions) is the one owner step, to be done before the PR merges so the first deploy on `main` succeeds.

## Builder check

A fresh reviewer read the draft as the builder and asked five questions; all were settled in this document without owner input: controlled inputs keep story-local state (not panel-driven); complex props are fixtures; trigger-opened and prop-less components are wrapper stories with empty `argTypes`; `sheet: false` keeps viewport-dependent stories off the contact sheet; the preview iframe uses its own theme identity; the alias lives in three places; the smoke test asserts the tarball exclusions; Pages is enabled before merge and the deploy workflow is also manually dispatchable.
