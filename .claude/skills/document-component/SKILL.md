---
name: document-component
description: Use when documenting or migrating a korzun-design module's doc (docs/control, docs/component, theme, toast, icon) for the docs site, adding or fixing a module's examples/, or refreshing a module's doc, JSDoc and examples after its API was changed elsewhere.
---

# Document a component

The output is a module doc shaped like the pilots (`docs/control/button.md`,
`docs/component/alert.md`, `docs/component/stack.md`): hand-written guidance,
JSDoc that carries every note the old tables had, runnable examples that cover
every variant and state, and generated regions filled by `npm run docs:gen`.
It documents the module's current API: component types and runtime code stay
as they are (step 7 says what to do when they would need to change).

Below, `<area>/<module>` is the module folder (`control/menu`), `<slug>` the
folder name (`menu`), `<Name>` the main exported value (`Menu`). For an
entry-point module (`theme`, `toast`, `icon`) the doc is `docs/<area>.md`, the
source `src/<area>/` and the slug `<area>`.

Before you start, read [red-flags.md](red-flags.md): the thoughts that made
earlier runs fail review, and what to do instead.

## 0. Branch check

The generator lives on `main`. Run `ls scripts/docs-gen/cli.mjs`.
- It exists: continue.
- It is missing: your branch predates it; rebase on `main` (or stop and report "branch has no docs generator").

## 1. Read

1. `git show HEAD:docs/<area>/<slug>.md`: the old doc, before you edit anything. Keep it open; steps 2, 3 and 6 check against it.
2. `src/<area>/<module>/`: `index.tsx` (or `types.ts`), `style.ts`, `index.test.tsx`.
3. The module's changelog entries. A tag list can name several modules (`- [Popover, Select, ChipsInput, Modal] …`), so match the name anywhere in it:
   ```
   grep -nE "^\s*- \[([^]]*, )?<Name>(, [^]]*)?\]" CHANGELOG.md
   ```
   Read each hit and the sub-bullets indented under it (`sed -n '<line>,+12p' CHANGELOG.md`). They say what changed since the old prose was written.
4. The doc of every module it builds on: each `../<other>/` import in its source has a doc at `docs/<area>/<other>.md` (Select and Menu build on Popover: read `docs/control/popover.md`).
5. `AGENTS.md` (the styling rules examples must follow).
6. One pilot doc and its `examples/` as the shape reference: Button for a control, Alert or Stack for a component.

## 2. JSDoc audit (REQUIRED, every prop)

Every row of every generated table comes from a JSDoc line, and each type's
own comment renders under its table heading, so the JSDoc is the doc. Audit
**every** prop of every exported type of the module, and **every type-level
comment** (on an interface or type alias: `SwitchRadiusValue`, `MenuIntentProps`),
the lines already there as well as the ones you add. Fill in this table, one
row per prop and one row per type (`Type` alone in the first column); it goes
in your final report:

| Type.prop or Type | Old table note (verbatim, or "none") | JSDoc after | Default column shows ("–" for a type row) |
|---|---|---|---|

