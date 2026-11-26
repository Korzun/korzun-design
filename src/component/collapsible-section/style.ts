import { createUseStyles, type Theme } from '../../theme/index.js';

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {},
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.space.md,
    padding: `${theme.space.md} ${theme.space.xs}`,
    cursor: 'pointer',
    userSelect: 'none',
    marginLeft: theme.space.sm,
    marginRight: theme.space.sm,
  },
  chevron: {
    fontSize: '.65rem', // section-specific chevron size; not on theme scale
    color: theme.color.text.faint,
    width: 12,
    flexShrink: 0,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.color.text.muted,
    textTransform: 'uppercase',
    letterSpacing: '.05em',
  },
  count: {
    fontSize: theme.fontSize.xs,
    color: theme.color.text.faint,
    marginLeft: theme.space.xs,
  },
  spacer: {
    flexGrow: 1,
  },
  // Keeps each action a flex item of the header, as before the wrapper existed.
  actions: {
    display: 'contents',
  },
}));
