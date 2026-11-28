/** Without a label
 * `label` is a required key: pass `label={undefined}` when there is no visible
 * label, name the field with `ariaLabel`, and describe it with a `placeholder`.
 */
import { Space, Text } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function WithoutLabel() {
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  return (
    <Space>
      <NumberInput
        name="quantity"
        layout="inline"
        label={undefined}
        ariaLabel="Quantity"
        placeholder="Quantity"
        value={quantity}
        onChange={setQuantity}
      />
      <Text tone="muted">Quantity: {quantity === undefined ? 'none' : quantity}</Text>
    </Space>
  );
}
