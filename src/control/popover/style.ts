import { createUseStyles, type Theme } from '../../theme';

export const useStyle = createUseStyles((theme: Theme) => ({
  popover: {
    position: 'fixed',
    zIndex: theme.zIndex.sticky,
  },
}));
