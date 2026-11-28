/** Basic
 * Body text sets nothing and inherits; a meta line is `size="sm"` with
 * `tone="muted"`; a caption is `size="xs"` with `tone="faint"`.
 */
import { Space, Text } from '@korzun/design/component';

export default function Basic() {
  return (
    <Space direction="vertical" gap="sm">
      <Text as="p">Welcome back.</Text>
      <Text as="p" size="sm" tone="muted">
        3 books, updated yesterday
      </Text>
      <Text as="p" size="xs" tone="faint">
        Cover art by the publisher
      </Text>
    </Space>
  );
}
