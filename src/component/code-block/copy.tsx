import { useEffect, useRef, useState } from 'react';

import { Button } from '../../control/button/index.js';
import { CheckIcon } from '../../icon/index.js';
import { useStyle } from './style.js';

type State = 'idle' | 'done' | 'failed';

const RESET_MS = 2000;

export type CopyCodeButtonProps = {
  /** The exact text put on the clipboard. */
  text: string;
  /** The idle button's accessible name; it reads "Copy". */
  label: string;
};

/** Copies `text`, shows the result for two seconds and announces it. */
export const CopyCodeButton = ({ text, label }: CopyCodeButtonProps) => {
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
    clearTimeout(timer.current);
    setState(next);
    timer.current = setTimeout(() => setState('idle'), RESET_MS);
  };

  const copy = () => {
    // A missing clipboard (outside a secure context, e.g. a dev server on a LAN address) or a
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
        ariaLabel={state === 'idle' ? label : undefined}
        prefix={state === 'done' ? CheckIcon : undefined}
        className={styles.copy}
        onClick={copy}
      >
        {state === 'idle' ? 'Copy' : message}
      </Button>
      <span role="status" className={styles.status}>
        {message}
      </span>
    </>
  );
};
