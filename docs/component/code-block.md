---
title: CodeBlock
description: A block of code in mono type that scrolls or wraps, can show highlighted children, and can offer a Copy button.
category: Data display
---
# CodeBlock

<!-- generated:import -->

`import { CodeBlock, type CodeBlockProps } from '@korzun/design/component'`

<!-- /generated:import -->

A block of code in mono type on a tinted box, for a command, an import line or a
snippet a reader may copy. It scrolls sideways (or wraps), shows either plain
text or highlighted children, and can add a Copy button.

Use something else for: a name or short expression inside a sentence (`Code`),
data in rows and columns (`Table`).

## Usage

### Plain and highlighted

Pass `code` alone for plain text. To colour it, pass highlighted spans as
`children`: they replace what shows, and Copy still copies `code`, so keep the
two the same text. Pass the inner `<code>` content (or its spans), not Shiki's whole
`<pre>`: `CodeBlock` renders its own `pre`.

### Code colours

`CodeBlock` sets these CSS variables on its root from `theme.color.code`, the
names Shiki's css-variables theme emits with `variablePrefix: '--code-'`. A
highlighter that uses that theme follows the light and dark themes with no
colour work.

| Variable | Theme token |
| --- | --- |
| `--code-foreground` | `color.code.foreground` |
| `--code-token-keyword` | `color.code.keyword` |
| `--code-token-string` | `color.code.string` |
| `--code-token-string-expression` | `color.code.string` |
| `--code-token-function` | `color.code.function` |
| `--code-token-parameter` | `color.code.parameter` |
| `--code-token-constant` | `color.code.constant` |
| `--code-token-punctuation` | `color.code.punctuation` |
| `--code-token-comment` | `color.code.comment` |
| `--code-token-link` | `color.code.link` |

Shiki's other variables (`--code-background`, `--code-token-inserted`,
`--code-token-deleted`, `--code-token-changed`, `--code-ansi-*`) are not set,
so those tokens fall back to the inherited colour. For highlighted HTML rendered
outside `CodeBlock`, such as markdown, spread `theme.recipe.codeColours` on its
wrapper to set the same ten variables.

### Copy

`copyable` adds a text button that reads Copy. Pressed, it writes `code` to the
clipboard and reads Copied with a check for 2 seconds; pressing again restarts
the 2 seconds. Where there is no clipboard (an insecure page) or the write is
refused, it reads Could not copy for 2 seconds and throws nothing. A visually
hidden status region announces the result. `copyLabel` is the idle button's
accessible name.

### Scrolling and wrapping

A long line scrolls inside the box and never widens the page; the right edge
fades while more is hidden, since phones hide scrollbars. `wrap` breaks long
lines instead.

### Styling

Takes `className` on the root, merged last. The look is fixed: it is the
`theme.recipe.codeBlock` look, drawn by the component.

### Corners

The box's corners follow where it sits: `lg` on a `Page`, `md` in a Card or
`Surface`, `sm` two levels in. The Copy button sits one level deeper. In dark
mode directly on a `Page` a 1px `border.default` edge separates the box from the
page. See [corners](../corners.md).

## Do / don't

- Do pass the same text as `code` and as the highlighted `children`.
- Don't use it inline in a sentence; use `Code`.

<!-- generated:examples -->

## Examples

### Basic

Plain code in a mono box. A line longer than the box scrolls sideways inside it, with a fade at the edge while more is hidden.

```tsx
import { CodeBlock } from '@korzun/design/component';

export default function Basic() {
  return <CodeBlock code="npm install @korzun/design react react-dom react-jss" />;
}
```

### Copyable

`copyable` adds a Copy button that turns into Copied for two seconds; `copyLabel` names it for screen readers.

```tsx
import { CodeBlock } from '@korzun/design/component';

export default function Copyable() {
  return (
    <CodeBlock
      code="import { Button } from '@korzun/design/control';"
      copyable
      copyLabel="Copy import"
    />
  );
}
```

### Highlighted

Children replace the plain text; Copy still copies `code`. `CodeBlock` sets the `--code-*` variables, so a highlighter that emits them, such as Shiki's css-variables theme with `variablePrefix: '--code-'`, follows the light and dark themes.

```tsx
import { CodeBlock } from '@korzun/design/component';

const code = "const label = 'Copy';";

export default function Highlighted() {
  return (
    <CodeBlock code={code} copyable>
      <span style={{ color: 'var(--code-token-keyword)' }}>const</span>{' '}
      <span style={{ color: 'var(--code-token-constant)' }}>label</span>
      <span style={{ color: 'var(--code-token-punctuation)' }}> = </span>
      <span style={{ color: 'var(--code-token-string)' }}>'Copy'</span>
      <span style={{ color: 'var(--code-token-punctuation)' }}>;</span>
    </CodeBlock>
  );
}
```

### Wrap

`wrap` breaks long lines inside the box instead of scrolling them, for output a reader should see whole.

```tsx
import { CodeBlock } from '@korzun/design/component';

export default function Wrap() {
  return (
    <CodeBlock
      wrap
      code="curl --fail --location --header 'Accept: application/json' https://example.com/api/v1/books?sort=title&order=asc&limit=100"
    />
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | What to show in place of `code`, such as syntax-highlighted spans. Copy still copies `code`. |
| `className` | `string` |  | Extra class on the root, merged after the component's own. |
| `code` (required) | `string` |  | The code as plain text. It is what Copy puts on the clipboard, and what shows when there are no `children`. |
| `copyable` | `boolean` | `false` | Adds a Copy button beside the code. |
| `copyLabel` | `string` | `'Copy code'` | The Copy button's accessible name; it reads "Copy". |
| `wrap` | `boolean` | `false` | Wraps long lines instead of scrolling them sideways. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.breakpoint.mobile` | `@media (max-width: 640px)` | `@media (max-width: 640px)` |
| `theme.color.bg.cardHeader` | `#EEEEEE` | `#232427` |
| `theme.color.border.default` | `#D9D9D9` | `#3A3B40` |
| `theme.color.code.foreground` | `#111` | `#F5F5F7` |
| `theme.colorScheme` | `light` | `dark` |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.recipe.codeBlock` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.codeColours` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.space.md` | `0.5rem` | `0.5rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): New `CodeBlock` (component): a block of code in mono type on a `bg.cardHeader` box that scrolls sideways (with a fade at the edge while more is hidden) or wraps with `wrap`. `code` is the plain text; `children` replace what shows (highlighted spans) while Copy still copies `code`. `copyable` adds a Copy button that becomes Copied with a check, or Could not copy, for 2 seconds and announces it in a status region; `copyLabel` names it. It sets the `--code-*` variables Shiki's css-variables theme emits, from `color.code`. Corners follow surface depth, and in dark mode directly on a Page it gets a 1px `border.default` edge.

<!-- /generated:changelog -->
