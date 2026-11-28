/** Nested cards
 * A Card inside a Card steps its corner down one level: `lg` on the page, `md` inside a Card,
 * `sm` one level deeper. Each Card's Button follows the same depth, so pass no `radius`. Nest
 * for a group that is itself a feature; to split one body into sections use `Divider`.
 */
import { Card, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Nested() {
  const [pressed, setPressed] = useState<string | undefined>();
  return (
    <Card
      title="Library (16px)"
      footer={<Button onClick={() => setPressed('Sync library')}>Sync library</Button>}
    >
      <Stack>
        <Text>The feature sits on the page.</Text>
        <Card
          title="Devices (8px)"
          footer={<Button onClick={() => setPressed('Pair device')}>Pair device</Button>}
        >
          <Stack>
            <Text>A group inside the feature, one level in.</Text>
            <Card title="Kitchen frame (4px)">
              <Text>Deeper Cards stay at the smallest step.</Text>
            </Card>
          </Stack>
        </Card>
        <Text tone="muted">Pressed: {pressed ?? 'nothing yet'}</Text>
      </Stack>
    </Card>
  );
}
