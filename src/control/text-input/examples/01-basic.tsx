/** Basic
 * A controlled field. `onChange` receives the string, not an event, and
 * `undefined` once the field is emptied.
 */
import { Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [name, setName] = useState<string | undefined>('Ada');
  return (
    <Stack>
      <TextInput name="name" label="Name" value={name} onChange={setName} />
      <Text tone="muted">Value: {name === undefined ? 'undefined' : `“${name}”`}</Text>
    </Stack>
  );
}
