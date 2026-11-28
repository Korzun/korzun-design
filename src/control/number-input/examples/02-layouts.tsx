/** Layouts
 * `horizontal` puts the label and field on one shaded row, `vertical` stacks
 * the label above the field on that row, and `inline` paints nothing around the
 * pair.
 */
import { Stack, Text } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<number | undefined>(412);
  const [vertical, setVertical] = useState<number | undefined>(880);
  const [inline, setInline] = useState<number | undefined>(160);
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          layout="horizontal"
        </Text>
        <NumberInput
          name="horizontal"
          layout="horizontal"
          label="Pages"
          value={horizontal}
          onChange={setHorizontal}
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          layout="vertical"
        </Text>
        <NumberInput
          name="vertical"
          layout="vertical"
          label="Pages"
          value={vertical}
          onChange={setVertical}
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          layout="inline"
        </Text>
        <NumberInput
          name="inline"
          layout="inline"
          label="Pages"
          value={inline}
          onChange={setInline}
        />
      </Stack>
    </Stack>
  );
}
