import cx from 'classnames';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { createElement } from 'react';

import { useStyle, useTypography, type TextSize, type TextTone, type TextWeight } from './style.js';

const INLINE_TAGS = ['span', 'strong', 'em', 'label'];

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** The element to render. `p` has its margin reset to 0; space paragraphs with `Space` `gap`. */
  as?: 'span' | 'p' | 'div' | 'label' | 'strong' | 'em';
  /** Font size, from the theme's `fontSize` tokens. Unset, it inherits from the parent. */
  size?: TextSize;
  /** Text colour. `primary` to `description` use the theme's `color.text` tokens; `danger` and `success` use the chip text colours, for inline error and confirmation text. Unset, it inherits from the parent. */
  tone?: TextTone;
  /** Font weight, from the theme's `fontWeight` tokens. Unset, it inherits from the parent. */
  weight?: TextWeight;
  /** Clips to one line with an ellipsis. Also sets `min-width: 0` and `max-width: 100%`, so it clips inside a `Space` with any `align`. On `span`, `strong`, `em` and `label` it also makes the element `inline-block`, because inline elements ignore overflow. */
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
