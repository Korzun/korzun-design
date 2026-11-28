import { createUseStyles, Theme } from '../../theme/index.js';

/** Width and height of a `prefix` icon, in px: the same size as the action's icon. */
export const PREFIX_SIZE = 20;

/** Input padding that clears a prefix icon sitting `inset` from the field's left edge. */
const clearPrefix = (theme: Theme, inset: string) =>
  `calc(${inset} + ${PREFIX_SIZE}px + ${theme.space.sm})`;

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
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    ...theme.recipe.input,
    // Shared single-line control height so inputs/select/chips line up on one row.
    height: theme.layout.controlHeight,
    flexGrow: 1,
    zIndex: theme.zIndex.base,
    '&$isAction': { paddingRight: theme.space.xxxxxl },
    '&$isPrefix': { paddingLeft: clearPrefix(theme, theme.space.md) },
  },
  // Drawn over the input's left padding (after it in the DOM, so on top);
  // clicks pass through to the field.
  prefix: {
    position: 'absolute',
    left: theme.space.md,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    color: theme.color.text.muted,
    pointerEvents: 'none',
    zIndex: theme.zIndex.base,
  },
  action: {
    paddingBottom: '2px',
    paddingTop: '6px',
    position: 'absolute',
    right: theme.space.md,
    zIndex: theme.zIndex.base,
  },
  counter: {
    flexShrink: 0,
    fontSize: theme.fontSize.xxs,
    color: theme.color.text.faint,
    padding: `0 ${theme.space.sm}`,
    lineHeight: theme.lineHeight.tight,
    userSelect: 'none',
    zIndex: theme.zIndex.base,
  },
  counterDanger: {
    color: theme.color.danger.default,
  },
  danger: {},
  horizontal: {},
  vertical: {},
  inline: {},
  isAction: {},
  isPrefix: {},
  // Corners follow surface depth: the shaded row and the field inside it are
  // flush, so both take the depth radius (md, the default, is depth 1).
  // On the page (lg) the corner curve is twice as deep, so the text and the
  // label move in to clear it: the 16px inset a Button keeps at the same radius.
  depth0: {
    '&, & $input': { borderRadius: theme.radius.lg },
    '&& $input': { paddingLeft: theme.space.xxl, paddingRight: theme.space.xxl },
    '&& $input$isAction': { paddingRight: theme.space.xxxxxl },
    '&& $input$isPrefix': { paddingLeft: clearPrefix(theme, theme.space.xl) },
    '& $prefix': { left: theme.space.xl },
    '&& $label': { marginLeft: theme.space.xxl },
    '& $action': { right: theme.space.xl },
  },
  depth1: {},
  depth2: { '&, & $input': { borderRadius: theme.radius.sm } },
}));
