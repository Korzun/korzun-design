# Surface depth, Alert, typed spacing (0.5.0) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corners become concentric site-wide by reading a surface depth from context, a tinted `Alert` ships, and `theme.space` values are typed as `rem` strings.

**Architecture:** A small internal context (`src/component/surface/`) carries a depth number: `Page` provides 0, `Dialog` 1, `Card`/`CardRow`/`Alert`/`Surface` one more than where they sit, `Popover` a fixed 2. `Button`, `Select`, `Card`, `CardRow` and `Alert` map depth to `radius.lg`/`md`/`sm`; explicit props win; no depth keeps today's defaults. It replaces the 0.3.0 `ButtonRadiusContext`.

**Tech Stack:** React 19, react-jss, TypeScript, vitest + Testing Library (jsdom, `getComputedStyle` reads injected jss), oxlint/oxfmt.

**Spec:** `docs/superpowers/specs/2026-11-24-surface-depth-alert-space-design.md`

## Global Constraints

- Depth → radius: 0 → `theme.radius.lg` (16px), 1 → `theme.radius.md` (8px), 2+ → `theme.radius.sm` (4px, clamped). No depth → each component's current default.
- Explicit `radius` (Button) and `surface` (Select) props always win over depth.
- Only corner radius changes on existing components; no shadow, padding or colour changes (except Select `page`, which already carries `shadow.cardStack`).
- No literal radii; only tokens or `calc(token ± 1px)`.
- `src/component/surface/` imports only React and `../../theme/index.js` (control modules import it; it must never import a control or component module, to avoid cycles).
- Relative imports to module folders, never a barrel. Peers only.
- Every exported component: `<Name>Props` exported from its barrel with JSDoc on every prop; doc at `docs/<area>/<module>.md` listed in `AGENTS.md`; a `<module>.stories.tsx`; tests.
- Run `npm run lint` (tsc, oxlint, oxfmt check) and `npx vitest run` before each commit; `npm run smoke` in the release task.
- Version `0.5.0`; CHANGELOG lists every visible change.

## Review Focus

1. A Button or Select inside a Popover/Menu opened from a page-level trigger must be `sm` (depth 2), not `lg` inherited through the portal. Test in Task 3.
2. An explicit `radius="background"` on a Button inside a Card stays 16px. Test in Task 3.
3. Rendering outside any Page/Dialog (consumer tests, bare stories) must look exactly as 0.4.0: Button 16px, Select 8px, Card 16px, CardRow 16px. Tests in Tasks 3, 4, 5.
4. Three-deep nesting clamps: Card in Card in Card is 4px, and a Button inside it is 4px, no `undefined` class. Test in Task 5.
5. Header-action and footer Buttons of a Card get the card's inner depth, not only body Buttons. Test in Task 5.

---

### Task 1: Typed spacing

**Files:**
- Modify: `src/theme/theme.ts` (the `space` block of `Theme`, ~line 143), `src/theme/index.ts` (export the type)
- Modify: `src/control/menu/index.tsx` (remove `as PopoverGap` on `theme.space.sm`), `docs/control/popover.md`, `docs/control/menu.md`, any story using the cast (`grep -rn "as PopoverGap" src docs`)
- Test: `src/theme/space.test.ts` (new)

**Interfaces:**
- Produces: `export type SpaceValue = \`${number}rem\`;` from `src/theme/theme.ts` and the theme barrel; every `Theme['space']` key typed `SpaceValue`.

- [ ] **Step 1: Write the type test** `src/theme/space.test.ts`, in the style of `src/control/menu/types.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import type { PopoverGap } from '../control/popover/index.js';
import { lightTheme } from './theme.js';
import type { SpaceValue } from './theme.js';

const gap: PopoverGap = lightTheme.space.sm;
const value: SpaceValue = '0.5rem';
// @ts-expect-error px is not a space value
const wrong: SpaceValue = '8px';

describe('SpaceValue', () => {
  it('lets theme.space values be used as a Popover gap without a cast', () => {
    expect([gap, value, wrong]).toHaveLength(3);
  });
  it('types every space value as a rem string', () => {
    for (const v of Object.values(lightTheme.space)) expect(v).toMatch(/^\d*\.?\d+rem$/);
  });
});
```

- [ ] **Step 2:** `npx tsc --noEmit` fails on `const gap` (string not assignable).
- [ ] **Step 3:** Add `SpaceValue`, type each `space` key with it, export it; remove every `as PopoverGap` cast on a `theme.space` value and the docs text telling consumers to cast.
- [ ] **Step 4:** `npm run lint` clean (warnings allowed), `npx vitest run src/theme` passes.
- [ ] **Step 5:** Commit `feat(theme): type space values as rem strings`.

