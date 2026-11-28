/** Preview */
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Preview() {
  const [name, setName] = useState<string | undefined>('Ada');
  return <TextInput name="name" label="Name" value={name} onChange={setName} />;
}
