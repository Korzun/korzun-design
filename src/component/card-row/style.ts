import { createUseStyles, type Theme } from '../../theme/index.js';

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    ...theme.recipe.card.shell,
    backgroundColor: theme.color.bg.card,
    padding: '6px', // row-specific compact padding
  },
  // Corners follow the depth the row sits at (lg, md, sm).
  depth0: {}, // depth 0 keeps the shell's radius.lg
  depth1: { borderRadius: theme.radius.md },
  depth2: { borderRadius: theme.radius.sm },
  clickable: {
    cursor: 'pointer',
  },
}));
