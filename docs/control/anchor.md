---
title: Anchor
description: A page outline that marks the section in view and scrolls to a section on click, as a list of titles or a minimap of dashes.
category: Navigation
---

# Anchor

<!-- generated:import -->

`import { Anchor, type AnchorItem, type AnchorProps } from '@korzun/design/control'`

<!-- /generated:import -->

A page outline that marks the section in view and scrolls to a section on
click, as a list of titles or a minimap of dashes. You pass the sections as
`items` (`{ id, title, level }`); it does not read headings from the page. It
renders a `nav` with a list of `<a href="#id">` links, so a link can still be
copied or opened in a new tab.

Use something else for: moving between screens (`NavDesktop`, `NavMobile`),
going up a level (`BackButton`), actions (`Menu`).

## Usage

### Choosing a look

- `variant="list"`: an indented list of titles, each level past 1 indented a
  step. The current one is blue with a bar on its left edge. Use it where a
  side column has room for the titles, as in a docs page.
- `variant="minimap"`: a slim column of dashes, one per item, 16px, 12px or
  8px wide by level. The current dash is blue. Hovering the dashes, or moving
  focus into them, opens the list in a card beside them, on their left, so
  keyboard users see the titles as they tab. It closes when the pointer and
  focus have both left; Escape closes one the pointer opened. Use it at the edge of a reading page, where a
  list would crowd the text, as Notion does. Clicking a dash scrolls to its
  section too.

Both looks are the same `nav` and the same links: the minimap only hides the
titles until it opens.

### The current section

The current section is the last item whose element's top is at or above
`offset + 1` px from the top of the window. Above the first item it is the
first; scrolled to the bottom of the page it is the last, so a short last
section can still be current. The link gets `aria-current="location"`. It is
recomputed on scroll and resize, at most once a frame.

An item whose `id` is not on the page is still listed, and clicking it does
nothing, but it is never current.

### Scrolling and focus

A click scrolls the window so the section's top sits `offset` px below the top
of the window: smoothly, or at once under `prefers-reduced-motion`. It then
moves focus to the section's element, adding `tabindex="-1"` if the element
has no `tabindex`, so the next Tab continues from there.

It never changes the URL: the click is handled in place of the browser's jump
to `#id`, because an app with hash routing (this docs site) would read the hash
as a route. A click with Ctrl, Cmd, Shift or Alt is left to the browser.

It scrolls the window only, not a scrolling element inside the page.

### Offset

`offset` is the height in px of sticky chrome above the content, such as a
sticky header. It is used both for where a click lands and for when a section
counts as current, so a section turns current as it passes under the header.
Measure the header rather than guess (the Placement example does).

### Placement and phones

Anchor never positions itself. Place it yourself:

- **Sticky in a side column**, beside the article: wrap it in an element with
  `position: sticky` and a `top`. This suits the list.
- **Fixed at the right edge**, vertically centred: wrap it in an element with
  `position: fixed`. This suits the minimap; its panel opens to the left,
  toward the page.

On phones there is usually no room beside the text: hide it with
`theme.breakpoint.mobile` (`display: 'none'`), as the Placement example does.

### Keyboard

Tab moves through the links, in both looks. Enter scrolls to the section and
moves focus to it. In the minimap, focus on a link opens the panel, and it
stays open while focus is inside, so the focused link stays visible: Tab past
the last link or Shift+Tab before the first to close it. Escape closes a panel
the pointer opened.

### Corners

The links' focus ring has a fixed `sm` radius, as Menu items do; the
minimap's panel is a `md` card, as a Popover is (see
[corners](../corners.md)).

### Styling

Takes `className` on the `nav`.

## Do / don't

- Do give every target element a unique `id` and pass items in page order.
- Do pass `offset` when a sticky header covers the top of the page, or clicks
  land under it.
- Don't put it in an element that scrolls on its own: it tracks and scrolls the
  window.

<!-- generated:examples -->

## Examples

### List

An indented list of titles in a sticky side column. Scroll the article and the section in
view turns blue, with a bar on its left; click a title to scroll to it. Level 2 and 3 items
indent under the one before.

