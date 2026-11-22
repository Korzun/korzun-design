# Changelog

## 0.3.0 — 2026-11-22

- New `Dialog` (control): a modal with a title, body and optional footer on a native `<dialog>`; `canDismiss` blocks Escape and backdrop dismissal while busy.
- New `ErrorMessage` (component): a `role="alert"` danger-coloured error line that renders nothing when empty.
- New `Spinner` (component): a loading indicator that takes the surrounding text colour and size.
- `ConfirmModal` is rebuilt on `Dialog`. No API or visual change; it is now named by its title (`aria-labelledby`).
- `Popover` renders inside an open `<dialog>` that contains its anchor, so `Select` and `ChipsInput` work in modals.
- Buttons in a `Dialog` footer default to `radius="modal"`; an explicit `radius` still wins. The radius applies to the footer only (a Dialog nested in a footer is unaffected), and `footer={0}` no longer renders a stray `0`.
- Guidance: AGENTS.md rules 3, 7 and 10 and the imports table, and `patterns.md`, now teach `Dialog`, `ErrorMessage` and `Spinner`; `Dialog` is no longer listed as missing.

## 0.2.0 — 2026-11-21

- New `Stack` (vertical flex column; `gap`, default `md`), `Inline` (horizontal row; `gap` default `sm`, `justify` including `between`), `Text` (`size`, `tone`, `weight`; unset props inherit), and `Heading` (`level` 1–4), so layout and text are set with props instead of style files.
- New `fontWeight.regular` (400) token.
- `truncate` on `Text` and `Heading` clips inside `Stack` (any `align`), `Inline`, and a `Stack` nested in an `Inline`; `Stack` and `Inline` roots have `min-width: 0`.
- AGENTS.md rule 1 now says layout and text go through these props; rule 10 no longer lists Stack, Text and Heading as things to build yourself, and `patterns.md` and `theme.md` now teach the components.
- No visual change to existing components.

## 0.1.0 — 2026-11-21

- `Tag` status tones: `success`, `warning` (yellow, stronger fill), `danger`, `info` (brand blue). New `color.warning` and `color.info` solid colours. Status tones report state; label tones name things. No visual change to existing tags.
- `Popover`:
  - `side` (`bottom`/`top`) and `align` (`start`/`center`/`end`).
  - Flips when the preferred side has no room.
  - Stays inside the viewport horizontally, unless `matchWidth` (then it lines up with the anchor exactly).
  - On the top side it is anchored by its bottom edge, and it re-measures when its content resizes (`ResizeObserver`), so it stays attached as content grows or shrinks.
  - The provisional first render is transparent rather than hidden, so an `autoFocus` child takes focus.
  - Exposes `data-side`.
  - Escape calls `onClose` unless already handled, without closing a surrounding dialog.
  - Defaults keep the same position when there is room below; `Select` and `ChipsInput` now open upward near the bottom of the viewport.
- New types: `PopoverSide`, `PopoverAlign`.

## 0.0.6 — 2026-11-21

First curation release: corners now follow the depth rule in `docs/corners.md`.

- `CardRow` drops its off-scale `12px` corner and takes `radius.lg` from the card shell, since a row sits on the page background. Its stories now render it on the page, not inside a `Card`. **Visible change:** the corners get rounder (12px to 16px).
- `Card size="small"` writes its corner as `calc(radius.md + 1px)`: md plus its 1px inset, concentric with its flush `md` children. Same 9px as before, now derived from the token.
- New `theme.recipe.row`: the shaded field row (`bg.cardHeader`, `radius.md`, padding `md lg md sm`), for custom rows beside form fields. `Switch`'s horizontal layout now uses it and looks the same.

## 0.0.5 — 2026-11-21

- No runtime changes. Every exported control and component now exports its props type from `/control`, `/component`, and the root:
  - Controls: `BackButtonProps`, `ButtonProps`, `ChipsInputProps`, `ConfirmModalProps`, `FieldListProps`, `NumberInputProps`, `PageActionsBarProps`, `PageActionsMenuProps`, `PageFooterActionsProps`, `PopoverProps`, `SegmentedControlProps`, `SwitchProps`, `TextAreaProps`, `TextInputProps`.
  - Components: `CardProps`, `CardDividerProps`, `CollapsibleSectionProps`, `EmptyStateProps`, `MetadataListProps`, `PageProps`, `ProgressIndicatorProps`, `TagProps`, `ThemeSettingProps`, `TopFadeProps`.
- New type exports for prop values: `ButtonTypeValue`, `ButtonRadiusValue`, `ChipColor`, `SegmentedOption`, `SwitchRadiusValue`, `TextInputAction`, `CardDividerAlign`, `PageTypeValue`.
- Every prop has a JSDoc comment, so editors and coding agents see the guidance in the `.d.ts`. `useModalDialog` declares its return type.

## 0.0.4 — 2026-11-21

- No code changes. The tarball now includes `AGENTS.md` and `docs/`: guidance for LLM coding agents covering setup, styling rules, the corner-radius-by-depth rule, screen patterns, and one doc per exported control and component. To use it, add `@node_modules/@korzun/design/AGENTS.md` to an app's `CLAUDE.md`.

## 0.0.3 — 2026-11-21

- `Tag` takes a `tone` prop that picks any `theme.color.chip` token (`status`, `author`, `series`, `subject`, `book`, `entryType`, `user`, `rating`, `neutral`) for text, background and border. It defaults to `subject`, so existing tags look the same. The clickable hover now comes from the tone too; with `subject` in light mode it matches the old amber.
- New `color.chip.neutral` token: a quiet grey built from each mode's muted text colour (light 0.08 / 0.22 alphas, dark 0.16 / 0.30, matching the other chips in each mode).
- `TagTone` type exported from the package root and `/component`.

## 0.0.2 — 2026-11-17

- No code changes. First release published through npm trusted publishing (GitHub Actions OIDC, with provenance); 0.0.1 was published by hand to create the package.
- Publish workflow skips `npm publish` when the tagged version is already on the registry, so re-running a release tag is safe.

## 0.0.1 — 2026-11-15

- Theme tokens and light/dark themes; `ThemeProvider` takes an `identity` prop (replaces Bookplate's token coupling).
- 18 control folders (17 exported, 1 internal helper): `ActionMenuList` (internal), `BackButton`, `Button`, `ChipsInput`, `ConfirmModal`, `DateTimeInput`, `FieldList`, `NumberInput`, `PageActionsBar`, `PageActionsMenu`, `PageFooterActions`, `Popover`, `SegmentedControl`, `Select`, `Switch`, `TextArea`, `TextInput`, `useModalDialog`.
- 15 component folders (14 exported, `metadata` is internal): `Card`, `CardDivider`, `CardRow`, `CollapsibleSection`, `EmptyState`, `MetaLine`, `Metadata` (internal), `MetadataList`, `NavDesktop`, `NavMobile`, `Page`, `ProgressIndicator`, `Tag`, `ThemeSetting`, `TopFade`; `Page` gains new `documentTitle` and `bottomNav` props.
- Icon set, minus brand icons.
- Toast: `ToastProvider`, `useToast`.
- Hooks: `useMinimizeOnScroll`, `usePullToRefresh`, `isStandalone`.
- Subpath exports: `/theme`, `/control`, `/component`, `/icon`, `/toast`, `/hooks`.
- Root `ThemeSettingValue` alias for the `ThemeSetting` type.
