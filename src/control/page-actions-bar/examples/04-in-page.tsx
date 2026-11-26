/** In a Page
 * The usual way to get it: pass `headerActions` and `actionsLabel` to `Page`,
 * which puts the bar in the header row on desktop and `PageActionsMenu` at
 * phone width from the same array.
 */
import { Card, Page, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function InPage() {
  const [message, setMessage] = useState('Nothing chosen yet.');
  return (
    <Page
      actionsLabel="Actions"
      headerActions={[
        { label: 'Edit', onClick: () => setMessage('Edit chosen'), primary: true },
        { label: 'Download', onClick: () => setMessage('Download chosen') },
        {
          label: 'Delete',
          onClick: () => setMessage('Delete chosen'),
          danger: true,
          separatorBefore: true,
        },
      ]}
    >
      <Card title="Dune">
        <Text>{message}</Text>
      </Card>
    </Page>
  );
}
