---
title: Code
description: Inline code in the mono font, sized to the surrounding text, for a prop name or a short expression in a line of prose.
category: Typography
---
# Code

<!-- generated:import -->

`import { Code, type CodeProps } from '@korzun/design/component'`

<!-- /generated:import -->

Inline code in the mono font, sized to the surrounding text, for a prop name or
a short expression in a line of prose. It renders a `<code>` element at 0.875em
of the text around it, so it scales in a heading, on a tinted chip with
`space.xxs` side padding.

Use something else for: a block of several lines or a snippet to copy
(`CodeBlock`), a keyboard key or a status chip (`Tag`).

## Usage

### Styling

Takes `className`, merged last. The look is fixed: it is the same
`theme.recipe.inlineCode` that styles code in the docs' markdown.

### Surprising behaviour

- **Breaks only when it must.** A long name stays on its line and wraps
  (`overflow-wrap: break-word`) only when it cannot fit the line.
- **Dark mode adds an edge on the page only.** Directly on a `Page` in dark
  mode, a 1px `border.default` hairline separates the chip from the page. Inside
  a `Card`, `Modal` or other surface the tint reads on its own, so there is none.

### Corners

The chip's corners are fixed at `radius.sm` at every depth: it is a glyph
smaller than a line of text. See [corners](../corners.md).

## Do / don't

- Do use it for names and short expressions inside a sentence or a heading.
- Don't put a multi-line snippet in it; use `CodeBlock`.

<!-- generated:examples -->

## Examples

### In text

A prop name inside a sentence. `Code` takes 0.875em of the text around it, so it sits in the line without looking larger.

```tsx
import { Code, Stack, Text } from '@korzun/design/component';

export default function InText() {
  return (
    <Stack gap="sm">
      <Text as="p">
        Set <Code>maxLength</Code> to cap the title, or <Code>onChange</Code> to follow each
        keystroke.
      </Text>
      <Text as="p" size="sm" tone="muted">
        It follows smaller text too: <Code>value</Code> and <Code>defaultValue</Code>.
      </Text>
    </Stack>
  );
}
```

### In a heading

`Code` scales with its heading, so a name stays in proportion at every level.

```tsx
import { Code, Heading, Stack } from '@korzun/design/component';

export default function InAHeading() {
  return (
    <Stack gap="sm">
      <Heading level={1}>
        The <Code>Table</Code> component
      </Heading>
      <Heading level={2}>
        The <Code>Table</Code> component
      </Heading>
      <Heading level={3}>
        The <Code>Table</Code> component
      </Heading>
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The code to show, a name or a short expression. It stays on the text's line and breaks only when it cannot fit. |
| `className` | `string` |  | Extra class on the `<code>` element, merged after the component's own. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.border.default` | `#D9D9D9` | `#3A3B40` |
| `theme.colorScheme` | `light` | `dark` |
| `theme.recipe.inlineCode` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): New `Code` (component): inline `<code>` in the mono font at 0.875em of the surrounding text (so it scales in a heading), on a `bg.cardHeader` chip with `sm` corners; a long name breaks only when it cannot fit. In dark mode directly on a Page it gets a 1px `border.default` edge. Takes `children` and `className`.

<!-- /generated:changelog -->
