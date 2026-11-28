/** Basic
 * A trigger button and a list of actions. Spread the `trigger` props onto the
 * button; choosing an item closes the menu and calls its `onClick`, which takes
 * no arguments.
 */
import { Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack align="start">
      <Menu
        trigger={(p) => <Button {...p}>Sort by</Button>}
        items={[
          { label: 'Title', onClick: () => setChosen('Title') },
          { label: 'Author', onClick: () => setChosen('Author') },
          { label: 'Date added', onClick: () => setChosen('Date added') },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
