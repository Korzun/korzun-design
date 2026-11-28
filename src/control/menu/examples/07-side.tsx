/** Side
 * `side="top"` opens the menu above the trigger. It flips to the other side when
 * there is no room, so the trigger sits below other content here.
 */
import { Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function Side() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack align="start">
      <Text tone="muted">Chosen: {chosen}</Text>
      <Menu
        side="top"
        trigger={(p) => <Button {...p}>Opens above</Button>}
        items={[
          { label: 'Reply', onClick: () => setChosen('Reply') },
          { label: 'Forward', onClick: () => setChosen('Forward') },
          { label: 'Mark unread', onClick: () => setChosen('Mark unread') },
        ]}
      />
    </Stack>
  );
}
