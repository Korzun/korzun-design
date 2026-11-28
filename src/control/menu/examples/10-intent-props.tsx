/** Intent props
 * `intentProps` are spread onto the item element: here hovering, focusing or
 * touching “Open reader” counts a prefetch, which is what a router's prefetch
 * hook would do.
 */
import { Space, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function IntentProps() {
  const [prefetches, setPrefetches] = useState(0);
  const count = () => setPrefetches((n) => n + 1);
  return (
    <Space direction="vertical" align="start">
      <Menu
        trigger={(p) => <Button {...p}>Book</Button>}
        items={[
          {
            label: 'Open reader',
            to: '/books/1/read',
            intentProps: { onMouseEnter: count, onFocus: count, onTouchStart: count },
          },
          { label: 'Reset count', onClick: () => setPrefetches(0) },
        ]}
      />
      <Text tone="muted">Prefetches: {prefetches}</Text>
    </Space>
  );
}
