import { createUseStyles, type Theme } from '../../theme/index.js';

export const useStyle = createUseStyles((theme: Theme) => ({
  popover: {
    position: 'fixed',
    zIndex: theme.zIndex.sticky,
  },
}));
