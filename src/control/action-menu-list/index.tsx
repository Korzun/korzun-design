import cx from 'classnames';
import { Fragment } from 'react';

import { useStyle } from './style.js';

/**
 * Hover/focus/touch handlers to spread onto a menu item — structurally
 * `usePrefetchOnIntent`'s `intentProps` (`~/lib/use-prefetch-on-intent`),
 * declared as a plain shape here so this control keeps its zero-dependency
 * relationship with Apollo.
 *
 * NOT applied to PRIMARY items: those render through `PageActionsBar`'s
 * `Button` (`~/control/button`), whose props are an explicit allow-list with
 * no pointer handlers on it. Every intent-carrying action so far is an
 * overflow item, so widening `Button` was not worth doing speculatively —
 * but a future primary action that wants prefetch needs that change first,
 * rather than silently getting nothing.
 */
export interface PageActionIntentProps {
  onMouseEnter: () => void;
  onFocus: () => void;
  onTouchStart: () => void;
}

/** One page action, shared by `PageActionsBar` and `PageActionsMenu`. */
export interface PageActionItem {
  /** Button or menu text. Must be unique: it is the React key. */
  label: string;
  /** Receives no event. In a menu, the menu closes first. */
  onClick: () => void;
  /** Red text or treatment. Styling only; it does not add a separator. */
  danger?: boolean;
  /** Greys the item out and blocks selection. */
  disabled?: boolean;
  /** `PageActionsBar` only: render as an inline Button instead of in the overflow menu. */
  primary?: boolean;
  /** `PageActionsBar` primary items only: side of the bar; anything but `'leading'` is trailing. */
  align?: 'leading' | 'trailing';
  /** Fires ahead of `onClick`, on intent to click — see
   * `PageActionIntentProps`. Used to prefetch what selecting this item is
   * about to need. */
  intentProps?: PageActionIntentProps;
  /** Render a divider immediately above this item (ignored on the first item),
   * grouping it apart from the items before it. `danger` only affects styling,
   * not grouping — a caller that wants a destructive item set off must say so
   * explicitly here. */
  separatorBefore?: boolean;
}

export type ActionMenuSurface = 'solid' | 'glass';

interface ActionMenuListProps {
  items: PageActionItem[];
  surface: ActionMenuSurface;
  onSelect: (item: PageActionItem) => void;
}

export function ActionMenuList({ items, surface, onSelect }: ActionMenuListProps) {
  const styles = useStyle();

  return (
    <div className={cx(styles.popover, styles[surface])} role="menu">
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {item.separatorBefore && index > 0 && (
            <div className={styles.separator} role="separator" />
          )}
          <button
            type="button"
            role="menuitem"
            className={cx(styles.item, { [styles.itemDanger]: item.danger })}
            disabled={item.disabled}
            onClick={() => onSelect(item)}
            {...item.intentProps}
          >
            {item.label}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
