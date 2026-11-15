# Design philosophy

These are the rules the code already enforces, extracted from the source comments at extraction time. Nothing here is aspirational: each rule names the file whose comment states it and the code that carries it out.

## One modal width

**Rule:** Give every dialog the same width by taking it from `layout.modalWidth`.

**Why:** `src/theme/theme.ts` says "modalWidth: one width for every dialog so modals read as a single system", and `recipe.modal.dialog` reads "One shared width for every modal; the maxWidth keeps it inside a narrow viewport (the auto side-margins then center it)". `layout.modalWidth` is `500px`, and `recipe.modal.dialog` (used by `src/control/confirm-modal/style.ts`) sets `width` to it and caps it at `calc(100vw - space.xxl * 2)`.

## Stacked shadows, not blur, on cards and buttons

**Rule:** Lift cards and buttons with a hard offset shadow (`0px 2px 0px <colour>`), not a blurred one.

**Why:** `src/theme/theme.ts` defines `shadow.cardStack`, `shadow.dangerStack` and `shadow.brandStack` as `0px 2px 0px` with a translucent colour, and `recipe.card.shell` and the button types in `src/control/button/style.ts` use them. Blurred shadows exist only where the surface is glass (`shadow.glass`, `shadow.glassActive`) or for a hover lift (`shadow.hoverLift`). In dark mode the stacks switch to `applyTransparency('#000', 0.4)`.

## Translucent hover scrims

**Rule:** Paint hover state with a translucent scrim (`color.bg.hover`), never an opaque grey.

**Why:** `src/theme/theme.ts` (`color.bg.hover`, light mode): "A translucent scrim, not an opaque grey: hover has to read on whatever surface it lands on. The old '#f0f0f0' was lighter than the modal footer (gray[100]) it was painted over, so hovering a text button there produced no visible change at all." Light mode is black at 0.07 opacity, dark mode white at 0.12. `src/control/button/style.ts` and `src/control/action-menu-list/style.ts` both use it.

## A 16px floor on mobile form controls

**Rule:** Keep the font size of every input, textarea and select at 16px on mobile.

**Why:** `src/theme/global-styles.ts`: "iOS Safari auto-zooms when a form control with a font-size below 16px is focused. Enforce a 16px floor on mobile so focusing an input never zooms." Controls whose class-level font size out-specifies that global rule restore the floor themselves: `recipe.input` in `src/theme/theme.ts` ("Restore the 16px floor on mobile: this class-level font-size otherwise out-specifies the global `input` rule") and `src/control/chips-input/style.ts`.

## Glass chrome with a solid fallback

**Rule:** Build floating chrome from `recipe.glass`, which must degrade to a near-opaque fill where backdrop blur is unavailable.

**Why:** `recipe.glass` in `src/theme/theme.ts` blurs and saturates the backdrop with `color.bg.glass`, and inside `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` swaps the background to `color.bg.glassFallback` (0.92 opacity against 0.6 for the glass itself). `src/control/action-menu-list/style.ts`, `src/control/page-actions-menu/style.ts` and `src/control/back-button/style.ts` spread it. `recipe.glassHighlight` is the pressed or active counterpart, used by `src/component/nav-mobile/style.ts`.

## The `track` token must read against both `page` and `card`

**Rule:** Keep `color.bg.track` distinguishable from `color.bg.page` and from `color.bg.card` in both themes.

**Why:** `src/theme/theme.ts` documents `bg.track` as "The rail behind a segmented control's sliding lens. Its own token, not `cardHeader`, because it must read against BOTH `page` and `card` — and in dark mode those sit on either side of `cardHeader`, which left the rail invisible on the page." In light mode it is `gray[100]`; in dark mode it is `#2C2D31`, "A step LIGHTER than the page, not darker", because the dark palette puts `page` above `card` and recessing the track has nowhere to go. `src/control/segmented-control/style.ts` paints it.

## Recipes are spreadable fragments, not components

**Rule:** Express shared styling as a `Recipe` object that styles spread (`...theme.recipe.glass`), not as a component.

**Why:** `src/theme/theme.ts`: "Recipes are JSS-spreadable fragments. Loose typing lets them include pseudo-selectors (`&:hover`) and nested rules without fighting JSS's TS surface." The `Recipe` type is deliberately loose for the same reason. `recipe.input`, `focusRing`, `label`, `spinner`, `glass`, `glassHighlight`, `modal.*` and `card.*` are all plain objects, and consumers such as `src/control/button/style.ts` spread them (`...theme.recipe.focusRing`).

## Measured layout numbers live in tokens

**Rule:** Put a measured layout number in `theme.layout` (or `theme.size`) and read it from there.

