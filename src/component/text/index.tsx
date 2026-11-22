import cx from 'classnames';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { createElement } from 'react';

import { useStyle, useTypography, type TextSize, type TextTone, type TextWeight } from './style.js';

const INLINE_TAGS = ['span', 'strong', 'em', 'label'];

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** The element to render. Default `'span'`. */
  as?: 'span' | 'p' | 'div' | 'label' | 'strong' | 'em';
  /** Font size, from the theme's `fontSize` tokens. Unset inherits. */
  size?: TextSize;
  /** Text colour: `primary`, `secondary`, `muted`, `faint`, `description`, or `danger`/`success` for inline error and confirmation text. Unset inherits. */
  tone?: TextTone;
  /** Font weight, from the theme's `fontWeight` tokens. Unset inherits. */
  weight?: TextWeight;
  /** Clip to one line with an ellipsis. Inline elements become `inline-block` so the clip applies. Default `false`. */
  truncate?: boolean;
  /** The id of the control this label describes. Only for `as="label"`. */
  htmlFor?: string;
  /** Extra class on the root. Override with `'&&'` specificity, never `!important`. */
  className?: string;
  /** The text. */
  children?: ReactNode;
  /** Ref to the root element. */
  ref?: Ref<HTMLElement>;
}

/** A run of text with themed size, tone and weight. Unset props inherit from the parent. */
export const Text = ({
  as = 'span',
  size,
  tone,
  weight,
  truncate = false,
  className,
  children,
  ref,
  ...rest
}: TextProps) => {
  const style = useStyle();
  const type = useTypography();
  return createElement(
    as,
    {
      ...rest,
      ref,
      className: cx(
        style.root,
        size && type[`size-${size}`],
        tone && type[`tone-${tone}`],
        weight && type[`weight-${weight}`],
        truncate && type.truncate,
        truncate && INLINE_TAGS.includes(as) && type.truncateInline,
        className
      ),
    },
    children
  );
};
