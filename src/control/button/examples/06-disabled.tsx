/** Disabled
 * `disabled` greys the button out, shows a not-allowed cursor, blocks clicks and
 * takes it out of the tab order. Every type has a disabled look, `danger`
 * included. The switch enables Save.
 */
import { Space } from '@korzun/design/component';
import { Button, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Disabled() {
  const [changed, setChanged] = useState(false);
  return (
    <Space direction="vertical" align="start">
      <Space wrap>
        <Button type="primary" disabled>
          Primary
        </Button>
        <Button disabled>Default</Button>
        <Button type="dashed" disabled>
          Dashed
        </Button>
        <Button type="text" disabled>
          Text
        </Button>
        <Button type="link" disabled>
          Link
        </Button>
      </Space>
      <Space wrap>
        <Button danger disabled>
          Danger
        </Button>
        <Button type="primary" danger disabled>
          Primary danger
        </Button>
      </Space>
      <Space wrap>
        <Switch name="changed" label="Has changes" checked={changed} onChange={setChanged} />
        <Button type="primary" disabled={!changed} onClick={() => setChanged(false)}>
          Save
        </Button>
      </Space>
    </Space>
  );
}
