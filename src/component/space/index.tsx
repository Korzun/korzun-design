import cx from 'classnames';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { Children, cloneElement, createElement, Fragment, isValidElement } from 'react';

import type { Gap } from './gap.js';
import { useStyle } from './style.js';

export type { Gap } from './gap.js';

export interface SpaceProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** The axis children are laid along: `'horizontal'` is a row, `'vertical'` a column. */
  direction?: 'horizontal' | 'vertical';
  /** Space between children, from the theme's `space` tokens, or `'none'`. The default is `'sm'` in a row and `'md'` in a column. */
  gap?: Gap;
  /** Cross-axis alignment of children; `start`/`end` map to `flex-start`/`flex-end`. The default is `'center'` in a row and `'stretch'` in a column. */
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  /** Main-axis distribution of children. `'between'` is `space-between`: it pushes the first and last child to opposite edges. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Lets children wrap onto further lines. Without it they stay on one line and may overflow or shrink. */
  wrap?: boolean;
  /** Drawn between each pair of children, never before the first or after the last. Fragments are unwrapped; `null`, `false`, `''` and empty fragments get none. Hidden from screen readers; inside a `ul`/`ol` it is an `li`. */
  split?: ReactNode;
  /** The element to render. `ul`/`ol` also reset list margin, padding and bullets. */
  as?: 'div' | 'section' | 'span' | 'nav' | 'ul' | 'ol' | 'li';
  /** Extra class, added last on the root. Override with `'&&'` specificity, never `!important`. */
  className?: string;
  /** The children, laid out along `direction`. */
  children?: ReactNode;
  /** Ref to the root element. */
  ref?: Ref<HTMLElement>;
}

// Children.toArray keeps a Fragment as one child. Unwrap fragments (recursively)
// so a separator sits between real items, none for an empty fragment. Each
// unwrapped child keeps its parent's key as a prefix, so keys stay unique.
const flatten = (nodes: ReactNode, prefix = ''): ReactNode[] =>
  Children.toArray(nodes).flatMap((child) => {
    // An empty string renders nothing (`{str && <X />}` with `str === ''`), so it gets no separator.
    if (child === '') return [];
    if (!isValidElement<{ children?: ReactNode }>(child)) return [child];
    const key = `${prefix}${child.key}`;
    return child.type === Fragment
      ? flatten(child.props.children, `${key}/`)
      : [cloneElement(child, { key })];
  });

/** Lays children out in a row or a column with a themed gap between them, and an optional separator. */
export const Space = ({
  direction = 'horizontal',
  gap,
  align,
  justify = 'start',
  wrap = false,
  split,
  as = 'div',
  className,
  children,
  ref,
  ...rest
}: SpaceProps) => {
  const style = useStyle();
  const vertical = direction === 'vertical';
  const isList = as === 'ul' || as === 'ol';
  const resolvedGap = gap ?? (vertical ? 'md' : 'sm');
  const resolvedAlign = align ?? (vertical ? 'stretch' : 'center');

  let content = children;
  if (split !== undefined && split !== null && split !== false) {
    content = flatten(children).flatMap((child, index) =>
      index === 0
        ? [child]
        : [
            isList ? (
              <li key={`split-${index}`} role="presentation" aria-hidden="true">
                {split}
              </li>
            ) : (
              <span key={`split-${index}`} aria-hidden="true">
                {split}
              </span>
            ),
            child,
          ]
    );
  }

  return createElement(
    as,
    {
      ...rest,
      ref,
      className: cx(
        style.root,
        style[direction],
        style[`gap-${resolvedGap}`],
        style[`align-${resolvedAlign}`],
        style[`justify-${justify}`],
        wrap && style.wrap,
        isList && style.list,
        className
      ),
    },
    content
  );
};
