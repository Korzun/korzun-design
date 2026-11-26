import cx from 'classnames';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { createElement } from 'react';

import type { Gap } from './gap.js';
import { useStyle } from './style.js';

export interface StackProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** The element to render. `ul`/`ol` also reset list margin, padding and bullets. Default `'div'`. */
  as?: 'div' | 'section' | 'ul' | 'ol' | 'li';
  /** Space between children, from the theme's `space` tokens, or `'none'`. Default `'md'`. */
  gap?: Gap;
  /** Cross-axis (horizontal) alignment of children; `start`/`end` map to `flex-start`/`flex-end`. Default `'stretch'`. */
  align?: 'stretch' | 'start' | 'center' | 'end';
  /** Extra class, added last on the root. Override with `'&&'` specificity, never `!important`. */
  className?: string;
  /** The children, laid out top to bottom. */
  children?: ReactNode;
  /** Ref to the root element. */
  ref?: Ref<HTMLElement>;
}

/** Lays children out in a vertical column with a themed gap between them. */
export const Stack = ({
  as = 'div',
  gap = 'md',
  align = 'stretch',
  className,
  children,
  ref,
  ...rest
}: StackProps) => {
  const style = useStyle();
  return createElement(
    as,
    {
      ...rest,
      ref,
      className: cx(
        style.root,
        style[`gap-${gap}`],
        style[`align-${align}`],
        (as === 'ul' || as === 'ol') && style.list,
        className
      ),
    },
    children
  );
};
