import { createUseStyles, type Theme } from '../../theme/index.js';

// Literals: `44px` (the phone tap target), `1px` for the dark page edge and the visually hidden status clip
// rules (`1`, `50%`), `3rem` for the scroll fade, `1.5` pre line height comes
// from `theme.recipe.codeBlock`. `#000` is the mask's opaque stop: a mask uses
// only its alpha, so it is not a colour. This module draws a text surface, so
// it sets fontFamily, fontSize, lineHeight and text colour (through
// `theme.recipe.codeBlock` and the code colour variables), which the skill
// normally forbids.
export const useStyle = createUseStyles((theme: Theme) => {
  const {
    borderRadius: _radius,
    backgroundColor: _bg,
    ...pre
  } = theme.recipe.codeBlock as Record<string, unknown>;
  return {
    // The variables Shiki's css-variables theme (`variablePrefix: '--code-'`) emits, from `color.code`.
    root: {
      display: 'flex',
      alignItems: 'flex-start',
      backgroundColor: theme.color.bg.cardHeader,
      ...theme.recipe.codeColours,
    },
    // Corners follow the depth the block sits at (lg, md, sm).
    depth0: { borderRadius: theme.radius.lg },
    depth1: { borderRadius: theme.radius.md },
    depth2: { borderRadius: theme.radius.sm },
    // Dark mode directly on a page only: `bg.cardHeader` is 1.01:1 on `bg.page`.
    pageEdge: {
      boxShadow:
        theme.colorScheme === 'dark' ? `inset 0 0 0 1px ${theme.color.border.default}` : 'none',
    },
    pre: {
      ...pre,
      color: theme.color.code.foreground,
      flex: '1 1 auto',
      minWidth: 0,
      // Always-visible scrollbars must not draw square at the box's rounded corners.
      borderRadius: 'inherit',
      // A block that scrolls sideways fades at its right edge while more is hidden there.
      '&[data-scroll-more]': {
        maskImage: 'linear-gradient(to left, transparent, #000 3rem)',
        WebkitMaskImage: 'linear-gradient(to left, transparent, #000 3rem)',
      },
    },
    wrap: { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
    action: { flex: '0 0 auto', padding: theme.space.md },
    // A 32px text button: on a phone its hit area grows to 44px with an invisible
    // `::after`, so the look stays as it is.
    copy: {
      [theme.breakpoint.mobile]: {
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'max(100%, 44px)',
          height: 'max(100%, 44px)',
          transform: 'translate(-50%, -50%)',
        },
      },
    },
    status: {
      position: 'absolute',
      width: 1,
      height: 1,
      overflow: 'hidden',
      clipPath: 'inset(50%)',
      whiteSpace: 'nowrap',
    },
  };
});
