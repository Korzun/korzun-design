import { createUseStyles, type Theme } from '../../theme/index.js';
import { gapRules } from './gap.js';

export const useStyle = createUseStyles((theme: Theme) => ({
  root: { display: 'flex', flexDirection: 'column' },
  list: { margin: 0, padding: 0, listStyle: 'none' },
  'align-stretch': { alignItems: 'stretch' },
  'align-start': { alignItems: 'flex-start' },
  'align-center': { alignItems: 'center' },
  'align-end': { alignItems: 'flex-end' },
  ...gapRules(theme),
}));
