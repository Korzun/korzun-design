/** Sizes
 * `size` takes a `fontSize` token and sets the spinner to that many `em`. Each spinner is labelled with its size.
 */
import { Space, Spinner, Text } from '@korzun/design/component';

export default function Sizes() {
  return (
    <Space direction="vertical" gap="sm">
      <Space>
        <Spinner size="xxs" label="Loading, xxs" />
        <Text tone="muted">xxs</Text>
      </Space>
      <Space>
        <Spinner size="xs" label="Loading, xs" />
        <Text tone="muted">xs</Text>
      </Space>
      <Space>
        <Spinner size="sm" label="Loading, sm" />
        <Text tone="muted">sm</Text>
      </Space>
      <Space>
        <Spinner size="md" label="Loading, md" />
        <Text tone="muted">md</Text>
      </Space>
      <Space>
        <Spinner size="lg" label="Loading, lg" />
        <Text tone="muted">lg</Text>
      </Space>
      <Space>
        <Spinner size="xl" label="Loading, xl" />
        <Text tone="muted">xl</Text>
      </Space>
      <Space>
        <Spinner size="xxl" label="Loading, xxl" />
        <Text tone="muted">xxl</Text>
      </Space>
    </Space>
  );
}
