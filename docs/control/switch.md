# Switch

`import { Switch } from '@korzun/design/control'`

An on/off toggle (`role="switch"`) with an optional label and description, a
full-row `horizontal` layout for forms, and a `loading` state for saves in
flight. Controlled: you own `checked`.

Use something else for: one of several options (`SegmentedControl`, `Select`),
an action that happens on click (`Button`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | (required) | **Not a form field**: there is no hidden input. Only the last-resort accessible name. |
| `checked` | `boolean` | (required) | Controlled. |
| `onChange` | `(checked: boolean) => void` | (required) | Receives the new value, not an event. Not called while `disabled` or `loading`. |
| `label` | `string` | | Visible label and accessible name. |
| `ariaLabel` | `string` | | Accessible name when the visible label lives elsewhere (a grid's row and column headers). Wins over `label`. Without either, `name` is announced. |
| `description` | `ReactNode` | | Helper text under the label, linked by `aria-describedby`. |
| `layout` | `'default' \| 'horizontal'` | `'default'` | `default`: track, then label, inline. `horizontal`: full-width `bg.cardHeader` row (`radius.md`), label and description left, track right; **the whole row toggles**, description included. |
| `radius` | `'inset' \| 'pill'` | `'inset'` | Track shape; see "Choosing a radius". |
| `loading` | `boolean` | `false` | Ignores clicks immediately and sets `aria-busy`; the thumb becomes a spinner only after 150ms, so fast saves don't flash. Keeps its colour. |
| `disabled` | `boolean` | `false` | Fades to 40%, removes it from the tab order. |

No `className`. Keyboard: Enter and Space toggle. Clicks and those keys stop
propagation, so a switch inside a clickable card row won't trigger the row.

## Choosing a radius

See [corners](../corners.md).

- In a shaded row (`layout="horizontal"`, or inside any field row): omit it
  (`inset`, a 4px track concentric with the row's 8px corner).
- In a `Card` header (`headerAction`), or anywhere with no nearby corner to
  echo: `radius="pill"`.

## Examples

```tsx
// A form setting inside a Card.
<Switch
  name="bwCover"
  label="Grayscale"
  layout="horizontal"
  description="Convert cover to grayscale for monochrome screens."
  checked={bwCover}
  onChange={setBwCover}
/>

// In a Card header: pill.
<Card
  title="Series"
  headerAction={
    <Switch name="isSeries" ariaLabel="Part of a series" radius="pill"
      checked={isSeries} onChange={setIsSeries} />
  }
>…</Card>

// Saving straight to the server.
<Switch name="push-device" label="This device" checked={subscribed}
  loading={busy} disabled={!supported} onChange={toggleSubscription} />
```

## Do / don't

- Do pass `loading` while the save runs instead of `disabled`; `disabled` means
  "you may not change this".
- Do give a label-less switch an `ariaLabel`; `name` is a machine key.
- Don't expect a switch to submit with a `<form>`; send `checked` from state.
- Don't put an interactive element in `description` of a `horizontal` switch:
  clicking it toggles the switch.
