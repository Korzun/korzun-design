/** Disabled and conditional items
 * A disabled item is greyed out and arrow keys skip it; a disabled link renders
 * without `href`, so middle-click cannot open it either. For an item that should
 * not appear at all, filter the `items` array: the button adds the last item.
 */
import { Space, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function DisabledAndConditional() {
  const [chosen, setChosen] = useState('nothing yet');
  const [admin, setAdmin] = useState(false);
  return (
    <Space direction="vertical">
      <Space>
        <Menu
          trigger={(p) => <Button {...p}>Devices</Button>}
          items={[
            { label: 'Sync now', onClick: () => setChosen('Sync now') },
            { label: 'Clear editions', disabled: true, onClick: () => setChosen('Clear editions') },
            { label: 'Device settings', to: '/settings', disabled: true },
            ...(admin
              ? [{ label: 'Reset all', danger: true, onClick: () => setChosen('Reset all') }]
              : []),
          ]}
        />
        <Button onClick={() => setAdmin((value) => !value)}>
          {admin ? 'Remove admin item' : 'Add admin item'}
        </Button>
      </Space>
      <Text tone="muted">Chosen: {chosen}</Text>
    </Space>
  );
}
