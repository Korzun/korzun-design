/** Status tones
 * Status tones report a state: `success`, `warning`, `danger`, `info`, and `neutral` for a state with no meaning to signal. Each tag is labelled with its tone.
 */
import { Inline, Stack, Tag, Text } from '@korzun/design/component';

export default function StatusTones() {
  return (
    <Stack gap="sm" align="start">
      <Inline>
        <Tag tone="success">Published</Tag>
        <Text tone="muted">success: something went well</Text>
      </Inline>
      <Inline>
        <Tag tone="warning">Overdue</Tag>
        <Text tone="muted">warning: needs attention soon</Text>
      </Inline>
      <Inline>
        <Tag tone="danger">Failed</Tag>
        <Text tone="muted">danger: something failed or is blocked</Text>
      </Inline>
      <Inline>
        <Tag tone="info">Scheduled</Tag>
        <Text tone="muted">info: neutral news</Text>
      </Inline>
      <Inline>
        <Tag tone="neutral">No change</Tag>
        <Text tone="muted">neutral: a state with no category</Text>
      </Inline>
    </Stack>
  );
}
