---
name: document-component
description: Use when documenting or migrating a korzun-design module's doc (docs/control, docs/component, theme, toast, icon) for the docs site, adding or fixing a module's examples/, or after changing a component's props or JSDoc so its generated doc, tables and examples are out of date.
---

# Document a component

The output is a module doc shaped like the pilots (`docs/control/button.md`,
`docs/component/alert.md`, `docs/component/stack.md`): hand-written guidance,
JSDoc that carries every note the old tables had, runnable examples that cover
every variant and state, and generated regions filled by `npm run docs:gen`.
Below, `<area>/<module>` is the module folder (`control/menu`), `<slug>` the
folder name (`menu`), `<Name>` the main exported value (`Menu`).

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

Coverage checklist (REQUIRED; fill it in, it goes in your report). List every row
below for this module, and give each an example file:

| What | Value | Example file |
|---|---|---|
| each union-typed prop (`type`, `tone`, `size`, `variant`, `side`, `align`, `surface`, `gap`, …) | every value, each visible on its own | |
| each state the module has (`disabled`, `loading`, error, empty, read-only) | each | |
| the old doc's main `## Example` composition | reproduced | |
| the common composition with its usual neighbours (in a `Card`, `Dialog`, form, row) | one | |

## 5. Delete stories

`git rm src/<area>/<module>/*.stories.tsx`. Examples replace stories.

## 6. Verify (REQUIRED, in order)

1. `npx oxfmt src/<area>/<module>` then `npm run docs:gen`.
2. Read every generated table in the doc against the old doc, row by row: each old note is present; types and descriptions are right for each row. A wrong row (a merged union with the wrong type or description, an unlinked supporting type, a missing default) is a generator problem: write it in your report with the file and line. Fix JSDoc when the JSDoc is wrong; the generated text is regenerated, never edited.
3. `npm run lint`.
4. `npm test` once (build, vitest, script tests, docs:check). Fix and rerun until green.
5. Screenshots. Start `npm run gallery` in the background, wait for `http://localhost:5173`, then:
   ```
   playwright screenshot --viewport-size 1280,2400 --wait-for-timeout 15000 "http://localhost:5173/#/components/<slug>" <scratch>/<slug>-light.png
   playwright screenshot --color-scheme dark --viewport-size 1280,2400 --wait-for-timeout 15000 "http://localhost:5173/#/components/<slug>" <scratch>/<slug>-dark.png
   ```
   For each example whose demo opens an overlay (menu, popover, select list, dialog), open it inside its demo frame:
   ```
   node .claude/skills/document-component/open-overlay.mjs <slug> <example-slug> "<trigger button name>" <scratch>/<slug>-<example-slug>-open.png
   ```
   `<example-slug>` is the example file name without `NN-` and `.tsx`. View every PNG. Each example renders, is not empty, is legible in dark. An example that renders wrong because of its own content (a `side="top"` trigger with no room above, so it flips) is fixed in the example. An overlay cut off at the frame edge is reported with its screenshot path. Stop the server (`pkill -f "vite --config gallery"`).

## 7. Commit

- Doc, JSDoc, examples and the stories deletion: one commit, `docs(<slug>): generated docs and examples`.
- An unrelated fix you needed (a brittle test, a typo elsewhere): its own commit, before it.
- CHANGELOG: if the diff in `src/` changes only comments, `examples/` and `*.stories.tsx`, no CHANGELOG line (the 0.5.1 `[General]` line covers the migration). If documenting it needs a change to runtime code or a type, stop and report it: behaviour changes are out of scope here.

## 8. Report

Your report contains, in order:
1. The JSDoc audit table from step 2 (every old note and where it lives now).
2. The coverage checklist from step 4.
3. Each check from step 6 with its result (`docs:check: ok`, test counts, lint clean).
4. Every screenshot path, and what you fixed or found in them.
5. Generator problems and anything left undone.
