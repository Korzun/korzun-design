import { createUseStyles, type Theme } from '../../theme/index.js';
const tone = (chip: Theme['color']['chip']['warning']) => ({
  backgroundColor: chip.bg,
  borderColor: chip.border,
  color: chip.text,
});

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.space.md,
    padding: theme.space.lg,
    border: '1px solid transparent',
    borderRadius: theme.radius.lg,
    fontSize: theme.fontSize.md,
    lineHeight: theme.lineHeight.body,
  },
  // Corners follow the depth the alert sits at (lg, md, sm).
  depth0: {},
  depth1: { borderRadius: theme.radius.md },
  depth2: { borderRadius: theme.radius.sm },
  warning: tone(theme.color.chip.warning),
  danger: tone(theme.color.chip.danger),
  success: tone(theme.color.chip.success),
  info: tone(theme.color.chip.info),
  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space.xxs,
    flex: '1 1 12rem',
    minWidth: 0,
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.space.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  icon: { width: '1.25em', height: '1.25em', flexShrink: 0 },
  // Body uses text.primary, not the chip's tone text: checked in the gallery in light and dark, the
  // saturated chip text (bright yellow/green in dark) is loud across a sentence, so only the title
  // and icon carry the tone and the paragraph stays the normal reading colour. (No text.default token exists.)
  body: { color: theme.color.text.primary },
  action: { flexShrink: 0 },
}));
