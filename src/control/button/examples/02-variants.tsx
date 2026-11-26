/** Variants
 * `type` picks the look, not the HTML attribute. `primary` is the one main action,
 * `default` a secondary one, `text` a Cancel in a modal footer, `link` an inline
 * row action, and `dashed` an "add a row" affordance.
 */
import { Inline, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Variants() {
  const [pressed, setPressed] = useState('nothing yet');
  return (
    <Inline wrap>
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
      <Text tone="muted">Pressed: {pressed}</Text>
    </Inline>
  );
}
