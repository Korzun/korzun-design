/** Decorative
 * Alone, a spinner needs a `label` that names the load: it is a `role="status"` that a screen reader announces. Beside text that already names the load, set `decorative` so it is hidden from assistive tech; `label` is then ignored.
 */
import { Inline, Spinner, Stack, Text } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Decorative() {
  const [decorative, setDecorative] = useState(true);
  return (
    <Stack>
      <Switch name="decorative" label="Decorative" checked={decorative} onChange={setDecorative} />
      <Inline gap="xs">
        <Spinner decorative={decorative} label="Loading books" />
        <Text>Loading books</Text>
      </Inline>
      <Text tone="muted">
        Screen readers: {decorative ? 'the spinner is hidden' : 'announce “Loading books” twice'}
      </Text>
    </Stack>
  );
}