```tsx
import { Heading, Space, Text } from '@korzun/design/component';
import { Anchor, type AnchorItem } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyle = createUseStyles((theme: Theme) => ({
  root: { padding: theme.space.xxxxl },
  article: {
    flex: 1,
    minWidth: 0,
    maxWidth: '36rem',
    // Room below the last section, so each section can scroll up to the top.
    paddingBottom: '50vh',
  },
  aside: { position: 'sticky', top: theme.space.xxxxl, flex: 'none' },
}));

const sections: (AnchorItem & { body: string[] })[] = [
  {
    id: 'adding',
    title: 'Adding books',
    body: [
      'Drop an EPUB on the library, or send it by email. Bookplate reads the title, author and cover from the file, and asks only when something is missing.',
      'A book you already have is matched by its identifier, so adding it twice keeps one copy and the newer file.',
    ],
  },
  {
    id: 'formats',
    title: 'Formats',
    level: 2,
    body: [
      'EPUB 2 and 3 open as they are. A PDF is kept as a file you can download, but it has no chapters to track.',
      'A file that fails validation is still added, with a note on its page saying what is wrong.',
    ],
  },
  {
    id: 'metadata',
    title: 'Fixing metadata',
    level: 2,
    body: [
      'Edit the title, series and subjects from the book page. Each change rewrites the file, so a reader that syncs the book later sees it too.',
      'Suggested fixes wait in a queue until you accept or dismiss them.',
    ],
  },
  {
    id: 'series',
    title: 'Series order',
    level: 3,
    body: [
      'A number after the series name sets the book’s place in it. Half numbers, such as 2.5, sit between two books.',
      'Books with no number sort after the numbered ones, by title.',
    ],
  },
  {
    id: 'reading',
    title: 'Reading',
    body: [
      'Open a book to read it in the browser, or send it to a reader. Progress is saved per chapter, on every device.',
      'Finishing the last chapter marks the book as read and asks for a rating.',
    ],
  },
  {
    id: 'sharing',
    title: 'Sharing',
    body: [
      'Invite someone to your library and they see every book in it. They keep their own progress, ratings and requests.',
      'A shared library has one owner. Only the owner can delete books or replace their files.',
      'Removing someone takes the library away from them at once. Their progress stays, in case you invite them back.',
      'A request for a book you do not have shows on your requests page, with who asked and when.',
    ],
  },
];

export default function List() {
  const styles = useStyle();
  return (
    <Space align="start" gap="xxxxxl" className={styles.root}>
      <Space direction="vertical" gap="xxxxl" className={styles.article}>
        {sections.map(({ id, title, level = 1, body }) => (
          <Space key={id} direction="vertical" gap="md">
            <Heading level={(level + 1) as 2 | 3 | 4} id={id}>
              {title}
            </Heading>
            {body.map((paragraph) => (
              <Text as="p" key={paragraph}>
                {paragraph}
              </Text>
            ))}
          </Space>
        ))}
      </Space>
      <div className={styles.aside}>
        <Anchor items={sections} />
      </div>
    </Space>
  );
}
```

### Minimap

A column of dashes fixed at the right edge, one per section, shorter for deeper levels. The
dash of the section in view is blue. Hover the dashes, or Tab to them, and the list opens in
a panel beside them; it closes once the pointer and focus have left, and Escape closes it
after a hover.

