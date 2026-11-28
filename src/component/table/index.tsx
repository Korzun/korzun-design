import cx from 'classnames';
import type { CSSProperties, ReactNode } from 'react';

import { depthClass, SurfaceDepthProvider, useSurfaceDepth } from '../surface/index.js';
import { useStyle } from './style.js';

export type TableColumn<Row> = {
  /** The field of the row this column shows by default, and the column's identity. */
  key: string;
  /** The column heading. On a phone it also labels each value, unless `label` says otherwise. */
  title: string;
  /** What names a value on a phone, where the headings are hidden. Defaults to `title`; `false` shows the value bare. */
  label?: string | false;
  /** Draws the cell instead of the row's `key` field. Receives the row and its index. */
  render?: (row: Row, index: number) => ReactNode;
  /** A CSS width for the heading cell (`'35%'`, `'8rem'`), on a wide screen. */
  width?: string;
  /** Takes a stacked row's full width on a phone, for a long description. */
  wide?: boolean;
  /** Keeps the cell's text on one line. */
  nowrap?: boolean;
  /** Where the cell's content sits; `'end'` right-aligns numbers. Defaults to `'start'`. */
  align?: 'start' | 'end';
};

export type TableProps<Row> = {
  /** The columns, in order. */
  columns: TableColumn<Row>[];
  /** The data, one row each. */
  rows: readonly Row[];
  /** What identifies a row: one of its fields, or a function returning a unique string. */
  rowKey: keyof Row | ((row: Row, index: number) => string);
  /** The table's accessible name, announced by screen readers. */
  ariaLabel?: string;
  /** Shown in one full-width row when `rows` is empty. Without it the table shows its header only. */
  empty?: ReactNode;
  /** A CSS minimum width for the table on a wide screen (`'40rem'`); it scrolls inside its box when narrower. A phone ignores it. */
  minWidth?: string;
  /** Extra class on the scrolling box, merged after the component's own. */
  className?: string;
};

const cellValue = (value: unknown): ReactNode =>
  value === null || value === undefined ? '–' : String(value);

/**
 * A data table that scrolls inside its own bordered box on a wide screen and
 * stacks each row on a phone. Its corners follow where it sits, and a control
 * in a cell sits one level deeper.
 */
export const Table = <Row,>({
  columns,
  rows,
  rowKey,
  ariaLabel,
  empty,
  minWidth,
  className,
}: TableProps<Row>) => {
  const styles = useStyle();
  const depth = useSurfaceDepth() ?? 0;
  const keyOf = (row: Row, index: number): string =>
    typeof rowKey === 'function' ? rowKey(row, index) : String(row[rowKey]);
  const tableStyle = minWidth ? ({ '--table-min-width': minWidth } as CSSProperties) : undefined;

  return (
    <div className={cx(styles.root, styles[`depth${depthClass(depth)}`], className)}>
      <table className={styles.table} style={tableStyle}>
        {ariaLabel && <caption className={styles.caption}>{ariaLabel}</caption>}
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className={cx(col.align === 'end' && styles.end)}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <SurfaceDepthProvider depth={depth + 1}>
            {rows.length === 0 && empty !== undefined && empty !== null && empty !== false ? (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={keyOf(row, index)}>
                  {columns.map((col) => {
                    const label = col.label === undefined ? col.title : col.label;
                    return (
                      <td
                        key={col.key}
                        data-label={label === false ? undefined : label}
                        className={cx(
                          col.wide && styles.wide,
                          col.nowrap && styles.nowrap,
                          col.align === 'end' && styles.end
                        )}
                      >
                        {col.render
                          ? col.render(row, index)
                          : cellValue((row as Record<string, unknown>)[col.key])}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </SurfaceDepthProvider>
        </tbody>
      </table>
    </div>
  );
};
