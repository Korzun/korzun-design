/** Layouts
 * `horizontal` and `vertical` paint a shaded row, with the label beside the inputs or
 * above them. `inline` paints no row, for a spot inside your own layout.
 */
import { Stack, Text } from '@korzun/design/component';
import { DateTimeInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<string | undefined>('2023-06-06T16:30:00Z');
  const [vertical, setVertical] = useState<string | undefined>('2023-06-06');
  const [inline, setInline] = useState<string | undefined>(undefined);
  return (
    <Stack>
      <Text tone="muted">layout horizontal</Text>
      <DateTimeInput
        name="horizontal"
        label="Published"
        layout="horizontal"
        value={horizontal}
        onChange={setHorizontal}
      />
      <Text tone="muted">layout vertical</Text>
      <DateTimeInput
        name="vertical"
        label="Published"
        layout="vertical"
        value={vertical}
        onChange={setVertical}
      />
      <Text tone="muted">layout inline</Text>
      <DateTimeInput
        name="inline"
        label="Published"
        layout="inline"
        value={inline}
        onChange={setInline}
      />
    </Stack>
  );
}