### Task 2: Surface depth module, Page provider, public `Surface`

**Files:**
- Create: `src/component/surface/index.tsx`, `src/component/surface/index.test.tsx`, `src/component/surface/surface.stories.tsx`, `docs/component/surface.md`
- Modify: `src/component/page/index.tsx` (wrap everything inside `<main>` in depth 0, all `type`s), `src/component/index.ts`, `AGENTS.md` (docs index), `docs/component/page.md`

**Interfaces:**
- Produces (module `src/component/surface/index.js`):
  - `useSurfaceDepth(): number | undefined`
  - `SurfaceDepthProvider({ depth: number; children }): JSX.Element` (internal, not in the barrel)
  - `radiusForDepth(radius: Theme['radius'], depth: number): string` (0 → lg, 1 → md, ≥2 → sm)
  - `depthClass(depth: number): 0 | 1 | 2` (clamp helper for style class lookup)
  - Public: `Surface({ children }: SurfaceProps)` provides `(useSurfaceDepth() ?? 0) + 1`; `SurfaceProps = PropsWithChildren<{}>` with JSDoc on `children`; `useSurfaceRadius(): string` = `radiusForDepth(theme.radius, depth ?? 0)` using `useTheme` from `../../theme/index.js`.
  - Barrel: `export { Surface, useSurfaceRadius, type SurfaceProps } from './surface/index.js';`

- [ ] **Step 1: Tests** in `index.test.tsx` (render a probe `() => <span>{String(useSurfaceDepth())}</span>`):
  - `reports no depth outside any provider` → text `undefined`
  - `Page provides depth 0 to its children, header and footer actions` → probe in `children` and in `header` both read `0`
  - `Page type="minimal" also provides depth 0`
  - `Surface steps one level deeper` → inside `<Page><Surface>` reads `1`; `<Surface><Surface>` with no Page reads `2`
  - `radiusForDepth maps 0/1/2/5 to lg/md/sm/sm` against `lightTheme.radius`
  - `useSurfaceRadius returns radius.md inside Page > Surface`
- [ ] **Step 2:** Run `npx vitest run src/component/surface` → fails (module missing).
- [ ] **Step 3:** Implement; Page wraps the whole `<main>` contents in `<SurfaceDepthProvider depth={0}>`.
- [ ] **Step 4:** Story: `Surface` around a hand-made inset box (`recipe.row`-style div using `useSurfaceRadius()` inline) inside a Card, with a Button inside. Doc `docs/component/surface.md`: when to use `Surface` (a hand-made box that contains library controls), `useSurfaceRadius`, the depth table. Add to AGENTS.md index.
- [ ] **Step 5:** `npm run lint`, `npx vitest run`, `npm run test:scripts` pass. Commit `feat(surface): depth context, Page depth 0, Surface and useSurfaceRadius`.

### Task 3: Button, Dialog, Popover, FieldList follow depth

**Files:**
- Modify: `src/control/button/index.tsx` (read depth), delete `src/control/button/radius-context.ts`
- Modify: `src/control/dialog/index.tsx` (one `SurfaceDepthProvider depth={1}` around header, body and footer; drop `ButtonRadiusContext`)
- Modify: `src/control/popover/index.tsx` (wrap portalled content in `SurfaceDepthProvider depth={2}`)
- Modify: `src/control/field-list/index.tsx` (`radius={depth === undefined ? 'card' : undefined}` on the add Button; update its JSDoc line 40)
- Tests: `src/control/button/index.test.tsx`, `src/control/dialog/index.test.tsx`, `src/control/popover/index.test.tsx`, `src/control/field-list/index.test.tsx`
- Docs: `docs/control/button.md`, `docs/control/dialog.md`, `docs/control/popover.md`, `docs/control/field-list.md`

**Interfaces:**
- Consumes: `useSurfaceDepth`, `SurfaceDepthProvider` from Task 2.
- Button default when `radius` is unset: depth `undefined` or 0 → `background`, 1 → `card`, ≥2 → `inset`.

