/** In a heading
 * `Code` scales with its heading, so a name stays in proportion at every level.
 */
import { Code, Heading, Stack } from '@korzun/design/component';

export default function InAHeading() {
  return (
    <Stack gap="sm">
      <Heading level={1}>
        The <Code>Table</Code> component
      </Heading>
      <Heading level={2}>
        The <Code>Table</Code> component
      </Heading>
      <Heading level={3}>
        The <Code>Table</Code> component
      </Heading>
    </Stack>
  );
}
