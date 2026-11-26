/** Layouts
 * `horizontal` puts the label and field on one shaded row, `vertical` stacks
 * the label above the field on that row, and `inline` paints nothing around the
 * pair.
 */
import { Stack } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<number | undefined>(1);
  const [vertical, setVertical] = useState<number | undefined>(2);
  const [inline, setInline] = useState<number | undefined>(3);
  return (
    <Stack>
      <NumberInput
        name="horizontal"
        layout="horizontal"
        label="Horizontal"
        value={horizontal}
        onChange={setHorizontal}
      />
      <NumberInput
        name="vertical"
        layout="vertical"
        label="Vertical"
        value={vertical}
        onChange={setVertical}
      />
      <NumberInput
        name="inline"
        layout="inline"
        label="Inline"
        value={inline}
        onChange={setInline}
      />
    </Stack>
  );
}
