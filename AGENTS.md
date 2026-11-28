# @korzun/design: guide for coding agents

This package's API is **not in your training data**. Don't guess props from
other libraries such as MUI, Chakra, or shadcn. Before using a module, read its
doc in `docs/`. The doc paths below are relative to this file, so in a
consuming app they are under `node_modules/@korzun/design/`.

The same docs are on the docs site, https://korzun.github.io/korzun-design/,
with an index for agents at https://korzun.github.io/korzun-design/llms.txt.

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

| Import                     | Contents                                                                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@korzun/design/theme`     | `ThemeProvider`, `useTheme`, `useThemeSetting`, `createUseStyles`, `Theme`, `lightTheme`, `darkTheme`                                                                                                  |
| `@korzun/design/control`   | buttons, inputs, select, switch, segmented control, popover, `ConfirmModal`, `Modal`, `useModal`, page actions, `Anchor`                                                                               |
| `@korzun/design/component` | `Page`, `Alert`, `Card` family, `Space`, `Text`, `Heading`, `Code`, `CodeBlock`, `EmptyState`, `ErrorMessage`, `Spinner`, `Table`, `Tag`, metadata, navs, `ThemeSetting`, `TopFade`                    |
| `@korzun/design/icon`      | `*Icon` components, `IconProps`                                                                                                                                                                        |
| `@korzun/design/toast`     | `ToastProvider`, `useToast`                                                                                                                                                                            |
| `@korzun/design/hooks`     | `useMinimizeOnScroll`, `usePullToRefresh`, `useIsStandalone`                                                                                                                                           |
| `@korzun/design`           | everything above, flat, plus `applyTransparency`; the `ThemeSetting` type is renamed `ThemeSettingValue` here                                                                                          |

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
   meaning. Lay out with `Space` and set text with `Text`/`Heading`.
   Don't write `display: 'flex'`, `gap`, `fontSize`, `fontWeight`, or text
   `color` in style files for that. Style files are for padding, borders,
   backgrounds, and one-offs.
2. **Corners follow depth.** On the page background use `lg`. Inside a card or
   modal use `md`. Inside one of those use `sm`. A flush child takes its
   parent's radius. Popovers, menus, and toasts use `md`, and their items `sm`.
   Step down one token per level; don't subtract padding. Never write a
   literal `borderRadius`. Library components do this for you; see
   [corners](docs/corners.md).
3. **Don't pass `radius` or `surface` by default.** `Button`, `Select`, `Card`,
   `CardRow` and `Alert` take their corners from where they sit (`Page` 0,
   `Card`/`Modal` 1, `Popover` 2). Pass `radius`/`surface` only to override. For a
   hand-made box with controls inside, wrap them in `Surface`.
4. **Button `type` is a visual variant** (`default`, `primary`, `text`, `link`,
   `dashed`), not the HTML attribute. For a submit button use `submit` (and
   `form="id"` when the button is outside its form). `onClick` is ignored on a
   submit button. `danger` (on `default` or `primary`) is the only modifier;
   there is no `success`.
5. **Icon props take components:** `prefix={SearchIcon}`, not
   `prefix={<SearchIcon />}`.
6. **Screens are a `Page` holding a stack of `Card`s,** one per feature. Form
   fields keep their default `horizontal` layout, and every field needs a
   `name`. See [patterns](docs/patterns.md).
7. **Modals:** use `ConfirmModal` for yes/no and `Modal` for anything else
   (title, body, optional footer; pass `canDismiss={!loading}`). Reach for
   `useModal` only for a custom native `<dialog>`.
8. **Menus:** a list of actions or links behind a button is a `Menu` (`items`
   array; `to` for links, `onClick` for actions). Never hand-build
   `role="menu"` or a dropdown of buttons.
9. **Accessibility:** give repeated row actions an `ariaLabel` ("Remove
   Kindle"). Don't wrap library controls in `<button>` or `<a>`; they are
   already interactive.
10. **Overrides:** pass `className` where the module doc says it is accepted,
    and win specificity with `'&&'`. Never use `!important`, and never target
    internal class names.
11. **Feedback and missing pieces:** show error lines with `ErrorMessage`,
    boxed status messages with `Alert`, and loading with `Spinner`. There is no
    `Tabs`, `Tooltip`, or `Checkbox` yet. Build them in app code from tokens
    following these rules, and don't pull in another UI library.

## Recipes

Before building a whole screen or a common group of parts (sign-in, …), check
`docs/recipes/` for a recipe and start from its code.

## Docs index

[docs]|theme.md: ThemeProvider, the light and dark themes, and createUseStyles for writing token-based styles.|corners.md: Corner radius by nesting depth, one radius step per level.|patterns.md: How screens are built: forms in cards, confirmations, menus, modals, toasts and style overrides.|tokens.md: Every theme token key in detail, group by group.|philosophy.md: The design rules the code enforces, and why.|icon.md: Inline SVG icon components that take the surrounding text colour, with the shared IconProps.|toast.md: Short, transient confirmations and errors that slide in from a corner and leave on their own.
[docs/control]|{anchor,back-button,button,chips-input,confirm-modal,date-time-input,field-list,menu,modal,number-input,page-actions-bar,page-actions-menu,page-footer-actions,popover,segmented-control,select,switch,text-area,text-input,use-modal}.md
[docs/component]|{alert,card,card-row,code,code-block,collapsible-section,divider,empty-state,error-message,heading,meta-line,nav-desktop,nav-mobile,page,progress-indicator,space,spinner,surface,table,tag,text,theme-setting,top-fade}.md
[docs/hooks]|{use-is-standalone,use-minimize-on-scroll,use-pull-to-refresh}.md
[docs/recipes]|{copy-button,login}.md
