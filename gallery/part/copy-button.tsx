import { Button } from '@korzun/design/control';
import { CheckIcon } from '@korzun/design/icon';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useEffect, useRef, useState } from 'react';

import { tapTarget } from '../layout/tap-target.js';

const useStyle = createUseStyles((theme: Theme) => ({
  // A 32px text button: on a phone its hit area grows to 44px. Nothing sits after
  // it in its row (an example's meta row, an icon tile), so it needs no reserved width.
  button: tapTarget(theme),
  // Visually hidden, but read aloud by screen readers.
  status: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
}));

type State = 'idle' | 'done' | 'failed';

const RESET_MS = 2000;

export type CopyButtonProps = {
  /** The exact text put on the clipboard. */
  text: string;
  /** The idle button's accessible name ("Copy CheckIcon import", "Copy Basic code"); it reads "Copy". */
  label: string;
};

/**
 * Copies `text` to the clipboard and shows the result in the button for two
 * seconds (Copied, or Could not copy), announced through a status region: the
 * Copy button recipe's state machine.
 */
export const CopyButton = ({ text, label }: CopyButtonProps) => {
  const styles = useStyle();
  const [state, setState] = useState<State>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
    };
  }, []);

  const show = (next: State) => {
    // A write that settles after unmount must not set state or start a timer.
    if (!mounted.current) return;
    // Pressing again restarts the two seconds.
    clearTimeout(timer.current);
    setState(next);
    timer.current = setTimeout(() => setState('idle'), RESET_MS);
  };

  const copy = () => {
    // A missing clipboard (outside a secure context, e.g. the dev server on a LAN address) or a
    // synchronous throw from writeText lands in the same failed path as a rejection.
    Promise.resolve()
      .then(() => navigator.clipboard.writeText(text))
      .then(
        () => show('done'),
        () => show('failed')
      );
  };

  const message = state === 'done' ? 'Copied' : state === 'failed' ? 'Could not copy' : '';
  return (
    <>
      <Button
        type="text"
        // The label is the name while idle; the changing text names it after.
        ariaLabel={state === 'idle' ? label : undefined}
        prefix={state === 'done' ? CheckIcon : undefined}
        className={styles.button}
        onClick={copy}
      >
        {state === 'idle' ? 'Copy' : message}
      </Button>
      {/* Always mounted, so a screen reader announces the text when it appears. */}
      <span role="status" className={styles.status}>
        {message}
      </span>
    </>
  );
};
