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
source `src/<area>/`, the slug `<area>`, and stories are
`src/<area>/*.stories.tsx` (e.g. `src/toast/toast.stories.tsx`).

## 0. Branch check

Run `ls scripts/docs-gen/cli.mjs`.
- It exists: continue.
- It is missing and your dispatch says to fast-forward: `git merge --ff-only docs-site`, then continue.
- It is missing otherwise: stop and report "branch has no docs generator".

## 1. Read

1. `git show HEAD:docs/<area>/<slug>.md`: the old doc, before you edit anything. Keep it open; steps 2 and 5 check against it.
2. `src/<area>/<module>/`: `index.tsx` (or `types.ts`), `style.ts`, `index.test.tsx`.
3. `AGENTS.md` (the styling rules examples must follow).
4. One pilot doc and its `examples/` as the shape reference: Button for a control, Alert or Stack for a component.

## 2. JSDoc audit (REQUIRED, every prop)

Every row of every generated table comes from a JSDoc line, so the JSDoc is
the doc. Audit **every** prop of every exported type of the module, the lines
already there as well as the ones you add. Fill in this table; it goes in your
final report:

| Type.prop | Old table note (verbatim, or "none") | JSDoc after | Default column shows |
|---|---|---|---|

A finished JSDoc line is:
- **On the prop itself.** Interface- and type-level comments are not rendered; a note there is lost. Each clause of the old note (every behaviour, every "needs X", every "type error when Y") appears on that prop's own `/** */`.
- **Behaviour the Type column cannot show**: what it does, when it is ignored, what it flips to, what TypeScript rejects. The Type column already lists union values; the description explains only values that carry extra meaning (Alert `tone`: which ones are announced).
- **Default-free prose.** The Default column carries defaults. It is filled from literal defaults in the component's destructuring (`side = 'bottom'`). If after `docs:gen` the column is empty for a prop that has a default (an enum constant, a `??` fallback, a value set by a child component), add `@default <value>` to that prop. Wording like "(default)", "`'solid'` (default)" or "defaults to" does not appear in descriptions.
- **Links as markdown relative to the doc**: `[corners](../corners.md)`.

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

<Intro: what it is and renders, 2-5 lines. Starts with the description sentence.>

Use something else for: <job> (`OtherComponent`), <job> (`Other`).

## Usage

<The old doc's prose, kept: choosing a variant, behaviour, keyboard tables,
"Behaviour to know", each as a `###` subsection. Edit only what is now wrong.>

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

The old hand-written `## Props`, `## Items` and type tables, and the old
`## Example` code block, are removed once step 2 has moved their notes into
JSDoc and step 4 has turned the example into `examples/`. Short code
fragments in Usage and "don't" snippets stay as prose. Generated regions are
written by `docs:gen` only; you leave the markers empty.

## 4. Examples

Each example is `src/<area>/<module>/examples/NN-slug.tsx`:

```tsx
/** Basic
 * One `primary` action for the main step and a `default` button beside it.
 * `onClick` takes no arguments: the button passes no event.
 */
import { Inline, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [saves, setSaves] = useState(0);
  return (
    <Inline>
      <Button onClick={() => setSaves(0)}>Reset</Button>
      <Button type="primary" onClick={() => setSaves((n) => n + 1)}>
        Save
      </Button>
      <Text tone="muted">Saves: {saves}</Text>
    </Inline>
  );
}
```

The first comment line is the title; the rest is the description shown above the demo.

- Imports: entry points only (`@korzun/design/<entry>`), all `@korzun/design/*` first then `react`, one block.
- Default export, no props. Layout with `Stack`/`Inline`, text with `Text`/`Heading`, plain characters (no HTML entities), no inline styles or literals.
- A handler shows its effect (a `Text` readout via `useState`, a toast) wherever that takes a line or two.
- Examples follow the doc's own advice (if Usage says "separator before danger items", every danger item has one).
- `01` is the canonical compact usage: it is the overview thumbnail.
- Link items and `to` props stay real links. Clicking one in a demo shows the frame's "The example navigated to…" page; that is expected.

Coverage checklist (REQUIRED; fill it in, it goes in your report). List every row
below for this module, and give each an example file:

