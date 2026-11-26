/** Surface
 * `solid` draws a card background, border and shadow; `glass` draws the frosted
 * glass recipe, for a menu over an image or a glass control. Each trigger is
 * labelled with its value.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function Surface() {
  const [chosen, setChosen] = useState('nothing yet');
  const items = (surface: string) => [
    { label: `Accept (${surface})`, onClick: () => setChosen(`Accept (${surface})`) },
    { label: `Reject (${surface})`, danger: true, onClick: () => setChosen(`Reject (${surface})`) },
  ];
  return (
    <Stack>
      <Inline>
        <Menu
          surface="solid"
          trigger={(p) => <Button {...p}>solid</Button>}
          items={items('solid')}
        />
        <Menu
          surface="glass"
          trigger={(p) => <Button {...p}>glass</Button>}
          items={items('glass')}
        />
      </Inline>
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
