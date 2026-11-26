/** Actions
 * `actions` is an array of keyed elements shown at the header's right end.
 * They sit inside the header, so a click or key press on one also toggles the
 * section: wrap an action that must not toggle in an element that stops
 * `click` and `keydown`.
 */
import { CollapsibleSection, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';
import type { ReactNode } from 'react';

function KeepOpen({ children }: { children: ReactNode }) {
  return (
    <span onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      {children}
    </span>
  );
}

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
        <KeepOpen key="add">
          <Button type="text" onClick={() => setCount((n) => n + 1)}>
            Add
          </Button>
        </KeepOpen>,
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
