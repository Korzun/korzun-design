import { Button } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useToast } from '@korzun/design/toast';

import { tapTarget } from '../layout/tap-target.js';

// A 32px text button: on a phone its hit area grows to 44px.
const useStyle = createUseStyles((theme: Theme) => ({ button: tapTarget(theme) }));

export type CopyButtonProps = {
  /** The exact text put on the clipboard. */
  text: string;
  /** The button's accessible name ("Copy import", "Copy code"); it reads "Copy". */
  label: string;
};

/** Copies `text` to the clipboard and toasts the result. */
export const CopyButton = ({ text, label }: CopyButtonProps) => {
  const styles = useStyle();
  const toast = useToast();
  const copy = () => {
    // The clipboard API is missing outside a secure context (the dev server on a LAN address).
    const written = navigator.clipboard
      ? navigator.clipboard.writeText(text)
      : Promise.reject(new Error('No clipboard'));
    written.then(
      () => toast('Copied', 'success'),
      () => toast('Could not copy', 'error')
    );
  };
  return (
    <Button type="text" ariaLabel={label} className={styles.button} onClick={copy}>
      Copy
    </Button>
  );
};