- [ ] **Step 1: Tests** (radius via `getComputedStyle(el).borderRadius`):
  - Button: `is 16px outside any surface`; `is 16px directly on a Page`; `is 8px inside Page > Surface`; `is 4px two levels in`; `an explicit radius="background" wins inside Page > Surface (16px)`.
  - Dialog: `body Buttons are 8px` (new; replaces any test asserting the 0.3.0 body reset); existing footer 8px test still passes.
  - Popover: `a Button inside the popover is 4px even when its anchor sits directly on a Page` (open Popover from `<Page>`).
  - FieldList: `add button is 8px outside any surface` and `add button is 4px inside Page > Surface > Surface`.
- [ ] **Step 2:** Run them; the new ones fail.
- [ ] **Step 3:** Implement. Then sweep `grep -rn "radius=\|surface=" src --include="*.tsx"` (excluding stories/tests) for any other internal child given a hard-coded radius and apply the FieldList rule to it. `ConfirmModal` tests must stay green unchanged (pixel-identical footer).
- [ ] **Step 4:** Update the four docs: Button "radius follows where it sits; pass `radius` only to override"; Dialog "content is one level in"; Popover "content is two levels in"; FieldList drop "add button is `radius="card"`".
- [ ] **Step 5:** `npm run lint`, `npx vitest run` pass. Commit `feat(button): radius follows surface depth; Dialog and Popover provide depth`.

### Task 4: Select follows depth, new `inset` surface

**Files:**
- Modify: `src/control/select/index.tsx` (`surface?: 'page' | 'card' | 'inset'`, default from depth), `src/control/select/style.ts` (`inset` class: `root` and `trigger` take `radius.sm`, otherwise identical to `card`)
- Test: `src/control/select/index.test.tsx`; story `src/control/select/select.stories.tsx` (add `inset`)
- Docs: `docs/control/select.md`

**Interfaces:**
- Consumes: `useSurfaceDepth` (Task 2).
- Default when `surface` is unset: `undefined` → `card`; 0 → `page`; 1 → `card`; ≥2 → `inset`.

- [ ] **Step 1: Tests:** `is the card look outside any surface (8px, no shadow)`; `takes the page look directly on a Page (16px)`; `is 8px inside Page > Surface`; `is 4px two levels in (inset)`; `explicit surface="card" wins directly on a Page`. Assert on the trigger element's `borderRadius`; for `page` also `boxShadow` non-empty.
- [ ] **Step 2:** Run, new ones fail. **Step 3:** Implement (update the JSDoc on `surface`, lines 35-49). **Step 4:** Docs: default now follows depth; `inset` value.
- [ ] **Step 5:** lint, vitest pass. Commit `feat(select): surface follows depth; inset surface`.

### Task 5: Card and CardRow follow depth and provide depth + 1

**Files:**
- Modify: `src/component/card/index.tsx`, `src/component/card/style.ts`, `src/component/card-row/index.tsx` (JSDoc: "A compact bordered row; its corners follow where it sits."), `src/component/card-row/style.ts`
- Tests: `src/component/card/index.test.tsx`, `src/component/card-row/index.test.tsx`
- Docs: `docs/component/card.md`, `docs/component/card-row.md`

