import cx from 'classnames';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { createElement } from 'react';

import type { Gap } from '../stack/gap.js';
import { useStyle } from './style.js';

export interface InlineProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** The element to render. `ul`/`ol` also reset list margin, padding and bullets. Default `'div'`. */
  as?: 'div' | 'span' | 'ul' | 'ol' | 'li' | 'nav';
  /** Space between children, from the theme's `space` tokens, or `'none'`. Default `'sm'`. */
  gap?: Gap;
  /** Cross-axis (vertical) alignment of children. Default `'center'`. */
  align?: 'center' | 'start' | 'end' | 'baseline' | 'stretch';
  /** Main-axis (horizontal) distribution. `'between'` pushes the first and last child to opposite edges. Default `'start'`. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Let children wrap onto further lines instead of overflowing. Default `false`. */
  wrap?: boolean;
  /** Extra class on the root. Override with `'&&'` specificity, never `!important`. */
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
