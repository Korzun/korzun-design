/** Basic
 * A controlled multi-line field. `onChange` receives the string, not an event,
 * and `undefined` once the field is emptied.
 */
import { Stack, Text } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [note, setNote] = useState<string | undefined>('Remember to return the book.');
  return (
    <Stack>
      <TextArea name="note" layout="vertical" label="Note" value={note} onChange={setNote} />
      <Text tone="muted">Length: {note === undefined ? 'undefined' : note.length}</Text>
    </Stack>
  );
}
