# Changelog

## 0.7.0 — 2026-11-26

- [Anchor] New `Anchor` (control): a page outline from `items` (`{ id, title, level }`) that highlights the section in view and scrolls to one on click. `variant="list"` is an indented list of titles; `variant="minimap"` is a column of dashes that opens the list in a panel on hover or focus, as in Notion. `offset` allows for sticky chrome; it never changes the URL.
- [Space] New `Space`: one layout primitive with a `direction` (default `'horizontal'`), `gap`, `align`, `justify`, `wrap`, `as` and a `split` separator drawn between items (hidden from screen readers, an `li` inside a list). Each direction keeps Stack's or Inline's defaults.
- [Space] **Breaking:** `Stack` and `Inline` (and `StackProps`, `InlineProps`) are removed; use `Space`. `<Stack …>` is `<Space direction="vertical" …>` and `<Inline …>` is `<Space …>`, with every prop and default unchanged.
- [Switch] While loading, an `inset` (squared) switch shows a rounded-square ring with an arc travelling around it in the thumb's place, instead of the round spinner, which clashed with its square corners. A `pill` switch keeps the round spinner.
- [ProgressCircle] **Breaking:** `ProgressIndicator` is renamed `ProgressCircle` (`ProgressIndicatorProps` → `ProgressCircleProps`). It always draws the circle and writes a number, 0 and 1 included; "Not started" and "Completed" are gone from the component and live in the new Reading progress recipe. The whole mark, label included, is now one `progressbar` with `aria-valuetext`.
- [ProgressCircle] New props: `tone` (`brand`, `success`, `warning`, `danger`, `neutral`; new `ProgressCircleTone` type; no `info`, which is the brand blue), `variant="outline"` for a border-only arc instead of the filled pie, `label` (`outside`, `inside`, `none`) for where the value is written, and `max` and `unit` for values that are not fractions (`value={3} max={12} unit=" of 12"` shows "3 of 12").
- [General] New recipe: Reading progress, "Not started", a `ProgressCircle` or "Completed" for a book.
- [Chip] **Breaking:** `Tag` is renamed `Chip` (`TagProps` → `ChipProps`, `TagTone` → `ChipTone`), so it shares a name with `ChipsInput` and the `color.chip` tokens it draws from. Props and look are unchanged.
- [ChipsInput, Chip] **Breaking:** `chipColor` is renamed `tone` and takes a `ChipTone`, as `Chip` does; the `ChipColor` type is removed (use `ChipTone` from `@korzun/design/component`).
- [ChipsInput] A `disabled` field hides its chips' remove (×) buttons instead of showing them dimmed, so the chips read as plain values.
- [ChipsInput] The text field shares a line with the chips whenever 8rem is free. Before, it sized from an input's natural width (about 20 characters, ~200px at the 16px phone size) and dropped to its own empty line, making the box a line taller than its chips need.
- [General] Docs site: the overview thumbnails for `Page`, `Surface`, `TopFade`, `Modal`, `ConfirmModal` and every hook are drawn with plain blocks, like `Space`, instead of sample content.
- [General] Docs site: each section lists its modules alphabetically by name, on the overview and in `llms.txt`.
- [useIsStandalone] **Breaking:** `isStandalone()` is now the hook `useIsStandalone()`, built on `useSyncExternalStore`. Call it at the top of a component and branch on its value (`const standalone = useIsStandalone();` then `{standalone && <TopFade />}`), not inside a condition or callback. It re-renders when the display mode changes and returns `false` during server rendering instead of throwing on `window`.
- [General] Docs generator: CHANGELOG tags that name a removed former name (`CardDivider`, `Dialog`, `useModalDialog`) resolve to the current name, so that history stays on the renamed module's page.
- [TextInput] New `prefix`: a decorative icon component drawn inside the field's left end (`prefix={SearchIcon}`) in `text.muted`, with the text moved clear of it. It is hidden from screen readers and lets clicks through. With a clearing `action` it makes a search box (new Search field example).
- [MetaLine] `separator=""` now counts as unset (gaps, no empty cells); a separator longer than one character logs a development-only console warning once, since it overflows its cell; the separator clip uses logical properties, so right-to-left lines clip and place the separator correctly.
- [MetaLine] **Breaking:** without `separator` the items are spaced by gaps (`space.lg`, lines `space.sm`), not dots; pass `separator="·"` for the old look. `separator` takes any one character, drawn by CSS between items. Items can now be labelled pairs, `{ label, value }`, shown with a faint capitalized label, mixed with plain items; a pair whose value is `null`, `undefined` or `false` is skipped. New `MetaLineItem` and `MetaLinePair` types. MetaLine replaces `MetadataList`.
- [MetaLine] **Breaking:** `MetadataList` (and its `Metadata` and `MetadataListProps` types) is removed; use `MetaLine` with `{ label, value }` items and no `separator` for its gapped, labelled look, wrapped in `Text size="sm"` for its size (MetaLine inherits font size and colour; MetadataList set `fontSize.sm` and `text.primary`). Its 15rem cap on each value is gone, and a pair with an empty value is skipped instead of showing its label alone.
- [lightTheme, darkTheme] **Breaking:** `size.metadataValue` (and the `size` group) is removed; `MetadataList` was its only user.
- [Table] New `Table` (component): a generic data table. `columns` name a row field or `render` a cell, `rowKey` is a field name or a function, and `empty` shows one full-width row when there are no rows. It scrolls inside its own bordered box on a wide screen (`minWidth` sets a minimum width there only), and on a phone each row stacks with every value labelled by its column title (`label`, `wide`). `nowrap`, `align: 'end'` and `width` shape the cells. Its corners follow surface depth, and a control in a cell sits one level deeper. Falsy values (`0`, `false`, `''`) show as themselves; only `null` and `undefined` show a dash.
- [CodeBlock] New `CodeBlock` (component): a block of code in mono type on a `bg.cardHeader` box that scrolls sideways (with a fade at the edge while more is hidden) or wraps with `wrap`. `code` is the plain text; `children` replace what shows (highlighted spans) while Copy still copies `code`. `copyable` adds a Copy button that becomes Copied with a check, or Could not copy, for 2 seconds and announces it in a status region; `copyLabel` names it. It sets the `--code-*` variables Shiki's css-variables theme emits, from `color.code`. Corners follow surface depth, and in dark mode directly on a Page it gets a 1px `border.default` edge.
- [Code] New `Code` (component): inline `<code>` in the mono font at 0.875em of the surrounding text (so it scales in a heading), on a `bg.cardHeader` chip with `sm` corners; a long name breaks only when it cannot fit. In dark mode directly on a Page it gets a 1px `border.default` edge. Takes `children` and `className`.
- [lightTheme, darkTheme] New `color.code` palette (foreground, keyword, string, function, parameter, constant, punctuation, comment, link) for syntax colours, and `recipe.codeBlock`, `recipe.inlineCode` and `recipe.codeColours` (the ten `--code-*` variables Shiki's css-variables theme reads, from `color.code`) for code rendered outside `CodeBlock` and `Code`.
- [Button] **Breaking:** the `success` prop is removed. It only tinted a `default` button green (a `primary` one stayed blue), which read as a fourth kind of button. For a done state such as Copy turning into Copied!, change the label and add a `CheckIcon` prefix. The `color.bg.success` and `color.border.success` tokens stay. The Button examples now show every type, and `danger` on both `default` and `primary`.
- [Button] A `link` button's spinner and `prefix`/`suffix` icons sit 0.5em from the label and centred on the text, like the other types; before they touched the label and sat high on the baseline. An icon-only link gets no extra space.
- [ThemeProvider, GlobalStyles] `GlobalStyles` (rendered by `ThemeProvider`) ships the reset the components are drawn against: every element is `box-sizing: border-box` with no default margin or padding, as in Bookplate's and Scribe's `index.html`. Without it a text field was 51px tall instead of `layout.controlHeight` (33px). An app that already carries this reset sees no change; one that relied on browser default margins (`p`, `h1`, `ul`) loses them.
- [TextInput, TextArea, NumberInput, DateTimeInput, ChipsInput, SegmentedControl, Tag, Switch] Corners follow surface depth, like `Button` and `Select`: `lg` directly on a `Page`, `md` in a Card or Dialog (unchanged), `sm` two or more levels in (a nested Card, a `CardRow` or `Surface` in a Card, a Popover). A field's shaded row and the field in it take the same radius; `ChipsInput` chips and a horizontal `Switch`'s `inset` track are a step squarer than their box. With no surface above, each keeps its 0.6.0 look. **Visible changes:** fields and Tags placed directly on a Page get 16px corners, and Tags inside a `CardRow` in a Card get 4px. A text field, `ChipsInput` box or field label directly on a Page also moves its text 16px in from the edge (8px elsewhere), the inset `Button` keeps, so it clears the deeper corner.
- [GlobalStyles, ThemeProvider] `color-scheme` is set on `html` as well as `body`. With body alone the root's scheme was `normal`, so in dark mode the page scrollbar stayed light and an iframe whose document uses `GlobalStyles` (or is still loading) painted an opaque white box.
- [General] Docs site: the tokens page shows every theme group (`size`, `fontFamily`, `fontWeight` and `lineHeight` were missing), draws one swatch for a single colour (`color.success`), and keeps long token names clear of their values; props and token tables stack each row on a phone instead of scrolling sideways; overview thumbnails stay hidden until they load, so nothing flashes white; a Guides page lists the guides, the header links to it, and the header marks the current section on component, recipe and guide pages; overview and recipe card descriptions render their inline markdown; examples keep their buttons, menu triggers and segmented controls at their own width instead of stretching across the demo.
- [General] Docs site: the overview search box has a search icon and, while it holds text, a Clear search button inside its right end (the TextInput `action` pattern) that empties it and returns focus to it.
- [SegmentedControl] Segments set their own font size (`fontSize.md`, the 14px of their labels) instead of the browser's 13.33px button default. Labels look the same; the segment's own text metrics no longer depend on the browser or page.
- [Button] `text` and `link` buttons show a solid 2px `border.focus` ring on keyboard focus (`:focus-visible`); before they showed nothing. Mouse clicks still leave no ring.
- [Button] Height no longer follows an inherited line-height: Buttons in a Dialog footer are 32px, not 35px, and an icon-only Button is 32px (was 31px, sitting 1px low) beside text Buttons. The label's line-height is pinned to 14px; `link` stays text-sized.
- [Switch, lightTheme, darkTheme] The unchecked track is the new `color.bg.switchOff` token (`#868686` light, `#6E7480` dark), about 3:1 on `bg.page`, `bg.card` and `bg.cardHeader`; it was `border.default` (1.16:1 on a shaded row). The loading spinner on an unchecked track is now the thumb colour.
- [Select] The option list matches `Menu`: a 4px inset pad, 4px-rounded options with a 2px gap, 14px text (was 12.8px), the flat `cardStack` shadow (was `hoverLift`) and `bg.hover` on hover (was `bg.cardHeader`). The keyboard highlight is unchanged.
- [General] Docs: a Copy button recipe (`docs/recipes/copy-button.md`): a `CopyButton` to copy into your app, with Copy, Copied and Could not copy states, a status region and a steady width.
- [General] Docs site: each module has an `examples/preview.tsx` that shows the component alone; the overview thumbnails render it instead of the first example, and it never appears on the component page or in the doc. `npm run docs:check` fails for a module without one.
- [General] Docs site: one type scale. Markdown and page headings match at each level (h2 20px bold, h3 16px semibold, same spacing), so example, props and changelog titles are no longer smaller than the text under them; code in a heading takes the heading size; page intros are 18px leads. Code blocks and the import line are 14px with a 1.5 line height, inline code is 0.875em and breaks only between words, and every code span uses the theme mono font. Guide, changelog and usage prose stops at 720px while tables and code blocks keep the full width. Props tables are 14px with semibold prop names, muted types, sized columns, and unions that wrap between members.
- [lightTheme, darkTheme, Select] Dark `color.border.light` is `#333439` (was `#2B2C30`, 1.10:1 on `bg.page` and 1.23:1 on `bg.card`, so hairline rules all but vanished); it is now 1.24:1 and 1.39:1, at or above light mode's step. A loading `Select`'s border in dark is a shade lighter. Light is unchanged.
- [Tag, ChipsInput, lightTheme, darkTheme] `color.chip.neutral` text is a step stronger, so a neutral Tag or chip holds 4.5:1 on its tint over `bg.page`, `bg.card` and `bg.cardHeader`: light `#5E5E5E` (was `#6E6E6E`, 4.0:1 over `cardHeader`), dark `#A8ADB6`, the mode's `text.description` (was `#9CA1AB`, 4.47:1 over `page`). Fill and border are unchanged.
- [General] Docs site, dark and phones: code blocks and inline code on the page draw a `border.default` edge in dark, where their fill was 1.01:1 on the page; the "–" for an empty props or token cell is muted, not faint (3.7:1). On a phone the header is two rows (name and theme, then links that scroll sideways) and sticks to the top, with headings and tables stopping below it; header links, the theme segments, "Show code" and "Copy" have 44px hit areas, with the desktop look unchanged; the overview is a list with small thumbnails (5,300px tall, was 12,800px); and code that scrolls sideways fades out at its right edge until scrolled to the end.
- [General] Docs site: the first Dialog, ConfirmModal, useModalDialog, Popover, Menu and Select example starts open, without taking the page's keyboard focus; readouts sit under their triggers on every page; layout, surface and radius examples share one muted caption style; horizontal-form labels line up; the TextInput and TextArea validation examples open invalid; the Inline wrap, TopFade, ChipsInput chip colours, Divider actions, Inline gaps and Tag tone examples show their point at a glance, and native elements in examples are styled from tokens; an empty overview search offers Clear search; the not-found page uses the site column and link style; changelog entries drop their bullets for a hairline between entries.
- [Divider, Card, Dialog] `CardDivider` is now `Divider` and works anywhere: directly in a Card or Dialog body it reaches the edges as before (cancelling `space.xl` in a large Card, 1px in a small one, `space.xxl` in a Dialog, where it used to overhang everything but a large Card), and on the page, in a `CardRow`, `Alert`, `Surface` or nested Card it spans its container. The new `bleed` prop overrides that. **Breaking:** the old names `CardDivider`, `CardDividerProps` and `CardDividerAlign` are removed; import `Divider`, `DividerProps` and `DividerAlign`.
- [Modal, useModal] **Breaking:** `Dialog` is renamed `Modal` and `useModalDialog` is renamed `useModal`, matching `ConfirmModal`; behaviour is unchanged. The old names `Dialog`, `DialogProps` and `useModalDialog` are removed. The footer marker attribute is now `data-modal-footer`.
- [General] Docs: modules are grouped into Layout, Navigation, Typography, Inputs, Overlays, Data display, Feedback, Foundations and Hooks. Actions is gone (`Button` is in Inputs, the Page action bars are in Layout under `Page`), Theme and the icons are Foundations, and the hooks have pages of their own with runnable examples (they were a guide). `PageActionsBar`, `PageActionsMenu` and `PageFooterActions` are listed under `Page` and `CardRow` under `Card`; their pages link to the parent. The overview shows only top-level modules; a nested one appears under Parts on its parent's page, and the overview's search still finds it. The order lives in `scripts/docs-gen/categories.mjs`.
- [General] Docs site: props, token and recipe tables render through `Table`, and code through the library: example code, the import line and alias types are `CodeBlock`s, and markdown code blocks and inline code use `recipe.codeBlock` and `recipe.inlineCode` with `color.code` highlighting. Code blocks are padded `space.xl` everywhere (example code was `space.xxl`). Copy buttons on the site show Copied with a check, or Could not copy, in the button for 2 seconds and announce it in a status region, instead of a toast.
- [General] Docs: each hook has its own page in the Hooks section, `isStandalone` (`docs/hooks/is-standalone.md`), `useMinimizeOnScroll` (`docs/hooks/use-minimize-on-scroll.md`, with `EXPAND_AFTER`, `MINIMIZE_SPEED` and `MinimizeOnScroll`) and `usePullToRefresh` (`docs/hooks/use-pull-to-refresh.md`, with `PULL_THRESHOLD`, `PullPhase`, `PullState` and the indicator recipe), each with its own examples, types and changelog; `docs/hooks.md` and the `#/components/hooks` page are gone. Imports from `@korzun/design/hooks` are unchanged. `useModal` is listed under Hooks too, though it is still imported from `@korzun/design/control`.

## 0.6.0 — 2026-11-26

- [lightTheme, darkTheme] New `theme.layout.formWidth` (`400px`): the width of a standalone form column such as sign-in, narrower than a dialog.
- [General] Recipes: worked assemblies of library parts with live previews, shipped as `docs/recipes/*.md` and indexed in AGENTS.md. First recipe: Sign in (`docs/recipes/login.md`).

## 0.5.2 — 2026-11-26

- [TextInput, TextArea, NumberInput] The visible `label` is linked to its field (`htmlFor` and a generated `id`), so it names the field and clicking it focuses the field. A new `ariaLabel` prop names a field that has no visible `label`; with a `label` it is ignored.
- [TextInput] `action` works: clicking its icon button calls `action.action`. `TextInputAction` gains an optional `ariaLabel` naming that button.
- [CollapsibleSection] Clicks and Enter/Space inside an action no longer reach the header, so no action toggles the section and a native button or link keeps its key press. Actions sit in a `display: contents` wrapper, so the layout is unchanged.
- [ProgressIndicator] A `value` that is not a finite number (`NaN`, `undefined`, `Infinity`) shows "Not started" instead of "NaN%".

## 0.5.1 — 2026-11-26

- [General] Docs: every module doc has front matter and generated import, examples, props, tokens and changelog sections; prop notes moved into JSDoc; docs site with overview, component pages, llms.txt and llms-full.txt replaces the story gallery. The props types of `Card`, `CardRow`, `CollapsibleSection`, `ConfirmModal`, `Page` and `Button` declare `children` explicitly, so it has a doc line; the types are equivalent, no change for callers.
- [ToastProvider] `ToastProviderProps` is exported from `@korzun/design/toast`.
- [Popover] The popover wrapper carries `data-preferred-side` (the `side` you asked for) alongside `data-side` (the side used after flipping).

## 0.5.0 — 2026-11-24

- [Page, Dialog, Card, CardRow, Alert, Surface, Popover, Menu, Select, Button] Surface depth: corners are concentric site-wide with no radius props. `Page` provides depth 0, `Dialog` 1, and `Card`, `CardRow` and `Alert` each provide one level deeper than where they sit; `Popover` (so `Menu` and the `Select` list) provides a fixed 2. Depth 0 is `radius.lg`, 1 is `md`, 2 and deeper is `sm`. `Button`, `Select`, `Card`, `CardRow` and `Alert` follow it; an explicit `Button radius` or `Select surface` still wins. With no `Page`, `Dialog`, `Card`, `CardRow`, `Alert` or `Surface` above it, a component keeps its 0.4.0 look; a bare `Card` (no `Page`) still counts as depth 0 and gives its contents depth 1, so its Buttons and nested Cards change as below.
- [Button, Select, Card, CardRow, Popover, Menu, Dialog, Page] **Visible changes:**
  - Buttons in a Card default to 8px (they were 16px unless `radius="card"` was set), and Buttons in a Dialog body are 8px.
  - Selects directly on a Page get the page look (16px and the card shadow); in a Card or Dialog they stay 8px. This includes Selects in your own boxes on a Page (a `useModalDialog` modal, a `recipe.card.shell` or `recipe.row` box), because depth cannot see hand-drawn boxes: wrap their contents in `Surface`, or pass `surface="card"`.
  - Without a Page, a bare `Card` counts as depth 0: its Buttons go from 16px to 8px, a Card nested in it steps down, and a `CardRow` in it is 8px.
  - A Card nested in a Card or Dialog steps down (8px, then 4px), and so do its Buttons and Selects; `size="small"` keeps its extra 1px.
  - `CardRow` is 16px on a Page and 8px inside a Card (it was always 16px).
  - Buttons and Selects inside a Popover or Menu are 4px.
- [Alert] New `Alert` (component): a tinted box with a `tone` (`warning`, `danger`, `success`, `info`), optional `title`, `Icon` and `action`, and body text. `danger` and `warning` get `role="alert"`, `success` and `info` get `role="status"`.
- [Surface, useSurfaceRadius] New `Surface` and `useSurfaceRadius` (component) for hand-made boxes that hold library controls: `Surface` marks its children one level deeper, and `useSurfaceRadius()` returns the radius token for the current depth.
- [Select] `Select` `surface` gains `'inset'` (`radius.sm`, no shadow), used two or more levels deep.
- [Popover, Menu] `theme.space` values are typed as `SpaceValue` (`${number}rem`), so `gap={theme.space.sm}` on `Popover` and `Menu` needs no `as PopoverGap` cast. `Theme['space']` is now typed `${number}rem`, so hand-built Theme objects or mocks with `px` values stop type-checking.
- [Dialog, Button] The internal `ButtonRadiusContext` is removed; Dialog footer Buttons are unchanged (8px).
- [General] Guidance: AGENTS.md rule 3 now says not to pass `radius` or `surface` by default; `corners.md` replaces "Picking the prop" with "It's automatic"; new docs for `Alert` and `Surface`; `patterns.md` has a status banner recipe; examples no longer set `radius="card"` or `radius="modal"`.

## 0.4.0 — 2026-11-23

- [Menu] New `Menu` (control): a button that opens a list of actions and links, described as an `items` array (`onClick` for actions, `to` for links; `Icon`, `danger`, `disabled`, `separatorBefore`, `intentProps`). Arrow keys, Home and End move between items, and Escape returns focus to the trigger. `surface` is `solid` or `glass`.
- [Menu] `Menu` trigger props: `ref` is a callback ref, so it attaches to a `<button>`, an `<a>` or a `Button` without a cast; `ariaControls` is set only while the menu is open. Tab from an open menu skips inert, hidden and `tabindex="-1"` elements and stays inside an open `<dialog>`. A disabled link item has no `href`.
- [Popover, Dialog, useModalDialog] Layer stack: popovers and dialogs now close innermost-first. Escape and an outside press only affect the topmost layer, so a popover inside a popover closes one level at a time. **Behaviour change:** a popover beneath an open dialog no longer takes its Escape or closes on a press inside the dialog.
- [Popover] `Popover` `gap` also accepts a `px` or `rem` string (type `PopoverGap`: `` number | `${number}px` | `${number}rem` ``), not only a number of pixels.
- [Button] `Button` takes a `ref` and `ariaHasPopup`. Its interactive `<div role="button">` now defaults to `tabIndex={0}` so it is reachable by keyboard (`-1` when disabled or loading; an explicit `tabIndex` wins). Its keydown now calls `preventDefault()` on Enter and Space, so Space no longer scrolls the page and Enter opening a menu does not also activate its first item.
- [PageActionsMenu, PageActionsBar, Menu] `PageActionsMenu` and `PageActionsBar` are rebuilt on `Menu`: arrow keys, Home and End move between actions, and Escape returns focus to the trigger. `PageActionItem` is now `MenuActionItem & { primary?, align? }`: it gains an optional `Icon` (shown in the menus, ignored by the bar's primary Buttons), and `to` is not allowed.
- [General] Guidance: AGENTS.md has a new rule 8 (Menus; later rules renumber to 9–11) and `patterns.md` now teaches `Menu`, and `docs/control/menu.md` is new.

## 0.3.0 — 2026-11-22

- [Dialog] New `Dialog` (control): a modal with a title, body and optional footer on a native `<dialog>`; `canDismiss` blocks Escape and backdrop dismissal while busy.
- [ErrorMessage] New `ErrorMessage` (component): a `role="alert"` danger-coloured error line that renders nothing when empty.
- [Spinner] New `Spinner` (component): a loading indicator that takes the surrounding text colour and size.
- [ConfirmModal, Dialog] `ConfirmModal` is rebuilt on `Dialog`. No API or visual change; it is now named by its title (`aria-labelledby`).
- [Popover, Select, ChipsInput, Dialog, useModalDialog] `Popover` renders inside an open `<dialog>` that contains its anchor, so `Select` and `ChipsInput` work in modals.
- [Button, Dialog] Buttons in a `Dialog` footer default to `radius="modal"`; an explicit `radius` still wins. The radius applies to the footer only (a Dialog nested in a footer is unaffected), and `footer={false}`, `''` and `null` render no footer bar.
- [General] Guidance: AGENTS.md rules 3, 7 and 10 and the imports table, and `patterns.md`, now teach `Dialog`, `ErrorMessage` and `Spinner`; `Dialog` is no longer listed as missing.

## 0.2.0 — 2026-11-21

- [Stack, Inline, Text, Heading] New `Stack` (vertical flex column; `gap`, default `md`), `Inline` (horizontal row; `gap` default `sm`, `justify` including `between`), `Text` (`size`, `tone`, `weight`; unset props inherit), and `Heading` (`level` 1–4), so layout and text are set with props instead of style files.
- [lightTheme, darkTheme] New `fontWeight.regular` (400) token.
- [Text, Heading, Stack, Inline] `truncate` on `Text` and `Heading` clips inside `Stack` (any `align`), `Inline`, and a `Stack` nested in an `Inline`; `Stack` and `Inline` roots have `min-width: 0`.
- [General] AGENTS.md rule 1 now says layout and text go through these props; rule 10 no longer lists Stack, Text and Heading as things to build yourself, and `patterns.md` and `theme.md` now teach the components.
- [General] No visual change to existing components.

## 0.1.0 — 2026-11-21

- [Tag, lightTheme, darkTheme] `Tag` status tones: `success`, `warning` (yellow, stronger fill), `danger`, `info` (brand blue). New `color.warning` and `color.info` solid colours. Status tones report state; label tones name things. No visual change to existing tags.
- [Popover, Select, ChipsInput] `Popover`:
  - `side` (`bottom`/`top`) and `align` (`start`/`center`/`end`).
  - Flips when the preferred side has no room.
  - Stays inside the viewport horizontally, unless `matchWidth` (then it lines up with the anchor exactly).
  - On the top side it is anchored by its bottom edge, and it re-measures when its content resizes (`ResizeObserver`), so it stays attached as content grows or shrinks.
  - The provisional first render is transparent rather than hidden, so an `autoFocus` child takes focus.
  - Exposes `data-side`.
  - Escape calls `onClose` unless already handled, without closing a surrounding dialog.
  - Defaults keep the same position when there is room below; `Select` and `ChipsInput` now open upward near the bottom of the viewport.
- [Popover] New types: `PopoverSide`, `PopoverAlign`.

## 0.0.6 — 2026-11-21

First curation release: corners now follow the depth rule in `docs/corners.md`.

- [CardRow, Card] `CardRow` drops its off-scale `12px` corner and takes `radius.lg` from the card shell, since a row sits on the page background. Its stories now render it on the page, not inside a `Card`. **Visible change:** the corners get rounder (12px to 16px).
- [Card] `Card size="small"` writes its corner as `calc(radius.md + 1px)`: md plus its 1px inset, concentric with its flush `md` children. Same 9px as before, now derived from the token.
- [Switch, lightTheme, darkTheme] New `theme.recipe.row`: the shaded field row (`bg.cardHeader`, `radius.md`, padding `md lg md sm`), for custom rows beside form fields. `Switch`'s horizontal layout now uses it and looks the same.

## 0.0.5 — 2026-11-21

- [General] No runtime changes. Every exported control and component now exports its props type from `/control`, `/component`, and the root:
  - Controls: `BackButtonProps`, `ButtonProps`, `ChipsInputProps`, `ConfirmModalProps`, `FieldListProps`, `NumberInputProps`, `PageActionsBarProps`, `PageActionsMenuProps`, `PageFooterActionsProps`, `PopoverProps`, `SegmentedControlProps`, `SwitchProps`, `TextAreaProps`, `TextInputProps`.
  - Components: `CardProps`, `CardDividerProps`, `CollapsibleSectionProps`, `EmptyStateProps`, `MetadataListProps`, `PageProps`, `ProgressIndicatorProps`, `TagProps`, `ThemeSettingProps`, `TopFadeProps`.
- [General] New type exports for prop values: `ButtonTypeValue`, `ButtonRadiusValue`, `ChipColor`, `SegmentedOption`, `SwitchRadiusValue`, `TextInputAction`, `CardDividerAlign`, `PageTypeValue`.
- [General, useModalDialog] Every prop has a JSDoc comment, so editors and coding agents see the guidance in the `.d.ts`. `useModalDialog` declares its return type.

## 0.0.4 — 2026-11-21

- [General] No code changes. The tarball now includes `AGENTS.md` and `docs/`: guidance for LLM coding agents covering setup, styling rules, the corner-radius-by-depth rule, screen patterns, and one doc per exported control and component. To use it, add `@node_modules/@korzun/design/AGENTS.md` to an app's `CLAUDE.md`.

## 0.0.3 — 2026-11-21

- [Tag] `Tag` takes a `tone` prop that picks any `theme.color.chip` token (`status`, `author`, `series`, `subject`, `book`, `entryType`, `user`, `rating`, `neutral`) for text, background and border. It defaults to `subject`, so existing tags look the same. The clickable hover now comes from the tone too; with `subject` in light mode it matches the old amber.
- [Tag, lightTheme, darkTheme] New `color.chip.neutral` token: a quiet grey built from each mode's muted text colour (light 0.08 / 0.22 alphas, dark 0.16 / 0.30, matching the other chips in each mode).
- [Tag] `TagTone` type exported from the package root and `/component`.

## 0.0.2 — 2026-11-17

- [General] No code changes. First release published through npm trusted publishing (GitHub Actions OIDC, with provenance); 0.0.1 was published by hand to create the package.
- [General] Publish workflow skips `npm publish` when the tagged version is already on the registry, so re-running a release tag is safe.

## 0.0.1 — 2026-11-15

- [ThemeProvider, lightTheme, darkTheme] Theme tokens and light/dark themes; `ThemeProvider` takes an `identity` prop (replaces Bookplate's token coupling).
- [General] 18 control folders (17 exported, 1 internal helper): `ActionMenuList` (internal), `BackButton`, `Button`, `ChipsInput`, `ConfirmModal`, `DateTimeInput`, `FieldList`, `NumberInput`, `PageActionsBar`, `PageActionsMenu`, `PageFooterActions`, `Popover`, `SegmentedControl`, `Select`, `Switch`, `TextArea`, `TextInput`, `useModalDialog`.
- [General] 15 component folders (14 exported, `metadata` is internal): `Card`, `CardDivider`, `CardRow`, `CollapsibleSection`, `EmptyState`, `MetaLine`, `Metadata` (internal), `MetadataList`, `NavDesktop`, `NavMobile`, `Page`, `ProgressIndicator`, `Tag`, `ThemeSetting`, `TopFade`; `Page` gains new `documentTitle` and `bottomNav` props.
- [General] Icon set, minus brand icons.
- [ToastProvider, useToast] Toast: `ToastProvider`, `useToast`.
- [useMinimizeOnScroll, usePullToRefresh, isStandalone] Hooks: `useMinimizeOnScroll`, `usePullToRefresh`, `isStandalone`.
- [General] Subpath exports: `/theme`, `/control`, `/component`, `/icon`, `/toast`, `/hooks`.
- [General] Root `ThemeSettingValue` alias for the `ThemeSetting` type.