Every rule below applies to type-level comments too. A finished JSDoc line is:
- **On the prop itself.** Each clause of the old note (every behaviour, every "needs X", every "type error when Y", every "so Z works") appears on that prop's own `/** */`. The comment on an interface or type alias renders as a paragraph under that type's table heading; it carries only what is true of the type as a whole ("An item that navigates."). A clause that describes one prop (what it renders, needs or rejects) stays on that prop's JSDoc even when the type comment says it too: a merged union table (`MenuItem`, the one `items` links to) shows no type paragraph. A note about one prop that sits only in a type comment moves onto the prop: that is a comment-only change and allowed.
- **Inherited member, note for this module only.** When the type is an intersection that inherits the member from another module's type (`PageActionItem = MenuActionItem & { … }` inherits `Icon`) and the note holds only here ("ignored by `PageActionsBar`'s primary Buttons"), put `@member <name> <note>` on this type's own comment. The generator appends the note to that member's row in this doc only; the other module's doc is unchanged. Never park the note on a sibling prop. A `@member` naming no member of the type fails `docs:gen`.
- **Behaviour only, at most three sentences.** What it does, when it is ignored, what it flips to, what TypeScript rejects. No history ("as it has always looked", "since 0.3"), no naming rationale, no restated union values (the Type column lists them; describe only values that carry extra meaning, as Alert `tone` does for which ones are announced). A longer explanation lives in a Usage subsection and the JSDoc links to it.
- **Default-free prose.** The Default column carries defaults: no "(default)", "(the default)", "`'solid'` (default)" or "defaults to". The generator fills the column from the component's destructuring as written: literals (`side = 'bottom'`), functions (`onChange = () => {}` shows `() => {}`) and other expressions. Two cases need you:
  - The column shows a name a reader cannot use (an enum constant: `ButtonType.Default`) or is empty for a prop that has a default (a `??` fallback, a value set by a child component): add `@default <value>` (`@default 'default'`).
  - The prop's unset value is computed from where the component sits (it follows surface depth): no `@default`, and the description starts "Unset, it follows …" (Button `radius`).
  - A `@default` that is not a value is prose (`@default accepts numeric text`) and shows as plain text. The generator tells them apart by parsing: a single word (`@default none`) parses as a name and renders as code. Write a prose default as two words or more (`@default no limit`), or as a value (`@default undefined`).
- **Links as markdown, never a bare "see X".** Another doc: `[corners](../corners.md)`, `[Popover](../control/popover.md)`. A section of this doc: `[Forms](#forms)`.
- **`children` gets a home when it needs a note.** A props type written `PropsWithChildren<{ … }>` has no member to carry a `children` note. Replacing it with an explicit, JSDoc'd `children?: ReactNode` inside the object (and dropping the wrapper) is allowed: the type is equivalent, so it is not an API change and needs no CHANGELOG line. Keep `children` required only if it already was (`children: ReactNode`).
- **Characters as written.** Typed Unicode stays (… – “ ” ✕); never replace it with ASCII (`...`, `-`, `"`).

Rewrite example (the Default column then shows `'medium'`):

```ts
/** `'medium'` (default): regular height; `'small'`: compact, `'large'`: tall. */  // before
/** Height and font size. `'small'` fits a table row. */                          // after
```

## 3. Doc file

`docs/<area>/<slug>.md` is exactly these parts, in order:

````md
---
title: <Name>
description: <one sentence; it becomes the AGENTS.md index note and the overview card>
category: <one of scripts/docs-gen/categories.mjs, verbatim>
---
# <Name>

<!-- generated:import -->
<!-- /generated:import -->

<Intro: what it is and renders, 2–5 lines. Starts with the description sentence.>

Use something else for: <job> (`OtherComponent`), <job> (`Other`).

## Usage

<The old doc's prose, kept: choosing a variant, behaviour, keyboard tables,
"Behaviour to know", each as a `###` subsection.>

## Do / don't

<Optional. Each line names a prop or behaviour of THIS module.>

<!-- generated:examples -->
<!-- /generated:examples -->

<!-- generated:props -->
<!-- /generated:props -->

<!-- generated:tokens -->
<!-- /generated:tokens -->

<!-- generated:changelog -->
<!-- /generated:changelog -->
````

- Usage and Do / don't: check every sentence against the code, the changelog lines and the docs of the modules it builds on (step 1). Rewrite each sentence that is now false; keep every other sentence word for word, characters included. List each rewritten sentence, old and new, in your report.
- Short facts from the old Props section ("No `className`.", "Pass `value` and `onChange` together.") go in Usage, as a sentence in the `###` subsection whose subject they share, or a new subsection named for it (`### Styling`). A fact the generated import region already states ("props type exported as `MenuProps`") is dropped.
- The old hand-written `## Props`, `## Items` and type tables, and the old `## Example` code block, are removed once step 2 has moved their notes into JSDoc and step 4 has turned the example into `examples/`. Short code fragments in Usage and "don't" snippets stay. A Usage code block that a runnable example now repeats line for line becomes one sentence naming that example.
- An old `## Example` that cannot run in a frame (a router layout with `useLocation` and `<Outlet/>`, an app-root `ThemeProvider`, a native `<input>` wired by ARIA to a control the library lacks): keep the old block verbatim as a Usage code fragment, under a sentence saying why it is not a demo ("It needs the app's router, so it is shown as code."). Keep every name it defines (its `main`, `settingsItems` arrays); never trim it so it uses a variable it no longer defines. Then put every part that can run (the props, item kinds and neighbours it uses) into one example. List the fragment in your report.
- Replace a guidance table (a hand-written list of tokens, keys or values with notes) with a link to another doc only when that doc already carries every note in it, checked row by row. Otherwise keep the table. A link that drops a note loses it without notice.
- Generated regions are written by `docs:gen` only; you leave the markers empty.

