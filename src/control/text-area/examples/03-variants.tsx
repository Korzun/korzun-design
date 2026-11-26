/** Variants
 * `outlined` has a border and the input background; `borderless` drops both, so
 * the browser's own textarea background shows. Check it in dark mode.
 */
import { Stack } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useState } from 'react';

export default function Variants() {
  const [outlined, setOutlined] = useState<string | undefined>('Outlined');
  const [borderless, setBorderless] = useState<string | undefined>('Borderless');
  return (
    <Stack>
      <TextArea
        name="outlined"
        layout="vertical"
        variant="outlined"
        label="Outlined"
        value={outlined}
        onChange={setOutlined}
      />
      <TextArea
        name="borderless"
        layout="vertical"
        variant="borderless"
        label="Borderless"
        value={borderless}
        onChange={setBorderless}
      />
    </Stack>
  );
}
