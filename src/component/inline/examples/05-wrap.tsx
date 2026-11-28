/** Wrap
 * A row of chips too long for its container gets `wrap`: children move onto
 * further lines. Without it they stay on one line and shrink or overflow. Both rows sit
 * in the same fixed-width box; the box clips with `overflow: hidden`, so the cut-off
 * tags at its edge are the overflow.
 */
import { Inline, Stack, Tag, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const subjects = [
  'Fiction',
  'Victorian',
  'Provincial life',
  'Politics',
  'Marriage',
  'Reform',
  'Medicine',
  'Class',
  'Ambition',
  'Money',
  'Idealism',
  'Society',
  'Education',
  'Religion',
  'Inheritance',
  'Friendship',
  'Scandal',
  'Science',
  'Duty',
  'Gossip',
  'Land',
  'Vocation',
  'Reputation',
  'Charity',
];

// A fixed-width container with a visible edge, so the overflow is plain to see.
const useStyles = createUseStyles((theme: Theme) => ({
  box: {
    width: `calc(${theme.space.xxxxxl} * 12)`,
    maxWidth: '100%',
    overflow: 'hidden',
    padding: theme.space.md,
    border: `1px dashed ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
  },
}));

export default function Wrap() {
  const styles = useStyles();
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          wrap
        </Text>
        <div className={styles.box}>
          <Inline wrap gap="xs">
            {subjects.map((subject) => (
              <Tag key={subject}>{subject}</Tag>
            ))}
          </Inline>
        </div>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          no wrap: clipped at the box edge
        </Text>
        <div className={styles.box}>
          <Inline gap="xs">
            {subjects.map((subject) => (
              <Tag key={subject}>{subject}</Tag>
            ))}
          </Inline>
        </div>
      </Stack>
    </Stack>
  );
}
