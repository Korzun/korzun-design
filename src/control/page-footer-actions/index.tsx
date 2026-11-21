import { Button } from '../button/index.js';
import { useStyle } from './style.js';

/** One button in a `PageFooterActions` row. */
export interface FooterAction {
  /** Button text; may change between renders (`Save` → `Saving…`) without remounting. */
  label: string;
  /** Required even for a `submit` item, and ignored there (pass `() => {}`). Receives no event. */
  onClick: () => void;
  /** Greys the button out and blocks clicks. */
  disabled?: boolean;
  /** Spinner; blocks clicks. */
  loading?: boolean;
  /** Red treatment. */
  danger?: boolean;
  /** Renders `type="primary"`; otherwise `type="default"`. */
  emphasis?: boolean;
  /** Side of the row; default `'trailing'`. */
  align?: 'leading' | 'trailing';
  /** Render a native submit button (`onClick` is then ignored). */
  submit?: boolean;
  /** Id of the `<form>` to submit; needed because the row sits outside the form. */
  form?: string;
}

export interface PageFooterActionsProps {
  /** Rendered in order within each side (leading, then trailing). */
  items: FooterAction[];
}

/**
 * Row of page-level buttons below the cards, split into leading and trailing
 * sides. Sits on the page background; don't put it inside a `Card`.
 */
export function PageFooterActions({ items }: PageFooterActionsProps) {
  const styles = useStyle();
  const leading = items.filter((item) => item.align === 'leading');
  const trailing = items.filter((item) => item.align !== 'leading');

  // Key by position within the row, not by label: a label can change across
  // renders (e.g. Save → Saving…) or repeat, and keying on it would remount the
  // button — dropping focus and its loading state.
  const renderButton = (item: FooterAction, key: string) => (
    <Button
      key={key}
      onClick={item.onClick}
      disabled={item.disabled}
      loading={item.loading}
      danger={item.danger}
      type={item.emphasis ? 'primary' : 'default'}
      submit={item.submit}
      form={item.form}
    >
      {item.label}
    </Button>
  );

  return (
    <div className={styles.root}>
      {leading.map((item, i) => renderButton(item, `leading-${i}`))}
      <div className={styles.spacer} />
      {trailing.map((item, i) => renderButton(item, `trailing-${i}`))}
    </div>
  );
}
