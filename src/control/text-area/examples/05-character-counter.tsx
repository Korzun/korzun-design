/** Character counter
 * `maxLength` limits the text natively. The `n/max` counter appears once the field is
 * within the last 10% of the limit (at least 50 characters) and turns red at the limit.
 * The first field is inside that window, the second is at the limit.
 */
import { Space } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useState } from 'react';

export default function CharacterCounter() {
  const [near, setNear] = useState<string | undefined>(
    'A short summary of the book that is already past halfway.'
  );
  const [full, setFull] = useState<string | undefined>(
    'A short summary of the book that fills every one of the characters allowed.'
  );
  return (
    <Space direction="vertical">
      <TextArea
        name="near"
        layout="vertical"
        label="Near the limit"
        maxLength={100}
        value={near}
        onChange={setNear}
      />
      <TextArea
        name="full"
        layout="vertical"
        label="At the limit"
        maxLength={75}
        value={full}
        onChange={setFull}
      />
    </Space>
  );
}
