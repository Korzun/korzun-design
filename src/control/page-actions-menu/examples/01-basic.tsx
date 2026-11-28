/** Basic
 * A round "More actions" button that opens a glass menu of every item, right-aligned
 * to the button. Choosing an item closes the menu and calls its `onClick`, which
 * takes no arguments.
 * @viewport mobile
 */
import { Space, Text } from '@korzun/design/component';
import { PageActionsMenu } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Space direction="vertical">
      <PageActionsMenu
        items={[
          { label: 'Edit', onClick: () => setChosen('Edit') },
          { label: 'Download', onClick: () => setChosen('Download') },
          { label: 'Share', onClick: () => setChosen('Share') },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
    </Space>
  );
}
