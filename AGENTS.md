# @korzun/design: guide for coding agents

This package's API is **not in your training data**. Don't guess props from
other libraries such as MUI, Chakra, or shadcn. Before using a module, read its
doc in `docs/`. The doc paths below are relative to this file, so in a
consuming app they are under `node_modules/@korzun/design/`.

To load this guide in a consuming app, add this line to its `CLAUDE.md` or
`AGENTS.md`:

```
@node_modules/@korzun/design/AGENTS.md
```

## Setup

- React 19 with react-jss. Peers: `react`, `react-dom`, `react-jss`, `classnames`,
  `react-router`.
- Wrap the app once: `<ThemeProvider identity={userIdOrNull}><ToastProvider>…`.
  `ThemeProvider` renders the global styles itself.
- Routing components (`BackButton`, `Page back`, the navs) need a react-router
  router above them.

## Imports

| Import | Contents |
|---|---|
| `@korzun/design/theme` | `ThemeProvider`, `useTheme`, `useThemeSetting`, `createUseStyles`, `Theme`, `lightTheme`, `darkTheme` |
| `@korzun/design/control` | buttons, inputs, select, switch, segmented control, popover, `ConfirmModal`, `useModalDialog`, page actions |
| `@korzun/design/component` | `Page`, `Card` family, `EmptyState`, `Tag`, metadata, navs, `ThemeSetting`, `TopFade` |
| `@korzun/design/icon` | `*Icon` components, `IconProps` |
| `@korzun/design/toast` | `ToastProvider`, `useToast` |
| `@korzun/design/hooks` | `useMinimizeOnScroll`, `usePullToRefresh`, `isStandalone` |
| `@korzun/design` | everything above, flat, plus `applyTransparency`; the `ThemeSetting` type is renamed `ThemeSettingValue` here |

Import only from these entry points, never from `dist/…` or `src/…` paths.
Every component exports its props type as `<Name>Props` (`ButtonProps`,
`CardProps`, …), and every prop has a JSDoc comment, so hover or read the
`.d.ts` for details.

## Rules

1. **Style with tokens only.** Use `createUseStyles((theme: Theme) => …)` in a
   sibling `style.ts`. Colours, spacing, font sizes, radii, shadows, and z-index
   all come from `theme.*`; use `applyTransparency(token, alpha)` for tints. No
   literal hex, px, or rem values, no inline `style={{…}}` with literals, and no
   other CSS-in-JS or Tailwind. See [theme](docs/theme.md). **Tags that report
   state use a status tone**; label tones (`subject`, `author`, …) name
   things. `status` is a legacy label tone despite its name; for a state use
   `success`/`warning`/`danger`/`info`, or `neutral` when it carries no
   meaning.
2. **Corners follow depth.** On the page background use `lg`. Inside a card or
   modal use `md`. Inside one of those use `sm`. A flush child takes its
   parent's radius. Popovers, menus, and toasts use `md`, and their items `sm`.
   Step down one token per level; don't subtract padding. Never write a
   literal `borderRadius`. See [corners](docs/corners.md).
3. **Buttons take the surface they sit on:** `radius="card"` inside a Card,
   `radius="modal"` in a modal footer, no `radius` on the page background.
4. **Button `type` is a visual variant** (`default`, `primary`, `text`, `link`,
   `dashed`), not the HTML attribute. For a submit button use `submit` (and
   `form="id"` when the button is outside its form). `onClick` is ignored on a
   submit button. `danger` and `success` can't both be set.
5. **Icon props take components:** `prefix={SearchIcon}`, not
   `prefix={<SearchIcon />}`.
6. **Screens are a `Page` holding a stack of `Card`s,** one per feature. Form
   fields keep their default `horizontal` layout, and every field needs a
   `name`. See [patterns](docs/patterns.md).
7. **Modals:** use `ConfirmModal` for yes/no. Build anything else on
   `useModalDialog(isOpen, onDismiss, canDismiss)` with a native `<dialog>`
   that stays mounted, and pass `canDismiss={!loading}`.
8. **Accessibility:** give repeated row actions an `ariaLabel` ("Remove
   Kindle"). Don't wrap library controls in `<button>` or `<a>`; they are
   already interactive.
9. **Overrides:** pass `className` where the module doc says it is accepted,
   and win specificity with `'&&'`. Never use `!important`, and never target
   internal class names.
10. **Missing pieces:** there is no `Stack`, `Text`, `Heading`, general
    `Dialog`, `Tabs`, `Tooltip`, `Checkbox`, or `Alert` yet. Build them in app
    code from tokens following these rules, and don't pull in another UI library.

## Docs index

[docs]|theme.md: provider, createUseStyles, token summary, recipes|corners.md: radius by nesting depth|patterns.md: screens, forms in cards, modals, overrides|tokens.md: every token key in detail|philosophy.md: design rules and why|icon.md|toast.md|hooks.md
[docs/control]|{back-button,button,chips-input,confirm-modal,date-time-input,field-list,number-input,page-actions-bar,page-actions-menu,page-footer-actions,popover,segmented-control,select,switch,text-area,text-input,use-modal-dialog}.md
[docs/component]|{card,card-divider,card-row,collapsible-section,empty-state,inline,meta-line,metadata-list,nav-desktop,nav-mobile,page,progress-indicator,stack,tag,text,theme-setting,top-fade}.md
