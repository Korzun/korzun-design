/** Preview */
import { Inline } from '@korzun/design/component';
import { Button } from '@korzun/design/control';

export default function Preview() {
  return (
    <Inline>
      <Button type="primary" onClick={() => {}}>
        Primary
      </Button>
      <Button onClick={() => {}}>Default</Button>
    </Inline>
  );
}
