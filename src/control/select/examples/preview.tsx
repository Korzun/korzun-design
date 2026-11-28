/** Preview */
import { Select } from '@korzun/design/control';
import { useState } from 'react';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Fig', 'Grape', 'Mango', 'Pear'];

export default function Preview() {
  const [fruit, setFruit] = useState<string | undefined>('Banana');
  return <Select name="fruit" label="Fruit" value={fruit} options={FRUITS} onChange={setFruit} />;
}
