import * as icons from '@korzun/design/icon';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import type { ReactElement } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: theme.space.xxl,
  },
  cell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.space.md,
    padding: theme.space.xxl,
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.default}`,
    borderRadius: theme.radius.md,
  },
  name: { fontSize: theme.fontSize.xs, color: theme.color.text.muted, textAlign: 'center' },
}));

const entries = Object.entries(icons)
  .filter(
    (entry): entry is [string, (props: icons.IconProps) => ReactElement] =>
      typeof entry[1] === 'function' && entry[0].endsWith('Icon')
  )
  .sort(([a], [b]) => a.localeCompare(b));

export function IconsPage() {
  const styles = useStyle();
  return (
    <div>
      <h1>Icons</h1>
      <div className={styles.grid}>
        {entries.map(([name, Icon]) => (
          <div key={name} className={styles.cell}>
            <Icon width={28} height={28} />
            <span className={styles.name}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
