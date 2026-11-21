import type { ReactElement } from 'react';

import type { IconProps } from '../icon/index.js';

/** A single navigation destination, shared by the desktop and mobile layouts. */
export interface NavItem {
  /** Route path passed to react-router `<Link to>`. Must be unique within a list (it is the key). */
  to: string;
  /** Visible text. */
  label: string;
  /** An icon component (`HomeIcon`), not an element. */
  Icon: (props: IconProps) => ReactElement;
  /** You compute this from the route; the nav does not match routes. Sets `aria-current="page"`. */
  active: boolean;
  /** A count of pending fixes, or `'dot'` for "active, nothing to decide yet". */
  badge?: number | 'dot';
}
