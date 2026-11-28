/** Disabled
 * `disabled` ignores the pointer and keys, leaves the tab order and greys the thumb. A switch toggles it.
 */
import { Space } from '@korzun/design/component';
import { Slider, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Disabled() {
  const [disabled, setDisabled] = useState(true);
  const [value, setValue] = useState(30);
  return (
    <Space direction="vertical">
      <Switch name="disabled" label="Disabled" checked={disabled} onChange={setDisabled} />
      <Slider
        value={value}
        onChange={setValue}
        detents={[{ value: 25 }, { value: 50 }, { value: 75 }]}
        disabled={disabled}
        ariaLabel="Volume"
      />
    </Space>
  );
}
