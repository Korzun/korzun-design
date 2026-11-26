/** Custom values and suggestions only
 * Enter or Tab also adds text that matches no suggestion. With
 * `allowCustom={false}` only a suggestion can be added: unmatched text stays in
 * the field.
 */
import { Stack, Text } from '@korzun/design/component';
import { ChipsInput } from '@korzun/design/control';
import { useState } from 'react';

const COLOURS = ['Amber', 'Blue', 'Crimson', 'Teal'];

export default function SuggestionsOnly() {
  const [anything, setAnything] = useState<string[]>([]);
  const [listed, setListed] = useState<string[]>([]);
  return (
    <Stack>
      <Text>Custom values allowed</Text>
      <ChipsInput
        value={anything}
        suggestions={COLOURS}
        onChange={setAnything}
        placeholder="Type any colour…"
      />
      <Text>Suggestions only</Text>
      <ChipsInput
        value={listed}
        suggestions={COLOURS}
        onChange={setListed}
        allowCustom={false}
        placeholder="Pick a listed colour…"
      />
    </Stack>
  );
}
