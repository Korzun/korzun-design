import { createUseStyles, type Theme } from '../../theme/index.js';

// Literals: none beyond the recipe. This module draws a text surface, so it
// sets fontFamily, fontSize and a background through `theme.recipe.inlineCode`
// (mono, 0.875em so it scales in a heading), which the skill normally forbids.
export const useStyle = createUseStyles((theme: Theme) => ({
  root: { ...theme.recipe.inlineCode },
  // Dark mode only: a hairline so the chip reads against the page. In a Card the
  // chip's bg.cardHeader already contrasts, so the class is added only on the page.
  pageEdge: {
    boxShadow:
      theme.colorScheme === 'dark' ? `inset 0 0 0 1px ${theme.color.border.default}` : 'none',
  },
}));
