import { createUseStyles, type Theme } from '../../theme/index.js';
import { applyTransparency } from '../../utils.js';

export type TagTone = keyof Theme['color']['chip'];

// One static rule per chip token, so a tone is a class swap rather than a
// dynamic (per-instance) style sheet. Hover deepens the tone's own colour: for
// `subject` in light mode this reproduces the old hard-coded amber exactly.
const toneRules = (theme: Theme) =>
  Object.fromEntries(
    (Object.keys(theme.color.chip) as TagTone[]).map((tone) => {
      const chip = theme.color.chip[tone];
      return [
        `tone-${tone}`,
        {
          background: chip.bg,
          color: chip.text,
          borderColor: chip.border,
          '&$clickable:hover': {
            background: applyTransparency(chip.text, 0.15),
            borderColor: applyTransparency(chip.text, 0.4),
          },
        },
      ];
    })
  ) as Record<`tone-${TagTone}`, object>;

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    padding: `${theme.space.xs} ${theme.space.md}`,
    borderRadius: theme.radius.md,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    border: '1px solid transparent',
  },
  // Compact variant: minimal vertical padding + tight line height so the chip
  // fits inside a normal text line, keeping fix rows the same height whether or
  // not they contain chips (no row min-height needed).
  sm: {
    padding: `${theme.space.xxxs} ${theme.space.sm}`,
    fontSize: theme.fontSize.xs,
    lineHeight: theme.lineHeight.tight,
  },
  clickable: {
    cursor: 'pointer',
  },
  ...toneRules(theme),
}));
