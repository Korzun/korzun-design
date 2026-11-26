/** Default check
 * Without `validate` the field accepts empty text or anything JavaScript reads
 * as a number: try `1.5`, `-3` or `1e3` (reported as 1000). Other text turns the
 * label and border red, `onValidChange` fires once, and `onChange` is not called,
 * so the saved number stays at the last valid one. Type `abc` to see it.
 */
import { Stack, Text } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function DefaultCheck() {
  const [rating, setRating] = useState<number | undefined>(4.5);
  const [valid, setValid] = useState(true);
  return (
    <Stack>
      <NumberInput
        name="rating"
        layout="vertical"
        label="Rating"
        value={rating}
        onChange={setRating}
        onValidChange={(_name, ok) => setValid(ok)}
      />
      <Text tone={valid ? 'success' : 'danger'}>{valid ? 'Valid' : 'Invalid'}</Text>
      <Text tone="muted">Saved number: {rating === undefined ? 'undefined' : rating}</Text>
    </Stack>
  );
}