## 4. Examples

Each example is `src/<area>/<module>/examples/NN-slug.tsx`:

```tsx
/** Basic
 * One `primary` action for the main step and a `default` button beside it.
 * `onClick` takes no arguments: the button passes no event.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [saves, setSaves] = useState(0);
  return (
    <Stack align="start">
      <Inline>
        <Button onClick={() => setSaves(0)}>Reset</Button>
        <Button type="primary" onClick={() => setSaves((n) => n + 1)}>
          Save
        </Button>
      </Inline>
      <Text tone="muted">Saves: {saves}</Text>
    </Stack>
  );
}
```

The first comment line is the title; the rest is the description shown above the demo.

A module that only shows on phones (its `style.ts` hides it with `[theme.breakpoint.normal]: { display: 'none' }`: BackButton, NavMobile, PageActionsMenu, TopFade) gets `@viewport mobile` on its own line in each such example's doc comment, after the description:

```tsx
/** Basic
 * A round back button that returns to the given route.
 * @viewport mobile
 */
```

The component page then renders that demo in a 390px-wide frame (its media queries see a phone), and an `01` with the tag gives a phone-width overview thumbnail. The tag line is left out of the description. The other value, `desktop`, is for a preview only (see "The preview"). Use `mobile` only where the module is hidden or laid out differently at desktop width, never to make a wide example fit. Check `style.ts` before tagging: a module with no breakpoint rule (PageFooterActions) shows at every width and gets no tag, and one hidden on phones (`[theme.breakpoint.mobile]`: PageActionsBar, NavDesktop) never does.
A phone-width frame is still a browser tab: `env(safe-area-inset-*)` is 0 there, so chrome sized by the installed app's insets (TopFade's band, NavMobile's home-indicator padding) shows at its browser-tab size. That is expected; do not add props or descriptions to fake the inset. Check the page at phone width too: `shoot-page.mjs … --width 390`.

