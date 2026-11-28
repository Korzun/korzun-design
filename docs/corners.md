---
title: Corners
description: Corner radius by nesting depth, one radius step per level.
category: Guide
---
# Corners

Corner radius tracks **depth**, not size. Surfaces on the page background have
the roundest corners. Each surface nested inside another gets a squarer,
concentric corner, so the inner curve follows the outer one.

## Tokens

| Token | Value | Use |
|---|---|---|
| `theme.radius.lg` | 16px | Surfaces on the page background |
| `theme.radius.md` | 8px | One level in: inside a card or modal; also floating layers |
| `theme.radius.sm` | 4px | Two levels in: inside an input, inset box, row, or menu |
| `theme.radius.pill` | 999px | Capsules: nav bar, a Switch with no nearby corner |
| `theme.radius.circle` | 50% | Round glass buttons |

## The rule

Find where the element sits, then read its radius from this table:

| Where the element sits | Radius | Examples |
|---|---|---|
| On the page background | `lg` | `Card`, modal dialog (`recipe.modal.dialog`), and any control directly on a `Page`: `Button`, `Select`, `CardRow`, text fields, `Tag` (automatic) |
| Inside a card or modal | `md` | inputs and their shaded rows, Buttons, Selects, Tags and SegmentedControls in a Card or Dialog (automatic), shaded rows (`recipe.row`), inset boxes |
| Inside one of those | `sm` | a chip inside an input, controls in a nested Card, CardRow, inset box (`Surface`) or Popover (automatic), a menu item, a Switch track in a shaded row |
| Flush with its parent (zero inset, edges touch) | the parent's radius | an unlabelled Select's trigger, an input filling its row |
| Inset 4px or less from its parent | `calc(parent − inset)` | a Switch thumb 2px inside a 4px track is 2px |
| A small control with no nearby corner | `pill` / `circle` | a Switch in a full-width card header |
| A floating layer (popover, menu, dropdown, toast) | `md`, plus `shadow.hoverLift` or `recipe.glass` | its items are `sm` |

**Step down one token per level** (`lg` → `md` → `sm`). Do not subtract the
padding: a Card has 13px of inset, but the inputs inside it are `md` (8px), not
16 − 13 = 3px. Exact subtraction applies only to tight insets of 4px or less.

## It's automatic

Components read their corners from the **surface depth** they sit at, so you
pass no radius prop:

| Depth | Radius | Where |
|---|---|---|
| 0 | `lg` (16px) | On the page background, inside a `Page` |
| 1 | `md` (8px) | Inside a `Card`, `CardRow`, `Alert` or `Dialog` on the page |
| 2+ | `sm` (4px) | One more level in; deeper levels stay `sm` |
| none | each component's old default | No `Page`, `Dialog`, `Card`, `CardRow`, `Alert` or `Surface` above it (tests, a component rendered on its own) |

Who provides depth:

- `Page` provides 0, to its header, content and footer actions.
- `Dialog` provides 1 to its header, body and footer.
- `Card`, `CardRow` and `Alert` each provide one level deeper than where
  they sit, so a Card in a Card steps down.
- `Popover` (and so `Menu` and the `Select` list) provides a fixed 2: a
  floating layer is `md` and its items `sm`, whatever opened it.

What follows depth with no prop: `Button`, `Select`, `Card`, `CardRow`,
`Alert`, `TextInput`, `TextArea`, `NumberInput`, `DateTimeInput`,
`ChipsInput` (its chips a step further in), `SegmentedControl`, `Tag`, and a
`Switch` row (`layout="horizontal"`, its `inset` track a step further in). A
field's shaded row and the field in it are flush, so both take the depth
radius. For a hand-made box that holds Buttons or Selects, wrap its contents
in `<Surface>` and read its own radius with `useSurfaceRadius()`; see
[surface](component/surface.md).

Hand-drawn boxes (your own `recipe.card.shell` or `recipe.row` styles, a `useModalDialog` modal) are invisible to depth: wrap their contents in `Surface`.

An explicit prop (`Button radius`, `Select surface`) is an **override** and
always wins over depth. It pins that radius even where depth would step down,
which breaks concentricity, so set it only when the surface really is different
(`radius="background"` on a Button that must stay round inside a Card).

`Switch` still takes `radius` (`inset` or `pill`) by hand for its track;
`inset` follows the row as above, `pill` stays a capsule. `type="link"`
buttons have no padding or background, so radius doesn't apply. Floating
layers (`Toast`, a `Popover` surface, the `ChipsInput` suggestion list) stay
`md` wherever they open.

## In your own styles

```ts
const useStyles = createUseStyles((theme: Theme) => ({
  panel: { ...theme.recipe.card.shell },  // already lg
  inset: {
    backgroundColor: theme.color.bg.cardHeader,
    borderRadius: theme.radius.md,        // one level in
    padding: theme.space.md,
  },
  chip: { borderRadius: theme.radius.sm }, // two levels in
  knob: { borderRadius: `calc(${theme.radius.sm} - 2px)` }, // 2px inset
}));
```

- Never write a literal `borderRadius` (`'12px'`, `'50%'`). The only
  non-token form allowed is `calc(theme.radius.X ± Npx)` for tight insets.
- A 1px inset works the other way too: `Card size="small"` is
  `calc(radius.md + 1px)` so its flush `md` children stay concentric.
