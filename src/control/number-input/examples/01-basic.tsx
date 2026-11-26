/** Basic
 * A controlled number field. `onChange` receives a number, not an event or the
 * text, and `undefined` once the field is emptied.
 */
import { Stack, Text } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [pages, setPages] = useState<number | undefined>(42);
  return (
    <Stack>
      <NumberInput name="pages" label="Pages" value={pages} onChange={setPages} />
      <Text tone="muted">Value: {pages === undefined ? 'undefined' : pages}</Text>
    </Stack>
  );
}
