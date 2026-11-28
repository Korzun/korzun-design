/** Basic
 * A row of buttons, spaced with no `gap` prop. Children sit on one line and
 * are centred vertically.
 */
import { Space } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [saved, setSaved] = useState(0);
  return (
    <Space>
      <Button type="primary" onClick={() => setSaved((n) => n + 1)}>
        Save
      </Button>
      <Button onClick={() => setSaved(0)}>Reset</Button>
      <span>Saved: {saved}</span>
    </Space>
  );
}
