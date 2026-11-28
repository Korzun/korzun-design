/** Sizes
 * `md` is the regular chip and `sm` the compact one. `sm` sits inside a line of text without making the row taller.
 */
import { Space, Chip, Text } from '@korzun/design/component';

export default function Sizes() {
  return (
    <Space direction="vertical" gap="sm" align="start">
      <Space>
        <Chip size="md">Medium</Chip>
        <Text tone="muted">md</Text>
      </Space>
      <Space>
        <Chip size="sm">Small</Chip>
        <Text tone="muted">sm</Text>
      </Space>
      <Text>
        Chapter 12 <Chip size="sm">Fiction</Chip> <Chip size="sm">Classic</Chip> in a line of text
      </Text>
    </Space>
  );
}
