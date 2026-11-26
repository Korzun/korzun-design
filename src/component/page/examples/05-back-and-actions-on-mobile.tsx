/** Back and actions on mobile
 * On a phone `back` shows a round back button and `headerActions` collapses into
 * one "More actions" menu beside it, in a sticky row at the top. The `header`
 * content, a search field here, leads the page content.
 * @viewport mobile
 */
import { Card, Page, Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function BackAndActionsOnMobile() {
  const [query, setQuery] = useState<string | undefined>('');
  const [last, setLast] = useState('nothing yet');
  return (
    <Page
      back="/library"
      header={<TextInput name="search" placeholder="Search" value={query} onChange={setQuery} />}
      headerActions={[
        { label: 'Edit', onClick: () => setLast('Edit'), primary: true },
        { label: 'Delete', onClick: () => setLast('Delete'), danger: true, separatorBefore: true },
      ]}
    >
      <Card title="Dune">
        <Stack>
          <Text>Searching for: {query || 'nothing'}</Text>
          <Text tone="muted">Last action: {last}</Text>
        </Stack>
      </Card>
    </Page>
  );
}
