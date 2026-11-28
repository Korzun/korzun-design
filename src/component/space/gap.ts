import type { Theme } from '../../theme/index.js';

export type Gap = keyof Theme['space'] | 'none';

// One static class per space token (shared by every Space), so a gap is a
// class swap rather than a per-instance dynamic style sheet.
export const gapRules = (theme: Theme) =>
  ({
    ...Object.fromEntries(
      (Object.keys(theme.space) as (keyof Theme['space'])[]).map((key) => [
        `gap-${key}`,
        { gap: theme.space[key] },
      ])
    ),
    'gap-none': { gap: 0 },
  }) as Record<`gap-${Gap}`, object>;
