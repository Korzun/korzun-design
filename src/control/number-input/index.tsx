import cx from 'classnames';
import { useCallback, useState } from 'react';

import { isNumeric } from '../../utils.js';
import { useStyle } from './style.js';

export type NumberInputProps = {
  /** Required key: pass `label={undefined}` for none. Not linked to the input (no `htmlFor`). */
  label: string | undefined;
  /** `horizontal` and `vertical` paint a shaded card-header row with `md` corners; `inline` paints nothing. */
  layout?: 'horizontal' | 'vertical' | 'inline';
  /** The input's `name` and the key passed to `onValidChange`. */
  name: string;
  /** Receives `parseFloat(text)`, or `undefined` when emptied; not called while `validate` fails. */
  onChange?: (newValue: number | undefined) => void;
  /** Called with `name` and the new validity; fires only when validity flips. */
  onValidChange?: (fieldName: string, newValid: boolean) => void;
  /** Placeholder text for the input. */
  placeholder?: string;
  /**
   * Receives the raw text. Replacing it drops the built-in check, so include one.
   * @default accepts empty or numeric text
   */
  validate?: (newValue: string) => boolean;
  /** Current number. Re-syncs into the field only when the prop changes. */
  value: number | undefined;
};

/**
 * Text field that reports a number: a plain `<input>` (no `type="number"`)
 * that calls `onChange` with the parsed value while the text validates.
 */
export const NumberInput = ({
  label,
  layout = 'horizontal',
  name,
  onChange = () => {},
  onValidChange = () => {},
  placeholder,
  validate = (newValue) => newValue === '' || isNumeric(newValue),
  value,
}: NumberInputProps) => {
  const style = useStyle();

  const [isValid, setIsValid] = useState<boolean>(true);
  const [internalValue, setInternalValue] = useState<string | undefined>(
    value !== undefined ? String(value) : undefined
  );
  const [prevValue, setPrevValue] = useState<number | undefined>(value);

  const handleValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInternalValue(newValue);
      if (validate(newValue)) {
        if (isValid === false) {
          setIsValid(true);
          onValidChange(name, true);
        }
        onChange(newValue === '' ? undefined : parseFloat(newValue));
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
    setInternalValue(value !== undefined ? String(value) : undefined);
  }

  return (
    <div className={cx(style.root, style[layout])}>
      {label && (
        <label className={cx(style.label, { [`${style.danger}`]: !isValid })}>{label}</label>
      )}
      <input
        name={name}
        className={cx(style.input, { [`${style.danger}`]: !isValid })}
        onChange={handleValueChange}
        placeholder={placeholder}
        value={internalValue === undefined ? '' : internalValue}
      />
    </div>
  );
};
