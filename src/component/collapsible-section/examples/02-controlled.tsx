/** Controlled
 * Pass `open` and flip your own state in `onOpenToggle`, which receives no
 * value. The button outside the section sets the same state.
 */
import { CollapsibleSection, Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Controlled() {
  const [open, setOpen] = useState(true);
  return (
    <Space direction="vertical">
      <Space>
        <Button onClick={() => setOpen((o) => !o)}>
          {open ? 'Collapse' : 'Expand'} from outside
        </Button>
      </Space>
      <Text tone="muted">Open: {open ? 'yes' : 'no'}</Text>
      <CollapsibleSection title="Advanced" open={open} onOpenToggle={() => setOpen((o) => !o)}>
        <Text>Extra settings go here.</Text>
      </CollapsibleSection>
    </Space>
  );
}
