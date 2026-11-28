/** Actions label
 * `actionsLabel` sets the overflow trigger's visible text and accessible name.
 * Pass "Actions" when every item is in the menu, as here, because "More…"
 * would promise inline actions that are not there.
 */
import { Space, Text } from '@korzun/design/component';
import { PageActionsBar } from '@korzun/design/control';
import { useState } from 'react';

export default function ActionsLabel() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Space direction="vertical">
      <PageActionsBar
        actionsLabel="Actions"
        items={[
          { label: 'Upload file', onClick: () => setChosen('Upload file') },
          { label: 'Upload folder', onClick: () => setChosen('Upload folder') },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
    </Space>
  );
}
