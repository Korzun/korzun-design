import { createUseStyles, Theme } from '../../theme/index.js';

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    overflow: 'hidden',
    borderRadius: theme.radius.md,
    '&$horizontal': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'start',
      gap: theme.space.md,
      backgroundColor: theme.color.bg.cardHeader,
      '& $label': {
        marginTop: theme.space.md,
        marginLeft: theme.space.sm,
        minWidth: '6rem',
        textAlign: 'left',
      },
      '& $input': { flexGrow: 1 },
    },
    '&$vertical': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.space.xs,
      backgroundColor: theme.color.bg.cardHeader,
      '& $label': {
        marginTop: theme.space.xs,
        marginLeft: theme.space.md,
      },
      '& $input': { flexGrow: 1 },
    },
    '&$inline': {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: theme.space.md,
    },
  },
  label: {
    ...theme.recipe.label,
  },
  input: {
    ...theme.recipe.input,
    // Shared single-line control height so inputs/select/chips line up on one row.
    height: theme.layout.controlHeight,
  },
  danger: {},
  horizontal: {},
  vertical: {},
  inline: {},
  // Corners follow surface depth: the shaded row and the field inside it are
  // flush, so both take the depth radius (md, the default, is depth 1).
  // On the page (lg) the corner curve is twice as deep, so the text and the
  // label move in to clear it: the 16px inset a Button keeps at the same radius.
  depth0: {
    '&, & $input': { borderRadius: theme.radius.lg },
    '&& $input': { paddingLeft: theme.space.xxl, paddingRight: theme.space.xxl },
    '&& $label': { marginLeft: theme.space.xxl },
  },
  depth1: {},
  depth2: { '&, & $input': { borderRadius: theme.radius.sm } },
}));
