/** Basic
 * A controlled single-value picker. Opening it swaps the trigger for a search
 * box; `onChange` receives the option's value, not an event, and the ✕ clears it.
 */
import { Stack, Text } from '@korzun/design/component';
import { Select } from '@korzun/design/control';
import { useState } from 'react';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Fig', 'Grape', 'Mango', 'Pear'];

export default function Basic() {
  const [fruit, setFruit] = useState<string | undefined>('Banana');
  return (
    <Stack>
      <Select name="fruit" label="Fruit" value={fruit} options={FRUITS} onChange={setFruit} />
      <Text tone="muted">Chosen: {fruit ?? 'nothing'}</Text>
    </Stack>
  );
}
