import { createUseStyles, type Theme } from '../../theme/index.js';

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    ...theme.recipe.card.shell,
    backgroundColor: theme.color.bg.card,
    padding: '6px', // row-specific compact padding
    // Corners come from recipe.card.shell (radius.lg): a row sits on the page background.
  },
  clickable: {
    cursor: 'pointer',
  },
}));
