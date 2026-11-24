import type { MenuActionItem, MenuIntentProps } from '../menu/index.js';

/**
 * Hover, focus and touch handlers spread onto a menu item; see
 * `MenuIntentProps`. Not applied to `PageActionsBar`'s primary items: its
 * `Button`s take no pointer handlers.
 */
export type PageActionIntentProps = MenuIntentProps;

/** One page action, shared by `PageActionsBar` and `PageActionsMenu`. */
export type PageActionItem = MenuActionItem & {
  /** `PageActionsBar` only: render as an inline Button instead of in the overflow menu. */
  primary?: boolean;
  /** `PageActionsBar` primary items only: side of the bar; anything but `'leading'` is trailing. */
  align?: 'leading' | 'trailing';
};