| What | Value | Example file |
|---|---|---|
| each union-typed prop (`type`, `tone`, `size`, `variant`, `side`, `align`, `surface`, `gap`, …) | every value, each visible on its own | |
| each state the module has (`disabled`, `loading`, error, empty, read-only) | each | |
| the old doc's main `## Example` composition | reproduced | |
| the common composition with its usual neighbours (in a `Card`, `Dialog`, form, row) | one | |
| examples follow the doc's own advice (Usage and Do / don't) | checked in every example | all |
| handlers show a visible effect where it takes a line or two | checked in every example | all |

A union with many values (a `gap` scale, every `tone`) can be one example
showing all values side by side, each labelled with its value.

## 5. Delete stories

`git rm src/<area>/<module>/*.stories.tsx`. Examples replace stories. On this
branch this supersedes CLAUDE.md's per-control stories rule (Task 15 updates
CLAUDE.md).

## 6. Verify (REQUIRED, in order)

1. `npx oxfmt src/<area>/<module>` then `npm run docs:gen`.
2. Read every generated table in the doc against the old doc, row by row: each old note is present; types and descriptions are right for each row. A wrong row (a merged union with the wrong type or description, an unlinked supporting type, a missing default) is a generator problem: write it in your report with the file and line. Fix JSDoc when the JSDoc is wrong; the generated text is regenerated, never edited.
3. `npm run lint`.
4. `npm test` once (build, vitest, script tests, docs:check). Fix and rerun until green.
5. Screenshots. Each block below is one Bash call; shell variables do not survive between calls, so the port and process id live in files and every call starts by setting `S` to your scratch directory (the same absolute path each time).
   Start the gallery on a free port, in its own process group:
   ```
   S=<scratch>; node -e "const s=require('net').createServer().listen(0,()=>{console.log(s.address().port);s.close()})" > $S/gallery.port
   PORT=$(cat $S/gallery.port); setsid npm run gallery -- --port $PORT --strictPort > $S/gallery.log 2>&1 & echo $! > $S/gallery.pid
   ```
   Wait for it:
   ```
   S=<scratch>; PORT=$(cat $S/gallery.port); for i in $(seq 1 60); do curl -s -o /dev/null http://localhost:$PORT/ && break; sleep 1; done; echo "gallery on $PORT"
   ```
   Shoot the whole page, light and dark; it waits until every demo frame has loaded and sized itself:
   ```
   S=<scratch>; PORT=$(cat $S/gallery.port); node .claude/skills/document-component/shoot-page.mjs http://localhost:$PORT <slug> $S/<slug>.png
   ```
   For each example whose demo opens an overlay, open it inside its demo frame, light and dark, with one step per action a reader takes:
   ```
   S=<scratch>; PORT=$(cat $S/gallery.port); node .claude/skills/document-component/open-overlay.mjs http://localhost:$PORT <slug> <example-slug> $S/<slug>-<example-slug>-open.png --click "<trigger name>"
   ```
   `<example-slug>` is the example file name without `NN-` and `.tsx`. Steps: `--click "role:name"` (role defaults to `button`; `--click "Open dialog" --click "Actions"` opens a menu inside a dialog), `--type "combobox:Fan"` types into the first element with that role, `--press Escape`.
   View every PNG. Each example renders, is not empty, is legible in dark, and each opened overlay is fully visible in its open-overlay shot. An example that renders wrong because of its own content (a `side="top"` trigger with no room above, so it flips) is fixed in the example; anything else is reported with its screenshot path.
   Stop the server by its process group: `S=<scratch>; kill -- -$(cat $S/gallery.pid)`.

## 7. Commit

- Doc, JSDoc, examples and the stories deletion: one commit, `docs(<slug>): generated docs and examples`.
- An unrelated fix you needed (a brittle test, a typo elsewhere): its own commit, before it.
- CHANGELOG: if the diff in `src/` changes only comments, `examples/` and `*.stories.tsx`, no CHANGELOG line (the 0.5.1 `[General]` line covers the migration). If documenting it would need a change to runtime code or a type (a bug, a missing prop), stop and report it: that change is made elsewhere, with its own CHANGELOG line, and this skill then refreshes the doc.

## 8. Report

Your report contains, in order:
1. The JSDoc audit table from step 2 (every old note and where it lives now).
2. The coverage checklist from step 4.
3. Each check from step 6 with its result (`docs:check: ok`, test counts, lint clean).
4. Every screenshot path, and what you fixed or found in them.
5. Generator problems and anything left undone.