- Imports: entry points only (`@korzun/design/<entry>`), all `@korzun/design/*` first then `react`, one block.
- Default export, no props. Layout with `Stack`/`Inline`, text with `Text`/`Heading`, no inline styles or literals.
- Text is typed Unicode (`Loading…`, `2–5`), never HTML entities and never ASCII stand-ins; strings match the component's own (`Loading…`, not `Loading...`).
- Every interactive control is wired to state, so using it visibly changes the demo, including a `Button` that is only there to show layout (Stack 03 counts its "Add a book" clicks): a controlled value with its setter, plus a `Text` readout where the control does not display its own value ("Chosen: Edit"). No handler that does nothing (`() => {}`, `() => undefined`, `() => null`, `noop`, a function with an empty body). Quick check, which must print nothing: `grep -rnE '\(\) => (\{\s*\}|undefined|null)|noop' --exclude=preview.tsx src/<area>/<module>/examples/`; it does not catch every do-nothing handler, so also read each handler. One exception: a callback the type requires but the component never calls (a `PageFooterActions` `FooterAction` with `submit: true` takes `onClick` and submits the form instead) gets `() => {}`, and that one grep hit is expected; say so in your report. Do not invent wiring for it (a ref that calls `requestSubmit()`). A shared `items` constant becomes a function of the setter, or moves inside the component.
- Titles and descriptions name no defaults: no "(the default)", no "`solid` by default".
- Each description sentence is shown by the demo. "Set `ariaLabel` when the trigger is an icon" means the demo's trigger is an icon `Button` with `ariaLabel`.
- Examples follow the Usage and Do / don't of this doc and of every component they use (read `docs/component/surface.md` before using `Surface`). An example never demonstrates a use those docs advise against (a `Surface` with no drawn box around it).
- `01` is the canonical compact usage, the first demo on the component page. The overview thumbnail is the preview below, not `01`.
- A lone trigger (a `Button` that opens a `Modal`, a fragment root `<>`) goes in an `Inline` or a `Stack align="start"`: at the root of the frame it stretches to the full width.
- A readout ("Chosen: …", "Saved: …") goes under the trigger or row of buttons, never beside or above it (except over a `side="top"` trigger, below): `<Stack align="start">`, the controls (several in an `Inline`), then `<Text tone="muted">`.
- Groups that show one value each (layouts, surfaces, radii) get a caption naming it: `<Stack gap="xl">` of groups, each a `<Stack gap="xs">` with `<Text size="sm" tone="muted">` (`layout="horizontal"`) above its demo. Labels in a `horizontal` form stay short (under about 6rem, "Index", "Width") so the fields line up.
- The first example of an overlay module (Modal, ConfirmModal, useModal, Popover, Menu, Select) starts open: `useState(true)` for a controlled `open`, or a trigger that opens once on mount (Menu 01, Select 01). The frame hands back the focus the overlay takes while it loads, so the docs page keeps its keyboard.
- An example with an overlay places its trigger so the overlay opens on the side the example is about (a `side="top"` trigger sits below other content, its readout included, or the overlay flips down before the frame can make room). The frame adds room above for a `side="top"` overlay, and room below for a list that flipped upward for lack of room, so it opens downward as it would on a page.
- A description talks about the component, never the demo frame (no "to stay inside the demo"). No prop (`side`, a large `gap`) is set only to fit the frame. When the frame clips an overlay and the example is as it should be, report a gallery defect.
- Link items and `to` props stay real links. Clicking one in a demo shows the frame's "The example navigated to…" page; that is expected.

### The preview

Every module also has `examples/preview.tsx`, its overview thumbnail. It is rendered alone in a small, centred, non-interactive frame (about 430×240px, scaled to 0.6) and never shown on the component page or in the doc; `docs:check` fails without one.

```tsx
/** Preview */
import { Inline } from '@korzun/design/component';
import { Button } from '@korzun/design/control';

export default function Preview() {
  return (
    <Inline>
      <Button type="primary">Save</Button>
      <Button>Cancel</Button>
    </Inline>
  );
}
```

- Show the component and nothing else, like an Ant Design overview card: one instance or a tight row of variants. No `Text` readouts or explanations, no wrapper `Card` unless the module only exists inside one (CardRow), no buttons that drive a demo.
- An overlay (Modal, Menu, Popover) is shown open. A phone-only module takes `@viewport mobile` as in its `01`. The thumbnail frame is about 430px wide, under the 640px mobile breakpoint, so a module hidden on phones (PageActionsBar, NavDesktop) takes `@viewport desktop`: the thumbnail lays it out at 680px and scales it to fit. Never override a module's own breakpoint styles to show it.
- It is not interactive, so the wiring rule above does not apply: a required handler may be `() => {}` (the grep check excludes `preview.tsx`).
- Check it: `http://localhost:<port>/#/frame/<slug>/preview?fit=center&theme=light` at a 430×240 viewport, in both themes.

Coverage checklist (REQUIRED; fill in every row, it goes in your report). Each row names its example file:

| What | Value | Example file |
|---|---|---|
| each union-typed prop (`type`, `tone`, `size`, `variant`, `side`, `align`, `surface`, `gap`, …) | every value, each visible on its own and labelled | |
| each state the module has (`disabled`, `loading`, error, empty, read-only) | each, visible on its own and held: a state reached only briefly (a timer, an in-flight request) gets a toggle that keeps it on, and has its own shot | |
| the old doc's main `## Example` | list every prop and item kind it uses (Menu: `align="end"`, link item, action item, `Icon`, `danger`, `separatorBefore`); one example contains all of them | |
| the common composition with its usual neighbours (in a `Card`, `Modal`, form, row) | one | |
| every interactive control wired to state with a visible effect | no do-nothing handler (grep above prints nothing, each handler read); each control's effect named | all |
| each description sentence shown by its demo | checked, sentence by sentence | all |
| examples follow this doc's and the used components' Usage and Do / don't | checked | all |

