/** Wrap and justify
 * `justify="between"` pushes the first and last child to opposite edges, as in
 * a title with an action. `wrap` lets a row of chips flow onto further lines
 * instead of overflowing.
 */
import { Heading, Space, Tag } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function WrapAndJustify() {
  const [all, setAll] = useState(false);
  return (
    <Space direction="vertical" gap="sm">
      <Space justify="between">
        <Heading level={3}>Currently reading</Heading>
        <Button type="link" onClick={() => setAll((value) => !value)}>
          {all ? 'Show less' : 'See all'}
        </Button>
      </Space>
      <Space wrap gap="xs">
        <Tag>Fiction</Tag>
        <Tag tone="author">George Eliot</Tag>
        {all && <Tag>Classic</Tag>}
        {all && <Tag>1871</Tag>}
      </Space>
    </Space>
  );
}
