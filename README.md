# @korzun/design

The design system behind Bookplate and Scribe: theme tokens, controls, components, icons, toast and hooks, built on React 19 and react-jss. All rights reserved; the package is published so the owner's own apps can depend on it.

## Install

```sh
npm i @korzun/design react react-dom react-jss classnames react-router
```

Peer dependencies:

- `react` ^19
- `react-dom` ^19
- `react-jss` ^10
- `classnames` ^2
- `react-router` ^8

## Providers

`ThemeProvider` takes `identity?: string | null`. The appearance choice is stored under `theme-setting:<identity>`; `null` (the default) means no persistence and `auto`. Wrap the app once, feeding it the signed-in identity:

```tsx
import { useEffect, useState } from 'react';
import { ThemeProvider, ToastProvider } from '@korzun/design';
import { TOKEN_CHANGED_EVENT, currentIdentity } from './lib/token';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [identity, setIdentity] = useState(currentIdentity);
  useEffect(() => {
    const onChange = () => setIdentity(currentIdentity());
    window.addEventListener(TOKEN_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(TOKEN_CHANGED_EVENT, onChange);
  }, []);
  return (
    <ThemeProvider identity={identity}>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
};
```

## Page

`Page` sets `document.title` when `documentTitle` is given; omit it if your app manages the title itself. `bottomNav` reserves the clearance `NavMobile` needs on mobile and is off by default.

## Imports

| Import | Contents |
| --- | --- |
| `@korzun/design` | everything |
| `@korzun/design/theme` | `ThemeProvider`, `useTheme`, `useThemeSetting`, `GlobalStyles`, `useThemeGlobalStyles`, `createUseStyles`, `lightTheme`, `darkTheme`, types `Theme`, `ThemeMode`, `ThemeSetting`, `ThemeProviderProps` |
| `@korzun/design/control` | buttons, inputs, select, segmented control, popover, dialogs, page actions |
| `@korzun/design/component` | card family, empty state, metadata, tag, page, nav layouts, theme setting |
| `@korzun/design/icon` | all icons, `IconProps`, default icon prop sets |
| `@korzun/design/toast` | `ToastProvider`, `useToast` |
| `@korzun/design/hooks` | `useMinimizeOnScroll`, `usePullToRefresh`, `isStandalone` |

The root export is everything, flat. The `ThemeSetting` type is exported from the root as `ThemeSettingValue`, because the `ThemeSetting` component takes the name; from `@korzun/design/theme` it is still `ThemeSetting`.

## Coding agents

The package ships `AGENTS.md` and per-module docs in `docs/`, written for LLM coding agents. Point your app's agent at them by adding this line to its `CLAUDE.md` or `AGENTS.md`:

```
@node_modules/@korzun/design/AGENTS.md
```

## Docs site

https://korzun.github.io/korzun-design/ is the documentation site: an overview of every module, and one page per control, component and entry point with its import line, live examples (each with its source), props tables, theme tokens and changelog. It also serves `llms.txt` (an index for LLM agents) and `llms-full.txt` (every doc in one file). Every push to `main` deploys it; it is not published to npm.

- `npm run gallery` serves the site locally (on the LAN) from the source tree; `npm run gallery:build` writes a static copy to `gallery-dist/`.
- `npm run docs:gen` builds the package and regenerates the generated sections of every `docs/**/*.md` (import, examples, props, tokens, changelog), the `AGENTS.md` docs index and the site data, from the JSDoc, each module's `examples/NN-slug.tsx`, the theme tokens and `CHANGELOG.md`. Run it after any API change; `npm run docs:check` (part of `npm test`) fails when anything is stale.
- Two Claude Code skills in `.claude/skills/` do the work: `new-component` adds a control, component or hook end to end (code, test, examples, doc, export, CHANGELOG), and `document-component` writes or refreshes a module's doc, JSDoc and examples.

## Development

- `npm test` runs the unit tests
- `npm run lint` runs oxlint, oxfmt and `tsc --noEmit`
- `npm run build` compiles with `tsc` to per-file ESM and `.d.ts` in `dist/`
- `npm run smoke` builds, packs the tarball and type-checks one import per subpath in a scratch project

## License

All rights reserved. See `LICENSE`.
