# ErrorMessage

`import { ErrorMessage, type ErrorMessageProps } from '@korzun/design/component'`

A failure message the user must notice. It renders a `<p role="alert">` in the
danger colour at `fontSize.sm`, with no margin or padding, so screen readers
announce it when it appears.

Use something else for: static red copy that is always on screen
(`<Text tone="danger">`, which uses the darker chip red and no `role`), or a
boxed alert (an Alert component comes later).

## Props

| Prop        | Type                     | Default | Notes                                                                 |
| ----------- | ------------------------ | ------- | --------------------------------------------------------------------- |
| `as`        | `'p' \| 'div' \| 'span'` | `'p'`   | The element to render.                                                |
| `children`  | `ReactNode`              |         | The error text. `null`, `undefined`, `false` and `''` render nothing. |
| `className` | `string`                 |         | Added last on the root.                                               |
| `ref`       | `Ref<HTMLElement>`       |         | Ref to the root element.                                              |

Every other HTML attribute (`id`, `aria-*`, `data-*`, event handlers) passes
through, and may override `role`. There is no `style` prop.

## Behaviour

- Empty renders nothing, not an empty alert. Leave it mounted and pass the
  error (or `undefined`) as children; an alert region that appears with text
  is announced.
- `0` is not empty and renders.
- Space it from the field above with `Stack` `gap`; it has no margin.
- Override with `className` at `'&&'` specificity, never `!important`.

## Examples

```tsx
// Under a field, linked for assistive tech.
<Stack gap="sm">
  <input id="title" aria-describedby="title-error" aria-invalid={!!error} />
  <ErrorMessage id="title-error">{error}</ErrorMessage>
</Stack>
```

## Do / don't

- Do keep it mounted and pass `error` as children.
- Do link it to the field with `id` and `aria-describedby`.
- Don't use it for permanent red copy; use `<Text tone="danger">`.
- Don't add margins to it; use `Stack`.
