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
| On the page background | `lg` | `Card`, modal dialog (`recipe.modal.dialog`), a standalone `Button` (default `radius`), `<Select surface="page">` |
| Inside a card or modal | `md` | inputs (`recipe.input`), `Button radius="card"` / `"modal"`, `Tag`, shaded rows, inset boxes |
| Inside one of those | `sm` | a chip inside an input, `Button radius="inset"` inside an inset box, a menu item, a Switch track in a shaded row |
| Flush with its parent (zero inset, edges touch) | the parent's radius | an unlabelled Select's trigger, an input filling its row |
| Inset 4px or less from its parent | `calc(parent − inset)` | a Switch thumb 2px inside a 4px track is 2px |
| A small control with no nearby corner | `pill` / `circle` | a Switch in a full-width card header |
| A floating layer (popover, menu, dropdown, toast) | `md`, plus `shadow.hoverLift` or `recipe.glass` | its items are `sm` |

**Step down one token per level** (`lg` → `md` → `sm`). Do not subtract the
padding: a Card has 13px of inset, but the inputs inside it are `md` (8px), not
16 − 13 = 3px. Exact subtraction applies only to tight insets of 4px or less.

## Picking the prop

Components take the radius as the **surface they sit on**, not as a size:

| Component | Prop | Values |
|---|---|---|
| `Button` | `radius` | `background` (lg, the default), `card` (md), `modal` (md), `inset` (sm) |
| `Select` | `surface` | `page` (lg), `card` (md) |
| `Switch` | `radius` | `inset` (sm track), `pill` |

- Every `Button` inside a `Card` (body or footer) gets `radius="card"`. Leaving
  it out gives a 16px button inside a 16px card: a bug.
- Every `Button` in a modal footer gets `radius="modal"`.
- `type="link"` buttons have no padding or background, so radius doesn't apply.

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
  non-token form allowed is `calc(theme.radius.X - Npx)` for tight insets.
- Known off-scale values in the library (don't copy them): `CardRow` uses
  `12px`, and `Card size="small"` uses `9px`.
