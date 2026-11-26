import cx from 'classnames';
import { useCallback, useId, useState } from 'react';

import { useDepthClassKey } from '../../component/surface/index.js';
import { IconProps } from '../../icon/index.js';
import { Button } from '../button/index.js';
import { useStyle } from './style.js';

/** Trailing icon button of a `TextInput`. */
type Action = {
  /** Icon component, not an element. */
  icon: React.ComponentType<IconProps>;
  /** Called when the icon button is clicked. */
  action: () => void;
  /** Accessible name of the icon button (`Clear search`); an icon alone has none. */
  ariaLabel?: string;
  /** Red icon. */
  danger?: boolean;
};

export type { Action as TextInputAction };

export type TextInputProps = {
  /** An icon button inside the field's right end, such as clear or reveal. */
  action?: Action;
  /** Accessible name of the input when there is no visible `label`. With a `label`, the label names it and this is ignored. */
  ariaLabel?: string;
  /** Passed through to the input. */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** Passed through to the input. */
  autoComplete?: React.HTMLInputAutoCompleteAttribute | undefined;
  /** Visible label, linked to the input so it names it. */
  label?: string;
  /** `horizontal` and `vertical` paint a shaded card-header row with corners that follow surface depth ([corners](../corners.md)); `inline` paints nothing. */
  layout?: 'horizontal' | 'vertical' | 'inline';
  /** Native limit, plus an `n/max` counter once within `max(10% of max, 10)` characters; the counter turns red at the limit. */
  maxLength?: number;
  /** The input's `name` (form data) and the key passed to `onValidChange`. */
  name: string;
  /** Receives the string, or `undefined` when emptied; not an event. Not called while `validate` fails. */
  onChange?: (newValue: string | undefined) => void;
  /** Passed through; unlike `onChange`, this one receives the event. */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Called with `name` and the new validity; fires only when validity flips. */
  onValidChange?: (fieldName: string, newValid: boolean) => void;
  /** Renders `type="password"`. */
  password?: boolean;
  /** Placeholder text for the input. */
  placeholder?: string;
  /** Receives the raw text on each keystroke; `false` turns label and border red. */
  validate?: (newValue: string) => boolean;
  /** Typed as required: pass it, even as `undefined` for empty. Re-syncs into the field only when the prop changes; see [Controlled-ish](#controlled-ish). */
  value: string | undefined;
};

/**
 * Single-line text field. Keeps its own text and re-syncs from `value` only
 * when the prop changes; `onChange` is skipped while `validate` fails.
 */
export const TextInput = ({
  autoCapitalize,
  autoComplete,
  action,
  ariaLabel,
  label,
  layout = 'horizontal',
  maxLength,
  name,
  onChange = () => {},
  onKeyDown,
  onValidChange = () => {},
  password = false,
  placeholder,
  validate = () => true,
  value = '',
}: TextInputProps) => {
  const style = useStyle();
  const depthKey = useDepthClassKey();
  const id = useId();

  const [isValid, setIsValid] = useState<boolean>(true);
  const [internalValue, setInternalValue] = useState<string | undefined>(value);
  const [prevValue, setPrevValue] = useState<string | undefined>(value);

  const handleValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInternalValue(newValue);
      if (validate(newValue)) {
        if (isValid === false) {
          setIsValid(true);
          onValidChange(name, true);
        }
        onChange(newValue === '' ? undefined : newValue);
      } else {
        if (isValid === true) {
          setIsValid(false);
          onValidChange(name, false);
        }
      }
    },
    [isValid, name, onChange, onValidChange, validate]
  );

  if (value !== prevValue) {
    setPrevValue(value);
    setInternalValue(value);
  }

  const currentLength = (internalValue ?? '').length;
  const remaining = maxLength !== undefined ? maxLength - currentLength : undefined;
  // Show the counter only as the field approaches its limit. Scale the threshold
  // to the field size (10% of the max, minimum 10 chars) so a short field like a
  // name doesn't show it constantly the way a large description field would.
  const showCounter =
    remaining !== undefined && remaining <= Math.max(Math.floor((maxLength ?? 0) * 0.1), 10);

  return (
    <div className={cx(style.root, style[layout], depthKey && style[depthKey])}>
      {label && (
        <label htmlFor={id} className={cx(style.label, { [style.danger]: !isValid })}>
          {label}
        </label>
      )}
      <div className={style.inputContainer}>
        <input
          autoCapitalize={autoCapitalize}
          aria-label={label ? undefined : ariaLabel}
          autoComplete={autoComplete}
          className={cx(style.input, {
            [style.danger]: !isValid,
            [style.isAction]: action !== undefined,
          })}
          id={id}
          maxLength={maxLength}
          name={name}
          onChange={handleValueChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          type={password ? 'password' : 'text'}
          value={internalValue}
        />
        {action && (
          <div className={cx(style.action)}>
            <Button
              type="link"
              danger={action.danger}
              ariaLabel={action.ariaLabel}
              onClick={action.action}
            >
              <action.icon height={20} width={20} strokeWidth={2} />
            </Button>
          </div>
        )}
        {showCounter && (
          <span
            className={cx(
              style.counter,
              remaining !== undefined && remaining <= 0 && style.counterDanger
            )}
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
