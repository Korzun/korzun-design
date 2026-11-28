/** Clearable and required
 * A set value shows a ✕ that sends `undefined` to `onChange`. Pass
 * `clearable={false}` for a required field, so it can only change to another option:
 * Shelf can be cleared; Home shelf cannot.
 */
import { Space } from '@korzun/design/component';
import { Select } from '@korzun/design/control';
import { useState } from 'react';

const SHELVES = ['To read', 'Reading', 'Finished'];

export default function Clearable() {
  const [optional, setOptional] = useState<string | undefined>('Reading');
  const [required, setRequired] = useState<string | undefined>('To read');
  return (
    <Space direction="vertical">
      <Select
        name="optional"
        label="Shelf"
        value={optional}
        options={SHELVES}
        onChange={setOptional}
      />
      <Select
        name="required"
        label="Home shelf"
        value={required}
        options={SHELVES}
        clearable={false}
        onChange={setRequired}
      />
    </Space>
  );
}
