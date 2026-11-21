# 0.1.0 Foundations (semantic tones, Popover placement) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `success`/`warning`/`danger`/`info` Tag tones (plus solid `color.warning`/`color.info`), and give Popover `side`/`align`, flipping, viewport clamping and Escape-to-close; ship as 0.1.0.

**Architecture:**
- **Tones.** These are four new `theme.color.chip` keys. `TagTone` is already `keyof Theme['color']['chip']`, and Tag's styles iterate the chip keys, so Tag itself needs no code change.
- **Popover geometry.** This moves into a pure `computePosition()` in `src/control/popover/position.ts`, unit-tested without a DOM. Popover renders hidden, measures its content in a layout effect, then places itself.

**Tech Stack:** React 19, react-jss, vitest with jsdom and @testing-library/react, oxlint/oxfmt, tsc.

**Spec:** `docs/superpowers/specs/2026-11-21-foundations-tones-popover-design.md`

## Global Constraints

**Repo rules:**
- No runtime `dependencies`; peers only. No positioning library.
- Relative imports only, pointing at a module folder, never at the `control` or `component` barrel. Stories may import `@gallery/*`.
- Every changed module keeps a test and a `*.stories.tsx`. Its doc in `docs/<area>/<module>.md` is updated whenever the API changes.
- Every exported prop has a JSDoc comment (`scripts/props-exports.test.mjs`).
- Tokens only in styles: no literal colours or px values in `style.ts`. Popover's runtime `top`/`left`/`width`/`visibility` inline style is the one existing exception.

**Exact colour values (from the spec):**
- warning:
  - light: text `#854d0e`, bg `rgba(234,179,8,0.16)`, border `rgba(202,138,4,0.40)`
  - dark: text `#FDE047`, bg `rgba(234,179,8,0.20)`, border `rgba(234,179,8,0.42)`
- info:
  - light: text `blue[700]`, bg `applyTransparency(blue[500], 0.08)`, border `applyTransparency(blue[500], 0.24)`
  - dark: text `blue[300]`, bg `applyTransparency(blue[400], 0.18)`, border `applyTransparency(blue[400], 0.36)`
- success:
  - light: text `#15803d`, bg `applyTransparency('#16a34a', 0.08)`, border `applyTransparency('#16a34a', 0.22)`
  - dark: text `#86EFAC`, bg `applyTransparency('#22C55E', 0.16)`, border `applyTransparency('#22C55E', 0.3)`
- danger:
  - light: text `red[700]`, bg `applyTransparency(red[500], 0.08)`, border `applyTransparency(red[500], 0.22)`
  - dark: text `red[400]`, bg `applyTransparency(red[500], 0.16)`, border `applyTransparency(red[500], 0.3)`
- Solid colours:
  - `color.warning`: light `#ca8a04`, dark `#EAB308`
  - `color.info`: each mode's `brand.default` (light `blue[500]`, dark `blue[400]`)

**Behaviour that must not change:**
- `Tag`'s default tone stays `subject`.
- Popover defaults are `side='bottom'`, `align='start'`, `gap=4`, `matchWidth=true`, and they reproduce today's position exactly.

**Release:** version `0.1.0`.

## Review Focus

These are the cases the spec implies but no feature test naturally hits.

1. **Escape inside a `<dialog>`.** Pressing Escape in an open Select inside a ConfirmModal or `useModalDialog` dialog should close only the dropdown, not the dialog. Test in Task 4.
2. **Escape already handled.** Select calls `preventDefault()` on Escape and closes itself. Popover must not call `onClose` a second time for that same key. Test in Task 4.
3. **Content wider than the viewport.** `matchWidth={false}` with wide content on a phone. `left` pins to `gap` rather than going negative. Test in Task 3.
4. **Neither side fits.** On a short viewport (landscape phone), the popover takes the side with more room and doesn't oscillate. Test in Task 3.
5. **Anchor scrolled.** Scrolling the page while open keeps the popover attached. It re-measures on capture-phase scroll, including the flip decision. Test in Task 4.

