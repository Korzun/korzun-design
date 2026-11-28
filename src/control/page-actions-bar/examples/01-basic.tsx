/** Basic
 * `primary` items are inline Buttons: `align: 'leading'` puts Read at the left
 * and the rest sit at the right. Everything else collapses into the overflow
 * menu, where `danger` turns Delete red and `separatorBefore` sets it apart.
 */
import { Space, Text } from '@korzun/design/component';
import { PageActionsBar } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Space direction="vertical">
      <PageActionsBar
        items={[
          { label: 'Read', onClick: () => setChosen('Read'), primary: true, align: 'leading' },
          { label: 'Edit', onClick: () => setChosen('Edit'), primary: true },
          { label: 'Download', onClick: () => setChosen('Download') },
          {
            label: 'Delete',
            onClick: () => setChosen('Delete'),
            danger: true,
            separatorBefore: true,
          },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
    </Space>
  );
}
