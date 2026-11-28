/** Decorative
 * Beside text that already names the load, set `decorative` so the spinner is hidden from assistive tech and `label` is ignored. With it off, the spinner is a `role="status"` that a screen reader announces by its `label`, here a second time.
 */
import { Space, Spinner, Text } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Decorative() {
  const [decorative, setDecorative] = useState(true);
  return (
    <Space direction="vertical">
      <Switch name="decorative" label="Decorative" checked={decorative} onChange={setDecorative} />
      <Space gap="xs">
        <Spinner decorative={decorative} label="Loading books" />
        <Text>Loading books</Text>
      </Space>
      <Text tone="muted">
        Screen readers: {decorative ? 'the spinner is hidden' : 'announce “Loading books” twice'}
      </Text>
    </Space>
  );
}
