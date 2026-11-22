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
  /** The heading level, rendered as `h1` to `h4`. Sets the default size and weight. */
  level: 1 | 2 | 3 | 4;
  /** Font size, from the theme's `fontSize` tokens. Default follows `level`: 1 `xxl`, 2 `xl`, 3 `lg`, 4 `md`. */
  size?: TextSize;
  /** Text colour. Default `'primary'`. */
  tone?: TextTone;
  /** Font weight, from the theme's `fontWeight` tokens. Default follows `level`: 1 and 2 `bold`, 3 and 4 `semibold`. */
  weight?: TextWeight;
  /** Clip to one line with an ellipsis. Default `false`. */
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
