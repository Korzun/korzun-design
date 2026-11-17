# Story-based Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-written gallery pages with colocated `*.stories.tsx` files rendered by a story explorer (sidebar, iframe canvas with theme and width controls, generated props panel, action log, contact sheet), tested by mounting every story in jsdom and deployed to GitHub Pages.

**Architecture:** Stories are discovered with `import.meta.glob` into a flat `StoryEntry[]` (`gallery/stories.ts`). The shell (`gallery/shell/*`) runs under a `HashRouter`; a story is rendered in an `<iframe>` pointing at a bare `#/preview/<id>` route, and the two windows exchange typed `postMessage`s (`gallery/messages.ts`) for live args, theme, and action logging. Shell and preview use different `ThemeProvider` identities. The tokens page stays as a reference page.

**Tech Stack:** Vite 8, Vitest 4 + jsdom + Testing Library, React 19, react-router 8 (`HashRouter`, `MemoryRouter` in tests), react-jss via the package's own `createUseStyles`, the package's own controls for the shell UI. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-17-story-gallery-design.md`

## Global Constraints

- No new runtime or dev dependencies; no Ladle, no Storybook.
- Shipped code under `src/` (everything except `*.stories.tsx`) is not modified. Styles stay byte-equivalent to Bookplate.
- Stories import their own module relatively (`./index.js`) and never the `control`/`component` barrels. The only non-relative import in a story is `@gallery/*`.
- Stories and gallery code never reach `dist/` or the tarball: `package.json` `files` has `!src/**/*.stories.*`, `tsconfig.build.json` excludes `src/**/*.stories.*`, and `scripts/smoke-exports.sh` fails on any `*.stories.*` or `*.test.*` entry in the tarball.
- `npm run lint` (oxlint + oxfmt + `tsc --noEmit`), `npm test`, `npm run smoke` green at the end of every task. The two pre-existing oxlint warnings (`src/control/switch/index.tsx:33`, `src/hooks/use-pull-to-refresh.ts:55`) are not regressions.
- Story id = kebab-cased title segments split on `/`, joined with `/`, plus `/` and the kebab-cased export name. Example: title `Control / Button`, export `WithIcons` → `control/button/with-icons`.
- Supported arg controls: `boolean`, `text`, `number` (optional `min`, `max`, `step`), `select` (`options: readonly string[]`), `action`. Nothing else.
- Width presets: `fill`, `414`, `768`, `1024`; default `fill`. Theme values: `light`, `dark`, `auto`.
- Shell `ThemeProvider identity="gallery"`; preview `ThemeProvider identity="gallery-preview"`.
- Hash routing: `#/` → first story, `#/story/<id>?theme=&width=&args=`, `#/preview/<id>?theme=&args=`, `#/all`, `#/tokens`.
- Static build output `gallery-dist/` (gitignored). Pages build uses Vite `--mode pages` with `base: '/korzun-design/'`.
- Commit messages end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- No version bump, no CHANGELOG entry.

## Review Focus

1. Two stories whose titles and export names kebab to the same id (e.g. `Control / Button` + `WithIcons` in one file and `Control/Button` + `WithIcons` in another) must fail discovery loudly, not silently shadow one another. `storyName` changes the display name only, never the id. Test in Task 1.
2. A hand-edited or stale `?args=` value that is not valid JSON, or not an object, must leave the story rendering with its default args rather than crashing the shell. Test in Task 6.
3. A `#/story/<id>` or `#/preview/<id>` whose id matches nothing (a story was renamed) must render a "Story not found" message with a link to the first story, not throw. Tests in Tasks 4 and 6.
4. A `message` event from another origin, or a same-origin message that is not one of ours, must be ignored by both shell and preview. Test in Task 4.
5. An `action` arg invoked with a DOM event, a React element, or a circular object must log without throwing (`serializeActionArgs` reduces events to `{ type }` and falls back to `String(value)`). Test in Task 4.

---

## File structure

```
gallery/
  alias.ts            modify: add galleryAlias (`@gallery` → gallery/)
  story.ts            new: Story, StoryDefault, ArgType, ArgTypes types
  stories.ts          new: collectStories, stories, storyById, resolveArgs, storyTree, toKebab
  fixtures.ts         new: FRUITS, SEGMENTS, ICON_SEGMENTS, NAV_ITEMS, FIELD_COLUMNS
  messages.ts         new: postMessage protocol + serializeActionArgs + guards
  preview.tsx         new: `#/preview/*` route (bare story + providers + ThemeSync)
  shell/
    sidebar.tsx       new: brand, search, tree, All/Tokens links
    toolbar.tsx       new: breadcrumb, theme segmented control, width segmented control
    canvas.tsx        new: iframe sized by width preset, posts args/theme, receives actions
    props-panel.tsx   new: controls from argTypes
    actions-log.tsx   new: action list + Clear
    story-view.tsx    new: `#/story/*` route composing toolbar/canvas/panel/log, owns URL state
  all.tsx             new: `#/all` contact sheet
  app.tsx             modify: HashRouter, new routes, shell layout
  app.test.tsx        modify: new route/behaviour tests
  stories.test.tsx    new: discovery unit tests + mount-every-story + coverage
  page/tokens.tsx     keep
  page/controls.tsx   delete (Task 7)
  page/components.tsx delete (Task 7)
  page/icons.tsx      delete (Task 7)
  vite.config.ts      modify: base by mode, build.outDir, galleryAlias
