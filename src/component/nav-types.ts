import type { ReactElement } from 'react';

import type { IconProps } from '../icon/index.js';

/** A single navigation destination, shared by the desktop and mobile layouts. */
export interface NavItem {
  /** Route path passed to react-router `<Link to>`. Must be unique within a list, as it is the key. */
  to: string;
  /** Visible text. */
  label: string;
  /** An icon component (`HomeIcon`), not an element. Drawn at 14×14 in a tab and 18×18 in a `NavMobile` circle. */
  Icon: (props: IconProps) => ReactElement;
  /** You compute this, for example from `useLocation().pathname`: the nav does not match routes. Sets `aria-current="page"` and marks the item as current. */
  active: boolean;
  /** A positive number draws a red count on the icon's corner and `0` draws nothing. `'dot'` draws a red dot for "active, nothing to decide yet". */
  badge?: number | 'dot';
}
