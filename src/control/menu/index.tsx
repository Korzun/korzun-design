import {
  type KeyboardEvent,
  type ReactElement,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';

import { useTheme } from '../../theme/index.js';
import { Popover, type PopoverGap } from '../popover/index.js';
import { enabledItems, MenuList } from './list.js';
import type { MenuActionItem, MenuProps } from './types.js';

export type {
  MenuActionItem,
  MenuIntentProps,
  MenuItem,
  MenuItemBase,
  MenuLinkItem,
  MenuProps,
  MenuTriggerProps,
} from './types.js';

const TABBABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]',
]
  .map((selector) => `${selector}:not([tabindex="-1"])`)
  .join(', ');

// Inert and hidden subtrees take no focus. Where the browser can tell
// (`checkVisibility`; jsdom cannot), unrendered elements are skipped too.
const focusable = (el: HTMLElement) =>
  !el.closest('[inert], [hidden]') &&
  (typeof el.checkVisibility !== 'function' || el.checkVisibility());

// The tabbable element after (or before) `from` in document order, skipping
// anything inside `from` or `skip`, and `from`'s own ancestors. Inside an
// open <dialog> only its descendants count: a modal makes the rest inert.
const tabbableBeside = (
  from: HTMLElement,
  backwards: boolean,
  skip: HTMLElement | null
): HTMLElement | undefined => {
  const scope = from.closest('dialog[open]') ?? document;
  const candidates = Array.from(scope.querySelectorAll<HTMLElement>(TABBABLE)).filter(
    (el) => !from.contains(el) && !el.contains(from) && !skip?.contains(el) && focusable(el)
  );
  const following = (el: HTMLElement) =>
    (from.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
  return backwards ? candidates.filter((el) => !following(el)).pop() : candidates.find(following);
};

/**
 * A button that opens a list of actions and links (the WAI-ARIA menu button
 * pattern). `trigger` renders the button; spread the props it receives onto
 * it. The list renders in a `Popover` anchored to the trigger.
 *
 * Opening focuses the first enabled item. Up and Down move through enabled
 * items and wrap; Home and End jump to the ends; Enter and Space activate.
 * Escape, or activating an item, closes and returns focus to the trigger. Tab
 * closes and moves focus on from the trigger. An outside pointer-down closes
 * without moving focus. Escape and outside presses go to the innermost open
 * layer first (a Select opened over the menu, a Dialog around it).
 */
export function Menu({
  trigger,
  items,
  surface = 'solid',
  side = 'bottom',
  align = 'start',
  ariaLabel,
}: MenuProps): ReactElement {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  // Filled by the callback ref the trigger receives; the Popover anchors to it.
  const triggerRef = useRef<HTMLElement | null>(null);
  const setTriggerNode = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
  }, []);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  const fallbackTriggerId = useId();
  const [triggerId, setTriggerId] = useState<string>();

  // The menu is named by its trigger unless `ariaLabel` is given; give the
  // trigger an id when it has none. The list renders a commit after opening
  // (the Popover resolves its portal target first), so the id is in place.
  useLayoutEffect(() => {
    const element = triggerRef.current;
    if (!open || ariaLabel || !element) return;
    if (!element.id) element.id = fallbackTriggerId;
    setTriggerId(element.id);
  }, [open, ariaLabel, fallbackTriggerId]);

  const close = useCallback(({ restoreFocus }: { restoreFocus: boolean }) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // The layer stack calls this on an outside pointer-down, and on an Escape
  // that reached it unhandled (focus had left the menu).
  const dismiss = useCallback(() => close({ restoreFocus: false }), [close]);

  const toggle = useCallback(() => setOpen((value) => !value), []);

  const handleAction = useCallback(
    (item: MenuActionItem) => {
      // Unmount the menu before the action runs, so it sees a closed menu.
      flushSync(() => close({ restoreFocus: true }));
      item.onClick();
    },
    [close]
  );

  const handleLink = useCallback(() => close({ restoreFocus: true }), [close]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const enabled = enabledItems(menuRef.current);
      const current = enabled.indexOf(document.activeElement as HTMLElement);
      const last = enabled.length - 1;
      const focusAt = (index: number) => {
        event.preventDefault();
        enabled[index]?.focus();
      };
      switch (event.key) {
        case 'ArrowDown':
          focusAt(current === -1 || current === last ? 0 : current + 1);
          break;
        case 'ArrowUp':
          focusAt(current <= 0 ? last : current - 1);
          break;
        case 'Home':
          focusAt(0);
          break;
        case 'End':
          focusAt(last);
          break;
        case ' ': {
          // A <button> item activates on Space natively; an <a> only on Enter.
          const focused = document.activeElement;
          if (focused instanceof HTMLAnchorElement && menuRef.current?.contains(focused)) {
            event.preventDefault();
            if (focused.getAttribute('aria-disabled') !== 'true') focused.click();
          }
          break;
        }
        case 'Escape':
          // Handled here, so the layer stack skips it (it ignores defaultPrevented).
          event.preventDefault();
          close({ restoreFocus: true });
          break;
        case 'Tab': {
          event.preventDefault();
          const triggerElement = triggerRef.current;
          const next =
            triggerElement && tabbableBeside(triggerElement, event.shiftKey, menuRef.current);
          flushSync(() => close({ restoreFocus: true }));
          next?.focus();
          break;
        }
      }
    },
    [close]
  );

  return (
    <>
      {trigger({
        ref: setTriggerNode,
        onClick: toggle,
        ariaExpanded: open,
        // Only while open: closed, the id names nothing in the document.
        ariaControls: open ? menuId : undefined,
        ariaHasPopup: 'menu',
      })}
      <Popover
        anchorRef={triggerRef}
        open={open}
        matchWidth={false}
        // Theme space values are rem strings typed as plain `string`.
        gap={theme.space.sm as PopoverGap}
        side={side}
        align={align}
        onClose={dismiss}
      >
        <MenuList
          ref={menuRef}
          id={menuId}
          items={items}
          surface={surface}
          ariaLabel={ariaLabel}
          ariaLabelledBy={triggerId}
          onKeyDown={handleKeyDown}
          onAction={handleAction}
          onLink={handleLink}
        />
      </Popover>
    </>
  );
}
