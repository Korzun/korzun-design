/** Status tones
 * Status tones report a state: `success`, `warning`, `danger`, `info`, and `neutral` for a state with no meaning to signal. Each tag is labelled with its tone.
 */
import { Tag, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { Fragment } from 'react';

// Two columns, so every caption starts at the same x whatever its tag's width.
const useStyles = createUseStyles((theme: Theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr',
    alignItems: 'center',
    gap: `${theme.space.sm} ${theme.space.lg}`,
  },
}));

const TONES = [
  { tone: 'success', label: 'Published', note: 'something went well' },
  { tone: 'warning', label: 'Overdue', note: 'needs attention soon' },
  { tone: 'danger', label: 'Failed', note: 'something failed or is blocked' },
  { tone: 'info', label: 'Scheduled', note: 'neutral news' },
  { tone: 'neutral', label: 'No change', note: 'a state with no category' },
] as const;

export default function StatusTones() {
  const styles = useStyles();
  return (
    <div className={styles.grid}>
      {TONES.map(({ tone, label, note }) => (
        <Fragment key={tone}>
          <Tag tone={tone}>{label}</Tag>
          <Text tone="muted">
            {tone}: {note}
          </Text>
        </Fragment>
      ))}
    </div>
  );
}
