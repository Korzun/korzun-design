/** Variants
 * `type` picks the look, not the HTML attribute. `primary` is the one main action,
 * `default` a secondary one, `text` a Cancel in a modal footer, `link` an inline
 * row action, and `dashed` an "add a row" affordance. The second row adds
 * `danger`, on `default` and on `primary`.
 */
import { Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Variants() {
  const [pressed, setPressed] = useState('nothing yet');
  return (
    <Space direction="vertical" align="start">
      <Space wrap>
        <Button type="primary" onClick={() => setPressed('Primary')}>
          Primary
        </Button>
        <Button onClick={() => setPressed('Default')}>Default</Button>
        <Button type="text" onClick={() => setPressed('Text')}>
          Text
        </Button>
        <Button type="link" onClick={() => setPressed('Link')}>
          Link
        </Button>
        <Button type="dashed" onClick={() => setPressed('Dashed')}>
          Dashed
        </Button>
      </Space>
      <Space wrap>
        <Button danger onClick={() => setPressed('Danger')}>
          Danger
        </Button>
        <Button type="primary" danger onClick={() => setPressed('Primary danger')}>
          Primary danger
        </Button>
      </Space>
      <Text tone="muted">Pressed: {pressed}</Text>
    </Space>
  );
}
