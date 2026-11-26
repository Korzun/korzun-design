/** Basic
 * An icon next to a text label is decorative, so it takes `aria-hidden`. A standalone icon that carries meaning takes `role="img"` and an `aria-label`. The button flips the state, and both icons follow it.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { AlertOctagonIcon, CheckIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function Basic() {
  const [valid, setValid] = useState(true);
  const Icon = valid ? CheckIcon : AlertOctagonIcon;
  return (
    <Stack gap="md" align="start">
      <Text size="sm" tone="muted">
        Decorative, beside a label
      </Text>
      <Inline gap="xs">
        <Icon width={15} height={15} aria-hidden />
        <Text>{valid ? 'Book is valid' : 'Book has problems'}</Text>
      </Inline>
      <Text size="sm" tone="muted">
        Standalone, named for screen readers
      </Text>
      <Icon width={24} height={24} role="img" aria-label={valid ? 'Valid' : 'Has problems'} />
      <Inline>
        <Button onClick={() => setValid(!valid)}>
          {valid ? 'Mark as broken' : 'Mark as valid'}
        </Button>
      </Inline>
    </Stack>
  );
}
