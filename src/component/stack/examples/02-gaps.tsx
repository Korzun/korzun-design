/** Gaps
 * `gap` takes a key of the theme's `space` scale: `xs` for tight groups, `md`
 * for most content, `xxl` between sections. `none` is for children that bring
 * their own spacing.
 */
import { Inline, Stack, Tag, Text } from '@korzun/design/component';

const gaps = ['none', 'xs', 'md', 'xxl'] as const;

export default function Gaps() {
  return (
    <Inline gap="xxl" align="start" wrap>
      {gaps.map((gap) => (
        <Stack key={gap} gap="xs" align="start">
          <Text size="sm" tone="muted">
            {`gap="${gap}"`}
          </Text>
          <Stack gap={gap} align="start">
            <Tag>One</Tag>
            <Tag>Two</Tag>
            <Tag>Three</Tag>
          </Stack>
        </Stack>
      ))}
    </Inline>
  );
}
