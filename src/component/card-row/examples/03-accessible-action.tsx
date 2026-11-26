/** Keyboard-reachable action
 * A row with `onClick` cannot be focused, so keyboard users cannot reach it. Put the action in a
 * real control inside the row: a link `Button` with an `ariaLabel` is focusable.
 */
import { CardRow, Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function AccessibleAction() {
  const [opened, setOpened] = useState<string | undefined>();
  const fileName = 'middlemarch.epub';
  return (
    <Stack>
      <CardRow>
        <Inline justify="between">
          {fileName}
          <Button type="link" ariaLabel={`Open ${fileName}`} onClick={() => setOpened(fileName)}>
            Open
          </Button>
        </Inline>
      </CardRow>
      <Text tone="muted">Opened: {opened ?? 'nothing yet'}</Text>
    </Stack>
  );
}
