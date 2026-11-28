/** Sizes
 * `md` is the regular chip and `sm` the compact one. `sm` sits inside a line of text without making the row taller.
 */
import { Space, Tag, Text } from '@korzun/design/component';

export default function Sizes() {
  return (
    <Space direction="vertical" gap="sm" align="start">
      <Space>
        <Tag size="md">Medium</Tag>
        <Text tone="muted">md</Text>
      </Space>
      <Space>
        <Tag size="sm">Small</Tag>
        <Text tone="muted">sm</Text>
      </Space>
      <Text>
        Chapter 12 <Tag size="sm">Fiction</Tag> <Tag size="sm">Classic</Tag> in a line of text
      </Text>
    </Space>
  );
}
