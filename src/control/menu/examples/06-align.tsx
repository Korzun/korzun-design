/** Align
 * `align` lines the menu up with the trigger's start edge, centre or end edge.
 * The wide triggers show it: each menu is narrower than its trigger. Use `end` for
 * a trigger at the right edge of the screen. An open menu covers the triggers
 * beside it; the menus open upward (`side="top"`) to stay inside the demo.
 */
import { Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function Align() {
  const [chosen, setChosen] = useState('nothing yet');
  const items = (align: string) => [
    { label: 'Open', onClick: () => setChosen(`Open (${align})`) },
    { label: 'Close', onClick: () => setChosen(`Close (${align})`) },
  ];
  return (
    <Stack>
      <Text tone="muted">Chosen: {chosen}</Text>
      <Menu
        side="top"
        align="start"
        trigger={(p) => <Button {...p}>align start: menu at the left edge</Button>}
        items={items('start')}
      />
      <Menu
        side="top"
        align="center"
        trigger={(p) => <Button {...p}>align center: menu at the middle</Button>}
        items={items('center')}
      />
      <Menu
        side="top"
        align="end"
        trigger={(p) => <Button {...p}>align end: menu at the right edge</Button>}
        items={items('end')}
      />
    </Stack>
  );
}