---

### Task 1: Status chip tokens and solid colours

**Files:**
- Modify: `src/theme/theme.ts`:
  - the `Theme['color']` type, around `success: string;` at line 97 and the `chip` block at lines 120-131
  - `lightColor` (around line 269 and the chip block at line 292)
  - `darkColor` (around line 361 and the chip block at line 384)
- Test: `src/theme/theme.test.ts`

**Interfaces:**
- Produces:
  - `Theme['color']['chip']` gains `success`, `warning`, `danger`, `info`, each `{ text: string; bg: string; border: string }`.
  - `Theme['color']` gains `warning: string` and `info: string`, beside `success`.
  - `TagTone` (derived) now includes the four new keys.

- [ ] **Step 1: Write the failing tests** in `src/theme/theme.test.ts`, in a new `describe('status tones')`:

```ts
it('every chip has text, bg and border in both modes', () => {
  for (const theme of [lightTheme, darkTheme]) {
    for (const [tone, chip] of Object.entries(theme.color.chip)) {
      expect(Object.keys(chip).sort(), tone).toEqual(['bg', 'border', 'text']);
      expect(chip.text && chip.bg && chip.border, tone).toBeTruthy();
    }
  }
});
it('has the four status chips', () => {
  for (const theme of [lightTheme, darkTheme]) {
    expect(Object.keys(theme.color.chip)).toEqual(
      expect.arrayContaining(['success', 'warning', 'danger', 'info'])
    );
  }
});
it('warning chip uses the picked yellow', () => {
  expect(lightTheme.color.chip.warning).toEqual({
    text: '#854d0e', bg: 'rgba(234,179,8,0.16)', border: 'rgba(202,138,4,0.40)',
  });
  expect(darkTheme.color.chip.warning).toEqual({
    text: '#FDE047', bg: 'rgba(234,179,8,0.20)', border: 'rgba(234,179,8,0.42)',
  });
});
it('info chip is built from brand blue', () => {
  expect(lightTheme.color.chip.info.text).toBe(lightTheme.color.blue[700]);
  expect(darkTheme.color.chip.info.text).toBe(darkTheme.color.blue[300]);
});
it('success and danger chips derive from the theme colours', () => {
  expect(lightTheme.color.chip.success.text).toBe('#15803d');
  expect(darkTheme.color.chip.success.text).toBe('#86EFAC');
  expect(lightTheme.color.chip.danger.text).toBe(lightTheme.color.red[700]);
  expect(darkTheme.color.chip.danger.text).toBe(darkTheme.color.red[400]);
});
it('solid warning and info colours', () => {
  expect(lightTheme.color.warning).toBe('#ca8a04');
  expect(darkTheme.color.warning).toBe('#EAB308');
  expect(lightTheme.color.info).toBe(lightTheme.color.brand.default);
  expect(darkTheme.color.info).toBe(darkTheme.color.brand.default);
});
```

Import `darkTheme` alongside `lightTheme` if the file doesn't already.

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx vitest run src/theme/theme.test.ts`
Expected: FAIL. `chip.warning` is undefined, and `color.warning` is undefined.

- [ ] **Step 3: Add the type keys and values** in `src/theme/theme.ts`, using the exact values from Global Constraints.
  - Give the four chip type keys one comment line: status tones for state, as opposed to the label tones above.
  - Give `warning` and `info` a JSDoc line each: solid colours for icons and accents.

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npx vitest run src/theme/theme.test.ts`
Expected: PASS.

Then run: `npx tsc --noEmit`
Expected: no errors. Anything that builds a full `Theme['color']` literal now needs the new keys.

- [ ] **Step 5: Commit**

