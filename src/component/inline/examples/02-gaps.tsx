/** Gaps
 * `gap` takes a key of the theme's `space` scale, or `none` for children
 * that bring their own spacing.
 */
import { Inline, Stack, Tag, Text } from '@korzun/design/component';

const gaps = [
  'none',
  'xxxs',
  'xxs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
  'xxxl',
  'xxxxl',
  'xxxxxl',
] as const;

export default function Gaps() {
  return (
    <Stack gap="sm">
      {gaps.map((gap) => (
        <Inline key={gap} gap="xl">
          <Text size="sm" tone="muted">
            {`gap="${gap}"`}
          </Text>
          <Inline gap={gap}>
            <Tag>One</Tag>
            <Tag>Two</Tag>
            <Tag>Three</Tag>
          </Inline>
        </Inline>
      ))}
    </Stack>
  );
}
