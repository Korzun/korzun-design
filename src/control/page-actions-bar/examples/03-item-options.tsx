/** Item options
 * A primary Button takes `danger` and `disabled`: Remove is red and Publish is
 * greyed out. Primary Buttons take neither `Icon` nor `intentProps`; the menu
 * does: Read online shows its `Icon`, Download runs `intentProps` when the
 * pointer, focus or a touch reaches it, and Archive is `disabled`.
 */
import { Space, Text } from '@korzun/design/component';
import { PageActionsBar } from '@korzun/design/control';
import { BookIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function ItemOptions() {
  const [chosen, setChosen] = useState('nothing yet');
  const [prefetched, setPrefetched] = useState('nothing yet');
  const prefetch = () => setPrefetched('Download');
  return (
    <Space direction="vertical">
      <PageActionsBar
        items={[
          { label: 'Edit', onClick: () => setChosen('Edit'), primary: true },
          { label: 'Publish', onClick: () => setChosen('Publish'), primary: true, disabled: true },
          { label: 'Remove', onClick: () => setChosen('Remove'), primary: true, danger: true },
          { label: 'Read online', onClick: () => setChosen('Read online'), Icon: BookIcon },
          {
            label: 'Download',
            onClick: () => setChosen('Download'),
            intentProps: { onMouseEnter: prefetch, onFocus: prefetch, onTouchStart: prefetch },
          },
          { label: 'Archive', onClick: () => setChosen('Archive'), disabled: true },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
      <Text tone="muted">Prefetched: {prefetched}</Text>
    </Space>
  );
}
