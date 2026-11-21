import { createUseStyles, type Theme } from '../../theme/index.js';
import { gapRules } from '../stack/gap.js';

export const useStyle = createUseStyles((theme: Theme) => ({
  root: { display: 'flex', flexDirection: 'row' },
  list: { margin: 0, padding: 0, listStyle: 'none' },
  wrap: { flexWrap: 'wrap' },
  'align-start': { alignItems: 'flex-start' },
  'align-center': { alignItems: 'center' },
  'align-end': { alignItems: 'flex-end' },
  'align-baseline': { alignItems: 'baseline' },
  'align-stretch': { alignItems: 'stretch' },
  'justify-start': { justifyContent: 'flex-start' },
  'justify-center': { justifyContent: 'center' },
  'justify-end': { justifyContent: 'flex-end' },
  'justify-between': { justifyContent: 'space-between' },
  ...gapRules(theme),
}));
