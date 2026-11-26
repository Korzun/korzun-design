/** In a Page
 * The usual way to get it: pass `headerActions` to `Page`, which renders this
 * menu at phone width and `PageActionsBar` on desktop from the same array.
 * @viewport mobile
 */
import { Card, Page, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function InPage() {
  const [message, setMessage] = useState('Nothing chosen yet.');
  return (
    <Page
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
