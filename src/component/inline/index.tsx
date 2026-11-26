import cx from 'classnames';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { createElement } from 'react';

import type { Gap } from '../stack/gap.js';
import { useStyle } from './style.js';

export interface InlineProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** The element to render. `ul`/`ol` also reset list margin, padding and bullets. */
  as?: 'div' | 'span' | 'ul' | 'ol' | 'li' | 'nav';
  /** Space between children, from the theme's `space` tokens, or `'none'`. */
  gap?: Gap;
  /** Cross-axis (vertical) alignment of children; `start`/`end` map to `flex-start`/`flex-end`. */
  align?: 'center' | 'start' | 'end' | 'baseline' | 'stretch';
  /** Main-axis (horizontal) distribution of children. `'between'` is `space-between`: it pushes the first and last child to opposite edges. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Lets children wrap onto further lines. Without it they stay on one line and may overflow or shrink. */
  wrap?: boolean;
  /** Extra class, added last on the root. Override with `'&&'` specificity, never `!important`. */
  className?: string;
  /** The children, laid out left to right. */
  children?: ReactNode;
  /** Ref to the root element. */
  ref?: Ref<HTMLElement>;
}

/** Lays children out in a horizontal row with a themed gap between them. */
export const Inline = ({
  as = 'div',
  gap = 'sm',
  align = 'center',
  justify = 'start',
  wrap = false,
  className,
  children,
  ref,
  ...rest
}: InlineProps) => {
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
        style[`justify-${justify}`],
        wrap && style.wrap,
        (as === 'ul' || as === 'ol') && style.list,
        className
      ),
    },
    children
  );
};
