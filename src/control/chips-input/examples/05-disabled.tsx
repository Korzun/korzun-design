/** Disabled
 * `disabled` blocks typing and hides the chips' remove buttons. A switch
 * toggles it so both states can be tried.
 */
import { Space } from '@korzun/design/component';
import { ChipsInput, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Disabled() {
  const [disabled, setDisabled] = useState(true);
  const [value, setValue] = useState(['Cherry', 'Date']);
  return (
    <Space direction="vertical">
      <Switch name="disabled" label="Disabled" checked={disabled} onChange={setDisabled} />
      <ChipsInput
        value={value}
        suggestions={['Apple', 'Banana']}
        onChange={setValue}
        disabled={disabled}
        placeholder="Add fruit…"
      />
    </Space>
  );
}
