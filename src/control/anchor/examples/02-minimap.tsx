/** Minimap
 * A column of dashes fixed at the right edge, one per section, shorter for deeper levels. The
 * dash of the section in view is blue. Hover the dashes, or Tab to them, and the list opens in
 * a panel beside them; it closes once the pointer and focus have left, and Escape closes it
 * after a hover.
 * @viewport screen
 */
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
