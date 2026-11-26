/** Item options
 * A primary Button takes `danger` and `disabled`: Remove is red and Publish is
 * greyed out. It ignores `Icon` and `intentProps`, so Edit shows no icon. In the
 * overflow menu Download shows its `Icon` and runs `intentProps` when the
 * pointer, focus or a touch reaches it, and Archive is `disabled`.
 */
import { Stack, Text } from '@korzun/design/component';
import { PageActionsBar } from '@korzun/design/control';
import { UploadIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function ItemOptions() {
  const [chosen, setChosen] = useState('nothing yet');
  const [prefetched, setPrefetched] = useState('nothing yet');
  const prefetch = (label: string) => () => setPrefetched(label);
  const intent = (label: string) => ({
    onMouseEnter: prefetch(label),
    onFocus: prefetch(label),
    onTouchStart: prefetch(label),
  });
  return (
    <Stack>
      <PageActionsBar
        items={[
          {
            label: 'Edit',
            onClick: () => setChosen('Edit'),
            primary: true,
            Icon: UploadIcon,
            intentProps: intent('Edit'),
          },
          { label: 'Publish', onClick: () => setChosen('Publish'), primary: true, disabled: true },
          { label: 'Remove', onClick: () => setChosen('Remove'), primary: true, danger: true },
          {
            label: 'Download',
            onClick: () => setChosen('Download'),
            Icon: UploadIcon,
            intentProps: intent('Download'),
          },
          { label: 'Archive', onClick: () => setChosen('Archive'), disabled: true },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
      <Text tone="muted">Prefetched: {prefetched}</Text>
    </Stack>
  );
}
