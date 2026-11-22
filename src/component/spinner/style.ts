import { createUseStyles, type Theme } from '../../theme/index.js';
import type { TextSize } from '../text/style.js';

// One static class per fontSize token, like Text's typography rules.
export const useStyle = createUseStyles((theme: Theme) => ({
  root: { display: 'inline-flex' },
  icon: { ...theme.recipe.spinner },
  ...(Object.fromEntries(
    (Object.keys(theme.fontSize) as TextSize[]).map((size) => [
      `size-${size}`,
      { fontSize: theme.fontSize[size] },
    ])
  ) as Record<`size-${TextSize}`, object>),
}));
