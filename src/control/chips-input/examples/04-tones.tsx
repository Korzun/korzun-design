/** Tones
 * `tone` picks the colour family for a field's chips. Use the one that
 * tags the same values elsewhere in the app, so a subject looks like a subject
 * everywhere.
 */
import { Space, Text, type ChipTone } from '@korzun/design/component';
import { ChipsInput } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

const COLORS: ChipTone[] = [
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

function ColorField({ tone }: { tone: ChipTone }) {
  const [value, setValue] = useState<string[]>([tone]);
  return (
    <Space direction="vertical" gap="xs">
      <Text size="sm" tone="muted">
        {tone}
      </Text>
      <ChipsInput value={value} suggestions={[]} onChange={setValue} tone={tone} />
    </Space>
  );
}

export default function ChipTones() {
  const styles = useStyles();
  return (
    <div className={styles.grid}>
      {COLORS.map((tone) => (
        <ColorField key={tone} tone={tone} />
      ))}
    </div>
  );
}
