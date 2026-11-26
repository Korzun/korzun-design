/** What counts as empty
 * `undefined`, `null`, `false` and `''` render nothing, not an empty alert.
 * `0` is not empty and renders.
 */
import { ErrorMessage, Inline, Stack, Text } from '@korzun/design/component';

export default function EmptyChildren() {
  return (
    <Stack gap="sm">
      <Inline>
        <Text tone="muted" size="sm">
          undefined:
        </Text>
        <ErrorMessage>{undefined}</ErrorMessage>
      </Inline>
      <Inline>
        <Text tone="muted" size="sm">
          null:
        </Text>
        <ErrorMessage>{null}</ErrorMessage>
      </Inline>
      <Inline>
        <Text tone="muted" size="sm">
          false:
        </Text>
        <ErrorMessage>{false}</ErrorMessage>
      </Inline>
      <Inline>
        <Text tone="muted" size="sm">
          empty string:
        </Text>
        <ErrorMessage>{''}</ErrorMessage>
      </Inline>
      <Inline>
        <Text tone="muted" size="sm">
          0:
        </Text>
        <ErrorMessage>{0}</ErrorMessage>
      </Inline>
    </Stack>
  );
}
