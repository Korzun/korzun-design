/** Detents with labels
 * `detents` draw ticks, filled up to the value, each with an optional label under it. With a `step` the thumb still stops between them; `startLabel` and `endLabel` sit under the ends.
 */
import { Space, Text } from '@korzun/design/component';
import { Slider } from '@korzun/design/control';
import { useState } from 'react';

const SIZES = [
  { value: 12, label: 'S' },
  { value: 16, label: 'M' },
  { value: 20, label: 'L' },
  { value: 24, label: 'XL' },
];

export default function Detents() {
  const [size, setSize] = useState(16);
  return (
    <Space direction="vertical">
      <Slider
        value={size}
        onChange={setSize}
        min={10}
        max={28}
        step={1}
        detents={SIZES}
        startLabel="10px"
        endLabel="28px"
        ariaLabel="Text size"
        ariaValueText={(v) => `${v} pixels`}
      />
      <Text tone="muted">Text size: {size}px</Text>
    </Space>
  );
}
