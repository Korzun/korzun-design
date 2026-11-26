/** The rendered element
 * `as` picks the element: `p`, `div` or `span`. Each one keeps `role="alert"`.
 */
import { ErrorMessage, Stack, Text } from '@korzun/design/component';

export default function As() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          {'as="p"'}
        </Text>
        <ErrorMessage as="p">Could not save the book.</ErrorMessage>
      </Stack>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          {'as="div"'}
        </Text>
        <ErrorMessage as="div">Could not save the book.</ErrorMessage>
      </Stack>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          {'as="span"'}
        </Text>
        <ErrorMessage as="span">Could not save the book.</ErrorMessage>
      </Stack>
    </Stack>
  );
}
