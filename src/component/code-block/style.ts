import { createUseStyles, type Theme } from '../../theme/index.js';

// Literals: `1px` for the dark page edge and the visually hidden status clip
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
    // The same variable names Shiki's css-variables theme (`variablePrefix: '--code-'`) emits.
    root: {
      display: 'flex',
      alignItems: 'flex-start',
      backgroundColor: theme.color.bg.cardHeader,
      '--code-foreground': theme.color.code.foreground,
      '--code-token-keyword': theme.color.code.keyword,
      '--code-token-string': theme.color.code.string,
      '--code-token-string-expression': theme.color.code.string,
      '--code-token-function': theme.color.code.function,
      '--code-token-parameter': theme.color.code.parameter,
      '--code-token-constant': theme.color.code.constant,
      '--code-token-punctuation': theme.color.code.punctuation,
      '--code-token-comment': theme.color.code.comment,
      '--code-token-link': theme.color.code.link,
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
      // A block that scrolls sideways fades at its right edge while more is hidden there.
      '&[data-scroll-more]': {
        maskImage: 'linear-gradient(to left, transparent, #000 3rem)',
        WebkitMaskImage: 'linear-gradient(to left, transparent, #000 3rem)',
      },
    },
    wrap: { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
    action: { flex: '0 0 auto', padding: theme.space.md },
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
