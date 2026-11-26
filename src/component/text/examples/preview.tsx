/** Preview */
import { Stack, Text } from '@korzun/design/component';

export default function Preview() {
  return (
    <Stack gap="sm">
      <Text as="p">Welcome back.</Text>
      <Text as="p" size="sm" tone="muted">
        3 books, updated yesterday
      </Text>
      <Text as="p" size="xs" tone="faint">
        Cover art by the publisher
      </Text>
    </Stack>
  );
}
