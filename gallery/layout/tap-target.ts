import type { Theme } from '@korzun/design/theme';

/** The smallest touch target on a phone (WCAG 2.5.5, Apple's HIG). */
export const TAP_TARGET = '44px';

/**
 * On a phone, grows an element's hit area to at least `TAP_TARGET` tall (and
 * wide) with an invisible `::after`, centred on it, so the layout and the
 * desktop look stay as they are. The element must not clip its overflow.
 */
export const tapTarget = (theme: Theme) => ({
  [theme.breakpoint.mobile]: {
    position: 'relative' as const,
    '&::after': {
      content: '""',
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      width: `max(100%, ${TAP_TARGET})`,
      height: `max(100%, ${TAP_TARGET})`,
      transform: 'translate(-50%, -50%)',
    },
  },
});
