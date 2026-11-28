/** Placement
 * Anchor never positions itself: put it sticky in a side column, or fixed at the right edge,
 * and hide it on phones, where there is no room beside the text. This page has a sticky
 * header, so its measured height goes to `offset`: a click lands each section just below the
 * header, and a section turns current as it passes under it.
 * @viewport screen
 */
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