```tsx
import { Heading, Space, Text } from '@korzun/design/component';
import { Anchor, type AnchorItem } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyle = createUseStyles((theme: Theme) => ({
  article: {
    maxWidth: '36rem',
    margin: '0 auto',
    padding: theme.space.xxxxl,
    // Room below the last section, so each section can scroll up to the top.
    paddingBottom: '50vh',
  },
  minimap: {
    position: 'fixed',
    right: theme.space.md,
    top: '50%',
    transform: 'translateY(-50%)',
  },
}));

const sections: (AnchorItem & { body: string[] })[] = [
  {
    id: 'arrival',
    title: 'Arrival',
    body: [
      'The train came in after dark, and the station was empty except for a porter asleep on a bench.',
      'She left her trunk with him anyway and walked into town to look for the inn her aunt had written about.',
    ],
  },
  {
    id: 'inn',
    title: 'The inn',
    level: 2,
    body: [
      'It was smaller than the letter made it sound: four rooms over a bar that served soup and nothing else.',
      'The owner knew her aunt’s name and gave her the room at the back, over the garden.',
    ],
  },
  {
    id: 'letter',
    title: 'A letter',
    level: 3,
    body: [
      'Under the pillow was an envelope addressed to her, in her aunt’s hand, dated the week before she died.',
      'She did not open it that night.',
    ],
  },
  {
    id: 'morning',
    title: 'Morning',
    body: [
      'The town looked different by day: a market in the square, children on the bridge, smoke from every chimney.',
      'She went back to the station for her trunk and found the porter awake and very sorry.',
    ],
  },
  {
    id: 'house',
    title: 'The house',
    level: 2,
    body: [
      'Her aunt’s house stood at the end of a lane, its shutters closed and its garden gone to seed.',
      'The key was where the letter said it would be, under the third stone by the door.',
    ],
  },
  {
    id: 'return',
    title: 'Return',
    body: [
      'She stayed a month. When she left, the shutters were open and the garden was dug over for spring.',
      'The letter she read on the last night. It said only that the house was hers, and that it always had been.',
      'On the train home she wrote to the inn to keep the back room for her in April.',
      'The porter carried her trunk to the platform himself, and waved until the train was out of sight.',
    ],
  },
];

export default function Minimap() {
  const styles = useStyle();
  return (
    <>
      <Space direction="vertical" gap="xxxxl" className={styles.article}>
        {sections.map(({ id, title, level = 1, body }) => (
          <Space key={id} direction="vertical" gap="md">
            <Heading level={(level + 1) as 2 | 3 | 4} id={id}>
              {title}
            </Heading>
            {body.map((paragraph) => (
              <Text as="p" key={paragraph}>
                {paragraph}
              </Text>
            ))}
          </Space>
        ))}
      </Space>
      <div className={styles.minimap}>
        <Anchor items={sections} variant="minimap" />
      </div>
    </>
  );
}
```

### Placement

Anchor never positions itself: put it sticky in a side column, or fixed at the right edge,
and hide it on phones, where there is no room beside the text. This page has a sticky
header, so its measured height goes to `offset`: a click lands each section just below the
header, and a section turns current as it passes under it.

