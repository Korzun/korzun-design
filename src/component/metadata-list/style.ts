import { createUseStyles, type Theme } from '../../theme/index.js';

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.space.lg,
    rowGap: theme.space.sm,
  },
}));
