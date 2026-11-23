import cx from 'classnames';
import { Fragment, type KeyboardEvent, type RefObject, useLayoutEffect } from 'react';
import { Link } from 'react-router';

import { useStyle } from './style.js';
import type { MenuActionItem, MenuItem, MenuProps } from './types.js';

/** The items arrow keys can reach: every menuitem except disabled ones. */
export const enabledItems = (menu: HTMLElement | null): HTMLElement[] =>
  menu
    ? Array.from(
        menu.querySelectorAll<HTMLElement>(
          '[role="menuitem"]:not(:disabled):not([aria-disabled="true"])'
        )
      )
    : [];

interface MenuListProps {
  /** The `role="menu"` element; Menu moves focus within it. */
  ref: RefObject<HTMLDivElement | null>;
  id: string;
  items: MenuItem[];
  surface: NonNullable<MenuProps['surface']>;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  /** An enabled action item was clicked (or activated by Enter or Space). */
  onAction: (item: MenuActionItem) => void;
  /** An enabled link item was clicked; the Link navigates after this returns. */
  onLink: () => void;
}

/**
 * The menu surface and its items: action items are `<button>`s, link items
 * react-router `<Link>`s (a disabled link is a bare `<a>` with no href), all `role="menuitem"` with `tabIndex={-1}` (Menu
 * moves focus with `.focus()`). The root takes `tabIndex={-1}` too, so it can
 * hold focus when every item is disabled.
 *
 * On mount, and whenever `items` change, focus moves to the first enabled
 * item unless it is already inside the menu (so a removed focused item hands
 * focus on rather than dropping it to the body).
 */
export function MenuList({
  ref,
  id,
  items,
  surface,
  ariaLabel,
  ariaLabelledBy,
  onKeyDown,
  onAction,
  onLink,
}: MenuListProps) {
  const styles = useStyle();

  useLayoutEffect(() => {
    const menu = ref.current;
    if (!menu) return;
    const active = document.activeElement;
    if (active && active !== menu && menu.contains(active)) return;
    (enabledItems(menu)[0] ?? menu).focus();
  }, [ref, items]);

  return (
    <div
      ref={ref}
      id={id}
      className={cx(styles.popover, styles[surface])}
      role="menu"
      tabIndex={-1}
      aria-label={ariaLabel || undefined}
      aria-labelledby={ariaLabel ? undefined : ariaLabelledBy}
      onKeyDown={onKeyDown}
    >
      {items.map((item, index) => {
        const { Icon } = item;
        const className = cx(styles.item, {
          [styles.itemDanger]: item.danger,
          [styles.itemWithIcon]: Icon,
        });
        const content = (
          <>
            {Icon && <Icon className={styles.icon} aria-hidden="true" />}
            {item.label}
          </>
        );
        return (
          <Fragment key={item.label}>
            {item.separatorBefore && index > 0 && (
              <div className={styles.separator} role="separator" />
            )}
            {item.to !== undefined && item.disabled ? (
              // No href, so middle-click and open-in-new-tab cannot reach it.
              <a
                role="menuitem"
                tabIndex={-1}
                className={cx(className, styles.link)}
                aria-disabled="true"
                {...item.intentProps}
              >
                {content}
              </a>
            ) : item.to !== undefined ? (
              <Link
                to={item.to}
                role="menuitem"
                tabIndex={-1}
                className={cx(className, styles.link)}
                onClick={onLink}
                {...item.intentProps}
              >
                {content}
              </Link>
            ) : (
              <button
                type="button"
                role="menuitem"
                tabIndex={-1}
                className={className}
                disabled={item.disabled}
                onClick={() => onAction(item)}
                {...item.intentProps}
              >
                {content}
              </button>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
