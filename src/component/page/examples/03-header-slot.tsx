/** Header slot
 * `header` is the page's own content for the header row, here a search field,
 * leading the actions bar in the same row. `actionsLabel` renames the overflow
 * trigger when every action lives in the menu.
 */
import { Card, Page, Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function HeaderSlot() {
  const [query, setQuery] = useState<string | undefined>('');
  const [last, setLast] = useState('nothing yet');
  return (
    <Page
      header={<TextInput name="search" placeholder="Search" value={query} onChange={setQuery} />}
      actionsLabel="Actions"
      headerActions={[
        { label: 'Import', onClick: () => setLast('Import') },
        { label: 'Export', onClick: () => setLast('Export') },
      ]}
    >
      <Card title="Library">
        <Stack>
          <Text>Searching for: {query || 'nothing'}</Text>
          <Text tone="muted">Last action: {last}</Text>
        </Stack>
      </Card>
    </Page>
  );
}
