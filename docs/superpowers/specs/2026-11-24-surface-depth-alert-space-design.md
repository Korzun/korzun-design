# 0.5.0: concentric corners by surface depth, Alert, typed spacing

## Intent

The owner is moving Bookplate, aviary and Scribe onto `@korzun/design` and wants
agents to build screens without hand-picking corner radii. Corners should be
concentric everywhere: each surface nested inside another gets the next squarer
corner. In the owner's words, concentric corners "give a sense of depth when
there aren't more visual cues". Today that rule lives in `docs/corners.md` and
agents apply it by hand (`<Button radius="card">` inside every Card), which is
the mistake they make.

The round has three parts:

1. **Surface depth.** Corners come from where a component sits, site-wide.
2. **Alert.** A tinted box with a tone, a title, body text and an action. The
   first use is aviary's overdue banner: a warning Alert with a title and a
   Button, inside the frame Card.
3. **Typed spacing.** `theme.space` values are typed as `rem` strings, so
   `gap={theme.space.sm}` on Popover/Menu needs no `as PopoverGap` cast.

## Goals

- Button, Select, Card, CardRow and Alert pick their corner radius from their
  depth with no prop, everywhere inside a `Page` or `Dialog`.
- A Card nested in a Card (or a Dialog) steps down a level ("inset card").
- Aviary's banner is one `<Alert tone="warning" title=… action={<Button>…}>` with
  no radius props anywhere.
- Explicit `radius` / `surface` props keep working and always win.
- `theme.space.*` is assignable to `PopoverGap` without a cast.

## Non-goals

- Text inputs, TextArea, NumberInput, DateTimeInput, ChipsInput, Switch, Tag and
  the toast stay at their current radius. Listed as a follow-up; reshaping every
  form is a separate round.
- No dismiss button on Alert.
- `ErrorMessage` is unchanged and stays the inline red text.
- Typing `theme.radius` or other token groups.

## Anti-goals

- Corners that don't nest: anything inside a surface ending up rounder than or
  equal to the surface around it, where the rule says it should step down.
