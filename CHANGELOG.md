# Changelog

## 0.0.1 — 2026-11-15

- Theme tokens and light/dark themes; `ThemeProvider` takes an `identity` prop (replaces Bookplate's token coupling).
- 18 control folders (17 exported, 1 internal helper): `ActionMenuList` (internal), `BackButton`, `Button`, `ChipsInput`, `ConfirmModal`, `DateTimeInput`, `FieldList`, `NumberInput`, `PageActionsBar`, `PageActionsMenu`, `PageFooterActions`, `Popover`, `SegmentedControl`, `Select`, `Switch`, `TextArea`, `TextInput`, `useModalDialog`.
- 15 component folders (14 exported, `metadata` is internal): `Card`, `CardDivider`, `CardRow`, `CollapsibleSection`, `EmptyState`, `MetaLine`, `Metadata` (internal), `MetadataList`, `NavDesktop`, `NavMobile`, `Page`, `ProgressIndicator`, `Tag`, `ThemeSetting`, `TopFade`; `Page` gains new `documentTitle` and `bottomNav` props.
- Icon set, minus brand icons.
- Toast: `ToastProvider`, `useToast`.
- Hooks: `useMinimizeOnScroll`, `usePullToRefresh`, `isStandalone`.
- Subpath exports: `/theme`, `/control`, `/component`, `/icon`, `/toast`, `/hooks`.
- Root `ThemeSettingValue` alias for the `ThemeSetting` type.
