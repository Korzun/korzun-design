/** Justify
 * `justify` distributes children along the row. `between` pushes the first
 * and last child to opposite edges.
 */
import { Inline, Stack, Tag, Text } from '@korzun/design/component';

const justifies = ['start', 'center', 'end', 'between'] as const;

export default function Justify() {
  return (
    <Stack gap="lg">
      {justifies.map((justify) => (
        <Stack key={justify} gap="xs">
          <Text size="sm" tone="muted">
            {`justify="${justify}"`}
          </Text>
          <Inline justify={justify}>
            <Tag>One</Tag>
            <Tag>Two</Tag>
            <Tag>Three</Tag>
          </Inline>
        </Stack>
      ))}
    </Stack>
  );
}
