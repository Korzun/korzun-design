/** Basic
 * With no props the spinner is `1em` square and takes the colour and font size of the text around it, so it sits inline without any sizing. The text names the load, so the spinner is `decorative`.
 */
import { Spinner, Space, Text } from '@korzun/design/component';

export default function Basic() {
  return (
    <Space direction="vertical" gap="sm">
      <Text>
        Syncing your library <Spinner decorative />
      </Text>
      <Text size="xl" tone="muted">
        Fetching covers <Spinner decorative />
      </Text>
    </Space>
  );
}