```bash
git add src/theme/theme.ts src/theme/theme.test.ts
git commit -m "feat(theme): success/warning/danger/info chip tones; color.warning and color.info"
```

---

### Task 2: Tag status tones (tests, stories, docs)

**Files:**
- Test: `src/component/tag/index.test.tsx`
- Modify: `src/component/tag/tag.stories.tsx`
- Modify: `src/component/tag/index.tsx`: the JSDoc on `tone` only
- Modify:
  - `docs/component/tag.md`
  - `docs/theme.md:65`
  - `docs/tokens.md:21` and `docs/tokens.md:93`
  - `AGENTS.md`: add a rule line

**Interfaces:**
- Consumes: the Task 1 chip keys and `TagTone`.

- [ ] **Step 1: Write the failing test** in `src/component/tag/index.test.tsx`:

```tsx
it.each(['success', 'warning', 'danger', 'info'] as const)('renders the %s status tone', (tone) => {
  renderWithProviders(<Tag tone={tone}>{tone}</Tag>);
  expectTone(screen.getByText(tone), lightTheme.color.chip[tone]);
});
```

- [ ] **Step 2: Run the test**

Run: `npx vitest run src/component/tag`
Expected: PASS already, since Task 1 added the keys and Tag iterates them. If it fails, Tag's style generation is not iterating the chip keys; fix that rather than the test.

- [ ] **Step 3: Update the stories.** In `tag.stories.tsx`, add a `StatusTones` story. It renders `success`, `warning`, `danger`, `info` and `neutral`, labelled "Published", "Overdue", "Failed", "Scheduled" and "No change", next to one `subject` tag for contrast. The gallery's theme toggle covers dark mode.

- [ ] **Step 4: Update the docs.**
  - **`tone` JSDoc** in `index.tsx`: "Status tones (`success`, `warning`, `danger`, `info`, `neutral`) report state; label tones (the rest) name a kind of thing. Default `subject`."
  - **`docs/component/tag.md`:** split the tone list into **Status** and **Label** tables. Add do/don't lines:
    - Do: `tone="warning"` for "Overdue".
    - Don't: use `subject` or `author` to mean warning or success.
    - Don't: use `info` to look like a link.
  - **`docs/theme.md:65`:** list all 13 tones, and add rows for `color.warning` and `color.info` next to `color.success`.
  - **`docs/tokens.md`:**
    - Line 21: the count changes from "eight" to the current set, split into status and label.
    - Line 93: same.
    - Mention `color.warning` and `color.info` wherever `color.success` is described.
  - **`AGENTS.md`:** under rule 1 (tokens) or as a sub-point of rule 9, add: "**Tags that report state use a status tone** (`success`, `warning`, `danger`, `info`, `neutral`); label tones (`subject`, `author`, …) name things." Keep the numbered list at 10 rules by folding it into rule 1.

- [ ] **Step 5: Verify**

Run: `npx vitest run src/component/tag gallery && npm run test:scripts`
Expected: PASS. The docs index and stories checks stay green.

- [ ] **Step 6: Commit**

```bash
git add src/component/tag docs/component/tag.md docs/theme.md docs/tokens.md AGENTS.md
git commit -m "feat(tag): document and story the status tones"
```

---

### Task 3: `computePosition` (pure placement)

**Files:**
- Create: `src/control/popover/position.ts`
- Test: `src/control/popover/position.test.ts`

**Interfaces:**
- Produces:

```ts
export type PopoverSide = 'bottom' | 'top';
export type PopoverAlign = 'start' | 'center' | 'end';
export type Rect = { top: number; bottom: number; left: number; right: number; width: number };
export type Placement = { top: number; left: number; width: number | undefined; side: PopoverSide };

export function computePosition(args: {
  anchor: Rect;
  content: { width: number; height: number };
  viewport: { width: number; height: number };
  side: PopoverSide;
  align: PopoverAlign;
  gap: number;
  matchWidth: boolean;
}): Placement;
```

