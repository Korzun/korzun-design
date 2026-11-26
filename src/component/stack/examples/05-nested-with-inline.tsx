/** Nested with Inline
 * Nest Stacks for sections with different gaps, and use `Inline` for each row.
 * The outer `xxl` gap separates sections; the inner `sm` gap groups a heading
 * with its content.
 */
import { Heading, Inline, Stack, Tag, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';

export default function NestedWithInline() {
  return (
    <Stack gap="xxl">
      <Stack as="section" gap="sm">
        <Inline justify="between">
          <Heading level={3}>Currently reading</Heading>
          <Button type="link">See all</Button>
        </Inline>
        <Inline wrap>
          <Tag>Fiction</Tag>
          <Tag tone="author">George Eliot</Tag>
        </Inline>
      </Stack>
      <Stack as="section" gap="sm">
        <Heading level={3}>Up next</Heading>
        <Text tone="muted">Nothing queued yet.</Text>
      </Stack>
    </Stack>
  );
}
