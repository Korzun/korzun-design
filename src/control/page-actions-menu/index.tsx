import { useCallback, useRef, useState } from 'react';

import { MoreIcon } from '../../icon/index.js';
import {
  ActionMenuList,
  type PageActionIntentProps,
  type PageActionItem,
} from '../action-menu-list/index.js';
import { useDismiss } from '../action-menu-list/use-dismiss.js';
import { useStyle } from './style.js';

export type { PageActionIntentProps, PageActionItem };

interface PageActionsMenuProps {
  items: PageActionItem[];
}

export function PageActionsMenu({ items }: PageActionsMenuProps) {
  const styles = useStyle();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, containerRef);

  const handleSelect = useCallback((item: PageActionItem) => {
    setOpen(false);
    item.onClick();
  }, []);

  return (
    <div className={styles.root} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreIcon width={20} height={20} aria-hidden="true" />
      </button>
      {open && (
        <div className={styles.popoverAnchor}>
          <ActionMenuList items={items} surface="glass" onSelect={handleSelect} />
        </div>
      )}
    </div>
  );
}
