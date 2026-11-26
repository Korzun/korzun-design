/** Header click
 * `onClickHeader` makes the header clickable. A click in `headerAction` does not reach it.
 */
import { Card, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function HeaderClick() {
  const [event, setEvent] = useState('none yet');
  return (
    <Stack>
      <Card
        title="Library"
        onClickHeader={() => setEvent('header clicked')}
        headerAction={
          <Button type="link" onClick={() => setEvent('action clicked')}>
            Sync
          </Button>
        }
      >
        <Text>42 books</Text>
      </Card>
      <Text tone="muted">Last event: {event}</Text>
    </Stack>
  );
}
