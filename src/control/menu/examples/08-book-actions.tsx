/** Book actions
 * The usual full menu: a link item, action items with icons, and a `danger` item
 * set apart by `separatorBefore`. `align="end"` fits a trigger at the right edge.
 */
import { Space, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { BookIcon, SettingsIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function BookActions() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Space direction="vertical">
      <Space justify="end">
        <Menu
          align="end"
          trigger={(p) => <Button {...p}>Book</Button>}
          items={[
            { label: 'Open reader', to: '/books/1/read', Icon: BookIcon },
            {
              label: 'Edit metadata',
              onClick: () => setChosen('Edit metadata'),
              Icon: SettingsIcon,
            },
            {
              label: 'Delete book',
              onClick: () => setChosen('Delete book'),
              danger: true,
              separatorBefore: true,
            },
          ]}
        />
      </Space>
      <Text tone="muted">Chosen: {chosen}</Text>
    </Space>
  );
}
