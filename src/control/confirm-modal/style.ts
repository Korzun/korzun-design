import { createUseStyles, type Theme } from '../../theme/index.js';

export const useStyle = createUseStyles((theme: Theme) => ({
  icon: {
    height: '24px',
    display: 'inline',
    paddingRight: theme.space.md,
    '& svg': { position: 'relative', top: '5px' },
  },
  iconDanger: {
    color: theme.color.danger.default,
  },
}));
