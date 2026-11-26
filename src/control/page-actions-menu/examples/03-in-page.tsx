/** In a Page
 * The usual way to get it: pass `headerActions` to `Page`, which renders this
 * menu at phone width and `PageActionsBar` on desktop from the same array. With
 * `back` the back button leads the row and the menu sits at the trailing end.
 * Read is `primary` and `leading` and Download carries `intentProps`; the menu
 * lists them all in order. Delete is `danger`, set apart by `separatorBefore`.
 * @viewport mobile
 */
import { Card, Page, Stack, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function InPage() {
  const [message, setMessage] = useState('Nothing chosen yet.');
  const [prefetched, setPrefetched] = useState('nothing yet');
  const prefetch = () => setPrefetched('Download');
  return (
    <Page
      back="/library"
      headerActions={[
        { label: 'Edit', onClick: () => setMessage('Edit chosen'), primary: true },
        {
          label: 'Read',
          onClick: () => setMessage('Read chosen'),
          primary: true,
          align: 'leading',
        },
        {
          label: 'Download',
          onClick: () => setMessage('Download chosen'),
          intentProps: { onMouseEnter: prefetch, onFocus: prefetch, onTouchStart: prefetch },
        },
        {
          label: 'Delete',
          onClick: () => setMessage('Delete chosen'),
          danger: true,
          separatorBefore: true,
        },
      ]}
    >
      <Card title="Dune">
        <Stack>
          <Text>{message}</Text>
          <Text tone="muted">Prefetched: {prefetched}</Text>
        </Stack>
      </Card>
    </Page>
  );
}
