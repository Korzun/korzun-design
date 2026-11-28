/** In a heading
 * `Code` scales with its heading, so a name stays in proportion at every level.
 */
import { Code, Heading, Space } from '@korzun/design/component';

export default function InAHeading() {
  return (
    <Space direction="vertical" gap="sm">
      <Heading level={1}>
        The <Code>Table</Code> component
      </Heading>
      <Heading level={2}>
        The <Code>Table</Code> component
      </Heading>
      <Heading level={3}>
        The <Code>Table</Code> component
      </Heading>
    </Space>
  );
}
