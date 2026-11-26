import { Button } from '@korzun/design/control';
import { useToast } from '@korzun/design/toast';

export type CopyButtonProps = {
  /** The exact text put on the clipboard. */
  text: string;
  /** The button's accessible name ("Copy import", "Copy code"); it reads "Copy". */
  label: string;
};

/** Copies `text` to the clipboard and toasts the result. */
export const CopyButton = ({ text, label }: CopyButtonProps) => {
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
    <Button type="text" ariaLabel={label} onClick={copy}>
      Copy
    </Button>
  );
};
