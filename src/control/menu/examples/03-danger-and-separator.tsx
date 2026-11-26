/** Danger and separator
 * `danger` turns an item's text red and does nothing else: Archive is red
 * with no divider. `separatorBefore` draws the divider above an item, so the
 * destructive item sits apart from the rest.
 */
import { Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function DangerAndSeparator() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack>
      <Menu
        trigger={(p) => <Button {...p}>Book</Button>}
        items={[
          { label: 'Edit metadata', onClick: () => setChosen('Edit metadata') },
          { label: 'Archive', danger: true, onClick: () => setChosen('Archive') },
          {
            label: 'Delete book',
            danger: true,
            separatorBefore: true,
            onClick: () => setChosen('Delete book'),
          },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
