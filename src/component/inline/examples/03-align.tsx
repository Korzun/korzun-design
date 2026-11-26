/** Align
 * `align` sets the vertical placement of children of different heights.
 * `center` is the usual choice; `baseline` lines up text of different sizes.
 */
import { Heading, Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';

const aligns = ['center', 'start', 'end', 'baseline', 'stretch'] as const;

export default function Align() {
  return (
    <Stack gap="lg">
      {aligns.map((align) => (
        <Stack key={align} gap="xs">
          <Text size="sm" tone="muted">
            {`align="${align}"`}
          </Text>
          <Inline align={align}>
            <Text size="sm">Small</Text>
            <Heading level={1}>Large</Heading>
            <Button>Action</Button>
          </Inline>
        </Stack>
      ))}
    </Stack>
  );
}
