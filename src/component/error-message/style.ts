import { createUseStyles, type Theme } from '../../theme/index.js';

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: 0,
    fontSize: theme.fontSize.sm,
    color: theme.color.danger.default,
  },
}));
