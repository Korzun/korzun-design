/** Actions
 * `actions` is an array of keyed elements shown at the header's right end. Clicks
 * and key presses inside an action stay with it, so Add does not toggle the
 * section.
 */
import { CollapsibleSection, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Actions() {
  const [open, setOpen] = useState(true);
  const [count, setCount] = useState(2);
  return (
    <CollapsibleSection
      title="Reading list"
      subTitle={`${count} books`}
      open={open}
      onOpenToggle={() => setOpen((o) => !o)}
      actions={[
        <Button key="add" type="text" onClick={() => setCount((n) => n + 1)}>
          Add
        </Button>,
      ]}
    >
      <Stack gap="xs">
        {Array.from({ length: count }, (_, i) => (
          <Text key={i}>Book {i + 1}</Text>
        ))}
      </Stack>
    </CollapsibleSection>
  );
}