src/**/<module>.stories.tsx   new: 31 story files (Tasks 1–3)
vite.config.ts        modify: galleryAlias for Vitest
tsconfig.json         modify: paths `@gallery/*`
tsconfig.build.json   modify: exclude stories
package.json          modify: files exclusion, gallery:build scripts
scripts/smoke-exports.sh   modify: tarball assertion
.gitignore            modify: gallery-dist/
.github/workflows/gallery.yml   new: Pages deploy
README.md, CLAUDE.md  modify
```

---

### Task 1: Story contract, discovery, first story, tarball exclusion

**Files:**
- Create: `gallery/story.ts`, `gallery/stories.ts`, `gallery/stories.test.tsx`, `src/control/button/button.stories.tsx`
- Modify: `gallery/alias.ts`, `vite.config.ts`, `gallery/vite.config.ts`, `tsconfig.json`, `tsconfig.build.json`, `package.json`, `scripts/smoke-exports.sh`

**Interfaces:**
- Produces (`gallery/story.ts`):
  ```ts
  export type ArgType =
    | { control: 'boolean' }
    | { control: 'text' }
    | { control: 'number'; min?: number; max?: number; step?: number }
    | { control: 'select'; options: readonly string[] }
    | { control: 'action' };
  export type ArgTypes<P> = Partial<Record<keyof P & string, ArgType>>;
  export type StoryDefault<P = Record<string, unknown>> = {
    title: string; args?: Partial<P>; argTypes?: ArgTypes<P>; sheet?: boolean;
  };
  export type Story<P = Record<string, unknown>> = ((args: P) => ReactElement) & {
    storyName?: string; args?: Partial<P>; argTypes?: ArgTypes<P>;
  };
  ```
- Produces (`gallery/stories.ts`):
  ```ts
  export type StoryEntry = {
    id: string; title: string; path: string[]; name: string;
    component: (args: Record<string, unknown>) => ReactElement;
    args: Record<string, unknown>; argTypes: Record<string, ArgType>; sheet: boolean;
  };
  export type StoryGroup = { label: string; children: (StoryGroup | StoryEntry)[] };
  export const toKebab: (s: string) => string;
  export const collectStories: (modules: Record<string, unknown>) => StoryEntry[]; // throws Error on invalid module or duplicate id
  export const stories: StoryEntry[]; // collectStories(import.meta.glob('../src/**/*.stories.tsx', { eager: true })), sorted by id
  export const storyById: (id: string) => StoryEntry | undefined;
  export const resolveArgs: (entry: StoryEntry, overrides: Record<string, unknown>, onAction: (name: string, args: unknown[]) => void) => Record<string, unknown>;
  export const storyTree: (entries: StoryEntry[]) => StoryGroup[]; // grouped by path, alphabetical
  ```
- Produces (`gallery/alias.ts`): `export const galleryAlias: Alias[]` mapping `/^@gallery\/(.*)$/` → `${here}$1`. Both Vite configs use `[...designAlias, ...galleryAlias]`.

- [ ] **Step 1: Write the failing discovery tests** in `gallery/stories.test.tsx`

```tsx
import { collectStories, resolveArgs, toKebab } from './stories.js';

const Comp = () => <div />;

describe('toKebab', () => {
  it.each([['Button', 'button'], ['WithIcons', 'with-icons'], ['Date Time Input', 'date-time-input'], ['  Control ', 'control']])('%s → %s', (input, out) => expect(toKebab(input)).toBe(out));
});

describe('collectStories', () => {
  it('derives ids from title segments and export names', () => {
    const [s] = collectStories({ '/src/control/button/button.stories.tsx': { default: { title: 'Control / Button' }, WithIcons: Comp } });
    expect(s).toMatchObject({ id: 'control/button/with-icons', path: ['Control', 'Button'], name: 'With Icons', sheet: true });
  });
  it('merges file args/argTypes under story-level ones and honours storyName', () => {
    const Named = Object.assign(() => <div />, { storyName: 'Big one', args: { size: 'lg' } });
    const [s] = collectStories({ '/a.stories.tsx': { default: { title: 'X', args: { size: 'sm', label: 'a' }, argTypes: { size: { control: 'text' } } }, Named } });
    expect(s.name).toBe('Big one');
    expect(s.args).toEqual({ size: 'lg', label: 'a' });
    expect(s.argTypes).toEqual({ size: { control: 'text' } });
  });
  it('throws on a module without a string title', () => {
    expect(() => collectStories({ '/a.stories.tsx': { default: {}, A: Comp } })).toThrow(/title/);
  });
  it('throws on a non-function named export', () => {
    expect(() => collectStories({ '/a.stories.tsx': { default: { title: 'X' }, A: 42 } })).toThrow(/A/);
  });
  it('throws on duplicate ids across files or via storyName', () => {
    expect(() => collectStories({ '/a.stories.tsx': { default: { title: 'X' }, A: Comp }, '/b.stories.tsx': { default: { title: 'X' }, A: Comp } })).toThrow(/x\/a/);
  });
  it('returns entries sorted by id', () => {
    const ids = collectStories({ '/a.stories.tsx': { default: { title: 'B' }, Z: Comp, A: Comp } }).map((s) => s.id);
    expect(ids).toEqual(['b/a', 'b/z']);
  });
});

