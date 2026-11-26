import cx from 'classnames';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { createElement } from 'react';

import { useTypography, type TextSize, type TextTone, type TextWeight } from '../text/style.js';
import { useStyle } from './style.js';

const LEVELS = {
  1: { size: 'xxl', weight: 'bold' },
  2: { size: 'xl', weight: 'bold' },
  3: { size: 'lg', weight: 'semibold' },
  4: { size: 'md', weight: 'semibold' },
} as const satisfies Record<1 | 2 | 3 | 4, { size: TextSize; weight: TextWeight }>;

export interface HeadingProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'style'> {
  /** The heading level, rendered as `h1` to `h4`. Also sets the default size and weight, see [Level defaults](#level-defaults). */
  level: 1 | 2 | 3 | 4;
  /** Font size, from the theme's `fontSize` tokens. Unset, it follows `level`: 1 `xxl`, 2 `xl`, 3 `lg`, 4 `md`. A size you set wins over the level default. */
  size?: TextSize;
  /** Text colour. `danger` and `success` are for inline error and confirmation text. */
  tone?: TextTone;
  /** Font weight, from the theme's `fontWeight` tokens. Unset, it follows `level`: 1 and 2 `bold`, 3 and 4 `semibold`. A weight you set wins over the level default. */
  weight?: TextWeight;
  /** Clips to one line with an ellipsis. Also sets `min-width: 0` and `max-width: 100%`, so it clips inside an `Inline` or `Stack` with any `align`. */
  truncate?: boolean;
  /** Extra class on the root. Override with `'&&'` specificity, never `!important`. */
  className?: string;
  /** The heading text. */
  children?: ReactNode;
  /** Ref to the root element. */
  ref?: Ref<HTMLHeadingElement>;
}

/** A heading: `level` picks the element and a default look, props override the look. */
export const Heading = ({
  level,
  size,
  tone = 'primary',
  weight,
  truncate = false,
  className,
  children,
  ref,
  ...rest
}: HeadingProps) => {
  const style = useStyle();
  const type = useTypography();
  return createElement(
    `h${level}`,
    {
      ...rest,
      ref,
      className: cx(
        style.root,
        type[`size-${size ?? LEVELS[level].size}`],
        type[`tone-${tone}`],
        type[`weight-${weight ?? LEVELS[level].weight}`],
        truncate && type.truncate,
        className
      ),
    },
    children
  );
};
