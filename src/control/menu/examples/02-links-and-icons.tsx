/** Links and icons
 * An item with `to` is a link and one with `onClick` is an action; one item is
 * never both. `Icon` takes an icon component (`HomeIcon`), not an element. A link
 * item needs a router above the Menu, and middle-click opens it in a new tab.
 */
import { Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { BooksIcon, HomeIcon, SettingsIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function LinksAndIcons() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack>
      <Menu
        trigger={(p) => <Button {...p}>Go to</Button>}
        items={[
          { label: 'Home', to: '/', Icon: HomeIcon },
          { label: 'Library', to: '/library', Icon: BooksIcon },
          { label: 'Settings', onClick: () => setChosen('Settings'), Icon: SettingsIcon },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
