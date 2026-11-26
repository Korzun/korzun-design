/** Header actions
 * `headerActions` puts page-level actions in the header row. On desktop the
 * `primary` item is a button and the rest sit in the "More…" menu; mark the one
 * or two main actions `primary`. An action with `danger` and `separatorBefore`
 * sets itself apart.
 */
import { Card, Page, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function HeaderActions() {
  const [last, setLast] = useState('nothing yet');
  return (
    <Page
      headerActions={[
        { label: 'Edit', onClick: () => setLast('Edit'), primary: true },
        { label: 'Duplicate', onClick: () => setLast('Duplicate') },
        { label: 'Delete', onClick: () => setLast('Delete'), danger: true, separatorBefore: true },
      ]}
    >
      <Card title="Dune">
        <Text>Last action: {last}</Text>
      </Card>
    </Page>
  );
}
