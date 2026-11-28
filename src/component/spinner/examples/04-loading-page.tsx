/** Loading page
 * A page or panel load with no progress value: a large spinner above a line of text. The text names the load, so the spinner is `decorative`; with no text, give it a specific `label` instead.
 */
import { Spinner, Space, Text } from '@korzun/design/component';

export default function LoadingPage() {
  return (
    <Space direction="vertical" align="center" gap="sm">
      <Spinner size="xxl" decorative />
      <Text tone="muted">Loading your library</Text>
    </Space>
  );
}
