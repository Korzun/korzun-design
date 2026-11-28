/** Preview */
import { Space } from '@korzun/design/component';
import { Button } from '@korzun/design/control';

export default function Preview() {
  return (
    <Space>
      <Button type="primary" onClick={() => {}}>
        Primary
      </Button>
      <Button onClick={() => {}}>Default</Button>
    </Space>
  );
}
