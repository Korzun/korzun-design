import { useSurfaceDepth } from '../../component/surface/index.js';
import { RowRemoveIcon } from '../../icon/index.js';
import { Button } from '../button/index.js';
import { NumberInput } from '../number-input/index.js';
import { TextInput } from '../text-input/index.js';
import { useStyle } from './style.js';

/**
 * One column of a `FieldList`: a `TextInput` (`'text'`) or `NumberInput`
 * (`'number'`) per row, keyed by `key`. `validate` receives the raw text.
 * A number column shows a row value only if it is a `number`: a numeric string
 * shows as empty.
 */
export type ColumnDescriptor =
  | {
      /** `'text'` renders a `TextInput`, `'number'` a `NumberInput`. */
      type: 'text';
      /** The row field this column reads and writes, and the end of each input's `name`. */
      key: string;
      /** Says what the column is, since inputs have no labels. */
      placeholder?: string;
      /** Receives the raw text on each keystroke; while it returns `false`, `onChange` is not called. */
      validate?: (v: string) => boolean;
    }
  | {
      /** `'text'` renders a `TextInput`, `'number'` a `NumberInput`. */
      type: 'number';
      /** The row field this column reads and writes, and the end of each input's `name`. */
      key: string;
      /** Says what the column is, since inputs have no labels. */
      placeholder?: string;
      /** Receives the raw text on each keystroke; while it returns `false`, `onChange` is not called. */
      validate?: (v: string) => boolean;
    };

/** A `FieldList` row: a stable unique `_key` plus one value per column key. */
export type FieldRow = {
  /** Stable and unique: it is the React key and part of each input's `name`. */
  _key: string;
} & Record<string, string | number | undefined>;

export type FieldListProps = {
  /** Text of the dashed add button ("Add identifier"). */
  addLabel: string;
  /** One input per column per row; inputs have no labels, so use `placeholder`. A number column shows a row value only if it is a `number`: a numeric string shows as empty. */
  columns: ColumnDescriptor[];
  /** Append a row with a fresh `_key`. Receives no event. */
  onAdd: () => void;
  /**
   * `string` from a text column, `number` from a number column, `undefined`
   * when emptied. Not called while that field's `validate` fails.
   */
  onChange: (rowKey: string, fieldKey: string, newValue: string | number | undefined) => void;
  /** Remove the row with this `_key`. */
  onRemove: (rowKey: string) => void;
  /** `fieldName` is `${rowKey}.${columnKey}`. Fires only when validity flips. */
  onValidChange?: (fieldName: string, isValid: boolean) => void;
  /** `_key` must be stable and unique: it is the React key and part of each input's `name`. */
  rows: FieldRow[];
};

/**
 * Editable list of rows, each a set of text/number inputs with a remove button,
 * plus a dashed add button. Belongs in a `Card` body (the add button is 8px outside any surface and follows depth inside one).
 */
export const FieldList = ({
  addLabel,
  columns,
  onAdd,
  onChange,
  onRemove,
  onValidChange,
  rows,
}: FieldListProps) => {
  const style = useStyle();
  const depth = useSurfaceDepth();

  return (
    <div className={style.root}>
      <div className={style.rowContainer}>
        {rows.map((row) => (
          <div className={style.row} key={row._key}>
            <div className={style.fields}>
              {columns.map((col) => (
                <div className={style.field} key={col.key}>
                  {col.type === 'text' ? (
                    <TextInput
                      name={`${row._key}.${col.key}`}
                      placeholder={col.placeholder}
                      validate={col.validate}
                      value={row[col.key] !== undefined ? String(row[col.key]) : ''}
                      onChange={(newValue) => onChange(row._key, col.key, newValue)}
                      onValidChange={onValidChange}
                    />
                  ) : (
                    <NumberInput
                      label={undefined}
                      name={`${row._key}.${col.key}`}
                      placeholder={col.placeholder}
                      validate={col.validate}
                      value={
                        typeof row[col.key] === 'number' ? (row[col.key] as number) : undefined
                      }
                      onChange={(newValue) => onChange(row._key, col.key, newValue)}
                      onValidChange={onValidChange}
                    />
                  )}
                </div>
              ))}
            </div>
            <Button type="link" danger title="Remove row" onClick={() => onRemove(row._key)}>
              <RowRemoveIcon height={20} width={20} strokeWidth={2} />
            </Button>
          </div>
        ))}
      </div>
      <Button type="dashed" onClick={onAdd} radius={depth === undefined ? 'card' : undefined}>
        {addLabel}
      </Button>
    </div>
  );
};
