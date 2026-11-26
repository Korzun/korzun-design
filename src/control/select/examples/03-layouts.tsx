/** Layouts
 * `horizontal` puts the label and trigger in one card-header row, `vertical`
 * stacks the label above the trigger in that row, and `inline` is just the
 * trigger with the label beside it.
 */
import { Stack } from '@korzun/design/component';
import { Select } from '@korzun/design/control';
import { useState } from 'react';

const SIZES = ['Small', 'Medium', 'Large'];

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<string | undefined>('Small');
  const [vertical, setVertical] = useState<string | undefined>('Medium');
  const [inline, setInline] = useState<string | undefined>('Large');
  return (
    <Stack>
      <Select
        name="horizontal"
        layout="horizontal"
        label="Horizontal"
        value={horizontal}
        options={SIZES}
        onChange={setHorizontal}
      />
      <Select
        name="vertical"
        layout="vertical"
        label="Vertical"
        value={vertical}
        options={SIZES}
        onChange={setVertical}
      />
      <Select
        name="inline"
        layout="inline"
        label="Inline"
        value={inline}
        options={SIZES}
        onChange={setInline}
      />
    </Stack>
  );
}
