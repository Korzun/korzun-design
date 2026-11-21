# CollapsibleSection

`import { CollapsibleSection } from '@korzun/design/component'`

A disclosure section with no card chrome: an uppercase, muted header row with a
text chevron (▶ / ▼), an optional count-style subtitle, optional trailing
actions, and children shown only while open. The header is a
`role="button"` (`tabIndex=0`, Enter/Space).

Use something else for: a collapsible feature on a screen (`Card` with
`isCollapsible`, which also hides its footer while collapsed).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | required | Rendered uppercase via CSS. |
| `subTitle` | `string` | | Faint text after the title, e.g. a count ("3 items"). |
| `children` | `ReactNode` | | Rendered only while open (unmounted when closed). |
| `actions` | `ReactNode[]` | `[]` | Rendered at the right end of the header. **An array**, not a single node. |
| `open` | `boolean` | | Controlled open state. Omit for uncontrolled (starts closed). |
| `onOpenToggle` | `() => void` | no-op | Called on every header click/Enter/Space. **Receives no value**; flip your own state. |

No `className`.

## Surprising behaviour

- **Actions toggle the section.** They are rendered inside the header button
  with no `stopPropagation`, so clicking an action also opens/closes the
  section. Stop propagation in your action's handler if that is unwanted.
- Actions in the array need their own `key`s (they are rendered as a bare
  array).
- The header has no `aria-expanded`.
- When controlled, `open` wins but internal state still flips on every click;
  if you later stop passing `open`, the section shows that stale internal state.
- Uncontrolled sections always start closed; there is no `defaultOpen`.

## Examples

```tsx
// Uncontrolled.
<CollapsibleSection title="Archived" subTitle={`${archived.length}`}>
  {archived.map((a) => <ArchivedRow key={a.id} item={a} />)}
</CollapsibleSection>

// Controlled.
const [open, setOpen] = useState(false);
<CollapsibleSection title="Advanced" open={open} onOpenToggle={() => setOpen((o) => !o)}>
  …
</CollapsibleSection>
```

## Do / don't

- Do pass `actions` as an array of keyed elements.
- Do stop click propagation inside actions that must not toggle the section.
- Don't use it as a screen's top-level feature container; that is `Card`.
