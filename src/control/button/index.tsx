import cx from 'classnames';
import { ComponentType, ReactNode, Ref, useCallback } from 'react';
import { useFormStatus } from 'react-dom';

import { depthClass, useSurfaceDepth } from '../../component/surface/index.js';
import { IconProps, SpinnerIcon } from '../../icon/index.js';
import { ButtonType, ButtonTypeValue, ButtonRadius, ButtonRadiusValue, useStyle } from './style.js';

type ButtonVariant =
  | {
      /** Red treatment for destructive actions. Mutually exclusive with `success` (setting both is a type error). */
      danger?: boolean;
      success?: false | undefined;
    }
  | {
      /** Green treatment. Mutually exclusive with `danger` (setting both is a type error). */
      success?: boolean;
      danger?: false | undefined;
    };

export type ButtonProps = React.PropsWithChildren<
  {
    /** The label. */
    children?: ReactNode;
    /**
     * Accessible name when the visible children are not distinguishing enough
     * on their own — several "Remove" buttons in a list, each belonging to a
     * different row.
     */
    ariaLabel?: string;
    /** For a disclosure button: whether the element it controls is expanded. */
    ariaExpanded?: boolean;
    /** For a disclosure button: the id of the element it controls. */
    ariaControls?: string;
    /** Announces that the button opens a popup of this kind (`'menu'` for a menu trigger). Rendered in both modes. */
    ariaHasPopup?: 'menu' | 'listbox' | 'dialog' | boolean;
    /** Extra class; win specificity with `'&&'` in your sheet, never `!important`. */
    className?: string;
    /** Greys the button out and blocks clicks. */
    disabled?: boolean;
    /** Id of the `<form>` to submit, for a `submit` button outside its form (e.g. in a `Card` footer). */
    form?: string;
    /** Shows a spinner in place of the icons and blocks clicks. */
    loading?: boolean;
    /**
     * Click and Enter/Space handler. **Ignored when `submit` is set**; the form
     * submits instead. Receives no event. Not called while `disabled` or `loading`.
     */
    onClick?: () => void;
    /** Icon component shown before the label (`prefix={SearchIcon}`), not an element. */
    prefix?: ComponentType<IconProps>;
    /**
     * Unset, it follows surface depth: 16px on a page or outside any surface,
     * 8px in a Card or Modal, 4px in a Popover or nested Card. Set, it names the
     * surface the button sits on, which sets its corner radius. Pass it only to
     * override; see [corners](../corners.md).
     */
    radius?: ButtonRadiusValue;
    /** Ref to the root element (the `<div role="button">`, or the `<button>` in submit mode), e.g. to `.focus()` it. A plain prop; no `forwardRef`. */
    ref?: Ref<HTMLElement>;
    /**
     * Render a native `<button type="submit">`. Also shows the spinner while the
     * enclosing form action is pending (`useFormStatus`). `onClick` is then ignored.
     */
    submit?: boolean;
    /** Icon component shown after the label (`suffix={ChevronIcon}`), not an element. */
    suffix?: ComponentType<IconProps>;
    /**
     * In div mode the button is keyboard-focusable by default; an explicit value
     * wins, except it is forced to `-1` while `disabled` or `loading`. Submit
     * mode passes it through to the native `<button>`, which is focusable anyway.
     * @default 0
     */
    tabIndex?: number;
    /** Native tooltip; passed through. */
    title?: string;
    /**
     * **Visual variant**, not the HTML `type`. Use `submit` for a submit button.
     * @default 'default'
     */
    type?: ButtonTypeValue;
  } & ButtonVariant
>;

// Depth 0 sits on the page, 1 in a card or dialog, 2 and deeper inside a popover or nested card.
const radiusByDepth = [
  ButtonRadius.Background,
  ButtonRadius.Card,
  ButtonRadius.Inset,
] as ButtonRadiusValue[];

/**
 * Clickable action with a visual variant, optional icons, and a loading state.
 * Renders a `<div role="button">`, or a native submit `<button>` when `submit` is set.
 */
export const Button = ({
  ariaLabel,
  ariaExpanded,
  ariaControls,
  ariaHasPopup,
  children,
  className: classNameProp,
  danger = false,
  disabled = false,
  form,
  loading = false,
  onClick = () => {},
  prefix: Prefix,
  radius: radiusProp,
  ref,
  submit = false,
  suffix: Suffix,
  success = false,
  tabIndex,
  title,
  type = ButtonType.Default as ButtonTypeValue,
}: ButtonProps) => {
  const styles = useStyle();
  // An explicit `radius` wins; otherwise the radius follows the surface depth.
  const depth = useSurfaceDepth() ?? 0;
  const radius = radiusProp ?? radiusByDepth[depthClass(depth)];
  // Safe to call unconditionally: outside a <form> action, useFormStatus
  // returns a default { pending: false }. Only consulted in submit mode.
  const { pending } = useFormStatus();
  const busy = loading || (submit && pending);

  const className = cx(
    styles.root,
    styles[type],
    styles[radius],
    { [styles.danger]: danger },
    { [styles.loading]: busy },
    { [styles.disabled]: disabled },
    { [styles.success]: success },
    classNameProp
  );

  const loadingIcon = busy ? <SpinnerIcon className={styles.spinner} /> : null;
  const prefixIcon = !busy && Prefix ? <Prefix className={styles.buttonIcon} /> : null;
  const suffixIcon = !busy && Suffix ? <Suffix className={styles.buttonIcon} /> : null;

  // Hoisted above the `if (submit)` branch (rather than left after the early
  // return, as in the naive version) so hook order never depends on the
  // `submit` branch taken during a given render. Both hooks are cheap and
  // simply unused in submit mode.
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!disabled && !busy) {
        event.stopPropagation();
        onClick();
      }
    },
    [busy, disabled, onClick]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!disabled && !busy && (event.key === 'Enter' || event.key === ' ')) {
        event.stopPropagation();
        // The key is handled: no page scroll on Space, and no keypress
        // activating whatever onClick moved focus to (a menu's first item).
        event.preventDefault();
        onClick();
      }
    },
    [busy, disabled, onClick]
  );

  if (submit) {
    return (
      <button
        type="submit"
        aria-label={ariaLabel}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-haspopup={ariaHasPopup}
        ref={ref as Ref<HTMLButtonElement>}
        form={form}
        className={className}
        disabled={disabled || busy}
        title={title}
        tabIndex={tabIndex}
      >
        {loadingIcon}
        {prefixIcon}
        {children}
        {suffixIcon}
      </button>
    );
  }

  const nonInteractive = disabled || busy;

  return (
    <div
      role="button"
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-haspopup={ariaHasPopup}
      ref={ref as Ref<HTMLDivElement>}
      aria-disabled={nonInteractive || undefined}
      tabIndex={nonInteractive ? -1 : (tabIndex ?? 0)}
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      title={title}
    >
      {loadingIcon}
      {prefixIcon}
      {children}
      {suffixIcon}
    </div>
  );
};

export type { ButtonTypeValue, ButtonRadiusValue };
