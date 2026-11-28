/** Label tones
 * Label tones name a kind of thing, so the same kind of thing is the same colour everywhere. `status` is a legacy label tone despite its name: it is listed for completeness, and a new state tag uses a status tone. Each tag is labelled with its tone.
 */
import { Chip, Text } from '@korzun/design/component';
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
  { tone: 'author', label: 'George Eliot', note: 'a person who wrote something' },
  { tone: 'series', label: 'Discworld', note: 'a series name' },
  { tone: 'subject', label: 'Fiction', note: 'a subject, genre or keyword' },
  { tone: 'book', label: 'Middlemarch', note: 'a book or title' },
  { tone: 'entryType', label: 'Essay', note: 'the kind of an entry or record' },
  { tone: 'user', label: 'simon', note: 'an app user or account' },
  { tone: 'rating', label: '4.5', note: 'a rating value' },
  { tone: 'status', label: 'Legacy', note: 'legacy label tone' },
] as const;

export default function LabelTones() {
  const styles = useStyles();
  return (
    <div className={styles.grid}>
      {TONES.map(({ tone, label, note }) => (
        <Fragment key={tone}>
          <Chip tone={tone}>{label}</Chip>
          <Text tone="muted">
            {tone}: {note}
          </Text>
        </Fragment>
      ))}
    </div>
  );
}
