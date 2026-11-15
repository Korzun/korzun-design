import { createUseStyles, type Theme } from '../../theme/index.js';

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    gap: theme.space.md,
    alignItems: 'center',
  },
  spacer: {
    flexGrow: 1,
  },
}));
