/** Props shared by every icon component. */
export type IconProps = {
  /** Pass it for a decorative icon next to a text label. It is not set unless you pass it. */
  'aria-hidden'?: boolean | 'true' | 'false';
  /** Accessible name for a meaningful standalone icon; pair it with `role="img"`. */
  'aria-label'?: string;
  /**
   * Class on the `<svg>`, for size, colour (`color: …`) or animation.
   * @default ''
   */
  className?: string;
  /** Unset, it follows the icon: unfilled for a stroke icon, the text colour for a filled one. Ignored by `SpinnerIcon` and the emoji icons. A colour passed here bypasses the theme. */
  fill?: string;
  /**
   * Height in pixels. Set it together with `width`. A `className` with CSS `width` and `height` overrides both.
   * @default 24
   */
  height?: number;
  /** `'img'` for a meaningful standalone icon, `'status'` for a loading spinner. */
  role?: string;
  /**
   * Stroke colour, for stroke icons only. A colour passed here bypasses the theme.
   * @default 'currentColor'
   */
  stroke?: string;
  /**
   * Stroke width, for stroke icons only; filled and emoji icons ignore it.
   * @default 2
   */
  strokeWidth?: number;
  /**
   * Width in pixels. Set it together with `height`. A `className` with CSS `width` and `height` overrides both.
   * @default 24
   */
  width?: number;
};

const defaultIconProps = {
  className: '',
  height: 24,
  width: 24,
};

export const defaultFilledIconProps = {
  ...defaultIconProps,
  fill: 'currentColor',
};

export const defaultStrokeIconProps = {
  ...defaultIconProps,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
};
