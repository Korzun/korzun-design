/** Basic
 * A controlled number field. `onChange` receives a number, not an event or the
 * text, and `undefined` once the field is emptied.
 */
import { Space, Text } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [pages, setPages] = useState<number | undefined>(42);
  return (
    <Space direction="vertical">
      <NumberInput name="pages" label="Pages" value={pages} onChange={setPages} />
      <Text tone="muted">Value: {pages === undefined ? 'undefined' : pages}</Text>
    </Space>
  );
}
