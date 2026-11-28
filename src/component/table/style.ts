import { createUseStyles, type Theme } from '../../theme/index.js';

// Literals: `1px` borders and the `1`/`50%` clip rules for the visually hidden
// header and caption, moved unchanged from the docs site's props table. This
// module draws a text surface, so it sets fontSize, lineHeight, fontWeight and
// text colours, which the skill normally forbids.
export const useStyle = createUseStyles((theme: Theme) => ({
  // A wide table scrolls inside its own box instead of widening the page.
  root: {
    overflowX: 'auto',
    border: `1px solid ${theme.color.border.default}`,
    backgroundColor: theme.color.bg.card,
  },
  // Corners follow the depth the table sits at (lg, md, sm).
  depth0: { borderRadius: theme.radius.lg },
  depth1: { borderRadius: theme.radius.md },
  depth2: { borderRadius: theme.radius.sm },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: theme.fontSize.md,
    lineHeight: theme.lineHeight.body,
    // A wide screen may ask for a minimum width (`minWidth`); a phone never sees it.
    [theme.breakpoint.normal]: { minWidth: 'var(--table-min-width, 0)' },
    '& th, & td': {
      padding: `${theme.space.lg} ${theme.space.xl}`,
      textAlign: 'left',
      verticalAlign: 'top',
      borderBottom: `1px solid ${theme.color.border.light}`,
    },
    '& tr:last-child td': { borderBottom: 0 },
    '& th': {
      fontWeight: theme.fontWeight.semibold,
      color: theme.color.text.secondary,
      backgroundColor: theme.color.bg.cardHeader,
      whiteSpace: 'nowrap',
    },
    // On a phone each row stacks instead of scrolling: the short cells share a
    // line and the `wide` cell takes the full width below. The headings stay for
    // screen readers only, and a cell's `data-label` names it in their place.
    [theme.breakpoint.mobile]: {
      '& thead': {
        position: 'absolute',
        width: 1,
        height: 1,
        overflow: 'hidden',
        clipPath: 'inset(50%)',
        whiteSpace: 'nowrap',
      },
      '& tbody': { display: 'block' },
      '& tr': {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        columnGap: theme.space.xl,
        rowGap: theme.space.sm,
        padding: `${theme.space.lg} ${theme.space.xl}`,
        borderBottom: `1px solid ${theme.color.border.light}`,
      },
      '& tr:last-child': { borderBottom: 0 },
      '& th, & td': { display: 'block', padding: 0, borderBottom: 0, minWidth: 0 },
      // The label is a flex item, so it stays beside a value that is a box itself (a swatch).
      '& td[data-label]': { display: 'flex', alignItems: 'baseline', gap: theme.space.xs },
      '& td[data-label]::before': {
        content: 'attr(data-label) ":"',
        flexShrink: 0,
        color: theme.color.text.faint,
      },
      '& td$wide': { flexBasis: '100%' },
    },
  },
  // The accessible name, never drawn: the same clip rules as the hidden header.
  caption: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
  /** The cell that takes the full width of a stacked row on a phone. */
  wide: {},
  nowrap: { whiteSpace: 'nowrap' },
  end: { '&&': { textAlign: 'right' } },
  empty: { color: theme.color.text.muted },
}));
