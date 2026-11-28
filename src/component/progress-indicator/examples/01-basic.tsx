/** Basic
 * `value` is a fraction from 0 to 1, not a percentage: `0.42` shows "42%". `ariaLabel` names the progress for assistive tech. The buttons step the value by a tenth.
 */
import { Inline, ProgressIndicator, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [value, setValue] = useState(0.4);
  return (
    <Stack>
      <ProgressIndicator value={value} ariaLabel="Reading progress for Middlemarch" />
      <Inline>
        <Button onClick={() => setValue((v) => Math.max(0, Math.round((v - 0.1) * 10) / 10))}>
          Less
        </Button>
        <Button onClick={() => setValue((v) => Math.min(1, Math.round((v + 0.1) * 10) / 10))}>
          More
        </Button>
      </Inline>
      <Text tone="muted">value: {value}</Text>
    </Stack>
  );
}
