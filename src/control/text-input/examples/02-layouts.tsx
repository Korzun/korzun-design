/** Layouts
 * `horizontal` puts the label and field on one shaded row, `vertical` stacks
 * the label above the field on that row, and `inline` paints nothing around the
 * pair.
 */
import { Stack } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<string | undefined>('Horizontal');
  const [vertical, setVertical] = useState<string | undefined>('Vertical');
  const [inline, setInline] = useState<string | undefined>('Inline');
  return (
    <Stack>
      <TextInput
        name="horizontal"
        layout="horizontal"
        label="Horizontal"
        value={horizontal}
        onChange={setHorizontal}
      />
      <TextInput
        name="vertical"
        layout="vertical"
        label="Vertical"
        value={vertical}
        onChange={setVertical}
      />
      <TextInput name="inline" layout="inline" label="Inline" value={inline} onChange={setInline} />
    </Stack>
  );
}
