# Card

`import { Card } from '@korzun/design/component'`

The bordered surface every feature on a screen lives in: an optional header
(title, subtitle, header actions), a padded body, and an optional footer. A
screen is a `<Page>` holding a vertical stack of Cards, one per feature. It can
also be a whole clickable list row (`size="small"` with `onClick`).

Use something else for: a "nothing here" block on the bare page (`EmptyState`),
a disclosure section with no card chrome (`CollapsibleSection`), a modal
(`ConfirmModal` / `useModalDialog` in `@korzun/design/control`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `ReactNode` | | Body. |
| `title` | `string \| ReactNode` | | Header title. |
| `subTitle` | `string` | | Small faint text after the title. |
| `headerAction` | `ReactNode \| ReactElement[]` | | Right side of the header. Clicks and keys here do **not** bubble to `onClick` / the collapse toggle. |
| `footer` | `ReactNode` | | Grey footer bar, children right-aligned. Clicks do not bubble to `onClick`. Hidden while a collapsible card is collapsed. |
| `size` | `'small' \| 'large'` | `'large'` | `large`: body padding `space.xl`. `small`: body padding `1px` and a 9px corner (see below). |
| `isCollapsible` | `boolean` | `false` | Header becomes a `role="button"` toggle (Enter/Space) with a rotating chevron before the title. |
| `defaultCollapsed` | `boolean` | **`true`** | **A collapsible card starts collapsed unless you pass `defaultCollapsed={false}`.** Uncontrolled; there is no `open` prop. |
| `onClick` | `() => void` | | Whole-card click; adds a pointer cursor. See the keyboard caveat below. |
| `onClickHeader` | `() => void` | | Header click. **Ignored when `isCollapsible`** (the header toggles instead). Its presence alone renders a header. |
| `className` | `string` | | On the outer element. Override with `'&&'` specificity in your sheet, never `!important`. |

The header renders only if one of `title`, `subTitle`, `headerAction`,
`onClickHeader`, or `isCollapsible` is set.

## Surprising behaviour

- **Keyboard on `onClick` is incomplete.** The root gets no `role` or
  `tabIndex`, so it is not focusable; its `onKeyDown` fires `onClick` on
  Enter/Space bubbling up from *any* focused child (an input inside a clickable
  card triggers it). Don't put form fields inside a clickable card.
- A header click on a collapsible card bubbles to the root, so `isCollapsible`
  together with `onClick` fires both.
- Collapsed content is unmounted, not hidden: child state resets on reopen.

## Corners

The shell uses `radius.lg`: a Card sits on the page background. Buttons inside
(body or footer) take `radius="card"`. See [corners](../corners.md).
`size="small"` hard-codes `borderRadius: '9px'`, off the radius scale: known
inconsistency, don't copy the value.

## Examples

```tsx
// A settings feature: title, a header action, a form submitted from the footer.
<Card
  title="Device password"
  headerAction={<Button type="link" onClick={regenerate}>Regenerate</Button>}
  footer={<Button type="primary" radius="card" submit form="device-pw">Save</Button>}
>
  <form id="device-pw" action={save}>…</form>
</Card>

// A collapsible row whose destructive actions only show once opened.
<Card isCollapsible title={user.username} footer={<Button type="link" danger onClick={remove}>Delete user</Button>}>
  <MetaLine items={[user.email, user.role]} />
</Card>

// A list row: one small clickable card per item.
<Card size="small" onClick={() => navigate(`/book/${book.id}`)}>
  <BookSummary book={book} />
</Card>
```

## Do / don't

- Do give each feature on a screen its own Card, stacked directly in `<Page>`.
- Do set `radius="card"` on Buttons inside a Card, except `type="link"`.
- Do put row actions that must not fire by accident in `footer` of a
  collapsible card; they are unreachable while it is collapsed.
- Don't nest Cards; use `CardDivider` to split one card into sections.
- Don't expect `isCollapsible` cards to start open; pass `defaultCollapsed={false}`.
- Do use the exported `CardProps` type when wrapping Card.
