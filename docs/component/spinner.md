# Spinner

`import { Spinner, type SpinnerProps } from '@korzun/design/component'`

A rotating loading indicator. It is `1em` square, takes the surrounding text
colour (`currentColor`), and by default the surrounding font size, so it sits
inline with text without any sizing. Use it for a page, panel or inline load
that has no progress value.

Use something else for: a load with a known fraction (`ProgressIndicator`).
`Button` (`loading`), `Select` (`loading`) and `Switch` (`loading`) draw their
own spinner; do not add one beside them.

## Props

| Prop         | Type                      | Default     | Notes                                                                                             |
| ------------ | ------------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `size`       | `keyof Theme['fontSize']` | inherit     | `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`. Sets the font size, so the spinner is that many `em`. |
| `label`      | `string`                  | `'Loading'` | Accessible name of the status. Ignored when `decorative`.                                         |
| `decorative` | `boolean`                 | `false`     | Hide from assistive tech: no role, `aria-hidden`.                                                 |
| `className`  | `string`                  |             | Added last on the root.                                                                           |

There is no `style` prop and no other attribute passthrough.

## Behaviour

- By default the root is a `span` with `role="status"` and `aria-label={label}`,
  so a screen reader announces the load. The inner icon is always `aria-hidden`.
- With `decorative`, the root has no role and is `aria-hidden`.
- Override with `className` at `'&&'` specificity, never `!important`.

## Examples

```tsx
// Inherits size and colour from the text around it.
<Spinner />

// A named load.
<Spinner size="xl" label="Loading books" />

// Beside text that already says what is loading: hide the spinner.
<Inline gap="xs" align="center">
  <Spinner decorative />
  <Text>Loading books</Text>
</Inline>

// Loading-page recipe.
<Stack align="center" gap="sm">
  <Spinner size="xxl" label="Loading your library" />
  <Text tone="muted">Loading your library</Text>
</Stack>
```

## Do / don't

- Do use `decorative` when adjacent text names the load.
- Do give a specific `label` when the spinner stands alone.
- Don't hand-write `role="status"` around it; it already has one.
- Don't add a Spinner inside `Button`, `Select` or `Switch`; they draw their own.
