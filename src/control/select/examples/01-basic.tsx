/** Basic
 * A controlled single-value picker. Opening it swaps the trigger for a search
 * box; `onChange` receives the option's value, not an event, and the ✕ clears it.
 * Select has no `open` prop, so this demo clicks the trigger once on mount to
 * start open.
 */
import { Stack, Text } from '@korzun/design/component';
import { Select } from '@korzun/design/control';
import { useEffect, useRef, useState } from 'react';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Fig', 'Grape', 'Mango', 'Pear'];

export default function Basic() {
  const [fruit, setFruit] = useState<string | undefined>('Banana');
  const box = useRef<HTMLDivElement>(null);
  // Opens the list once on mount (the ref survives Strict Mode's second effect run).
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    box.current?.querySelector<HTMLElement>('[role="button"]')?.click();
  }, []);
  return (
    <Stack>
      <div ref={box}>
        <Select name="fruit" label="Fruit" value={fruit} options={FRUITS} onChange={setFruit} />
      </div>
      <Text tone="muted">Chosen: {fruit ?? 'nothing'}</Text>
    </Stack>
  );
}
