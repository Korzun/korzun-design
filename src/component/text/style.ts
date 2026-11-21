import { createUseStyles, type Theme } from '../../theme/index.js';

export type TextSize = keyof Theme['fontSize'];
export type TextTone =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'faint'
  | 'description'
  | 'danger'
  | 'success';
export type TextWeight = keyof Theme['fontWeight'];

const toneColor = (theme: Theme, tone: TextTone): string => {
  if (tone === 'danger') return theme.color.chip.danger.text;
  if (tone === 'success') return theme.color.chip.success.text;
  return theme.color.text[tone];
};

const TONES: TextTone[] = [
  'primary',
  'secondary',
  'muted',
  'faint',
  'description',
  'danger',
  'success',
];

// One static rule per token value, so a prop is a class swap rather than a
// dynamic style sheet. Shared with Heading.
const typographyRules = (theme: Theme) => ({
  ...(Object.fromEntries(
    (Object.keys(theme.fontSize) as TextSize[]).map((size) => [
      `size-${size}`,
      { fontSize: theme.fontSize[size] },
    ])
  ) as Record<`size-${TextSize}`, object>),
  ...(Object.fromEntries(
    TONES.map((tone) => [`tone-${tone}`, { color: toneColor(theme, tone) }])
  ) as Record<`tone-${TextTone}`, object>),
  ...(Object.fromEntries(
    (Object.keys(theme.fontWeight) as TextWeight[]).map((weight) => [
      `weight-${weight}`,
      { fontWeight: theme.fontWeight[weight] },
    ])
  ) as Record<`weight-${TextWeight}`, object>),
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
    // A start, centre or end aligned flex item sizes to its content, so cap it.
    maxWidth: '100%',
  },
  // Inline elements ignore overflow and width, so they become inline-block.
  truncateInline: {
    display: 'inline-block',
    verticalAlign: 'bottom',
  },
});

export const useTypography = createUseStyles((theme: Theme) => typographyRules(theme));

export const useStyle = createUseStyles(() => ({
  root: { margin: 0 },
}));
