import cx from 'classnames';
import { ComponentType, useCallback, useContext } from 'react';
import { useFormStatus } from 'react-dom';

import { IconProps, SpinnerIcon } from '../../icon/index.js';
import { ButtonRadiusContext } from './radius-context.js';
import { ButtonType, ButtonTypeValue, ButtonRadius, ButtonRadiusValue, useStyle } from './style.js';

type ButtonVariant =
  | {
      /** Red treatment for destructive actions. Mutually exclusive with `success`. */
      danger?: boolean;
      success?: false | undefined;
    }
  | {
      /** Green treatment. Mutually exclusive with `danger`. */
      success?: boolean;
      danger?: false | undefined;
    };

export type ButtonProps = React.PropsWithChildren<
  {
    /**
     * Accessible name when the visible children are not distinguishing enough
     * on their own — several "Remove" buttons in a list, each belonging to a
     * different row.
     */
    ariaLabel?: string;
    /** For a disclosure button: the state of what it controls, and its id. */
    ariaExpanded?: boolean;
    /** For a disclosure button: the id of the element it controls. */
    ariaControls?: string;
    /** Extra class; win specificity with `'&&'` in your sheet, never `!important`. */
    className?: string;
    /** Greys the button out and blocks clicks. */
    disabled?: boolean;
    /** Id of the `<form>` to submit, for a `submit` button outside its form. */
    form?: string;
    /** Shows a spinner in place of the icons and blocks clicks. */
    loading?: boolean;
    /**
     * Applies to the default (div) mode only. In submit mode it is ignored:
     * native form submission (driven by the associated <form>) fires instead.
     * Receives no event.
     */
    onClick?: () => void;
    /** Icon component shown before the label (`prefix={SearchIcon}`), not an element. */
    prefix?: ComponentType<IconProps>;
    /** The surface the button sits on: `'background'` (default), `'card'`, `'inset'`, `'modal'`. */
    radius?: ButtonRadiusValue;
    /**
     * Render a native `<button type="submit">`; also spins while the enclosing
     * form action is pending. `onClick` is then ignored.
     */
    submit?: boolean;
    /** Icon component shown after the label (`suffix={ChevronIcon}`), not an element. */
    suffix?: ComponentType<IconProps>;
    /** Passed through; forced to -1 while disabled or loading (div mode). */
    tabIndex?: number;
    /** Native tooltip; passed through. */
    title?: string;
    /**
     * Visual variant (`'default'`, `'primary'`, `'text'`, `'link'`, `'dashed'`),
     * not the HTML `type`. Use `submit` for a submit button.
     */
    type?: ButtonTypeValue;
  } & ButtonVariant
>;

/**
 * Clickable action with a visual variant, optional icons, and a loading state.
 * Renders a `<div role="button">`, or a native submit `<button>` when `submit` is set.
 */
export const Button = ({
  ariaLabel,
  ariaExpanded,
  ariaControls,
  children,
  className: classNameProp,
  danger = false,
  disabled = false,
  form,
  loading = false,
  onClick = () => {},
  prefix: Prefix,
  radius: radiusProp,
  submit = false,
  suffix: Suffix,
  success = false,
  tabIndex,
  title,
  type = ButtonType.Default as ButtonTypeValue,
}: ButtonProps) => {
  const styles = useStyle();
  // An explicit `radius` wins; otherwise a surface (Dialog footer) may supply one.
  const radiusFromContext = useContext(ButtonRadiusContext);
  const radius = radiusProp ?? radiusFromContext ?? (ButtonRadius.Background as ButtonRadiusValue);
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
      aria-disabled={nonInteractive || undefined}
      tabIndex={nonInteractive ? -1 : tabIndex}
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
