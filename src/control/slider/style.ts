import { createUseStyles, type Theme } from '../../theme/index.js';

// Colours: the unfilled track and ticks use `border.strong`, not Bookplate's
// `border.light`, which all but vanishes on the dark page.
//
// Literals, each Bookplate's slider geometry (the look this replaces):
// - rail height 40px: the pointer hit area around the 4px track.
// - track and fill 4px tall with 2px corners; ticks 2×14px with 1px corners.
// - knob 18px; its shadow `0 1px 4px rgba(0,0,0,.2)` is specific to it.
// - thumb wrapper 24px minimum: the WCAG 2.5.8 target size, whatever a custom
//   thumb draws.
// - snap 0.15s ease: between `transition.fast` (0.1s) and `medium` (0.2s);
//   Bookplate's value, kept so the replacement feels the same.
const SNAP = '0.15s ease';

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    userSelect: 'none',
  },
  rail: {
    position: 'relative',
    height: '40px',
    cursor: 'pointer',
    touchAction: 'none',
  },
  track: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '4px',
    borderRadius: '2px',
    transform: 'translateY(-50%)',
    background: theme.color.border.strong,
  },
  fill: {
    position: 'absolute',
    top: '50%',
    left: 0,
    height: '4px',
    borderRadius: '2px',
    transform: 'translateY(-50%)',
    background: theme.color.brand.default,
    pointerEvents: 'none',
    transition: `width ${SNAP}`,
  },
  tick: {
    position: 'absolute',
    top: '50%',
    width: '2px',
    height: '14px',
    borderRadius: '1px',
    transform: 'translate(-50%, -50%)',
    background: theme.color.border.strong,
    pointerEvents: 'none',
    '&[data-active]': { background: theme.color.brand.default },
  },
  thumb: {
    ...theme.recipe.focusRing,
    position: 'absolute',
    top: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '24px',
    minHeight: '24px',
    transform: 'translate(-50%, -50%)',
    borderRadius: theme.radius.circle,
    transition: `left ${SNAP}`,
    '&:focus-visible': { outlineColor: theme.color.border.focus },
  },
  // While dragging the thumb and fill track the pointer exactly; the snap
  // animates only on release. Reduced motion never animates.
  dragging: {
    '& $thumb, & $fill': { transition: 'none' },
  },
  '@media (prefers-reduced-motion: reduce)': {
    thumb: { transition: 'none' },
    fill: { transition: 'none' },
  },
  knob: {
    width: '18px',
    height: '18px',
    borderRadius: theme.radius.circle,
    background: theme.color.brand.default,
    boxShadow: '0 1px 4px rgba(0,0,0,.2)',
  },
  disabled: {
    // The library's disabled fade, as Button.
    '& $rail': { cursor: 'default', opacity: 0.5 },
    '& $knob': { background: theme.color.text.faint },
  },
  labels: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    // One line of label text, so absolutely placed detent labels have a row.
    minHeight: '1.5em',
    marginTop: theme.space.xs,
    fontSize: theme.fontSize.xs,
    color: theme.color.text.faint,
  },
  detentLabel: {
    position: 'absolute',
    top: 0,
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
  },
  // Labels at the very ends line up with the track ends instead of overflowing.
  atStart: { transform: 'none' },
  atEnd: { transform: 'translateX(-100%)' },
}));
