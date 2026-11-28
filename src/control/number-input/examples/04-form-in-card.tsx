/** Form in a card
 * The `horizontal` layout is made for a `Card` body. Index uses the built-in check.
 * Width replaces it with a rule that allows whole numbers up to 4096, and both
 * fields report validity through `onValidChange`, so Save stays disabled while
 * either is invalid.
 */
import { Card, Space, Text } from '@korzun/design/component';
import { Button, NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function FormInCard() {
  const [seriesIndex, setSeriesIndex] = useState<number | undefined>(2);
  const [coverWidth, setCoverWidth] = useState<number | undefined>(600);
  const [valid, setValid] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<string | null>(null);
  const invalid = Object.values(valid).some((ok) => !ok);
  const onValidChange = (field: string, ok: boolean) => setValid((s) => ({ ...s, [field]: ok }));
  return (
    <Card
      title="Series"
      footer={
        <Button
          type="primary"
          disabled={invalid}
          onClick={() => setSaved(`Index ${seriesIndex ?? '–'}, width ${coverWidth ?? '–'}`)}
        >
          Save
        </Button>
      }
    >
      <Space direction="vertical">
        <NumberInput
          name="seriesIndex"
          label="Index"
          value={seriesIndex}
          onChange={setSeriesIndex}
          onValidChange={onValidChange}
        />
        <NumberInput
          name="coverWidth"
          label="Width"
          value={coverWidth}
          onChange={setCoverWidth}
          validate={(t) => t === '' || (/^\d+$/.test(t) && Number(t) <= 4096)}
          onValidChange={onValidChange}
        />
        {saved !== null && <Text tone="success">Saved: {saved}</Text>}
      </Space>
    </Card>
  );
}
