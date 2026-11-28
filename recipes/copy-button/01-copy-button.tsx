/**
 * Copy button
 *
 * A connection URL in Code with a Copy button that turns into Copied, or Could not copy.
 */
import { Code, Inline } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { CheckIcon } from '@korzun/design/icon';
import { createUseStyles } from '@korzun/design/theme';
import { useEffect, useRef, useState } from 'react';

// In your app this goes in a sibling style.ts.
const useStyle = createUseStyles({
  // Reserves the widest label ("Could not copy"), so the row keeps its width as the label changes.
  button: { minWidth: '10em' },
  // Visually hidden, but read aloud by screen readers.
  status: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
});

type State = 'idle' | 'done' | 'failed';

const RESET_MS = 2000;

// Copy this component into your app.
function CopyButton({ text }: { text: string }) {
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
        // The label is the name while idle; the changing text names it after.
        ariaLabel={state === 'idle' ? 'Copy' : undefined}
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
}

export default function CopyButtonExample() {
  return (
    <Inline gap="md">
      <Code>postgres://app@db.internal:5432/app</Code>
      <CopyButton text="postgres://app@db.internal:5432/app" />
    </Inline>
  );
}
