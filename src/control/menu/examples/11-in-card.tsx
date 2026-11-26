/** In a Card
 * A Menu in a card's `headerAction`. The list renders in a portal, so the card
 * does not clip it, and its corners step down by themselves: no `radius` prop.
 */
import { Card, Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function InCard() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Card
      title="Reading list"
      headerAction={
        <Menu
          align="end"
          trigger={(p) => <Button {...p}>Manage</Button>}
          items={[
            { label: 'Rename list', onClick: () => setChosen('Rename list') },
            { label: 'Clear list', danger: true, onClick: () => setChosen('Clear list') },
          ]}
        />
      }
    >
      <Stack>
        <Text>Three books queued.</Text>
        <Text tone="muted">Chosen: {chosen}</Text>
      </Stack>
    </Card>
  );
}