The algorithm, which the tests don't fully determine:

- `w = matchWidth ? anchor.width : content.width`; `h = content.height`.
- **Vertical side:**
  - `roomBelow = viewport.height - anchor.bottom - gap`
  - `roomAbove = anchor.top - gap`
  - `fits(s) = (s === 'bottom' ? roomBelow : roomAbove) >= h`
  - Use the preferred `side` unless `!fits(side)` and the other side's room is greater than the preferred side's room. Then use the other side.
  - Bottom: `top = anchor.bottom + gap`. Top: `top = anchor.top - gap - h`.
- **Horizontal align:**
  - start: `left = anchor.left`
  - center: `left = anchor.left + anchor.width / 2 - w / 2`
  - end: `left = anchor.right - w`
- **Clamp:** `left = Math.max(gap, Math.min(left, viewport.width - w - gap))`. If `w > viewport.width - 2 * gap`, `left = gap`.
- **Width:** return `width: matchWidth ? anchor.width : undefined`.

Fixture for the tests:

```ts
const anchor = { top: 100, bottom: 130, left: 100, right: 300, width: 200 };
const viewport = { width: 1000, height: 800 };
const base = { anchor, viewport, gap: 4, matchWidth: true, side: 'bottom', align: 'start',
  content: { width: 200, height: 150 } } as const;
```

- [ ] **Step 1: Write the failing tests** in `position.test.ts`, one `it` per line:
  - **defaults match today:** `computePosition(base)` returns `{ top: 134, left: 100, width: 200, side: 'bottom' }`.
  - **side top:** anchor `{ top: 400, bottom: 430, left: 100, right: 300, width: 200 }` with `side: 'top'` gives `top: 246` (400 − 4 − 150), `side: 'top'`.
  - **flips bottom to top when the bottom doesn't fit and the top has more room:**
    - anchor `{ top: 700, bottom: 730, left: 100, right: 300, width: 200 }`, height 150
    - expect `side: 'top'`, `top: 546`
  - **flips top to bottom:**
    - anchor `top: 50, bottom: 80`, `side: 'top'`
    - expect `side: 'bottom'`, `top: 84`
  - **neither fits; takes the side with more room:**
    - viewport height 300, anchor `top: 100, bottom: 130`, height 250
    - roomAbove is 96, roomBelow is 166, so expect `side: 'bottom'`
    - the same with `side: 'top'` also returns `'bottom'`
  - **align center:** `matchWidth: false`, content width 100, gives `left: 150`, `width: undefined`.
  - **align end:** `matchWidth: false`, content width 100, gives `left: 200`.
  - **clamps at the right edge:**
    - anchor `left: 900, right: 1000, width: 100`, `matchWidth: false`, content width 300
    - expect `left: 1000 - 300 - 4 = 696`
  - **clamps at the left edge:**
    - anchor `left: 0, right: 50, width: 50`, `align: 'end'`, `matchWidth: false`, content width 200
    - expect `left: 4`
  - **wider than the viewport pins to gap:** viewport width 320, `matchWidth: false`, content width 400, gives `left: 4`.

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx vitest run src/control/popover/position.test.ts`
Expected: FAIL, because the module isn't found.

- [ ] **Step 3: Implement `computePosition`** in `position.ts` per the algorithm above.

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npx vitest run src/control/popover/position.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/control/popover/position.ts src/control/popover/position.test.ts
git commit -m "feat(popover): pure computePosition with side, align, flip and clamp"
```

---

### Task 4: Popover uses placement; Escape; tests, stories and docs

**Files:**
- Modify: `src/control/popover/index.tsx`
- Create: `src/control/popover/index.test.tsx`. This is Popover's first component test.
- Modify: `src/control/popover/popover.stories.tsx`
- Modify: `src/control/index.ts`: also export `type PopoverSide` and `type PopoverAlign`
- Modify: `src/index.ts`, if the root re-exports control types by name. Check it; if it uses `export *` from control, nothing is needed.
- Modify: `docs/control/popover.md`
- Modify: the spec's Escape bullet (see Step 6)

