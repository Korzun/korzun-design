/** Sizes
 * `md` is the regular chip and `sm` the compact one. `sm` sits inside a line of text without making the row taller.
 */
import { Inline, Stack, Tag, Text } from '@korzun/design/component';

export default function Sizes() {
  return (
    <Stack gap="sm" align="start">
      <Inline>
        <Tag size="md">Medium</Tag>
        <Text tone="muted">md</Text>
      </Inline>
      <Inline>
        <Tag size="sm">Small</Tag>
        <Text tone="muted">sm</Text>
      </Inline>
      <Text>
        Chapter 12 <Tag size="sm">Fiction</Tag> <Tag size="sm">Classic</Tag> in a line of text
      </Text>
    </Stack>
  );
}
