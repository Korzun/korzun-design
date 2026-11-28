/** Basic
 * By default `value` is a fraction from 0 to 1, not a percentage: `0.42` shows "42%". The circle shows at 0 and 1 too, as "0%" and "100%". `ariaLabel` names the progress for assistive tech. The buttons step the value by a tenth.
 */
import { Space, ProgressCircle, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [value, setValue] = useState(0.4);
  return (
    <Space direction="vertical">
      <ProgressCircle value={value} ariaLabel="Reading progress for Middlemarch" />
      <Space>
        <Button onClick={() => setValue((v) => Math.max(0, Math.round((v - 0.1) * 10) / 10))}>
          Less
        </Button>
        <Button onClick={() => setValue((v) => Math.min(1, Math.round((v + 0.1) * 10) / 10))}>
          More
        </Button>
      </Space>
      <Text tone="muted">value: {value}</Text>
    </Space>
  );
}