```tsx
import { Heading, Space, Text } from '@korzun/design/component';
import { Anchor, SegmentedControl, type AnchorItem } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useLayoutEffect, useRef, useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.header,
    padding: `${theme.space.xl} ${theme.space.xxxxl}`,
    backgroundColor: theme.color.bg.page,
    borderBottom: `1px solid ${theme.color.border.default}`,
  },
  body: { padding: theme.space.xxxxl },
  article: {
    flex: 1,
    minWidth: 0,
    maxWidth: '36rem',
    // Room below the last section, so each section can scroll up to the top.
    paddingBottom: '50vh',
  },
  column: {
    position: 'sticky',
    // Below the sticky header, whose height is measured on mount and resize.
    top: ({ offset }: { offset: number }) => `calc(${offset}px + ${theme.space.xxxxl})`,
    flex: 'none',
  },
  edge: {
    position: 'fixed',
    right: theme.space.md,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  // No room beside the text on a phone.
  outline: { [theme.breakpoint.mobile]: { display: 'none' } },
}));

const sections: (AnchorItem & { body: string[] })[] = [
  {
    id: 'prepare',
    title: 'Prepare the soil',
    body: [
      'Dig the bed over to a spade’s depth and work in a barrow of compost for every square metre.',
      'Leave it a week to settle before you plant, and pull any weeds that come up in that time.',
    ],
  },
  {
    id: 'sow',
    title: 'Sowing',
    body: [
      'Sow thinly in drills a finger deep, a hand’s width apart. Cover, firm the soil with the back of a rake and water gently.',
      'Thin the seedlings once they are big enough to handle, keeping the strongest.',
    ],
  },
  {
    id: 'indoors',
    title: 'Starting indoors',
    level: 2,
    body: [
      'Tender crops start on a windowsill six weeks before the last frost.',
      'Pot them on once they have two true leaves, into compost a little richer than the first.',
    ],
  },
  {
    id: 'harden',
    title: 'Hardening off',
    level: 3,
    body: [
      'Set the pots outside for an hour on the first day, and a little longer each day after, for two weeks.',
      'Bring them in on a cold night; one frost undoes the fortnight.',
    ],
  },
  {
    id: 'water',
    title: 'Watering',
    body: [
      'Water at the roots in the morning, deeply and less often. A bed that dries out between waterings roots deeper.',
      'Mulch after a good soaking to keep the water in.',
    ],
  },
  {
    id: 'harvest',
    title: 'Harvest',
    body: [
      'Pick little and often: most crops keep producing while you keep picking.',
      'Leave a few plants to go to seed, and save the seed in paper envelopes for next year.',
      'Clear the bed in autumn and sow a green manure to cover it through the winter.',
      'Dig the green manure in a month before spring planting, and the cycle starts again.',
    ],
  },
];

export default function Placement() {
  const [placement, setPlacement] = useState<'column' | 'edge'>('column');
  const header = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  useLayoutEffect(() => {
    const el = header.current;
    if (!el) return;
    const measure = () => setOffset(el.offsetHeight);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const styles = useStyle({ offset });
  const anchor = (
    <Anchor
      items={sections}
      variant={placement === 'column' ? 'list' : 'minimap'}
      offset={offset}
      className={styles.outline}
    />
  );

  return (
    <>
      <div ref={header} className={styles.header}>
        <Space justify="between">
          <Heading level={1} size="lg">
            Kitchen garden
          </Heading>
          <SegmentedControl
            label="Placement"
            value={placement}
            options={[
              { value: 'column', label: 'Side column' },
              { value: 'edge', label: 'Right edge' },
            ]}
            onChange={setPlacement}
          />
        </Space>
      </div>
      <Space align="start" gap="xxxxxl" className={styles.body}>
        <Space direction="vertical" gap="xxxxl" className={styles.article}>
          {sections.map(({ id, title, level = 1, body }) => (
            <Space key={id} direction="vertical" gap="md">
              <Heading level={(level + 1) as 2 | 3 | 4} id={id}>
                {title}
              </Heading>
              {body.map((paragraph) => (
                <Text as="p" key={paragraph}>
                  {paragraph}
                </Text>
              ))}
            </Space>
          ))}
        </Space>
        {placement === 'column' && <div className={styles.column}>{anchor}</div>}
      </Space>
      {placement === 'edge' && <div className={styles.edge}>{anchor}</div>}
    </>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | `'On this page'` | Accessible name of the `nav`. |
| `className` | `string` |  | Extra class on the `nav`. Override with `'&&'` specificity, never `!important`. |
| `items` (required) | [AnchorItem](#anchoritem)`[]` |  | The sections, in page order. An item whose element is not on the page is listed but never current. |
| `offset` | `number` | `0` | Height in px of sticky chrome above the content. A click scrolls the section to this far below the top of the window, and a section counts as current once its top passes it. |
| `variant` | `'list' \| 'minimap'` | `'list'` | `'list'` is an indented list of titles; `'minimap'` is a column of dashes that opens the list in a panel on hover or focus. See [Choosing a look](#choosing-a-look). |

### AnchorItem

One section of the page outline.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | `string` |  | The `id` of the section's element on the page, usually its heading. The link's `href` is `#id`. |
| `level` | `1 \| 2 \| 3` | `1` | Nesting depth: each level past 1 indents the link, and in the minimap shortens its dash. |
| `title` (required) | `string` |  | The text of the link. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.bg.card` | `#FCFCFC` | `#1A1B1E` |
| `theme.color.border.default` | `#D9D9D9` | `#3A3B40` |
| `theme.color.border.strong` | `#DDDDDD` | `#48494F` |
| `theme.color.brand.default` | `#1777FF` | `#3696fe` |
| `theme.color.brand.outline` | `#91CAFF` | `rgba(54, 150, 254, 0.45)` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.color.text.secondary` | `#5A6375` | `#C8CBD2` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.pill` | `999px` | `999px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.recipe.focusRing` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.shadow.cardStack` | `0px 2px 0px rgba(217, 217, 217, 0.2)` | `0px 2px 0px rgba(0, 0, 0, 0.4)` |
| `theme.space.lg` | `0.625rem` | `0.625rem` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.space.xxs` | `0.125rem` | `0.125rem` |
| `theme.transition.fast` | `0.1s ease-in` | `0.1s ease-in` |
| `theme.zIndex.header` | `10` | `10` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): New `Anchor` (control): a page outline from `items` (`{ id, title, level }`) that highlights the section in view and scrolls to one on click. `variant="list"` is an indented list of titles; `variant="minimap"` is a column of dashes that opens the list in a panel on hover or focus, as in Notion. `offset` allows for sticky chrome; it never changes the URL.

<!-- /generated:changelog -->
