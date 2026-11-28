import * as icons from '@korzun/design/icon';
import type { IconProps } from '@korzun/design/icon';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import type { ComponentType } from 'react';

import { CopyButton } from './copy-button.js';

// Every `*Icon` export of the entry point, so a new icon shows up with no edit here.
const ICONS = (Object.entries(icons) as [string, unknown][])
  .filter((entry): entry is [string, ComponentType<IconProps>] => entry[0].endsWith('Icon'))
  .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

const useStyle = createUseStyles((theme: Theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(11rem, 1fr))',
    gap: theme.space.md,
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.space.sm,
    padding: `${theme.space.xl} ${theme.space.md} ${theme.space.sm}`,
    border: `1px solid ${theme.color.border.default}`,
    // A tile on the page background.
    borderRadius: theme.radius.lg,
    backgroundColor: theme.color.bg.card,
    color: theme.color.text.primary,
  },
  name: {
    fontFamily: theme.fontFamily.mono,
    fontSize: theme.fontSize.xs,
    color: theme.color.text.secondary,
    overflowWrap: 'anywhere',
    textAlign: 'center',
  },
}));

/** Every icon in `@korzun/design/icon`, each with its name and a button copying its import. */
export const IconGrid = () => {
  const styles = useStyle();
  return (
    <ul className={styles.grid} aria-label="Icons">
      {ICONS.map(([name, Icon]) => (
        <li key={name} className={styles.item}>
          <Icon aria-hidden />
          <code className={styles.name}>{name}</code>
          <CopyButton
            text={`import { ${name} } from '@korzun/design/icon'`}
            label={`Copy ${name} import`}
          />
        </li>
      ))}
    </ul>
  );
};
