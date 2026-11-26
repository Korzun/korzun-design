/** Back and actions on mobile
 * On a phone `back` shows a round back button and `headerActions` collapses into
 * one "More actions" menu beside it, in a sticky row at the top. The back button
 * goes to the given path, so pressing it navigates the demo away.
 * @viewport mobile
 */
import { Card, Page, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function BackAndActionsOnMobile() {
  const [last, setLast] = useState('nothing yet');
  return (
    <Page
      back="/library"
      headerActions={[
        { label: 'Edit', onClick: () => setLast('Edit'), primary: true },
        { label: 'Delete', onClick: () => setLast('Delete'), danger: true, separatorBefore: true },
      ]}
    >
      <Card title="Dune">
        <Text>Last action: {last}</Text>
      </Card>
    </Page>
  );
}
