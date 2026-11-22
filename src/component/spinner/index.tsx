import cx from 'classnames';

import { SpinnerIcon } from '../../icon/index.js';
import type { TextSize } from '../text/style.js';
import { useStyle } from './style.js';

export interface SpinnerProps {
  /** Size, from the theme's `fontSize` tokens; the spinner is `1em` square. Unset inherits the surrounding font size. */
  size?: TextSize;
  /** Accessible name announced for the loading state. Default `'Loading'`. Ignored when `decorative`. */
  label?: string;
  /** Hide the spinner from assistive tech, for use beside text that already names the load. Default `false`. */
  decorative?: boolean;
  /** Extra class on the root. Override with `'&&'` specificity, never `!important`. */
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
