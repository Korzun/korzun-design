/** Without a label
 * `label` is a required key: pass `label={undefined}` when there is no visible
 * label, and describe the field with a `placeholder`.
 */
import { Inline, Text } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function WithoutLabel() {
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  return (
    <Inline>
      <NumberInput
        name="quantity"
        layout="inline"
        label={undefined}
        placeholder="Quantity"
        value={quantity}
        onChange={setQuantity}
      />
      <Text tone="muted">Quantity: {quantity === undefined ? 'none' : quantity}</Text>
    </Inline>
  );
}
