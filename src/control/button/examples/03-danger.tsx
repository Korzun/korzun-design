/** Danger
 * Add `danger` to a destructive action: on `primary` when it confirms the
 * deletion, on `default` otherwise.
 */
import { Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Danger() {
  const [pressed, setPressed] = useState('nothing yet');
  return (
    <Space direction="vertical" align="start">
      <Space wrap>
        <Button danger onClick={() => setPressed('Log out')}>
          Log out
        </Button>
        <Button type="primary" danger onClick={() => setPressed('Delete book')}>
          Delete book
        </Button>
      </Space>
      <Text tone="muted">Pressed: {pressed}</Text>
    </Space>
  );
}
