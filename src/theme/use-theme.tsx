import { useTheme as useJssTheme } from 'react-jss';

import type { Theme } from './theme.js';

export function useTheme(): Theme {
  return useJssTheme<Theme>();
}
