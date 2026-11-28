/** Layouts
 * `horizontal` puts the label and field on one shaded row, `vertical` stacks
 * the label above the field on that row, and `inline` paints nothing around the
 * pair.
 */
import { Stack, Text } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<string | undefined>('Read on the train.');
  const [vertical, setVertical] = useState<string | undefined>('Lend to Sam.');
  const [inline, setInline] = useState<string | undefined>('Reread next year.');
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          layout="horizontal"
        </Text>
        <TextArea
          name="horizontal"
          layout="horizontal"
          label="Note"
          value={horizontal}
          onChange={setHorizontal}
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          layout="vertical"
        </Text>
        <TextArea
          name="vertical"
          layout="vertical"
          label="Note"
          value={vertical}
          onChange={setVertical}
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          layout="inline"
        </Text>
        <TextArea name="inline" layout="inline" label="Note" value={inline} onChange={setInline} />
      </Stack>
    </Stack>
  );
}