**Interfaces:**
- Consumes: `computePosition`, `PopoverSide` and `PopoverAlign` from `./position.js` (Task 3).
- Produces: `PopoverProps` gains two props:
  - `side?: PopoverSide`, default `'bottom'`. JSDoc: "Preferred side; flips to the other side when this one has no room."
  - `align?: PopoverAlign`, default `'start'`. JSDoc: "Horizontal alignment to the anchor's left edge, centre, or right edge."
  - The wrapper carries `data-side="bottom" | "top"`.

**Behaviour:**
- **Rendering.**
  - On open, render the portal immediately with `visibility: hidden` at a provisional position.
  - In a `useLayoutEffect`, measure:
    - `anchorRef.current.getBoundingClientRect()`
    - `contentRef.current.getBoundingClientRect()` for width and height
    - `window.innerWidth/innerHeight`
  - Call `computePosition`, store the `Placement`, and render visible.
  - Re-run on capture-phase `scroll` and on `resize`, as today.
  - `matchWidth` keeps setting `width`.
- **Escape.** While `open && onClose`, add a `keydown` listener on `document` in the bubble phase. If `event.key === 'Escape' && !event.defaultPrevented`, call `event.preventDefault()` and then `onClose()`.
  - `preventDefault` stops a native `<dialog>` from firing `cancel`.
  - The `defaultPrevented` check skips keys a control already handled. Select does this.
- **Outside click:** unchanged.
- **Docblock:** update it. Remove "No Escape handling … never flips"; keep "No focus management".

**Tests:**

The test helper stubs `getBoundingClientRect` on the anchor element and on `HTMLElement.prototype` for the content. Set `window.innerWidth = 1000` and `window.innerHeight = 800`, and restore them in `afterEach`.

- [ ] **Step 1: Write the failing tests** in `index.test.tsx`:
  - **defaults unchanged:**
    - anchor rect `{top:100,bottom:130,left:100,right:300,width:200}`
    - the wrapper's `style.top` is `'134px'`, `left` is `'100px'`, `width` is `'200px'`
    - `data-side="bottom"` and `visibility` is not `hidden`
  - **`side="top"`** with the anchor at top 400 and content height 150: `style.top` is `'246px'`, `data-side="top"`.
  - **flips:** the anchor near the bottom (top 700) with `side` left at its default gives `data-side="top"`.
  - **re-measures on scroll:**
    - Move the stubbed anchor rect to `top: 700`.
    - `fireEvent.scroll(window)`, inside `act`.
    - Expect `data-side="top"`. This covers Review Focus 5.
  - **Escape calls onClose:** `fireEvent.keyDown(document, { key: 'Escape' })` calls `onClose` once.
  - **Escape already handled is ignored** (Review Focus 2):
    - Dispatch a `KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })` on a child button inside the popover.
    - A React `onKeyDown` on that button calls `e.preventDefault()`.
    - `onClose` is not called.
  - **Escape is prevented so an enclosing dialog stays open** (Review Focus 1): dispatch a cancelable Escape keydown on `document.body` while open. `event.defaultPrevented` is `true` after dispatch.
  - **no Escape listener when closed or without onClose:** the keydown leaves `defaultPrevented` false.
  - **outside mousedown calls onClose; a mousedown inside does not.** This pins existing behaviour that had no test.

- [ ] **Step 2: Run the tests and confirm the new ones fail**

Run: `npx vitest run src/control/popover`
Expected: the side, flip, data-side and Escape tests fail. The defaults and outside-click tests may already pass.

- [ ] **Step 3: Implement the props and behaviour** in `index.tsx`, as described above.

- [ ] **Step 4: Run the tests and confirm they pass, including the existing users**

