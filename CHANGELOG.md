# Changelog

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
- [Popover, Dialog] Layer stack: popovers and dialogs now close innermost-first. Escape and an outside press only affect the topmost layer, so a popover inside a popover closes one level at a time. **Behaviour change:** a popover beneath an open dialog no longer takes its Escape or closes on a press inside the dialog.
- [Popover] `Popover` `gap` also accepts a `px` or `rem` string (type `PopoverGap`: `` number | `${number}px` | `${number}rem` ``), not only a number of pixels.
- [Button] `Button` takes a `ref` and `ariaHasPopup`. Its interactive `<div role="button">` now defaults to `tabIndex={0}` so it is reachable by keyboard (`-1` when disabled or loading; an explicit `tabIndex` wins). Its keydown now calls `preventDefault()` on Enter and Space, so Space no longer scrolls the page and Enter opening a menu does not also activate its first item.
- [PageActionsMenu, PageActionsBar, Menu] `PageActionsMenu` and `PageActionsBar` are rebuilt on `Menu`: arrow keys, Home and End move between actions, and Escape returns focus to the trigger. `PageActionItem` is now `MenuActionItem & { primary?, align? }`: it gains an optional `Icon` (shown in the menus, ignored by the bar's primary Buttons), and `to` is not allowed.
- [General] Guidance: AGENTS.md has a new rule 8 (Menus; later rules renumber to 9–11) and `patterns.md` now teaches `Menu`, and `docs/control/menu.md` is new.

## 0.3.0 — 2026-11-22

- [Dialog] New `Dialog` (control): a modal with a title, body and optional footer on a native `<dialog>`; `canDismiss` blocks Escape and backdrop dismissal while busy.
- [ErrorMessage] New `ErrorMessage` (component): a `role="alert"` danger-coloured error line that renders nothing when empty.
- [Spinner] New `Spinner` (component): a loading indicator that takes the surrounding text colour and size.
- [ConfirmModal, Dialog] `ConfirmModal` is rebuilt on `Dialog`. No API or visual change; it is now named by its title (`aria-labelledby`).
- [Popover, Select, ChipsInput, Dialog] `Popover` renders inside an open `<dialog>` that contains its anchor, so `Select` and `ChipsInput` work in modals.
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
- [General] Every prop has a JSDoc comment, so editors and coding agents see the guidance in the `.d.ts`. `useModalDialog` declares its return type.

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
