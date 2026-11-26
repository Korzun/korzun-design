/** Danger and success
 * Add `danger` to a destructive action: on `primary` when it confirms the
 * deletion, on `default` otherwise. `success` is the green treatment. The two
 * cannot both be set; TypeScript rejects it.
 */
import { Inline, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function DangerAndSuccess() {
  const [pressed, setPressed] = useState('nothing yet');
  return (
    <Inline wrap>
      <Button danger onClick={() => setPressed('Log out')}>
        Log out
      </Button>
      <Button type="primary" danger onClick={() => setPressed('Delete book')}>
        Delete book
      </Button>
      <Button type="primary" success onClick={() => setPressed('Mark as read')}>
        Mark as read
      </Button>
      <Text tone="muted">Pressed: {pressed}</Text>
    </Inline>
  );
}