A union with many values (a `gap` scale, every `tone`) can be one example
showing all values side by side, each labelled with its value.

## 5. Delete stories

No `*.stories.tsx` remain (0.5.1 replaced the story gallery with the docs
site). If one turns up in the module, `git rm` it; examples replace it.

## 6. Verify (REQUIRED, in order)

1. `npx oxfmt src/<area>/<module>` then `npm run docs:gen`.
2. Notes check, row by row. For each row of your audit table, find every clause of its Old note column in **that prop's own row** of the generated table. Only a clause no single prop owns may live in its type's description paragraph instead. A clause found only in an example, in Usage, or in another prop's row is lost: put it on the prop's JSDoc and regenerate. Then read every generated row: type, default and description right. A wrong row that right JSDoc cannot fix (a merged union with the wrong type, an unlinked supporting type) is a generator problem: write it in your report with the file and line. A type cell links a type whose table is in another migrated doc by itself (`PageActionItem` in `page-actions-bar.md` links to `../control/page-actions-menu.md#pageactionitem`); a type from a doc not migrated yet stays plain code until that doc is, which is not a defect. Do not hand-write that link into the JSDoc. The generated text is regenerated, never edited. A member typed as an object literal prints short: comments inside the type are dropped, a nested literal reads `{ … }` (`zIndex`'s `stack: { … }`), and a literal still over 120 characters lists its keys only (`Theme`'s `color` reads `{ gray, blue, red, text, … }`). That is by design, not a defect: the row's JSDoc names where the full shape is documented (`[tokens](../tokens.md#color)`), and no tag turns it off.
3. `npm run lint`.
4. `npm test` once (build, vitest, script tests, docs:check), with the full log kept: `S=<scratch>; npm test > $S/<slug>/test.log 2>&1; echo "exit $?"; tail -5 $S/<slug>/test.log`. Fix and rerun until green; the last run's log stays at that path. Run it after your last edit to `src/` or `docs/`, so the log is newer than every file you commit.
5. Screenshots: the last step before the commit. Any edit after a screenshot (an example, its description, JSDoc, the doc) means you redo 6.1 to 6.5 and reshoot that example's shots and the full page.

   Each block below is one Bash call; shell variables do not survive between calls, so the port and process id live in files and every call starts by setting `S` to your scratch directory (the same absolute path each time).
   Start the gallery on a free port, in its own process group:
   ```
   S=<scratch>; node -e "const s=require('net').createServer().listen(0,()=>{console.log(s.address().port);s.close()})" > $S/gallery.port
   PORT=$(cat $S/gallery.port); setsid npm run gallery -- --port $PORT --strictPort > $S/gallery.log 2>&1 & echo $! > $S/gallery.pid
   ```
   Wait for it:
   ```
   S=<scratch>; PORT=$(cat $S/gallery.port); for i in $(seq 1 60); do curl -s -o /dev/null http://localhost:$PORT/ && break; sleep 1; done; echo "gallery on $PORT"
   ```
   Shoot the whole page, light and dark (writes `<slug>-light.png` and `<slug>-dark.png`; it waits until every demo frame has loaded and sized itself):
   ```
   S=<scratch>; PORT=$(cat $S/gallery.port); node .claude/skills/document-component/shoot-page.mjs http://localhost:$PORT <slug> $S/<slug>.png
   ```
   Overlay shots (REQUIRED): one for **every** example that contains an overlay control (Menu, Select, Popover, Modal, ChipsInput, anything that opens a list or layer), each opened the way a reader opens it, light and dark:
   ```
   S=<scratch>; PORT=$(cat $S/gallery.port); node .claude/skills/document-component/open-overlay.mjs http://localhost:$PORT <slug> <example-slug> $S/<slug>-<example-slug>-open.png --click "<role>:<name>"
   ```
   `<example-slug>` is the example file name without `NN-` and `.tsx`. Steps run in order, one per reader action:
   - `--click "<role>:<name>"`: the element with that ARIA role and exact accessible name; a bare name means role `button`. A Select's trigger is `button:<its shown value or placeholder>`.
   - `--click "Open dialog" --click "Actions"`: a menu inside a dialog.
   - `--click "<role>:<name>#2"`: the second element with that role and name (1-based), when several share one.
   - `--type "<role>:<text>"`: types into the first element with that role; it needs no accessible name (`--type "textbox:Fi"` after opening a searchable Select; `--type "combobox:Fan"`). `--type "textbox#2:…"` types into the second textbox. For a newline (a TextArea), pass the text with zsh/bash ANSI quoting: `--type $'textbox:One\nTwo'`.
   - `--press <key>`: `ArrowDown`, `Enter`, `Escape`, `Backspace`. It presses on whatever has focus, so a key after `--type` lands in that field.
   - A validity state that only typing reaches (invalid, too long) gets its own shot: the steps that reach it (`--type "textbox:abc"`, then `--press Backspace` if needed) are the held view.
   - `--width <px>` (both scripts) sets the browser width: `--width 390` to see the page as a phone does.
   An example with several overlays gets one shot per overlay.

   Fill in this table; it goes in your report:

   | Example | Overlay | Steps | Shot paths (light, dark) | Fully visible? |
   |---|---|---|---|---|

   View every PNG. Each example renders, is not empty, and is legible in dark. Each overlay is fully visible inside its frame. An overlay cut at the frame edge is a defect: fix the example (move the trigger, give the list room), or, when the example is right, report it under generator problems as a gallery defect with the shot path.
   Reshoot check (REQUIRED, last thing before the commit). With `<oldest>` the oldest PNG of your final set of shots:
   ```
   find src/<area>/<module> docs/<area>/<slug>.md -newer <oldest>
   ```
   (entry-point module: `find src/<area> docs/<area>.md -newer <oldest>`). It prints nothing. Anything it prints means reshoot that example's shots and the full page, then run it again. Run it again after every follow-up commit too (a review fix, a JSDoc tweak), right before you report, and quote its empty output in the report; a commit made after the last shots means reshooting first.
   Stop the server by its process group: `S=<scratch>; kill -- -$(cat $S/gallery.pid)`.

