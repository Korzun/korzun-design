import { createUseStyles, type Theme } from '../../theme/index.js';

export const useStyle = createUseStyles((theme: Theme) => ({
  root: { margin: 0, lineHeight: theme.lineHeight.tight },
}));
