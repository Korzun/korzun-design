import { createUseStyles, type Theme } from '../../theme/index.js';

/**
 * Width of one separator cell. In `em` so it scales with whatever font size
 * the caller sets on the line. With a separator, the list is shifted left by
 * exactly this much and its overflow clipped, so the separator that leads the
 * FIRST item on every line (not just the first line) falls outside the box.
 */
const separatorWidth = '1em';

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    overflow: 'hidden',
  },
  // No separator: items spaced like a card's labelled facts.
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: theme.space.lg,
    rowGap: theme.space.sm,
  },
  // A separator: the character (a CSS string in `--meta-separator`, set
  // inline) leads each item in a 1em cell; the first on each line is clipped.
  separated: {
    '&&': { columnGap: 0, rowGap: 0, marginLeft: `-${separatorWidth}` },
    '& $item::before': {
      content: 'var(--meta-separator)',
      display: 'inline-block',
      width: separatorWidth,
      textAlign: 'center',
      color: theme.color.text.muted,
    },
  },
  item: {
    // A datum never breaks across lines: it wraps as a whole, or not at all.
    whiteSpace: 'nowrap',
    // A single datum wider than the whole line shrinks and ellipsizes rather
    // than pushing the row wider.
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  label: {
    color: theme.color.text.faint,
    textTransform: 'capitalize',
    marginRight: theme.space.xs,
  },
}));
