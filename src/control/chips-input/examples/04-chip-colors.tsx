/** Chip colors
 * `chipColor` picks the colour family for a field's chips. Use the one that
 * tags the same values elsewhere in the app, so a subject looks like a subject
 * everywhere.
 */
import { Stack, Text } from '@korzun/design/component';
import { ChipsInput, type ChipColor } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
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

// A grid of small fields, as many to a row as fit, instead of one full-width field each.
const useStyles = createUseStyles((theme: Theme) => ({
  grid: {
    display: 'grid',
    // Columns about ten rem wide: room for a chip and the typing area.
    gridTemplateColumns: `repeat(auto-fill, minmax(calc(${theme.space.xxxxxl} * 5), 1fr))`,
    gap: `${theme.space.lg} ${theme.space.md}`,
  },
}));

function ColorField({ chipColor }: { chipColor: ChipColor }) {
  const [value, setValue] = useState<string[]>([chipColor]);
  return (
    <Stack gap="xs">
      <Text size="sm" tone="muted">
        {chipColor}
      </Text>
      <ChipsInput value={value} suggestions={[]} onChange={setValue} chipColor={chipColor} />
    </Stack>
  );
}

export default function ChipColors() {
  const styles = useStyles();
  return (
    <div className={styles.grid}>
      {COLORS.map((chipColor) => (
        <ColorField key={chipColor} chipColor={chipColor} />
      ))}
    </div>
  );
}
