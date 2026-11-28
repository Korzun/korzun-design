/** Preview */
import { Space, Chip } from '@korzun/design/component';

export default function Preview() {
  return (
    <Space>
      <Chip tone="success">Published</Chip>
      <Chip tone="author">George Eliot</Chip>
      <Chip tone="subject">Fiction</Chip>
    </Space>
  );
}