describe('resolveArgs', () => {
  it('applies overrides over defaults and wires action args to onAction', () => {
    const [s] = collectStories({ '/a.stories.tsx': { default: { title: 'X', args: { label: 'a', n: 1 }, argTypes: { onClick: { control: 'action' } } }, A: Comp } });
    const seen: unknown[] = [];
    const args = resolveArgs(s, { n: 2 }, (name, a) => seen.push([name, a]));
    expect(args).toMatchObject({ label: 'a', n: 2 });
    (args.onClick as (x: number) => void)(7);
    expect(seen).toEqual([['onClick', [7]]]);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run gallery/stories.test.tsx`
Expected: FAIL, cannot resolve `./stories.js`.

- [ ] **Step 3: Add the `@gallery` alias everywhere**

`gallery/alias.ts`: add `export const galleryAlias: Alias[] = [{ find: /^@gallery\/(.*)$/, replacement: `${here}$1` }];`. In `vite.config.ts` and `gallery/vite.config.ts` use `resolve: { alias: [...designAlias, ...galleryAlias] }`. In `tsconfig.json` `paths` add `"@gallery/*": ["./gallery/*"]`.

- [ ] **Step 4: Implement `gallery/story.ts` and `gallery/stories.ts`** per the Interfaces block

`collectStories`: for each module, require `default.title` string else throw `Story file ${path}: default export needs a string title`; for each other export require a function else throw `Story file ${path}: export ${name} is not a story`; `name` = `storyName ?? toKebab(exportName).split('-').map(capitalize).join(' ')`; id from title segments split on `/`, trimmed, each `toKebab`, plus `toKebab(exportName)`; throw `Duplicate story id ${id}` on a repeat; sort by id. `resolveArgs`: `{ ...entry.args, ...overrides }`, then for every `argTypes` key with `control: 'action'` set `(...a) => onAction(key, a)`. `storyTree`: fold `path` into nested groups, children sorted by label, entries after groups.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run gallery/stories.test.tsx`
Expected: PASS.

- [ ] **Step 6: Write the first story and the mount test**

`src/control/button/button.stories.tsx`:

```tsx
import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { SearchIcon } from '../../icon/search.js';
import { SettingsIcon } from '../../icon/settings.js';
import { Button } from './index.js';

type Props = ComponentProps<typeof Button>;

export default {
  title: 'Control / Button',
  args: { children: 'Save', type: 'default', disabled: false, loading: false, danger: false },
  argTypes: {
    children: { control: 'text' },
    type: { control: 'select', options: ['default', 'primary', 'text', 'link', 'dashed'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    danger: { control: 'boolean' },
    onClick: { control: 'action' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => <Button {...args} />;
export const Primary: Story<Props> = (args) => <Button {...args} type="primary" />;
export const Success: Story<Props> = (args) => <Button {...args} danger={false} success />;
export const WithIcons: Story<Props> = (args) => <Button {...args} prefix={SearchIcon} suffix={SettingsIcon} />;
```

Append to `gallery/stories.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ThemeProvider } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { stories } from './stories.js';

describe('every story mounts', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });
  it('found the button stories', () => {
    expect(stories.map((s) => s.id)).toEqual(expect.arrayContaining(['control/button/default', 'control/button/with-icons']));
  });
  it.each(stories.map((s) => [s.id, s] as const))('%s renders without console errors', (_id, s) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const Comp = s.component;
    render(
      <MemoryRouter><ThemeProvider identity="gallery"><ToastProvider><Comp {...resolveArgs(s, {}, () => {})} /></ToastProvider></ThemeProvider></MemoryRouter>
    );
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
  it('declares an arg default for every non-action argType', () => {
    for (const s of stories) for (const [k, t] of Object.entries(s.argTypes)) if (t.control !== 'action') expect(s.args, `${s.id}.${k}`).toHaveProperty(k);
  });
});
```

- [ ] **Step 7: Run the whole suite and lint**

Run: `npm test && npm run lint`
Expected: PASS; lint shows only the two known warnings.

- [ ] **Step 8: Exclude stories from the package and assert it**

`package.json` `files`: add `"!src/**/*.stories.*"`. `tsconfig.build.json` `exclude`: add `"src/**/*.stories.*"`. In `scripts/smoke-exports.sh`, right after the tarball is located:

```bash
if tar -tzf "${tarballs[0]}" | grep -E '\.(stories|test)\.[cm]?[jt]sx?$'; then
  echo "smoke: tarball contains story or test files"; exit 1
fi
```

Run: `npm run smoke`
Expected: `smoke: ok`.

- [ ] **Step 9: Commit**

```bash
git add gallery/story.ts gallery/stories.ts gallery/stories.test.tsx gallery/alias.ts vite.config.ts gallery/vite.config.ts tsconfig.json tsconfig.build.json package.json scripts/smoke-exports.sh src/control/button/button.stories.tsx
git commit -m "feat(gallery): story contract, discovery, and first story"
```

---

### Task 2: Control stories

**Files:**
- Create: `gallery/fixtures.ts` and one `src/control/<module>/<module>.stories.tsx` for each module below.

**Interfaces:**
- Consumes: `Story`, `StoryDefault` from `@gallery/story`; `resolveArgs` behaviour (action args are functions).
- Produces (`gallery/fixtures.ts`): `FRUITS = ['Apple','Banana','Cherry','Date']`; `SEGMENTS = [{value:'one',label:'One'},{value:'two',label:'Two'},{value:'three',label:'Three'}] as const`; `ICON_SEGMENTS` (search/settings with `SearchIcon`/`SettingsIcon`, imported relatively from `../src/icon/*.js`); `FIELD_COLUMNS = [{type:'text',key:'name',placeholder:'Name'},{type:'number',key:'qty',placeholder:'Qty'}]`; `NAV_ITEMS` (Home/Books/Settings with `HomeIcon`/`BookIcon`/`SettingsIcon`, `to` values `/home`, `/books`, `/settings`, badges `3` and `'dot'` as in today's gallery).

Controlled inputs hold their value in `useState` seeded from the arg (see spec). `value`/`onChange`/`checked` are never arg types. Each file's stories carry over what today's `gallery/page/controls.tsx` section shows:

| File | Title | Stories (export → notable props) | argTypes |
|---|---|---|---|
| `text-input/text-input.stories.tsx` | `Control / TextInput` | `Default`; `Validated` (`validate={(v)=>v.length>0}`, `layout="vertical"`); `Password` (`password`); `Placeholder` (empty value, `placeholder="Type here"`) | `label` text, `layout` select `['horizontal','vertical','inline']`, `placeholder` text |
| `text-area/text-area.stories.tsx` | `Control / TextArea` | `Default`; `AutoResize` (`autoResize maxLength={80}`); `Borderless` (`variant="borderless"`) | `label` text, `layout` select, `maxLength` number |
| `number-input/number-input.stories.tsx` | `Control / NumberInput` | `Default`; `Vertical` | `label` text, `layout` select |
| `date-time-input/date-time-input.stories.tsx` | `Control / DateTimeInput` | `Default` (shows chosen value under the input, `(empty)` when undefined) | `label` text |
| `select/select.stories.tsx` | `Control / Select` | `Default`; `AllowCreate`; `Disabled`; `Loading` | `label` text, `layout` select, `disabled` boolean, `loading` boolean, `allowCreate` boolean, `surface` select `['card','page']` |
| `chips-input/chips-input.stories.tsx` | `Control / ChipsInput` | `Default` (`suggestions={FRUITS}`); `Disabled` (`chipColor="author"`) | `label` text, `placeholder` text, `disabled` boolean |
| `segmented-control/segmented-control.stories.tsx` | `Control / SegmentedControl` | `Text`; `IconsClearable` (`clearable showLabels={false}`); `ReadOnly` (no onChange, value `'two'`) | `label` text, `surface` select `['card','row']` |
| `switch/switch.stories.tsx` | `Control / Switch` | `Default`; `WithDescription`; `Disabled`; `Loading` | `label` text, `description` text, `disabled` boolean, `loading` boolean, `layout` select `['default','horizontal']`, `radius` select `['inset','pill']` |
| `field-list/field-list.stories.tsx` | `Control / FieldList` | `Default` (two rows, add/change/remove in local state, columns `FIELD_COLUMNS`) | `addLabel` text |
| `confirm-modal/confirm-modal.stories.tsx` | `Control / ConfirmModal` | `Default` (button opens; `title="Confirm action"`); `Danger` (`danger confirmText="Delete" icon={SettingsIcon}`) | `title` text, `confirmText` text, `danger` boolean, `onConfirm` action, `onCancel` action |
| `popover/popover.stories.tsx` | `Control / Popover` | `Default` (anchored toggle button, `matchWidth={false}`) | `matchWidth` boolean |
| `back-button/back-button.stories.tsx` | `Control / BackButton` | `Default` (`to="/"`) | none |
| `page-actions-bar/page-actions-bar.stories.tsx` | `Control / PageActionsBar` | `Default` (five items as today's `actionItems`, `onClick`s call the `onAction` arg) | `actionsLabel` text, `onAction` action |
| `page-actions-menu/page-actions-menu.stories.tsx` | `Control / PageActionsMenu` | `Default` (same items) | `onAction` action |
| `page-footer-actions/page-footer-actions.stories.tsx` | `Control / PageFooterActions` | `Default` (Delete/Cancel/Busy/Disabled/Save as today) | `onAction` action |

Not covered: `action-menu-list` (internal), `use-modal-dialog` (exercised by ConfirmModal).

- [ ] **Step 1: Write `gallery/fixtures.ts`** per Interfaces.
- [ ] **Step 2: Write the fifteen story files** per the table. Each `export default` uses `satisfies StoryDefault<Props>` with `Props = ComponentProps<typeof X>`; every argTypes key except actions has a default in `args`.
- [ ] **Step 3: Run the suite and lint**

Run: `npm test && npm run lint`
Expected: PASS; `stories.test.tsx` lists one `renders` case per new story.

- [ ] **Step 4: Commit**

```bash
git add gallery/fixtures.ts src/control
git commit -m "feat(gallery): stories for every exported control"
```

---

### Task 3: Component, icon, and toast stories; coverage test

**Files:**
- Create: `src/component/<module>/<module>.stories.tsx` for the modules below, `src/icon/icons.stories.tsx`, `src/toast/toast.stories.tsx`
- Modify: `gallery/stories.test.tsx`

| File | Title | Stories | argTypes | `sheet` |
|---|---|---|---|---|
| `card/card.stories.tsx` | `Component / Card` | `Default` (title/subTitle/footer, rows and dividers as today); `Collapsible` (`isCollapsible defaultCollapsed`); `Small` (`size="small"`) | `title` text, `subTitle` text, `footer` text, `size` select `['small','large']`, `isCollapsible` boolean | |
| `card-divider/card-divider.stories.tsx` | `Component / CardDivider` | `Default` (three dividers inside a Card as today, including `actions={<Tag size="sm">action</Tag>}`) | `align` select `['left','center','right']` | |
| `card-row/card-row.stories.tsx` | `Component / CardRow` | `Default`; `Clickable` | `onClick` action, `children` text | |
| `collapsible-section/collapsible-section.stories.tsx` | `Component / CollapsibleSection` | `Uncontrolled`; `Controlled` (local `open` state) | `title` text, `subTitle` text | |
| `empty-state/empty-state.stories.tsx` | `Component / EmptyState` | `Default`; `Danger` | `title` text, `children` text, `danger` boolean | |
| `meta-line/meta-line.stories.tsx` | `Component / MetaLine` | `Default` (`['Author','2024',null,'320 pages']`) | none | |
| `metadata-list/metadata-list.stories.tsx` | `Component / MetadataList` | `Default` (Title / Status with `Tag`) | none | |
| `nav-desktop/nav-desktop.stories.tsx` | `Component / NavDesktop` | `Default` (`NAV_ITEMS`) | none | `false` |
| `nav-mobile/nav-mobile.stories.tsx` | `Component / NavMobile` | `Default` (`main`/`settings`/`expanded="main"` as today, no containing frame: the iframe is the viewport) | `expanded` select `['main','settings']` | `false` |
| `page/page.stories.tsx` | `Component / Page` | `Default` (a Card inside); `WithBottomNav` (`bottomNav back="/" headerActions=[{label:'Action'}]`) | `type` select from `PageType` values, `bottomNav` boolean, `actionsLabel` text | `false` |
| `progress-indicator/progress-indicator.stories.tsx` | `Component / ProgressIndicator` | `Default` (0.1, 0.25, 0.5, 0.75, 0.95 side by side); `Single` (args-driven) | `value` number `min 0 max 1 step 0.05`, `size` number | |
| `tag/tag.stories.tsx` | `Component / Tag` | `Default`; `Small`; `Clickable` | `children` text, `size` select `['sm','md']`, `onClick` action | |
| `theme-setting/theme-setting.stories.tsx` | `Component / ThemeSetting` | `Default` | none | |
| `top-fade/top-fade.stories.tsx` | `Component / TopFade` | `Default` (with a tall scrollable block of text under it so the band is visible) | none | `false` |
| `src/icon/icons.stories.tsx` | `Icon / All` | `Grid` (every `*Icon` export from `./index.js` in the grid layout of today's icons page, name under each); `Sizes` (one icon at 16/24/32/48) | `width` number for `Sizes` only (declared on the story) | |
| `src/toast/toast.stories.tsx` | `Toast / Toast` | `Default` (three buttons firing `useToast()` with success/error/info; the story wraps itself in nothing extra: the preview's `ToastProvider` is in scope) | `message` text | |

Story files for `nav-*`, `page`, and `icons` import `NAV_ITEMS`/icons via `@gallery/fixtures` and relative `../../icon/<name>.js`.

- [ ] **Step 1: Write the sixteen story files** per the table.
- [ ] **Step 2: Add the coverage test** to `gallery/stories.test.tsx`

```tsx
describe('coverage', () => {
  const modules = Object.keys(import.meta.glob('../src/{control,component}/*/index.{ts,tsx}'));
  const storyFiles = Object.keys(import.meta.glob('../src/**/*.stories.tsx'));
  const exempt = ['control/action-menu-list', 'control/use-modal-dialog', 'component/metadata'];
  it.each(modules.map((m) => [m.replace(/^\.\.\/src\/(.*)\/index\.tsx?$/, '$1')]))('%s has a stories file', (dir) => {
    if (exempt.includes(dir)) return;
    expect(storyFiles.some((f) => f.startsWith(`../src/${dir}/`))).toBe(true);
  });
  it('has icon and toast stories', () => {
    expect(storyFiles).toEqual(expect.arrayContaining(['../src/icon/icons.stories.tsx', '../src/toast/toast.stories.tsx']));
  });
});
```

- [ ] **Step 3: Run the suite and lint**

Run: `npm test && npm run lint`
Expected: PASS, 31 story files discovered.

- [ ] **Step 4: Commit**

```bash
git add src/component src/icon/icons.stories.tsx src/toast/toast.stories.tsx gallery/stories.test.tsx
git commit -m "feat(gallery): stories for components, icons, and toast; coverage test"
```

---

### Task 4: Message protocol and preview route

**Files:**
- Create: `gallery/messages.ts`, `gallery/preview.tsx`, `gallery/preview.test.tsx`

**Interfaces:**
- Produces (`gallery/messages.ts`):
  ```ts
  export type ThemeValue = 'light' | 'dark' | 'auto';
  export type ShellToPreview =
    | { type: 'gallery:args'; args: Record<string, unknown> }
    | { type: 'gallery:theme'; theme: ThemeValue };
  export type PreviewToShell =
    | { type: 'gallery:ready' }
    | { type: 'gallery:action'; name: string; args: unknown[] };
  export const isShellToPreview: (data: unknown) => data is ShellToPreview;
  export const isPreviewToShell: (data: unknown) => data is PreviewToShell;
  export const serializeActionArgs: (args: unknown[]) => unknown[]; // Event → { type }, React element → '<Element>', non-JSON-able → String(value); result is JSON-safe
  export const postToWindow: (target: Window, message: ShellToPreview | PreviewToShell) => void; // target.postMessage(message, window.location.origin)
  export const parseArgsParam: (raw: string | null) => Record<string, unknown>; // JSON.parse; {} on null, invalid JSON, or non-object
  ```
- Produces (`gallery/preview.tsx`): `export const Preview = ({ parentWindow = window.parent === window ? null : window.parent }: { parentWindow?: Window | null }) => ReactElement`, the `#/preview/*` route element. Reads id from the splat param (`useParams()['*']`), `theme` and `args` from `useSearchParams`. Renders `ThemeProvider identity="gallery-preview"` → `ToastProvider` → `ThemeSync theme=…` → story with `resolveArgs(entry, overrides, onAction)`. `onAction` posts `gallery:action` with `serializeActionArgs` to `parentWindow` when it is not null (the prop exists so tests can pass a fake). Listens for `message` events: ignores `event.origin !== window.location.origin` and non-`isShellToPreview` data; `gallery:args` replaces overrides, `gallery:theme` sets theme. Posts `gallery:ready` on mount. Unknown id → `<p>Story not found: <code>{id}</code></p>` with a `Link` to `/story/${stories[0].id}`.
- `ThemeSync` (local to `preview.tsx`): `({ theme }: { theme: ThemeValue }) => null`; `useEffect` calling `useThemeSetting()[1](theme)` when `theme` changes.

- [ ] **Step 1: Write failing tests** in `gallery/preview.test.tsx`

```tsx
describe('messages', () => {
  it('parseArgsParam tolerates bad input', () => {
    expect(parseArgsParam(null)).toEqual({});
    expect(parseArgsParam('{not json')).toEqual({});
    expect(parseArgsParam('[1]')).toEqual({});
    expect(parseArgsParam('{"a":1}')).toEqual({ a: 1 });
  });
  it('serializeActionArgs reduces events and survives cycles', () => {
    const cyc: Record<string, unknown> = {}; cyc.self = cyc;
    const out = serializeActionArgs([new MouseEvent('click'), <b />, cyc, 3]);
    expect(out[0]).toEqual({ type: 'click' });
    expect(out[1]).toBe('<Element>');
    expect(typeof out[2]).toBe('string');
    expect(out[3]).toBe(3);
    expect(() => JSON.stringify(out)).not.toThrow();
  });
});

describe('Preview', () => {
  const mount = (url: string, parentWindow: Window | null = null) => render(<MemoryRouter initialEntries={[url]}><Routes><Route path="/preview/*" element={<Preview parentWindow={parentWindow} />} /><Route path="/story/*" element={<div>story route</div>} /></Routes></MemoryRouter>);
  it('renders the story named in the URL with URL args', () => {
    mount('/preview/control/button/default?args=' + encodeURIComponent(JSON.stringify({ children: 'From URL' })));
    expect(screen.getByRole('button', { name: 'From URL' })).toBeInTheDocument();
  });
  it('applies the theme param to the preview identity', () => {
    mount('/preview/control/button/default?theme=dark');
    expect(localStorage.getItem('theme-setting:gallery-preview')).toBe('dark');
  });
  it('updates args from a same-origin shell message and ignores others', () => {
    mount('/preview/control/button/default');
    act(() => { window.dispatchEvent(new MessageEvent('message', { origin: 'https://evil.example', data: { type: 'gallery:args', args: { children: 'Evil' } } })); });
    expect(screen.queryByRole('button', { name: 'Evil' })).toBeNull();
    act(() => { window.dispatchEvent(new MessageEvent('message', { origin: window.location.origin, data: { type: 'gallery:args', args: { children: 'Live' } } })); });
    expect(screen.getByRole('button', { name: 'Live' })).toBeInTheDocument();
  });
  it('posts actions to the parent window', () => {
    const post = vi.fn();
    mount('/preview/control/button/default', { postMessage: post } as unknown as Window);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(post).toHaveBeenCalledWith(expect.objectContaining({ type: 'gallery:action', name: 'onClick' }), window.location.origin);
  });
  it('shows not-found for an unknown id', () => {
    mount('/preview/nope/nothing');
    expect(screen.getByText(/Story not found/)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', `/story/${stories[0].id}`);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run gallery/preview.test.tsx`
Expected: FAIL, modules missing.

- [ ] **Step 3: Implement `gallery/messages.ts` and `gallery/preview.tsx`** per Interfaces.
- [ ] **Step 4: Run tests, then the full suite and lint**

Run: `npx vitest run gallery/preview.test.tsx && npm test && npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add gallery/messages.ts gallery/preview.tsx gallery/preview.test.tsx
git commit -m "feat(gallery): preview route and shell/preview message protocol"
```

---

### Task 5: Sidebar

**Files:**
- Create: `gallery/shell/sidebar.tsx`, `gallery/shell/sidebar.test.tsx`

**Interfaces:**
- Consumes: `stories`, `storyTree`, `StoryGroup`, `StoryEntry` from `@gallery/stories`; `TextInput` from `../../src/control/text-input/index.js`; `CollapsibleSection` from `../../src/component/collapsible-section/index.js`; `NavLink` from react-router.
- Produces: `export const Sidebar = ({ entries = stories }: { entries?: StoryEntry[] }) => ReactElement`. Renders brand `@korzun/design`, a `TextInput name="search" label="Search" layout="inline"` whose value filters entries by case-insensitive substring over `title + ' / ' + name`, the tree from `storyTree(filtered)` (groups as `CollapsibleSection`, open when they contain the active story or when a filter is set), each story as `NavLink to={`/story/${id}`}`, and footer links `All` → `/all`, `Tokens` → `/tokens`.

- [ ] **Step 1: Write failing tests** in `gallery/shell/sidebar.test.tsx`

```tsx
const mount = (path = '/story/control/button/default') => render(<MemoryRouter initialEntries={[path]}><ThemeProvider identity="gallery"><Sidebar /></ThemeProvider></MemoryRouter>);
it('lists groups and marks the active story', () => {
  mount();
  expect(screen.getByRole('link', { name: 'Default' })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('link', { name: 'All' })).toHaveAttribute('href', '/all');
  expect(screen.getByRole('link', { name: 'Tokens' })).toHaveAttribute('href', '/tokens');
});
it('filters by search text', async () => {
  mount();
  await userEvent.type(screen.getByLabelText('Search'), 'toast');
  expect(screen.getAllByRole('link').filter((l) => l.getAttribute('href')?.startsWith('/story/')).map((l) => l.getAttribute('href'))).toEqual(['/story/toast/toast/default']);
});
```

- [ ] **Step 2: Run to verify failure**; Run: `npx vitest run gallery/shell/sidebar.test.tsx`; Expected: FAIL.
- [ ] **Step 3: Implement `gallery/shell/sidebar.tsx`** per Interfaces, styles via `createUseStyles` with theme tokens (width 240, border-right `theme.color.border.default`, link padding/active styles carried over from today's `gallery/app.tsx`).
- [ ] **Step 4: Run tests and lint**; Run: `npx vitest run gallery/shell && npm run lint`; Expected: PASS.
- [ ] **Step 5: Commit**

```bash
git add gallery/shell/sidebar.tsx gallery/shell/sidebar.test.tsx
git commit -m "feat(gallery): sidebar with story tree and search"
```

---

### Task 6: Story view: toolbar, canvas, props panel, action log

**Files:**
- Create: `gallery/shell/toolbar.tsx`, `gallery/shell/canvas.tsx`, `gallery/shell/props-panel.tsx`, `gallery/shell/actions-log.tsx`, `gallery/shell/story-view.tsx`, `gallery/shell/story-view.test.tsx`

**Interfaces:**
- Consumes: `storyById`, `stories`, `StoryEntry`, `ArgType` from `@gallery/stories` / `@gallery/story`; `ThemeValue`, `ShellToPreview`, `isPreviewToShell`, `postToWindow`, `parseArgsParam` from `@gallery/messages`; `useThemeSetting` from `../../src/theme/index.js`; `SegmentedControl`, `Switch`, `TextInput`, `NumberInput`, `Select`, `Button` from their module folders.
- Produces:
  ```ts
  export type WidthPreset = 'fill' | '414' | '768' | '1024';
  export const WIDTHS: ReadonlyArray<{ value: WidthPreset; label: string }>; // Fill, Phone, Tablet, Desktop
  export const Toolbar: (p: { entry: StoryEntry; theme: ThemeValue; onTheme: (t: ThemeValue) => void; width: WidthPreset; onWidth: (w: WidthPreset) => void }) => ReactElement; // breadcrumb "Control / Button / Default" as heading level 1
  export const Canvas: (p: { entry: StoryEntry; theme: ThemeValue; width: WidthPreset; overrides: Record<string, unknown>; onAction: (name: string, args: unknown[]) => void }) => ReactElement;
    // <iframe title="Story preview" src={`${import.meta.env.BASE_URL}#/preview/${entry.id}?theme=${theme}&args=${encodeURIComponent(JSON.stringify(overrides))}`}> sized `width === 'fill' ? '100%' : `${width}px``, height 100%;
    // on 'gallery:ready' and whenever overrides/theme change, postToWindow(iframe.contentWindow, …); forwards 'gallery:action' to onAction; ignores foreign origins.
  export const PropsPanel: (p: { entry: StoryEntry; values: Record<string, unknown>; onChange: (name: string, value: unknown) => void }) => ReactElement;
    // one row per argTypes entry except 'action': boolean→Switch, text→TextInput, number→NumberInput, select→Select (options from argType); empty state text "This story declares no adjustable props."
  export type ActionRecord = { at: string; name: string; args: unknown[] };
  export const ActionsLog: (p: { records: ActionRecord[]; onClear: () => void }) => ReactElement; // list "<time> <name> <JSON args>", Button "Clear"; empty text "No actions yet."
  export const StoryView: () => ReactElement; // `#/story/*` route element, owns URL state
  ```
- `StoryView` state: `theme` = `?theme` if valid else the shell's `useThemeSetting()` value; changing it sets both the shell setting and the param. `width` = `?width` if a preset else `fill`. `overrides` = `parseArgsParam(?args)`; `onChange` writes `?args=` (omit the param when overrides is empty). Action records live in component state. Unknown id → the same not-found message and link as `Preview`.

- [ ] **Step 1: Write failing tests** in `gallery/shell/story-view.test.tsx`

```tsx
const Location = () => { const l = useLocation(); return <output data-testid="loc">{l.pathname + l.search}</output>; };
const mount = (url: string) => render(<MemoryRouter initialEntries={[url]}><ThemeProvider identity="gallery"><ToastProvider><Routes><Route path="/story/*" element={<><StoryView /><Location /></>} /></Routes></ToastProvider></ThemeProvider></MemoryRouter>);

it('shows breadcrumb, iframe, and props from argTypes', () => {
  mount('/story/control/button/default');
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Control / Button / Default');
  expect(screen.getByTitle('Story preview')).toHaveAttribute('src', expect.stringContaining('#/preview/control/button/default?theme='));
  expect(screen.getByLabelText('disabled')).toBeInTheDocument();
  expect(screen.getByLabelText('type')).toBeInTheDocument();
});
it('writes a changed boolean into ?args= and the iframe src', async () => {
  mount('/story/control/button/default');
  await userEvent.click(screen.getByLabelText('disabled'));
  expect(screen.getByTestId('loc')).toHaveTextContent('args=' + encodeURIComponent(JSON.stringify({ disabled: true })));
  expect(screen.getByTitle('Story preview')).toHaveAttribute('src', expect.stringContaining(encodeURIComponent('{"disabled":true}')));
});
it('falls back to defaults on malformed ?args=', () => {
  mount('/story/control/button/default?args=%7Bnope');
  expect(screen.getByLabelText('children')).toHaveValue('Save');
});
it('applies ?width= and ?theme=', () => {
  mount('/story/control/button/default?width=414&theme=dark');
  expect(screen.getByTitle('Story preview')).toHaveStyle({ width: '414px' });
  expect(screen.getByTitle('Story preview')).toHaveAttribute('src', expect.stringContaining('theme=dark'));
  expect(localStorage.getItem('theme-setting:gallery')).toBe('dark');
});
it('logs actions posted by the preview and ignores foreign origins', async () => {
  mount('/story/control/button/default');
  act(() => { window.dispatchEvent(new MessageEvent('message', { origin: 'https://evil.example', data: { type: 'gallery:action', name: 'onEvil', args: [] } })); });
  expect(screen.queryByText(/onEvil/)).toBeNull();
  act(() => { window.dispatchEvent(new MessageEvent('message', { origin: window.location.origin, data: { type: 'gallery:action', name: 'onClick', args: [{ type: 'click' }] } })); });
  expect(screen.getByText(/onClick/)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
  expect(screen.getByText('No actions yet.')).toBeInTheDocument();
});
it('shows not-found for an unknown id', () => {
  mount('/story/nope/nothing');
  expect(screen.getByText(/Story not found/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run to verify failure**; Run: `npx vitest run gallery/shell/story-view.test.tsx`; Expected: FAIL.
- [ ] **Step 3: Implement the five files** per Interfaces. Layout: toolbar on top, canvas filling the middle, a 300px right column with `PropsPanel` above `ActionsLog`. Note: jsdom gives an iframe no `contentWindow` navigation; `Canvas` must tolerate `contentWindow` being `null`.
- [ ] **Step 4: Run tests and lint**; Run: `npx vitest run gallery/shell && npm run lint`; Expected: PASS.
- [ ] **Step 5: Commit**

```bash
git add gallery/shell
git commit -m "feat(gallery): story view with toolbar, iframe canvas, props panel, action log"
```

---

### Task 7: Routes, contact sheet, remove the old pages

**Files:**
- Create: `gallery/all.tsx`
- Modify: `gallery/app.tsx`, `gallery/app.test.tsx`, `gallery/index.html` (title `@korzun/design`)
- Delete: `gallery/page/controls.tsx`, `gallery/page/components.tsx`, `gallery/page/icons.tsx`

**Interfaces:**
- Consumes: `Sidebar`, `StoryView`, `Preview`, `TokensPage`, `stories`, `storyTree`, `resolveArgs`.
- Produces:
  - `gallery/all.tsx`: `export const AllStories = () => ReactElement`: heading level 1 `All stories`; for each group (via `storyTree(stories)`), a heading level 2 with the group path and, per story, a `<section data-testid="sheet-story">` holding a heading level 3 with the story name followed by the story rendered inline with `resolveArgs(entry, {}, () => {})`, or, when `entry.sheet === false`, a `Link` to `/story/${id}` labelled `Open ${name}` instead of the render.
  - `gallery/app.tsx`: `export const GalleryRoutes = () => ReactElement` with routes `/` → `<Navigate to={`/story/${stories[0].id}`} replace />`, `/story/*` → shell layout (Sidebar + StoryView), `/all` → shell layout with `AllStories`, `/tokens` → shell layout with `TokensPage`, `/preview/*` → `<Preview />` with no shell and no shell providers. `export const App = () => <HashRouter><GalleryRoutes /></HashRouter>`; the shell layout element wraps its children in `ThemeProvider identity="gallery"` and `ToastProvider` (the preview route brings its own).

- [ ] **Step 1: Rewrite `gallery/app.test.tsx`**

```tsx
const mount = (path: string) => render(<MemoryRouter initialEntries={[path]}><GalleryRoutes /></MemoryRouter>);
beforeEach(() => { HTMLDialogElement.prototype.showModal = vi.fn(); HTMLDialogElement.prototype.close = vi.fn(); });
it('redirects / to the first story', () => { mount('/'); expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(stories[0].title); });
it('renders the tokens page inside the shell', () => { mount('/tokens'); expect(screen.getByRole('heading', { level: 1, name: 'Tokens' })).toBeInTheDocument(); expect(screen.getByRole('link', { name: 'All' })).toBeInTheDocument(); });
it('renders the contact sheet with sheet:false stories as links', () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  mount('/all');
  expect(screen.getByRole('heading', { level: 1, name: 'All stories' })).toBeInTheDocument();
  const links = screen.getAllByRole('link', { name: /^Open / });
  expect(links.length).toBe(stories.filter((s) => !s.sheet).length);
  for (const l of links) expect(l).toHaveAttribute('href', expect.stringMatching(/^\/story\/component\/(page|nav-mobile|nav-desktop|top-fade)\//));
  expect(screen.getAllByTestId('sheet-story').length).toBe(stories.length);
  expect(error).not.toHaveBeenCalled();
  error.mockRestore();
});
it('renders the preview route without the sidebar', () => { mount('/preview/control/button/default'); expect(screen.queryByRole('link', { name: 'All' })).toBeNull(); expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument(); });
```

- [ ] **Step 2: Run to verify failure**; Run: `npx vitest run gallery/app.test.tsx`; Expected: FAIL.
- [ ] **Step 3: Implement `gallery/all.tsx`, rewrite `gallery/app.tsx`, delete the three page files**, and remove their imports. `gallery/main.tsx` stays.
- [ ] **Step 4: Run the full suite, lint, and the dev server smoke**

Run: `npm test && npm run lint`
Expected: PASS.
Run: `timeout 20 npm run gallery -- --port 61000 2>&1 | head -20`
Expected: Vite prints its ready banner with no error lines.

- [ ] **Step 5: Commit**

```bash
git add -A gallery
git commit -m "feat(gallery): hash routes, contact sheet, remove hand-written pages"
```

---

### Task 8: Static build, Pages deploy, docs

**Files:**
- Create: `.github/workflows/gallery.yml`
- Modify: `gallery/vite.config.ts`, `package.json`, `.gitignore`, `README.md`, `CLAUDE.md`

**Interfaces:**
- `gallery/vite.config.ts`: `defineConfig(({ mode }) => ({ root: here, base: mode === 'pages' ? '/korzun-design/' : '/', plugins: [react()], resolve: { alias: [...designAlias, ...galleryAlias] }, server: { host: true }, build: { outDir: `${here}../gallery-dist`, emptyOutDir: true } }))`.
- `package.json` scripts: `"gallery:build": "vite build --config gallery/vite.config.ts"`, `"gallery:build:pages": "vite build --config gallery/vite.config.ts --mode pages"`.
- `.gitignore`: add `gallery-dist/`.
- Workflow `Gallery`: `on: push: branches: [main]` and `workflow_dispatch`; `permissions: contents: read, pages: write, id-token: write`; `concurrency: group: pages, cancel-in-progress: false`; job `build` (checkout, setup-node with `node-version-file: .node-version` and `cache: npm`, `npm ci`, `npm run gallery:build:pages`, `actions/configure-pages`, `actions/upload-pages-artifact` with `path: gallery-dist`) and job `deploy` (`needs: build`, `environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }`, `actions/deploy-pages` with `id: deployment`). Pin each action to the full commit SHA of its latest major tag with a `# vN` comment, obtained via `gh api repos/actions/<action>/git/ref/tags/<tag> --jq .object.sha` (dereference annotated tags with `gh api repos/actions/<action>/git/tags/<sha>`), matching the style of `ci.yml`.

- [ ] **Step 1: Vite config, scripts, gitignore**; then run `npm run gallery:build` and `npm run gallery:build:pages`.

Expected: both succeed; `grep -c '/korzun-design/' gallery-dist/index.html` prints `1` or more after the pages build and `0` after the plain build; `git status --short` shows no `gallery-dist/` entries.

- [ ] **Step 2: Write `.github/workflows/gallery.yml`** per Interfaces.
- [ ] **Step 3: Docs**

README `## Gallery` becomes:

```markdown
## Gallery

`npm run gallery` starts the story explorer on the LAN; `npm run gallery:build` writes a static copy to `gallery-dist/`. Every push to `main` deploys it to https://korzun.github.io/korzun-design/. It is for development only and is not published to npm.

Each control and component has a `*.stories.tsx` beside it: a default export with a `title`, default `args`, and `argTypes` (`boolean`, `text`, `number`, `select`, `action`), and one named export per story. Stories import their own module relatively and may import helpers from `@gallery/*`.
```

CLAUDE.md: `gallery/` description → `gallery/` the story explorer (dev-only; stories live beside their modules as `*.stories.tsx`); the rule "Every new or changed control and component gets a test and a gallery entry (…)" → "Every new or changed control and component gets a test and a stories file (`<module>.stories.tsx` beside it; `gallery/stories.test.tsx` fails when one is missing), so behaviour and appearance are both covered."; the relative-imports rule gains ", except stories, which may import `@gallery/*`"; add a rule "Stories and gallery code never ship: `files`, `tsconfig.build.json`, and the smoke test all exclude `*.stories.*`."

- [ ] **Step 4: Lint, test, smoke**; Run: `npm run lint && npm test && npm run smoke`; Expected: PASS.
- [ ] **Step 5: Commit**

```bash
git add gallery/vite.config.ts package.json .gitignore .github/workflows/gallery.yml README.md CLAUDE.md
git commit -m "feat(gallery): static build, GitHub Pages deploy, docs"
```

**Owner step before merging the branch:** enable GitHub Pages (Settings → Pages → Source: GitHub Actions). Otherwise the first `Gallery` run on `main` fails; re-run it from the Actions tab after enabling.
