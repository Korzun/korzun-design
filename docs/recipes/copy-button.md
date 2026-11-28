---
title: Copy button
description: A button that copies text, turns into Copied or Could not copy for two seconds, and announces the result.
category: Recipe
---

# Copy button

A button that puts text on the clipboard and says what happened. Copy the
`CopyButton` component into your app and pass it the `text` to copy.

<!-- generated:examples -->

## Examples

### Copy button

A connection URL in Code with a Copy button that turns into Copied, or Could not copy.

```tsx
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
```

<!-- /generated:examples -->

## Why it's built this way

- **A recipe, not a `Copy` component.** Where the button sits, what it copies
  and how it looks beside it change from place to place; the state machine is
  the only shared part, and it is short enough to own. `CodeBlock` carries the
  same logic for its own `copyable` button.
- **Three states.** Idle shows `Copy`. A successful write shows `Copied` with a
  `CheckIcon` prefix, and a failed one shows `Could not copy`; both return to
  idle after two seconds. Pressing again restarts the two seconds.
- **No toast.** The answer belongs where the press happened. A toast would
  appear away from the button and pile up if pressed repeatedly.
- **A `role="status"` region.** A label that changes in place is not reliably
  announced, so a visually hidden status region says `Copied` or `Could not
  copy`. It is always mounted, because a region added together with its text is
  often missed. The idle `ariaLabel` is dropped while the label shows the
  result, so the button's name never contradicts the announcement.
- **A missing clipboard counts as a failure.** `navigator.clipboard` is absent
  outside a secure context (a dev server on a LAN address), and `writeText` can
  reject when permission is denied; both show `Could not copy` and throw
  nothing.
- **Clean up on unmount.** One timer is cleared on every press and on unmount,
  and a write that settles after unmount does nothing.

## Keeping the width steady

`Copied` is wider than `Copy`, so a row with the button in the middle would
shift every time it changed. Either put the button last in its row, or give it a
`minWidth` in `em` wide enough for the longest label, `Could not copy` (`10em`
here; `Copied` with its check is shorter). `em` follows the button's font size, so it stays right if
the size changes.

## Wiring it up

- Pass the exact text to copy; the button's label never has to match it.
- For code, `CodeBlock` with `copyable` already includes this button.
