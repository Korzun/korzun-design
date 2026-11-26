/** Chip colors
 * `chipColor` picks the colour family for a field's chips. Use the one that
 * tags the same values elsewhere in the app, so a subject looks like a subject
 * everywhere.
 */
import { Stack, Text } from '@korzun/design/component';
import { ChipsInput, type ChipColor } from '@korzun/design/control';
import { useState } from 'react';

const COLORS: ChipColor[] = [
  'status',
  'author',
  'series',
  'subject',
  'book',
  'entryType',
  'user',
  'rating',
  'neutral',
  'success',
  'warning',
  'danger',
  'info',
];

function ColorRow({ chipColor }: { chipColor: ChipColor }) {
  const [value, setValue] = useState<string[]>([chipColor]);
  return (
    <Stack gap="xs">
      <Text tone="muted">{chipColor}</Text>
      <ChipsInput value={value} suggestions={[]} onChange={setValue} chipColor={chipColor} />
    </Stack>
  );
}

export default function ChipColors() {
  return (
    <Stack>
      {COLORS.map((chipColor) => (
        <ColorRow key={chipColor} chipColor={chipColor} />
      ))}
    </Stack>
  );
}
