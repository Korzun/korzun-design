/** Validation and placeholder
 * `placeholder` shows while the field is empty. `validate` receives the raw text
 * on each keystroke; while it returns `false` the label turns red, `onChange` is
 * not called (the saved text stays at the last valid one) and `onValidChange`
 * fires once when validity flips. Add a second line to see it.
 */
import { Stack, Text } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useState } from 'react';

export default function Validation() {
  const [text, setText] = useState<string | undefined>(undefined);
  const [valid, setValid] = useState(true);
  return (
    <Stack>
      <TextArea
        name="one-line"
        layout="vertical"
        label="One line only"
        placeholder="No line breaks allowed"
        value={text}
        onChange={setText}
        validate={(v) => !v.includes('\n')}
        onValidChange={(_name, ok) => setValid(ok)}
      />
      <Text tone={valid ? 'success' : 'danger'}>{valid ? 'Valid' : 'Invalid'}</Text>
      <Text tone="muted">Saved text: {text === undefined ? 'nothing' : `“${text}”`}</Text>
    </Stack>
  );
}
