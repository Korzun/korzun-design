/** Controlled
 * Pass `open` and flip your own state in `onOpenToggle`, which receives no
 * value. The button outside the section sets the same state.
 */
import { CollapsibleSection, Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Controlled() {
  const [open, setOpen] = useState(true);
  return (
    <Stack>
      <Inline>
        <Button onClick={() => setOpen((o) => !o)}>
          {open ? 'Collapse' : 'Expand'} from outside
        </Button>
        <Text tone="muted">Open: {open ? 'yes' : 'no'}</Text>
      </Inline>
      <CollapsibleSection title="Advanced" open={open} onOpenToggle={() => setOpen((o) => !o)}>
        <Text>Extra settings go here.</Text>
      </CollapsibleSection>
    </Stack>
  );
}
