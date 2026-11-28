/** Character counter
 * `maxLength` limits the text natively. The `n/max` counter appears once the field is
 * within the last 10% of the limit (at least 10 characters) and turns red at the limit.
 * The first field is near its limit, the second is at it.
 */
import { Space } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function CharacterCounter() {
  const [near, setNear] = useState<string | undefined>('Short story collection, volume two');
  const [full, setFull] = useState<string | undefined>('Exactly thirty characters long');
  return (
    <Space direction="vertical">
      <TextInput
        name="near"
        layout="vertical"
        label="Near the limit"
        maxLength={40}
        value={near}
        onChange={setNear}
      />
      <TextInput
        name="full"
        layout="vertical"
        label="At the limit"
        maxLength={30}
        value={full}
        onChange={setFull}
      />
    </Space>
  );
}
