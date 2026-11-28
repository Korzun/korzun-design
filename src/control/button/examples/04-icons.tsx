/** Icons
 * `prefix` and `suffix` take an icon component (`prefix={SearchIcon}`), not an
 * element. An icon-only button needs an `ariaLabel` so it has an accessible name.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { ChevronIcon, SearchIcon, SettingsIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function Icons() {
  const [pressed, setPressed] = useState('nothing yet');
  return (
    <Stack align="start">
      <Inline wrap>
        <Button prefix={SearchIcon} onClick={() => setPressed('Search')}>
          Search
        </Button>
        <Button type="primary" suffix={ChevronIcon} onClick={() => setPressed('Next')}>
          Next
        </Button>
        <Button prefix={SettingsIcon} ariaLabel="Settings" onClick={() => setPressed('Settings')} />
      </Inline>
      <Text tone="muted">Pressed: {pressed}</Text>
    </Stack>
  );
}
