# Alert

`import { Alert, type AlertProps, type AlertTone } from '@korzun/design/component'`

A tinted, bordered box for a status message that sits in the page flow: a tone,
an optional title, body text, an optional icon and an optional action. The
tone's `theme.color.chip[tone]` colours the background, border, title and icon;
the body text uses the normal text colour so a sentence stays readable.

Use something else for: inline field or form failure text (`ErrorMessage`), or a
single status word in a row (`Tag`). An Alert is for a message with weight that
may carry an action.

## Props

| Prop        | Type                                           | Default | Notes                                                                                          |
| ----------- | ---------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `tone`      | `'warning' \| 'danger' \| 'success' \| 'info'` |         | Required. `warning` and `danger` get `role="alert"`; `success` and `info` get `role="status"`. |
| `title`     | `ReactNode`                                    |         | Semibold heading above the body.                                                               |
| `children`  | `ReactNode`                                    |         | Body text.                                                                                     |
| `Icon`      | `ComponentType<IconProps>`                     |         | Shown before the title in the tone's text colour. There is no default icon per tone.           |
| `action`    | `ReactNode`                                    |         | Right side, usually a `Button`. Wraps under the text when narrow.                              |
| `className` | `string`                                       |         | Added last on the root. Override with `'&&'` specificity.                                      |

## Behaviour

- Corners follow surface depth (see `docs/corners.md`): 16px on a Page, 8px in
  a Card. With no provider the Alert counts as depth 0.
- Its contents, including `action`, sit one level deeper, so a Button in the
  action is already one step smaller than the Alert. Do not pass `radius`.
- Spacing and font sizes come from theme tokens; there is no `style` prop.

## Examples

```tsx
// Aviary's overdue banner: a warning inside a Card.
<Card>
  <Alert tone="warning" title="Frame is overdue" action={<Button>Retry</Button>}>
    No check-in for 2h 14m.
  </Alert>
</Card>
```

```tsx
<Alert tone="danger" title="Upload failed" Icon={AlertOctagonIcon}>
  The file is larger than 20 MB.
</Alert>
```

## Do / don't

- Do pick the tone by meaning: `warning` needs attention, `danger` failed,
  `success` done, `info` neutral news.
- Do put the one recovery action in `action`.
- Don't use it for field errors; use `ErrorMessage`.
- Don't mount a `danger` or `warning` Alert for static, always-visible copy:
  it is announced as an alert when it appears.
