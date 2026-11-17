import type { Story, StoryDefault } from '@gallery/story';
import type { ReactElement } from 'react';

import { createUseStyles, type Theme } from '../theme/index.js';
import { BookIcon } from './book.js';
import * as icons from './index.js';

type IconComponent = (props: icons.IconProps) => ReactElement;

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
  row: { display: 'flex', alignItems: 'center', gap: theme.space.xl },
}));

const entries = Object.entries(icons)
  .filter(
    (entry): entry is [string, IconComponent] =>
      typeof entry[1] === 'function' && entry[0].endsWith('Icon')
  )
  .sort(([a], [b]) => a.localeCompare(b));

export default { title: 'Icon / All' } satisfies StoryDefault;

export const Grid: Story = () => {
  const styles = useStyle();
  return (
    <div className={styles.grid}>
      {entries.map(([name, Icon]) => (
        <div key={name} className={styles.cell}>
          <Icon width={28} height={28} />
          <span className={styles.name}>{name}</span>
        </div>
      ))}
    </div>
  );
};

type SizesArgs = { width: number };

export const Sizes: Story<SizesArgs> = ({ width }) => {
  const styles = useStyle();
  return (
    <div className={styles.row}>
      {[16, 24, 32, 48].map((size) => (
        <BookIcon key={size} width={size} height={size} />
      ))}
      <BookIcon width={width} height={width} />
    </div>
  );
};
Sizes.args = { width: 64 };
Sizes.argTypes = { width: { control: 'number' } };
