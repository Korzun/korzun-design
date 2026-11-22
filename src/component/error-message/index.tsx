import cx from 'classnames';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { createElement } from 'react';

import { useStyle } from './style.js';

export interface ErrorMessageProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'children'> {
  /** The element to render. Default `'p'`. */
  as?: 'p' | 'div' | 'span';
  /** The error text. `null`, `undefined`, `false` and `''` render nothing; `0` renders. */
  children?: ReactNode;
  /** Extra class on the root. Override with `'&&'` specificity, never `!important`. */
  className?: string;
  /** Ref to the root element. */
  ref?: Ref<HTMLElement>;
}

/** An announced failure message (`role="alert"`) in the danger colour. Renders nothing when empty, so leave it mounted. */
export const ErrorMessage = ({
  as = 'p',
  children,
  className,
  ref,
  ...rest
}: ErrorMessageProps) => {
  const style = useStyle();
  if (children == null || children === false || children === '') return null;
  return createElement(
    as,
    { role: 'alert', ...rest, ref, className: cx(style.root, className) },
    children
  );
};
