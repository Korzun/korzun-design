import { createUseStyles, type Theme } from '../../theme/index.js';

/** The colour of the progress: brand, a status colour, or a quiet grey. There is no `info`: it is the brand blue. */
export type ProgressCircleTone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

const toneColour = (theme: Theme): Record<ProgressCircleTone, string> => ({
  brand: theme.color.brand.default,
  success: theme.color.success,
  warning: theme.color.warning,
  danger: theme.color.danger.default,
  neutral: theme.color.text.muted,
});

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.space.xs,
    verticalAlign: 'middle',
  },
  svg: { display: 'block', flexShrink: 0, overflow: 'visible' },
  // Filled: a sector inside a thin ring in the text colour.
  sector: {},
  ring: {
    fill: 'none',
    stroke: theme.color.text.primary,
    strokeWidth: 6,
  },
  // Outline: an arc over a faint full-circle track.
  track: {
    fill: 'none',
    stroke: theme.color.border.default,
    strokeWidth: 10,
  },
  arc: {
    fill: 'none',
    strokeWidth: 10,
    strokeLinecap: 'round',
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.color.text.primary,
    fontVariantNumeric: 'tabular-nums',
  },
  inside: {
    fill: theme.color.text.primary,
    fontFamily: 'inherit',
    fontWeight: theme.fontWeight.semibold,
    fontVariantNumeric: 'tabular-nums',
  },
  // Over a filled sector the text gets a halo in the card colour, so it reads
  // on the fill and off it.
  halo: {
    stroke: theme.color.bg.card,
    strokeWidth: 6,
    strokeLinejoin: 'round',
    paintOrder: 'stroke',
  },
  ...(Object.fromEntries(
    Object.entries(toneColour(theme)).map(([tone, colour]) => [
      `tone-${tone}`,
      { '& $sector': { fill: colour }, '& $arc': { stroke: colour } },
    ])
  ) as Record<`tone-${ProgressCircleTone}`, object>),
}));
