/** Basic
 * One `primary` action for the main step and a `default` button beside it.
 * `onClick` takes no arguments: the button passes no event.
 */
import { Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [saves, setSaves] = useState(0);
  return (
    <Space direction="vertical" align="start">
      <Space>
        <Button onClick={() => setSaves(0)}>Reset</Button>
        <Button type="primary" onClick={() => setSaves((n) => n + 1)}>
          Save
        </Button>
      </Space>
      <Text tone="muted">Saves: {saves}</Text>
    </Space>
  );
}