Run: `npx vitest run src/control`
Expected: PASS, including the Select and ChipsInput tests, which use the defaults.

- [ ] **Step 5: Update the stories.** In `popover.stories.tsx:`
  - Add `side`, `align` and `matchWidth` to `argTypes`, as select and boolean controls.
  - Add `Placements`: a grid of six anchors, one per side×align, each open with a small `md`-radius surface. Corners follow `docs/corners.md`.
  - Add `FlipNearBottom`: an anchor pushed to the bottom of a full-height container, opening upward.

Check `Placements` visually:

```
npx vite --config gallery/vite.config.ts
playwright screenshot --wait-for-timeout 1500 "http://localhost:PORT/#/preview/control/popover/Placements?theme=light" shot.png
```

- [ ] **Step 6: Update the docs.**
  - **`docs/control/popover.md`:**
    - Props table rows for `side` and `align`.
    - Flip, clamp, and `data-side` notes.
    - Escape: calls `onClose` unless the key was already `defaultPrevented`, and calls `preventDefault`, so a surrounding dialog stays open.
    - Remove "never flips" and "no Escape".
  - **The spec's Escape bullet:** replace the `stopPropagation` wording with the `defaultPrevented` / `preventDefault` mechanism. `preventDefault` on keydown is what stops a native `<dialog>`'s `cancel`, and `stopPropagation` from a document listener wouldn't.
  - **`src/control/index.ts`:** export `type PopoverSide` and `type PopoverAlign` from `./popover/index.js`. Re-export them there from `./position.js`.

- [ ] **Step 7: Verify everything**

Run: `npm test && npm run lint`
Expected: all vitest and script tests pass. Lint shows only the two pre-existing warnings (switch `useDelayedFlag`, `use-pull-to-refresh`).

- [ ] **Step 8: Commit**

```bash
git add src/control/popover src/control/index.ts src/index.ts docs/control/popover.md docs/superpowers/specs/2026-11-21-foundations-tones-popover-design.md
git commit -m "feat(popover): side, align, flip, viewport clamp and Escape to close"
```

---

### Task 5: Release 0.1.0

**Files:**
- Modify: `package.json` (`version`)
- Modify: `CHANGELOG.md`
- Modify: `scripts/smoke-exports.sh`: extend the type probe

- [ ] **Step 1: Bump the version.** Set `package.json` `version` to `0.1.0`, and run `npm install --package-lock-only` so the lockfile matches.

- [ ] **Step 2: Extend the smoke probe.** Import `type PopoverSide` and `type TagTone`, and add the line below to the declared probe tuple (or a second `export const`):

```ts
export const toneProbe: [TagTone, PopoverSide] = ['warning', 'top'];
```

- [ ] **Step 3: Add the CHANGELOG entry.** Add `## 0.1.0 — <release date>` at the top:
  - `Tag` status tones: `success`, `warning` (yellow, stronger fill), `danger`, `info` (brand blue). New `color.warning` and `color.info` solid colours. Status tones report state; label tones name things. No visual change to existing tags.
  - `Popover`:
    - `side` (`bottom`/`top`) and `align` (`start`/`center`/`end`)
    - flips when the preferred side has no room
    - stays inside the viewport horizontally
    - exposes `data-side`
    - Escape calls `onClose` unless already handled, without closing a surrounding dialog
    - Defaults unchanged, so `Select` and `ChipsInput` look the same.
  - New types: `PopoverSide`, `PopoverAlign`.

- [ ] **Step 4: Run the full verification**

Run: `npm test && npm run lint && npm run smoke`
Expected: everything passes, and the smoke test reports the tarball resolves every subpath with the probe compiling.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json CHANGELOG.md scripts/smoke-exports.sh
git commit -m "chore(release): 0.1.0"
```

Then open the PR, wait for green, and merge. Tag `v0.1.0` (signed) on main only when the user says so.
