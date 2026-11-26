/** Wrap
 * A row of chips too long for its container gets `wrap`: children move onto
 * further lines. Without it they stay on one line and shrink or overflow.
 */
import { Inline, Stack, Tag, Text } from '@korzun/design/component';

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

export default function Wrap() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          wrap
        </Text>
        <Inline wrap gap="xs">
          {subjects.map((subject) => (
            <Tag key={subject}>{subject}</Tag>
          ))}
        </Inline>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          no wrap
        </Text>
        <Inline gap="xs">
          {subjects.map((subject) => (
            <Tag key={subject}>{subject}</Tag>
          ))}
        </Inline>
      </Stack>
    </Stack>
  );
}