## 7. Commit

- Doc, JSDoc, examples and the stories deletion: one commit, `docs(<slug>): generated docs and examples`.
- An unrelated fix you needed (a brittle test, a typo elsewhere): its own commit, before it.
- CHANGELOG: if the diff in `src/` changes only comments and `examples/` (or swaps `PropsWithChildren<{ … }>` for an explicit `children`, see §2), no CHANGELOG line: a doc refresh is runtime-neutral (0.5.1's `[General]` line announced the migration itself; the 0.5.1 `[Popover]` line, `data-preferred-side`, is the kind of runtime change that does get one). If documenting it would need a change to runtime code or a type (a bug, a missing prop), stop and report it: that change is made elsewhere, with its own CHANGELOG line, and this skill then refreshes the doc.

## 8. Report

Your report contains, in order:
1. The JSDoc audit table from step 2 (every old note and where it lives now).
2. The coverage checklist from step 4.
3. Every Usage and Do / don't sentence you rewrote (old, new, why), and any you doubt but kept.
4. Each check from step 6 with its result (`docs:check: ok`, test counts, lint clean). For `npm test`, give the path of `$S/<slug>/test.log` and quote its last lines (the vitest `Tests` count, the script `pass`/`fail` counts and `docs:check: ok`). Quote the final reshoot `find` (empty), run after your last commit. If `docs:gen` stops with "`<Name>` takes `<Type>`, which … does not export", the props type is missing from the entry: that is a type export with its own CHANGELOG line, made outside this skill (step 7), not a doc to write as "takes no props".
5. The full-page shot paths and the overlay table from step 6.5, with what you fixed or found in them.
6. Generator and gallery problems (file, line, shot path), and anything left undone.
