/** Basic
 * One `primary` action for the main step and a `default` button beside it.
 * `onClick` takes no arguments: the button passes no event.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [saves, setSaves] = useState(0);
  return (
    <Stack align="start">
      <Inline>
        <Button onClick={() => setSaves(0)}>Reset</Button>
        <Button type="primary" onClick={() => setSaves((n) => n + 1)}>
          Save
        </Button>
      </Inline>
      <Text tone="muted">Saves: {saves}</Text>
    </Stack>
  );
}
