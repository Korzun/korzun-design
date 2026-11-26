import cx from 'classnames';

import { SpinnerIcon } from '../../icon/index.js';
import type { TextSize } from '../text/style.js';
import { useStyle } from './style.js';

export interface SpinnerProps {
  /** Sets the font size from the theme's `fontSize` tokens, so the spinner is that many `em` square. Unset, it takes the surrounding font size. */
  size?: TextSize;
  /** Accessible name of the status, announced as the loading state. Ignored when `decorative`. */
  label?: string;
  /** Hides it from assistive tech (no role, `aria-hidden`), for use beside text that already names the load. */
  decorative?: boolean;
  /** Added last on the root. Override with `'&&'` specificity, never `!important`. */
  className?: string;
}

/** A rotating loading indicator that takes the surrounding text colour and, unless sized, its font size. */
export const Spinner = ({
  size,
  label = 'Loading',
  decorative = false,
  className,
}: SpinnerProps) => {
  const style = useStyle();
  return (
    <span
      {...(decorative ? { 'aria-hidden': true } : { role: 'status', 'aria-label': label })}
      className={cx(style.root, size && style[`size-${size}`], className)}
    >
      <SpinnerIcon aria-hidden={true} className={style.icon} />
    </span>
  );
};
