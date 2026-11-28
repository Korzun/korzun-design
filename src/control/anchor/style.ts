import { createUseStyles, type Theme } from '../../theme/index.js';

// Literals that stay in this file, each for its reason:
//   '2px'           — the current link's bar and a dash's height: hairline geometry
//                     that must not scale with the rem space scale
//   '16px' / '12px' / '8px' — dash widths by level, so the minimap reads as an outline
//   '200px'         — the open panel's minimum width, so short titles still read as a list
//   'max-content' / '280px' — the panel sizes to its titles (its containing block is the
//                     narrow dash column) and wraps a long one past 280px
//   '70vh'          — the open panel's maximum height; past it the panel scrolls
//   '1px' / '-1px' / 'rect(0 0 0 0)' — the visually-hidden pattern for titles at rest
//   '50%' / 'translateY(-50%)' — centres the panel on the dash column
//   '100%' in the shell's padding — the nav's width, so the shell spans the dash column
//   'fit-content'   — the minimap hugs its dashes, so only they open it on hover
//   '0' in calc()   — level 1 has no extra indent

const indent = (theme: Theme, steps: number) =>
  steps === 0 ? theme.space.md : `calc(${theme.space.md} + ${steps} * ${theme.space.lg})`;

const visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  border: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {},
  // The list look's rail: a hairline down the left edge, which the current bar sits on.
  list: {},
  rail: { boxShadow: `inset 1px 0 0 ${theme.color.border.default}` },
  // A link is one row of text. Its colour is state (rest, hover, current), so
  // it is set here rather than through `Text` `tone`, which the title inherits.
  link: {
    position: 'relative',
    display: 'block',
    paddingTop: theme.space.xs,
    paddingBottom: theme.space.xs,
    paddingInlineEnd: theme.space.md,
    color: theme.color.text.secondary,
    textDecoration: 'none',
    // A fixed `sm`, like a Menu item: it only rounds the focus ring of a text row.
    borderRadius: theme.radius.sm,
    ...theme.recipe.focusRing,
    transitionProperty: 'color, outline-color',
    transitionDuration: theme.transition.fast,
    '&:hover': { color: theme.color.text.primary },
    '&:focus-visible': { outlineColor: theme.color.brand.outline },
    // The current link's bar, on its left edge.
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: theme.space.xxs,
      bottom: theme.space.xxs,
      width: '2px',
      borderRadius: theme.radius.pill,
      backgroundColor: 'transparent',
    },
    '&$current': { color: theme.color.brand.default },
    '&$current::before': { backgroundColor: theme.color.brand.default },
  },
  current: {},
  level1: { paddingInlineStart: indent(theme, 0) },
  level2: { paddingInlineStart: indent(theme, 1) },
  level3: { paddingInlineStart: indent(theme, 2) },

  // ── minimap ──
  minimap: {
    position: 'relative',
    width: 'fit-content',
  },
  open: {},
  // The dash column; padded so the hover target is larger than the dashes.
  dashes: {
    // Above the open shell, which spans the column too, so a dash still takes its click.
    position: 'relative',
    zIndex: theme.zIndex.header + 1,
    padding: theme.space.md,
    cursor: 'pointer',
  },
  dash: {
    display: 'block',
    height: '2px',
    // A glyph thinner than a line of text: always pill-ended.
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.border.default,
    transition: `background-color ${theme.transition.fast}`,
    '&$current': { backgroundColor: theme.color.brand.default },
  },
  dash1: { width: '16px' },
  dash2: { width: '12px' },
  dash3: { width: '8px' },
  // At rest the links are in the DOM, focusable, but not drawn.
  hidden: visuallyHidden,
  // Open, the same list is the panel: the list look in a card beside the dashes.
  // The open panel's transparent box: the card, plus padding on its right as
  // wide as the dash column and the gap (a percentage padding is of the nav's
  // width). Being part of the nav and as tall as the card, it keeps the hover
  // on any path from a dash to the card, even a card taller than the dashes.
  shell: {
    position: 'absolute',
    zIndex: theme.zIndex.header,
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    paddingRight: `calc(100% + ${theme.space.xs})`,
  },
  panel: {
    boxSizing: 'border-box',
    width: 'max-content',
    minWidth: '200px',
    maxWidth: '280px',
    maxHeight: '70vh',
    overflowY: 'auto',
    padding: theme.space.md,
    backgroundColor: theme.color.bg.card,
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: theme.color.border.strong,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.cardStack,
  },
}));
