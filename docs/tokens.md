# Tokens

Every token lives in `src/theme/theme.ts`. The `Theme` interface declares the groups; `lightTheme` and `darkTheme` are both built by `buildTheme(mode)` and share every key, differing only in values. Consumers read tokens with `useTheme()` or inside `createUseStyles((theme: Theme) => ...)`. The groups below follow the order of the `Theme` type; the key lists are taken from it.

The top-level `colorScheme` key holds the mode, `'light'` or `'dark'` (type `ThemeMode`), and is also the only non-group key of the type.

## color

Surfaces, text, borders and state colours, mode-aware. Keys are grouped as follows.

- `color.gray`: primitive palette, steps `50 100 150 200 300 400 500 600 700 900`. Identical in both modes.
- `color.blue`: primitive palette, steps `50 100 200 300 400 500 600 700 800`. Identical in both modes.
- `color.red`: primitive palette, steps `50 100 300 400 500 600 700`. Identical in both modes.
- `color.text`: `primary secondary muted faint onPrimary onDanger description`
- `color.bg`: `page card cardHeader track input footer glass glassFallback glassActive selected hover success placeholder`. `track` must read against both `page` and `card`; `hover` is a translucent scrim; `glass*` feed `recipe.glass`.
- `color.border`: `default strong light focus hover danger glass glassActive faint loading success section`
- `color.success`: a single value.
- `color.brand`: `default hover active light outline loading loadingHover loadingActive linkHover`
- `color.danger`: `default hover active light outline loading loadingHover loadingActive`
- `color.overlay`: `backdrop`
- `color.chip`: eight tinted label colourways, each `{ text, bg, border }`: `status author series subject book entryType user rating`. See Slated for curation.

## space

The spacing scale, in `rem`: `xxxs xxs xs sm md lg xl xxl xxxl xxxxl xxxxxl` (`0.1rem` up to `2rem`).

## radius

Corner radii: `sm md lg circle pill` (`4px`, `8px`, `16px`, `50%`, `999px`).

## size

Fixed component sizes that are not part of the spacing scale. One key: `metadataValue`. See Slated for curation.

## layout

Intrinsic sizes of chrome that other elements must lay out around. They are measured, not derived, so they are tuned on a device and kept in one place. Keys: `navHeightMobile` (the floating mobile nav, `96px`), `modalWidth` (the one width for every dialog, `500px`), `controlHeight` (the shared single-line control height, `2.0625rem`), and `floatingControlTopBase`, a position rather than a size: the `top` at which the mobile back button and actions menu pin, `max(space.xxxl, env(safe-area-inset-top) + space.xxxxl)`.

## fontSize

The type scale: `xxs xs sm md lg xl xxl` (`0.6rem` up to `1.75rem`).

## fontFamily

Two stacks: `body` (`system-ui, sans-serif`) and `mono`.

## fontWeight

Numeric weights: `medium semibold bold extrabold` (500, 600, 700, 800).

## lineHeight

Two values: `tight` (1) and `body` (1.3).

## shadow

Mode-aware elevation. `card` is a soft one-pixel shadow (defined, with no consumer outside the theme); `cardStack`, `dangerStack` and `brandStack` are the hard `0px 2px 0px` offset shadows for cards and buttons; `hoverLift` is the elevation of floating surfaces (the toast and the select and chips-input dropdowns); `glass` and `glassActive` belong to `recipe.glass` and `recipe.glassHighlight`. Keys: `card cardStack hoverLift dangerStack brandStack glass glassActive`.

## transition

Shorthand durations and easings: `fast medium slide slow spring`.

## zIndex

Stacking layers: `behind base stack header sticky toast`, where `stack` is a nested `{ lo, md, hi }` (1, 2, 3). Values run from `-1` (`behind`) to `9999` (`toast`).

## breakpoint

Media-query strings, ready to use as JSS keys: `mobile` (`@media (max-width: 640px)`) and `normal` (`@media (min-width: 641px)`).

## recipe

JSS-spreadable style fragments (`...theme.recipe.x`), not components.

- `recipe.input`: the base text-field look (border, radius, hover and focus colours, 16px font on mobile).
- `recipe.focusRing`: a transparent 2px outline that controls recolour on focus.
- `recipe.label`: form label text, with a `$danger` variant.
- `recipe.spinner`: a 1em rotating indicator using the `theme-rotation` keyframes.
- `recipe.glass`: frosted, blurred chrome with a solid fallback where backdrop blur is unsupported.
- `recipe.glassHighlight`: the active or pressed fill that sits on top of glass.
- `recipe.row`: the shaded field row (`bg.cardHeader` fill, `radius.md`, padding `space.md space.lg space.md space.sm`) that `Switch`'s horizontal layout uses; spread it for any custom row that sits beside form fields in a card.
- `recipe.modal.dialog`: the shared dialog shell (one width, backdrop, mobile margins and safe-area insets).
- `recipe.modal.header`: dialog title row.
- `recipe.modal.footer`: dialog action row.
- `recipe.card.shell`: card container with border, radius and `shadow.cardStack`.
- `recipe.card.header`: card title bar.
- `recipe.card.footer`: card action row.

## Slated for curation

Both groups below move into the package byte-for-byte in 0.0.1 and are due for a decision before the API settles.

- `color.chip.*`: eight colourways (`status author series subject book entryType user rating`) named after Bookplate's metadata chips, not after a general role.
- `size.metadataValue`: `15rem`, a width named after Bookplate's metadata display.

No other token name or comment in `src/theme/theme.ts` is clearly Bookplate-specific. Two comments mention app internals (`floatingControlTopBase` refers to the admin picker and `router/nav-layout-style`), but the tokens themselves are generic.
