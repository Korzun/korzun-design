/** Item options
 * The same `items` array drives `PageActionsBar`, so items carry `primary` and
 * `align`; this menu lists every item in order and ignores both. Edit and Read
 * are marked `primary` and still appear. `Icon` takes an icon component,
 * `intentProps` runs when the pointer, focus or a touch reaches Download,
 * Archive is `disabled`, and Delete is `danger` with a `separatorBefore`.
 * @viewport mobile
 */
import { Stack, Text } from '@korzun/design/component';
import { PageActionsMenu } from '@korzun/design/control';
import { UploadIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function ItemOptions() {
  const [chosen, setChosen] = useState('nothing yet');
  const [prefetched, setPrefetched] = useState('nothing yet');
  const prefetch = () => setPrefetched('Download');
  return (
    <Stack>
      <PageActionsMenu
        items={[
          { label: 'Edit', onClick: () => setChosen('Edit'), primary: true },
          { label: 'Read', onClick: () => setChosen('Read'), primary: true, align: 'leading' },
          {
            label: 'Download',
            onClick: () => setChosen('Download'),
            Icon: UploadIcon,
            intentProps: { onMouseEnter: prefetch, onFocus: prefetch, onTouchStart: prefetch },
          },
          { label: 'Archive', onClick: () => setChosen('Archive'), disabled: true },
          {
            label: 'Delete',
            onClick: () => setChosen('Delete'),
            danger: true,
            separatorBefore: true,
          },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
      <Text tone="muted">Prefetched: {prefetched}</Text>
    </Stack>
  );
}
