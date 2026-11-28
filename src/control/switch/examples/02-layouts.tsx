/** Layouts
 * `default` puts the track and the label inline. `horizontal` is a full-width
 * shaded row with the label and `description` on the left and the track on the
 * right, and the whole row toggles. In both, the `description` is helper text
 * linked by `aria-describedby`.
 */
import { Space, Text } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [inline, setInline] = useState(true);
  const [row, setRow] = useState(false);
  return (
    <Space direction="vertical" gap="xl">
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          layout="default"
        </Text>
        <Switch
          name="sync"
          label="Sync over Wi-Fi only"
          description="Large downloads wait for a Wi-Fi connection."
          checked={inline}
          onChange={setInline}
        />
      </Space>
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          layout="horizontal"
        </Text>
        <Switch
          name="grayscale"
          label="Grayscale"
          layout="horizontal"
          description="Convert covers to grayscale for monochrome screens."
          checked={row}
          onChange={setRow}
        />
      </Space>
    </Space>
  );
}
