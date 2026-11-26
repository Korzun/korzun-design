/** Validation
 * `validate` receives the raw text on each keystroke. While it returns `false`
 * the label and border turn red, `onChange` is not called (the saved value stays
 * at the last valid text) and `onValidChange` fires once when validity flips.
 * Type past ten characters to see it.
 */
import { Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Validation() {
  const [title, setTitle] = useState<string | undefined>('Dune');
  const [valid, setValid] = useState(true);
  return (
    <Stack>
      <TextInput
        name="title"
        layout="vertical"
        label="Title (up to 10)"
        value={title}
        onChange={setTitle}
        validate={(text) => text.length <= 10}
        onValidChange={(_name, ok) => setValid(ok)}
      />
      <Text tone={valid ? 'success' : 'danger'}>{valid ? 'Valid' : 'Invalid'}</Text>
      <Text tone="muted">Saved value: {title === undefined ? 'undefined' : `“${title}”`}</Text>
    </Stack>
  );
}
