/** Align
 * `align` sets the vertical placement of children of different heights.
 * `center` is the usual choice; `baseline` lines up text of different sizes.
 */
import { Inline, Stack, Tag, Text } from '@korzun/design/component';

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
            <Text size="xxl">Large</Text>
            <Tag>Chip</Tag>
          </Inline>
        </Stack>
      ))}
    </Stack>
  );
}
