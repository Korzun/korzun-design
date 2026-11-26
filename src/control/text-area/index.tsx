import cx from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useStyle } from './style.js';

export type TextAreaProps = {
  /** Grows to fit content, so it never scrolls. The minimum height is 7rem with it and 10rem without, set inline so a class can't lower it. */
  autoResize?: boolean;
  /** Visible label. Not linked to the textarea (no `htmlFor`). */
  label?: string;
  /** `horizontal` and `vertical` paint a shaded card-header row with `md` corners; `inline` paints nothing. */
  layout?: 'horizontal' | 'vertical' | 'inline';
  /** Native limit, plus an `n/max` counter once within `max(10% of max, 50)` characters; the counter turns red at the limit. */
  maxLength?: number;
  /** The textarea's `name` and the key passed to `onValidChange`. */
  name: string;
  /** Receives the string, or `undefined` when emptied; not an event. Not called while `validate` fails. */
  onChange?: (newValue: string | undefined) => void;
  /** Called with `name` and the new validity; fires only when validity flips. */
  onValidChange?: (fieldName: string, newValid: boolean) => void;
  /** Placeholder text for the textarea. */
  placeholder?: string;
  /** Receives the raw text on each keystroke; `false` turns the label red. */
  validate?: (newValue: string) => boolean;
  /** Typed as required (pass `undefined` for empty). Re-syncs into the field only when the prop changes. */
  value: string | undefined;
  /** `'outlined'` has a border and the input background; `'borderless'` drops both and keeps its `md` corners, so the browser's default textarea background shows (check it in dark mode). */
  variant?: 'outlined' | 'borderless';
};

/**
 * Multi-line text field with optional auto-resize and a length counter.
 * Keeps its own text and re-syncs from `value` only when the prop changes.
 */
export const TextArea = ({
  autoResize = false,
  label,
  layout = 'horizontal',
  maxLength,
  name,
  onChange = () => {},
  onValidChange = () => {},
  placeholder,
  validate = () => true,
  value = '',
  variant = 'outlined',
}: TextAreaProps) => {
  const style = useStyle();
  const ref = useRef<HTMLTextAreaElement>(null);

  const [isValid, setIsValid] = useState<boolean>(true);
  const [internalValue, setInternalValue] = useState<string | undefined>(value);
  const [prevValue, setPrevValue] = useState<string | undefined>(value);

  const handleValueChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  useEffect(() => {
    if (!autoResize || !ref.current) return;
    const el = ref.current;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [autoResize, internalValue]);

  const currentLength = (internalValue ?? '').length;
  const remaining = maxLength !== undefined ? maxLength - currentLength : undefined;
  const showCounter =
    remaining !== undefined && remaining <= Math.max(Math.floor((maxLength ?? 0) * 0.1), 50);

  return (
    <div className={cx(style.root, style[layout])}>
      {label && (
        <label className={cx(style.label, { [`${style.danger}`]: !isValid })}>{label}</label>
      )}
      <div className={style.textareaWrapper}>
        <textarea
          className={cx(style.input, style[variant], { [style.autoResize]: autoResize })}
          maxLength={maxLength}
          name={name}
          onChange={handleValueChange}
          placeholder={placeholder}
          ref={ref}
          style={{ minHeight: autoResize ? '7rem' : '10rem' }}
          value={internalValue}
        />
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
