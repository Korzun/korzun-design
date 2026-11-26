/** Sizes
 * `size` takes a `fontSize` token and sets the spinner to that many `em`. Each spinner is labelled with its size.
 */
import { Inline, Stack, Spinner, Text } from '@korzun/design/component';

export default function Sizes() {
  return (
    <Stack gap="sm">
      <Inline>
        <Spinner size="xxs" label="Loading, xxs" />
        <Text tone="muted">xxs</Text>
      </Inline>
      <Inline>
        <Spinner size="xs" label="Loading, xs" />
        <Text tone="muted">xs</Text>
      </Inline>
      <Inline>
        <Spinner size="sm" label="Loading, sm" />
        <Text tone="muted">sm</Text>
      </Inline>
      <Inline>
        <Spinner size="md" label="Loading, md" />
        <Text tone="muted">md</Text>
      </Inline>
      <Inline>
        <Spinner size="lg" label="Loading, lg" />
        <Text tone="muted">lg</Text>
      </Inline>
      <Inline>
        <Spinner size="xl" label="Loading, xl" />
        <Text tone="muted">xl</Text>
      </Inline>
      <Inline>
        <Spinner size="xxl" label="Loading, xxl" />
        <Text tone="muted">xxl</Text>
      </Inline>
    </Stack>
  );
}
