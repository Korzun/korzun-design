import type { ComponentType, ReactNode } from 'react';

import type { IconProps } from '../../icon/index.js';
import type { PopoverAlign, PopoverSide } from '../popover/index.js';

/** Hover, focus and touch handlers spread onto a menu item, e.g. to prefetch what selecting it needs. */
export interface MenuIntentProps {
  /** Pointer entered the item. */
  onMouseEnter: () => void;
  /** The item took focus (arrow keys or opening the menu). */
  onFocus: () => void;
  /** A touch started on the item. */
  onTouchStart: () => void;
}

/** Fields shared by every item kind. */
export interface MenuItemBase {
  /** Visible text. Must be unique within the menu: it is the React key. */
  label: string;
  /** Leading icon component (`HomeIcon`), not an element. Drawn at the text size, hidden from assistive tech. */
  Icon?: ComponentType<IconProps>;
  /** Red text. Styling only; it does not add a separator. */
  danger?: boolean;
  /** Greyed out, cannot be activated, skipped by arrow keys. A disabled link renders without `href`, so middle-click cannot open it either. */
  disabled?: boolean;
  /** Divider above this item. Ignored on the first item. */
  separatorBefore?: boolean;
  /** Handlers spread onto the item element, e.g. to prefetch. */
  intentProps?: MenuIntentProps;
}

/** An item that runs code. */
export interface MenuActionItem extends MenuItemBase {
  /** Receives no event. The menu closes first, then this is called. */
  onClick: () => void;
  /** Not allowed on an action item: an item is an action or a link, never both. */
  to?: never;
}

/** An item that navigates: a react-router `<Link>`, so middle-click and open-in-new-tab work. */
export interface MenuLinkItem extends MenuItemBase {
  /**
   * Router path. Renders a react-router `<Link>`, so middle-click and open-in-new-tab
   * work. Needs a router above the Menu; a Menu of action items only does not.
   */
  to: string;
  /** Not allowed on a link item: an item is an action or a link, never both. */
  onClick?: never;
}

/** One menu entry: an action (`onClick`) or a link (`to`). */
export type MenuItem = MenuActionItem | MenuLinkItem;

/** What `trigger` receives; spread it onto the element that opens the menu (a `Button` takes it as-is). */
export interface MenuTriggerProps {
  /**
   * Callback ref: attach it to the trigger element (`<button ref={p.ref}>`,
   * `<a ref={p.ref}>`, or a `Button` through the spread). The menu anchors to
   * that element and returns focus to it.
   */
  ref: (node: HTMLElement | null) => void;
  /** Toggles the menu. */
  onClick: () => void;
  /** Whether the menu is open. */
  ariaExpanded: boolean;
  /** The id of the `role="menu"` element while open; `undefined` while closed. */
  ariaControls: string | undefined;
  /** Always `'menu'`. */
  ariaHasPopup: 'menu';
}

export interface MenuProps {
  /**
   * Renders the element that opens the menu. Spread `props` onto it:
   * `trigger={(p) => <Button {...p}>Sort</Button>}`.
   */
  trigger: (props: MenuTriggerProps) => ReactNode;
  /** Items in order. Labels must be unique (they are the React key). Filter the array for conditional items. */
  items: MenuItem[];
  /** `'solid'` draws a card background, border and shadow; `'glass'` draws the frosted glass recipe. */
  surface?: 'solid' | 'glass';
  /** Preferred side of the trigger; flips to the other side when there is no room. */
  side?: PopoverSide;
  /** Alignment to the trigger's start edge, centre or end edge. Use `'end'` for a trigger at the right edge. */
  align?: PopoverAlign;
  /** Accessible name for the menu. Without it the menu is labelled by the trigger. */
  ariaLabel?: string;
}