**Interfaces:**
- Consumes: `useSurfaceDepth`, `SurfaceDepthProvider`, `depthClass` (Task 2).
- A Card at depth `d = useSurfaceDepth() ?? 0` draws radius for `d` and wraps header, body and footer in `SurfaceDepthProvider depth={d + 1}`. `size="small"`: radius is `calc(<token for d+1> + 1px)` (d=0 → `calc(md + 1px)`, today's value; d≥1 → `calc(sm + 1px)`). CardRow: same depth rule, `lg`/`md`/`sm` only.
- Style approach: `depth0`/`depth1`/`depth2` classes in each sheet (no inline styles), chosen with `depthClass`.

- [ ] **Step 1: Tests:**
  - Card: `is 16px outside any surface and on a Page`; `a Card inside a Card is 8px`; `a Card three deep is 4px and its Button is 4px`; `small card is calc(8px + 1px) on a Page and calc(4px + 1px) inside a Card` (assert the computed string jsdom returns; match with `toContain('8px')`/`toContain('4px')` and `'1px'` if jsdom keeps `calc`); `Buttons in the body, headerAction and footer are 8px on a Page`.
  - CardRow: `is 16px on a Page`; `is 8px inside a Card`; `its Button is 4px inside a Card`.
- [ ] **Step 2:** Run, new ones fail. **Step 3:** Implement. Existing Card/CardRow tests and stories unchanged in look outside a Page.
- [ ] **Step 4:** Docs: Card "nested Cards step down"; CardRow "16px on the page, 8px in a Card".
- [ ] **Step 5:** lint, vitest pass. Commit `feat(card): corners follow depth; Card and CardRow provide the next level`.

### Task 6: Alert

**Files:**
- Create: `src/component/alert/index.tsx`, `style.ts`, `index.test.tsx`, `alert.stories.tsx`; `docs/component/alert.md`
- Modify: `src/component/index.ts`, `AGENTS.md` (docs index)

**Interfaces:**
- Consumes: `useSurfaceDepth`, `SurfaceDepthProvider`, `depthClass` (Task 2); `IconProps` from `../../icon/index.js`.
- Produces: `Alert`, `AlertProps`, `AlertTone = 'warning' | 'danger' | 'success' | 'info'`.
- Props (JSDoc each): `tone: AlertTone` (required), `title?: ReactNode`, `children?: ReactNode`, `Icon?: ComponentType<IconProps>`, `action?: ReactNode`, `className?: string`.
- Colours from `theme.color.chip[tone]`: `bg` background, `1px solid border`, title and icon in `text`; body colour: `text` or `theme.color.text.default`, whichever reads better in both modes (check the stories in light and dark with `playwright screenshot`), stated in a style comment.
- Role: `danger`/`warning` → `role="alert"`; `success`/`info` → `role="status"`.
- Layout: text column (title above body) and action on the right; action wraps below the text when narrow (flex-wrap). Spacing and font sizes from tokens only.
- Depth: radius for `d = depth ?? 0`; contents (including `action`) in `SurfaceDepthProvider depth={d + 1}`.

- [ ] **Step 1: Tests:** `renders title, body and action`; `warning and danger use role="alert"`; `success and info use role="status"`; `renders the Icon before the title`; `is 8px inside a Card on a Page and its action Button is 4px`; `is 16px directly on a Page`; `uses the tone's chip background` (compare `backgroundColor` to `lightTheme.color.chip.warning.bg` normalised by jsdom — set it on a probe element and compare computed values).
- [ ] **Step 2:** Run, fail. **Step 3:** Implement. **Step 4:** Stories: each tone; with/without title, Icon, action; on a Page and inside a Card (aviary shape: warning, title "Frame is overdue", body "No check-in for 2h 14m.", action Button "Retry"). Doc `docs/component/alert.md`: when to use Alert vs `ErrorMessage` (inline field/form failure text) vs `Tag` (a status word in a row); props; the aviary example.
- [ ] **Step 5:** lint, vitest, `npm run test:scripts` pass. Commit `feat(alert): tinted Alert with tone, title, icon and action`.

### Task 7: Corners guidance, nesting story, release prep

**Files:**
- Modify: `docs/corners.md` (replace "Picking the prop" with "It's automatic": depth table, providers incl. Popover = 2, `Surface` for hand-made boxes, explicit props as overrides; delete "Every Button inside a Card gets `radius="card"`" and "Every Button in a modal footer gets `radius="modal"`"), `AGENTS.md` (corners rule: don't pass `radius`/`surface` by default), `docs/patterns.md` (recipe "Status banner in a card": the aviary Alert)
- Create: a nesting story, `src/component/surface/nesting.stories.tsx` (or in `surface.stories.tsx`): Page > Card (Button, Select) > Card (Button, Select) > Card (Button, Select), plus a Dialog with a Card in its body
- Modify: `CHANGELOG.md` (0.5.0), `package.json` + `package-lock.json` version `0.5.0`, `scripts/smoke-exports.sh` (probe `Alert` and `Surface`/`useSurfaceRadius` from `@korzun/design/component`, and the `SpaceValue` type if the script checks types)

- [ ] **Step 1:** Docs edits as listed. CHANGELOG 0.5.0 entries: Surface depth (what provides it); **visible changes**: Buttons in Cards default to 8px, Dialog body Buttons 8px, Selects directly on a Page get the page look (16px + shadow), nested Cards step down, CardRow is 8px inside a Card, Buttons and Selects inside a Popover/Menu are 4px; new `Alert`, `Surface`, `useSurfaceRadius`, Select `surface="inset"`; `SpaceValue` type, cast no longer needed; internal `ButtonRadiusContext` removed.
- [ ] **Step 2:** Screenshot the nesting story and the Alert story in light and dark (`npm run gallery`, then `playwright screenshot`) and check each level is concentric.
- [ ] **Step 3:** `npm run lint`, `npx vitest run`, `npm run test:scripts`, `npm run smoke` all pass.
- [ ] **Step 4:** Commit `docs: concentric corners are automatic; 0.5.0`.
