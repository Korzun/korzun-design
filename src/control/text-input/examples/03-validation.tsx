/** Validation
 * `validate` receives the raw text on each keystroke. While it returns `false`
 * the label and border turn red, `onChange` is not called (the saved value stays
 * at the last valid text) and `onValidChange` fires once when validity flips.
 * Clear the field to see it.
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
        label="Title (required)"
        value={title}
        onChange={setTitle}
        validate={(text) => text.trim().length > 0}
        onValidChange={(_name, ok) => setValid(ok)}
      />
      <Text tone={valid ? 'success' : 'danger'}>{valid ? 'Valid' : 'Invalid'}</Text>
      <Text tone="muted">Saved value: {title === undefined ? 'undefined' : `“${title}”`}</Text>
    </Stack>
  );
}
