/** Custom values and suggestions only
 * Enter or Tab also adds text that matches no suggestion. With
 * `allowCustom={false}` only a suggestion can be added: unmatched text stays in
 * the field.
 */
import { Space, Text } from '@korzun/design/component';
import { ChipsInput } from '@korzun/design/control';
import { useState } from 'react';

const COLOURS = ['Amber', 'Blue', 'Crimson', 'Teal'];

export default function SuggestionsOnly() {
  const [anything, setAnything] = useState<string[]>([]);
  const [listed, setListed] = useState<string[]>([]);
  return (
    <Space direction="vertical" gap="xl">
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          Custom values allowed
        </Text>
        <ChipsInput
          value={anything}
          suggestions={COLOURS}
          onChange={setAnything}
          placeholder="Type any colour…"
        />
      </Space>
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          {'allowCustom={false}: suggestions only'}
        </Text>
        <ChipsInput
          value={listed}
          suggestions={COLOURS}
          onChange={setListed}
          allowCustom={false}
          placeholder="Pick a listed colour…"
        />
      </Space>
    </Space>
  );
}
