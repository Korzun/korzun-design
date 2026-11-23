import type { Ref } from 'react';

import { Button } from '../button/index.js';
import { Menu } from '../menu/index.js';
import type { PageActionIntentProps, PageActionItem } from '../page-actions-menu/item.js';
import { useStyle } from './style.js';

export type { PageActionIntentProps, PageActionItem };

export interface PageActionsBarProps {
  /**
   * `primary` items render as inline Buttons (`align: 'leading'` on the left),
   * the rest in the overflow menu. Labels must be unique.
   */
  items: PageActionItem[];
  /** Visible label (and accessible name) for the overflow trigger. Defaults to
   * "More…" — pass e.g. "Actions" on a page whose whole action set lives in the
   * menu rather than spilling over from inline buttons. */
  actionsLabel?: string;
}

/**
 * Desktop page-header action row: primary items as inline Buttons, the rest
 * behind a "More…" overflow `Menu`. Usually rendered by `Page headerActions`.
 */
export function PageActionsBar({ items, actionsLabel }: PageActionsBarProps) {
  const styles = useStyle();

  const triggerLabel = actionsLabel ?? 'More…';
  const triggerAriaLabel = actionsLabel ?? 'More actions';

  const primary = items.filter((item) => item.primary);
  const leading = primary.filter((item) => item.align === 'leading');
  const trailing = primary.filter((item) => item.align !== 'leading');
  const overflow = items.filter((item) => !item.primary);

  const renderButton = (item: PageActionItem) => (
    <Button key={item.label} onClick={item.onClick} disabled={item.disabled} danger={item.danger}>
      {item.label}
    </Button>
  );

  return (
    <div className={styles.root}>
      {leading.map(renderButton)}
      <div className={styles.spacer} />
      {trailing.map(renderButton)}
      {overflow.length > 0 && (
        <div className={styles.more}>
          <Menu
            surface="solid"
            align="end"
            items={overflow}
            trigger={({ ref, onClick, ariaExpanded, ariaControls, ariaHasPopup }) => (
              <button
                ref={ref as Ref<HTMLButtonElement>}
                type="button"
                className={styles.moreTrigger}
                aria-label={triggerAriaLabel}
                aria-haspopup={ariaHasPopup}
                aria-expanded={ariaExpanded}
                aria-controls={ariaControls}
                onClick={onClick}
              >
                {triggerLabel}
              </button>
            )}
          />
        </div>
      )}
    </div>
  );
}
