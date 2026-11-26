/** Levels
 * `level` picks the element, `h1` to `h4`, and a default size and weight.
 * Keep the outline in order: one `h1` per page, no skipped levels.
 */
import { Heading, Stack } from '@korzun/design/component';

export default function Levels() {
  return (
    <Stack gap="sm">
      <Heading level={1}>Level 1: h1</Heading>
      <Heading level={2}>Level 2: h2</Heading>
      <Heading level={3}>Level 3: h3</Heading>
      <Heading level={4}>Level 4: h4</Heading>
    </Stack>
  );
}
