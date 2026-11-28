import cx from 'classnames';
import { isValidElement, type CSSProperties, type ReactNode } from 'react';

import { useStyle } from './style.js';

/** A labelled datum: a faint, CSS-capitalized label followed by its value. */
export type MetaLinePair = {
  /** Shown faint and capitalized by CSS: `'cover fit'` displays as “Cover Fit”. */
  label: string;
  /** The value. When it is `null`, `undefined` or `false` the whole pair is skipped; `''` and `0` are kept. */
  value: ReactNode;
};

/** One datum: any node, or a labelled pair. */
export type MetaLineItem = ReactNode | MetaLinePair;

export type MetaLineProps = {
  /** The data, in order: nodes and `{ label, value }` pairs, mixed freely. `null`, `undefined` and `false` items (and pairs with such a value) are skipped, and nothing renders when every item is. `''` and `0` are kept, so filter them yourself. */
  items: MetaLineItem[];
  /** One character drawn between items (`'·'`, `'|'`, `'/'`). It never dangles at a line break and is not read by screen readers. Unset: items are spaced by gaps instead. */
  separator?: string;
  /** On the outer element. The font size and colour set here reach every item, and the separators scale with it. Override with `'&&'` specificity, never `!important`. */
  className?: string;
};

const isPair = (item: MetaLineItem): item is MetaLinePair =>
  typeof item === 'object' && item !== null && !isValidElement(item) && 'label' in item;

const absent = (value: unknown) => value === null || value === undefined || value === false;

/** `s` as a CSS string literal for `content`: quotes, backslashes and line breaks escaped. */
const cssString = (s: string) =>
  `"${s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r\n|\r|\n/g, '\\a ')}"`;

/**
 * A short run of data about one record: a row's secondary line ("Frank
 * Herbert · Book 3 · 42%") or a card's labelled facts ("Format EPUB   Size
 * 2.1 MB"). It wraps between data, never inside one.
 *
 * With a `separator`, the separators are CSS, not text: each item draws its own
 * leading separator in a fixed-width cell, the list is shifted left by one cell
 * and the overflow clipped. Whichever item starts a line, its separator is the
 * one hidden, which is exactly the one that should not show. Keeping them out
 * of the DOM also means screen readers read the data, not the punctuation.
 */
export const MetaLine = ({ items, separator, className }: MetaLineProps) => {
  const styles = useStyle();
  const present = items.filter((item) => !absent(item) && !(isPair(item) && absent(item.value)));
  if (present.length === 0) {
    return null;
  }
  const separated = separator !== undefined;
  const style = separated
    ? ({ '--meta-separator': cssString(separator) } as CSSProperties)
    : undefined;
  return (
    <div className={cx(styles.root, className)}>
      <div className={cx(styles.list, separated && styles.separated)} style={style}>
        {present.map((item, i) => (
          // A positional list: the same data in the same place is the same item.
          <span key={i} className={styles.item} data-testid="meta-item">
            {isPair(item) ? (
              <>
                <span className={styles.label}>{item.label}</span>
                {item.value}
              </>
            ) : (
              item
            )}
          </span>
        ))}
      </div>
    </div>
  );
};
