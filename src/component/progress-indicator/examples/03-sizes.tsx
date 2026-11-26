/** Sizes
 * `size` is the width and height of the pie in px. The label's font size does not scale with it. Each is labelled with its `size`.
 */
import { Inline, ProgressIndicator, Stack, Text } from '@korzun/design/component';

export default function Sizes() {
  return (
    <Stack gap="sm">
      <Inline>
        <ProgressIndicator value={0.6} ariaLabel="Reading progress, 14" size={14} />
        <Text tone="muted">size 14</Text>
      </Inline>
      <Inline>
        <ProgressIndicator value={0.6} ariaLabel="Reading progress, 24" size={24} />
        <Text tone="muted">size 24</Text>
      </Inline>
      <Inline>
        <ProgressIndicator value={0.6} ariaLabel="Reading progress, 40" size={40} />
        <Text tone="muted">size 40</Text>
      </Inline>
      <Inline>
        <ProgressIndicator value={0.6} ariaLabel="Reading progress, 64" size={64} />
        <Text tone="muted">size 64</Text>
      </Inline>
    </Stack>
  );
}