- Changes in the look of components rendered outside any `Page`/`Dialog`
  (tests, bare stories, consumers' own wrappers): with no surface around them,
  every component keeps today's default.
- Visual changes beyond corners (shadows, padding, colours) on existing
  components.

## Approaches

- **A. Buttons and Alert follow their surface; Select stays as is.** Smallest
  visual change: only Buttons in Cards change. Selects still need `surface="page"`
  by hand.
- **B. Site-wide: Page marks level 0, so Select on the page also follows**
  (chosen by the owner: "I want this pattern to be site-wide"). Every Select
  directly on a Page becomes 16px with the page shadow; Bookplate has about 36
  Selects to review when it moves onto the package.
- Rejected: CSS-only nesting (`.card .button`): can't cross the Popover/Dialog
  portal, can't be overridden cleanly by the explicit prop, and doesn't reach
  consumer components.

## Design

### Depth

A depth number, provided through React context (internal module
`src/component/surface/` or similar; builder's choice of folder):

| Depth | Radius token | Meaning |
|---|---|---|
| 0 | `radius.lg` (16px) | on the page background |
| 1 | `radius.md` (8px) | inside a Card or Dialog |
| 2+ | `radius.sm` (4px) | inside a surface inside a Card or Dialog (clamped) |
| none | each component's current default | no Page or Dialog above it |

Providers:

- `Page` provides depth 0 around everything it renders: the `header` slot, the
  controls row, the content area, `PageFooterActions`, and `type="minimal"`
  pages too ("site-wide").
- `Dialog` provides depth 1 to its header, body and footer. This replaces the
  0.3.0 `ButtonRadiusContext` (footer-only, body reset); footer Buttons stay
  `md`, so `ConfirmModal` stays pixel-identical.
- `Card` sitting at depth `d` provides `d + 1` to its header, body and footer.
  Outside any provider it counts as depth 0 (it is drawn as a page-level card,
  as now) and provides 1.
- `CardRow` behaves like Card. 0.0.6 gave it `lg` because "a row sits on the
  page background"; with depth it is `lg` on the page and `md` inside a Card,
  which is the same rule applied automatically. Its JSDoc ("for stacking items
  inside a `Card` body") is corrected to "a compact bordered row; its corners
  follow where it sits". Listed in the CHANGELOG as a visible change.
- `Alert` behaves like Card.
- `Popover` (and so Menu and Select's list) provides **depth 2** to its content,
  whatever depth its trigger sits at. A floating layer is `md` and its items
  `sm` (`docs/corners.md`), so a Button or Select inside a popover is `sm`.
  Context crosses `createPortal`, so Popover sets this explicitly. **Visible
  change** (CHANGELOG): Buttons and Selects placed inside a Popover become 4px.

The `ButtonRadiusContext` is replaced, not kept beside the new context.

### Consumers

- `Button`: `radius` prop wins; otherwise depth 0 → `background`, 1 → `card`,
  2+ → `inset`; no depth → `background` (today's default). `modal` stays a valid
  value (equal to `card`).
- `Select`: `surface` prop wins; otherwise depth 0 → `page`, 1 → `card`,
  2+ → a new `inset` surface (`radius.sm`, otherwise identical to `card`);
  no depth → `card` (today's default). **Owner-visible change:** Selects directly
  on a Page gain the page look (`radius.lg` + `shadow.cardStack`).
- `Card` (owner: "inset cards"): its own radius is the token for the depth it
  sits at (0 → lg, 1 → md, 2+ → sm). `size="small"` keeps its 1px rule: its
  radius is the token of the depth its *contents* get, plus 1px
  (depth 0 → `calc(md + 1px)` as today; depth 1 → `calc(sm + 1px)`; deeper
  clamps there). Only the radius changes; shadow and border stay.
- `CardRow`: radius is the token for its depth.
- `Alert`: radius is the token for its depth.

### Public API for consumers' own surfaces (my call)

Agents also build their own boxes (`recipe.row`, inset panels). So the pattern
reaches them, export from the component barrel:

- `Surface`: `({ children }) =>` renders no element, marks its children one level
  deeper than where it sits. For a hand-made inset box that contains Buttons.
- `useSurfaceRadius(): string`: the radius token for the current depth (no
  depth → `radius.lg`), for a consumer style that wants to follow.

Both get docs, JSDoc, stories, `<Name>Props` exports, as the repo rules require.
Builder may cut `useSurfaceRadius` if it can't be used naturally from a
react-jss sheet (it returns a value for an inline style or a sheet prop); if so,
note it in the plan.

### Alert

`src/component/alert/`, exported as `Alert`, `AlertProps`, `AlertTone`.

| Prop | Type | Notes |
|---|---|---|
| `tone` | `'warning' \| 'danger' \| 'success' \| 'info'` | Required. |
| `title` | `ReactNode` | Optional, semibold. |
| `children` | `ReactNode` | Body text. |
| `Icon` | `ComponentType<IconProps>` | Optional, before the title, in the tone's text colour. No default icon per tone (my call: there is no warning-triangle icon yet). |
| `action` | `ReactNode` | Right side; a Button picks up depth+1 corners automatically. Wraps under the text at narrow widths. |
| `className` | `string` | `'&&'` override convention. |

- Colours: `theme.color.chip[tone]` `bg`, `border` and `text` (title and icon in
  `text`; body in `text` too, or `text.default` if the chip text colour is too
  strong for a paragraph: builder checks contrast in both modes and picks).
- Padding and gaps from `theme.space`; radius from depth.
- Role (my call): `danger` and `warning` → `role="alert"`; `success` and
  `info` → `role="status"`.

Aviary's banner:

```
┌──────────────────────────────────────────┐  ← 8px, inside the frame Card
│ Frame is overdue              ┌────────┐ │
│ No check-in for 2h 14m.       │ Retry  │ │  ← Button 4px
│                               └────────┘ │
└──────────────────────────────────────────┘
```

### Typed spacing

- In `src/theme/theme.ts`, each `Theme['space']` value is typed as
  `` `${number}rem` `` (a named exported type, for example `SpaceValue`).
- `theme.space.sm` is then assignable to `PopoverGap` with no cast. Remove the
  cast from `docs/control/popover.md`, `docs/control/menu.md`, the Menu source
  and any story.
- A type test (`@ts-expect-error` style, as `menu/types.test.ts`) pins that
  `const g: PopoverGap = theme.space.sm` compiles.

### Docs and release

- `docs/corners.md`: the rule stays; "Picking the prop" becomes "It's automatic":
  depth table, the providers, `Surface` for hand-made boxes, explicit props as
  overrides. Remove "every Button inside a Card gets `radius="card"`".
- `AGENTS.md`: the corners rule says not to pass `radius`/`surface` by default;
  index entries for Alert and Surface.
- `docs/component/alert.md`, `docs/component/surface.md`; update Button, Select,
  Card, CardRow, Dialog, Page docs.
- `docs/patterns.md`: a "status banner in a card" recipe (the aviary shape).
- Stories: Alert (each tone, with/without title, icon, action, on page and in a
  card); a nesting story (Card in Card in Dialog, each with a Button and a
  Select) to eyeball concentric corners.
- CHANGELOG 0.5.0 lists the visible changes: Buttons in Cards default to `md`,
  Selects on a Page get the page look, nested Cards and CardRows in a Card step down, Buttons and Selects in a Popover are `sm`, Dialog body
  Buttons are `md`.
- Version 0.5.0; smoke probe for `Alert` and `Surface`.

### Internal hard-coded radii

Components in this repo that pass a radius to a child to fake the rule (for
example `FieldList`'s add Button, `radius="card"`) stop doing so whenever a
depth is present, so they follow the depth; with no depth around them they
keep passing today's value, so they look the same outside a Page or Dialog.
The builder sweeps `src/` for `radius=` and `surface=` on internal children
and applies this to each.

### Scope

This repo only. Bookplate still carries its own copies of these modules and
does not depend on the package; aviary adopting `Alert` and Bookplate's Selects
are reviewed when each app moves onto the package, not in this round. The
CLAUDE.md "styles move byte-equivalent from Bookplate" rule governed the 0.0.1
port; curation rounds since (0.0.6, 0.1.0) have already changed styles on
purpose and say so in the CHANGELOG, and this round does the same.

## Constraints

- React 19, react-jss tokens only (no literal radii except `calc(token ± 1px)`),
  peers only, relative imports to module folders, tests and stories for every
  changed component, `<Name>Props` with JSDoc, docs per exported module, the
  release flow in `CLAUDE.md`.

## Left to the builder

- Context shape and folder name; whether depth is a number or a small union.
- How Popover/Menu content opts out of inherited depth.
- Alert's exact padding, gap and body colour, within the tokens.
- Whether `useSurfaceRadius` ships (see above).
