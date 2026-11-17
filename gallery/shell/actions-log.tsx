import { createUseStyles, type Theme } from '@korzun/design/theme';
import type { ReactElement } from 'react';

import { Button } from '../../src/control/button/index.js';

export type ActionRecord = { at: string; name: string; args: unknown[] };

const useStyle = createUseStyles((theme: Theme) => ({
  log: { display: 'flex', flexDirection: 'column', gap: theme.space.md, padding: theme.space.xl },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  heading: { margin: 0, fontSize: 'inherit', fontWeight: theme.fontWeight.bold },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space.sm,
    fontFamily: 'monospace',
    overflowWrap: 'anywhere',
  },
  empty: { color: theme.color.text.secondary, margin: 0 },
}));

type ActionsLogProps = { records: ActionRecord[]; onClear: () => void };

export const ActionsLog = ({ records, onClear }: ActionsLogProps): ReactElement => {
  const styles = useStyle();
  return (
    <section aria-label="Actions" className={styles.log}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Actions</h2>
        <Button onClick={onClear}>Clear</Button>
      </div>
      {records.length === 0 ? (
        <p className={styles.empty}>No actions yet.</p>
      ) : (
        <ul className={styles.list}>
          {[...records].reverse().map((r, i) => (
            <li key={records.length - i}>{`${r.at} ${r.name} ${JSON.stringify(r.args)}`}</li>
          ))}
        </ul>
      )}
    </section>
  );
};
