/** In a Page
 * The usual way to get it: pass `headerActions` to `Page`, which puts the bar
 * in the header row on desktop and `PageActionsMenu` at phone width from the
 * same array. `primary: true` means shown inline as its own button, not a blue
 * button: Read (also `align: 'leading'`, so it sits on the left) and Edit get one,
 * and Download and Delete go in the overflow menu.
 */
import { Card, Page, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function InPage() {
  const [message, setMessage] = useState('Nothing chosen yet.');
  return (
    <Page
      headerActions={[
        {
          label: 'Read',
          onClick: () => setMessage('Read chosen'),
          primary: true,
          align: 'leading',
        },
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