**Why:** `src/theme/theme.ts` on `layout`: "Intrinsic sizes of chrome that other elements must lay out around. These are measured, not derived (the element's real height comes from its content), so they need on-device tuning — keep the single source of truth here." `navHeightMobile` is read by `src/component/page/style.ts` and `src/toast/style.ts`, and `controlHeight` by the text, number, select and date-time inputs. Exception to know about: `src/component/page/style.ts` keeps its own measured `minHeight: '2.25rem'` on `headerRow`, commented "MEASURED, not derived, and the one number to tune here", and `src/control/chips-input/style.ts` uses the same `2.25rem` for its roomier default. Those two have not been promoted to tokens.

## Form controls share one height

**Rule:** Give single-line inputs, selects and chips the same height from `layout.controlHeight`.

**Why:** `src/theme/theme.ts`: "controlHeight: the shared single-line height for inputs/select/chips (~33px) so form controls line up on one row. Single source of truth." `layout.controlHeight` is `2.0625rem`, and `src/control/text-input/style.ts`, `number-input`, `select` and `date-time-input` set `height` to it. `chips-input` uses it only in its `dense` mode.

## Pin floating controls with sticky positioning, not scroll listeners

**Rule:** Hold floating mobile controls in a `position: sticky` row at `layout.floatingControlTopBase`; do not drive a fixed element's `top` from scroll events.

**Why:** `src/component/page/style.ts` (`controlsRow`): "STICKY, not fixed: it starts in the page's flow … scrolls up with the page like everything else, and pins at `floatingControlTopBase` once it gets there." The old approach, a `position: fixed` row with a scroll listener rewriting `top`, "lags the compositor on iOS and jitters for the whole ride; sticky positioning is the same motion, done by the scroller itself." `floatingControlTopBase` in `src/theme/theme.ts` is also the one token that is a position rather than a size.

## Page content clears the floating mobile nav through one token

**Rule:** Anything that must rest above the floating mobile nav adds `layout.navHeightMobile` to its offset instead of hard-coding the nav's height.

**Why:** `src/theme/theme.ts`: "The floating mobile nav capsule is ~96px tall on-device … page padding and bottom-docked toasts both clear it via this token." `src/component/page/style.ts` (`bottomNav`) pads the last row by it "so the last row can always be scrolled above both the nav and Safari's expanded URL bar", and `src/toast/style.ts` rests mobile toasts at `calc(navHeightMobile + space.md + env(safe-area-inset-bottom))`.

## Toasts slide up from behind the nav

**Rule:** Stack mobile toasts one layer below the nav (`zIndex.sticky - 1`), so they emerge from behind it rather than covering it.

**Why:** `src/toast/style.ts`: "Rest just above the floating bottom nav (plus the home-indicator inset). Sit one layer below the nav so toasts slide up from behind it, not over it." On mobile the code sets `zIndex: theme.zIndex.sticky - 1`; the desktop container uses `theme.zIndex.toast`.

## Safe-area insets are spent once, by whatever is topmost

**Rule:** Add `env(safe-area-inset-top)` once, at the topmost element, and let anything below it reuse the inset through `--page-top-inset`.

**Why:** `src/component/page/style.ts`: "The inset belongs to whatever is topmost. When that is this `<main>` the fallback applies; when the admin's library-switcher band sits above it, the band has already spent the inset and sets `--page-top-inset` to zero on everything after it." Counting it twice left a status-bar-sized hole in the installed app only, "because in a Safari tab the inset is zero, which is how it went unnoticed." The page's top padding is `calc(space.xxxxxl + var(--page-top-inset, env(safe-area-inset-top)))`. The modal recipe applies the same insets to its mobile margins.

## Un-tokenized literals are declared, not hidden

**Rule:** When a style keeps a literal that is off the token scale, say so in a comment at the top of the file and on the line.

**Why:** `src/control/button/style.ts` opens with "A small handful of literals stay un-tokenized in this file by design", listing `'#FFF'` (focus-ring border on colored backgrounds), `'0.5em'` (a gap that scales with the button's own font size) and `'0.80rem'` (button-specific size, "off the global fontSize scale"). The `0.80rem` line repeats the note in place.

## Not found in the code

- **Ink-on-paper register over glossy chrome.** Searched `src/` for gradients and glossy treatments. The only gradient is a `linear-gradient` mask in `src/component/top-fade/style.ts`, which is a blur fade, not paint. The statement itself lives in Bookplate's `brand/README.md` ("a gradient reads as glossy app-store chrome, which is the opposite of the idea"), where it governs the logo kit (solid ink tiles, `currentColor` marks), and that kit is not part of this package. The flat, hard-edged look the principle implies is covered by the stacked-shadow rule above, so it is not written separately.
