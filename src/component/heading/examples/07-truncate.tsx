/** Truncate
 * `truncate` clips a long title to one line with an ellipsis. Beside an
 * action in an `Inline`, the title shrinks and the button keeps its width.
 */
import { Heading, Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

const title =
  'Middlemarch: A Study of Provincial Life, in Eight Books, with a Prelude and a Finale, Followed by an Extended Note on the Text, a Chronology, a Map of the Midlands, and a Glossary of Provincial Terms';

export default function Truncate() {
  const [opened, setOpened] = useState(0);
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          Without truncate
        </Text>
        <Heading level={3}>{title}</Heading>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          With truncate, beside an action
        </Text>
        <Inline justify="between">
          <Heading level={3} truncate>
            {title}
          </Heading>
          <Button type="primary" onClick={() => setOpened((n) => n + 1)}>
            Open
          </Button>
        </Inline>
        <Text size="sm" tone="muted">
          Opened: {opened}
        </Text>
      </Stack>
    </Stack>
  );
}
