import { useCallback, useRef, useState } from 'react';

import {
  ActionMenuList,
  type PageActionIntentProps,
  type PageActionItem,
} from '../action-menu-list/index.js';
import { useDismiss } from '../action-menu-list/use-dismiss.js';
import { Button } from '../button/index.js';
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
 * behind a "More…" overflow menu. Usually rendered by `Page headerActions`.
 */
export function PageActionsBar({ items, actionsLabel }: PageActionsBarProps) {
  const styles = useStyle();
  const [open, setOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, moreRef);

  const triggerLabel = actionsLabel ?? 'More…';
  const triggerAriaLabel = actionsLabel ?? 'More actions';

  const primary = items.filter((item) => item.primary);
  const leading = primary.filter((item) => item.align === 'leading');
  const trailing = primary.filter((item) => item.align !== 'leading');
  const overflow = items.filter((item) => !item.primary);

  const handleSelect = useCallback((item: PageActionItem) => {
    setOpen(false);
    item.onClick();
  }, []);

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
        <div className={styles.more} ref={moreRef}>
          <button
            type="button"
            className={styles.moreTrigger}
            aria-label={triggerAriaLabel}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {triggerLabel}
          </button>
          {open && (
            <div className={styles.popoverAnchor}>
              <ActionMenuList items={overflow} surface="solid" onSelect={handleSelect} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
