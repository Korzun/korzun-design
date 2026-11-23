import { MoreIcon } from '../../icon/index.js';
import { Menu } from '../menu/index.js';
import type { PageActionIntentProps, PageActionItem } from './item.js';
import { useStyle } from './style.js';

export type { PageActionIntentProps, PageActionItem };

export interface PageActionsMenuProps {
  /** All items appear in the menu, in order; `primary` and `align` are ignored here. Labels must be unique. */
  items: PageActionItem[];
}

/**
 * Mobile page-header "More actions" button that opens a glass menu of
 * `items`. Usually rendered by `Page headerActions`. Keyboard behaviour is
 * `Menu`'s.
 */
export function PageActionsMenu({ items }: PageActionsMenuProps) {
  const styles = useStyle();

  return (
    <div className={styles.root}>
      <Menu
        surface="glass"
        align="end"
        items={items}
        trigger={({ ref, onClick, ariaExpanded, ariaControls, ariaHasPopup }) => (
          <button
            ref={ref}
            type="button"
            className={styles.trigger}
            aria-label="More actions"
            aria-haspopup={ariaHasPopup}
            aria-expanded={ariaExpanded}
            aria-controls={ariaControls}
            onClick={onClick}
          >
            <MoreIcon width={20} height={20} aria-hidden="true" />
          </button>
        )}
      />
    </div>
  );
}
