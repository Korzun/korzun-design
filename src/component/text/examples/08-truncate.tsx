/** Truncate
 * `truncate` clips to one line with an ellipsis. Beside an action in an
 * `Inline`, the title shrinks and the button keeps its width; a title above
 * a meta line in a `Stack` shrinks with the row.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

const title =
  'Middlemarch: A Study of Provincial Life, in Eight Books, with a Prelude and a Finale, Followed by an Extended Note on the Text, a Chronology, a Map of the Midlands, and a Glossary of Provincial Terms';

export default function Truncate() {
  const [opened, setOpened] = useState(0);
  return (
    <Stack gap="xl">
      <Inline justify="between">
        <Text truncate weight="semibold">
          {title}
        </Text>
        <Button type="primary" onClick={() => setOpened((n) => n + 1)}>
          Open
        </Button>
      </Inline>
      <Inline justify="between">
        <Stack gap="none">
          <Text truncate weight="semibold">
            {title}
          </Text>
          <Text size="sm" tone="muted">
            George Eliot. Opened: {opened}
          </Text>
        </Stack>
        <Button type="primary" onClick={() => setOpened((n) => n + 1)}>
          Open
        </Button>
      </Inline>
    </Stack>
  );
}
