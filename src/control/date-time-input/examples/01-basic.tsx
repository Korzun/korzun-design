/** Basic
 * A date with an optional time. Both come from the browser's native pickers; the time
 * box stays disabled until there is a date. `onChange` receives the recomposed ISO string,
 * not an event, and `undefined` once the date is cleared.
 */
import { Space, Text } from '@korzun/design/component';
import { DateTimeInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Space direction="vertical">
      <DateTimeInput name="publishDate" label="Publish date" value={value} onChange={setValue} />
      <Text tone="muted">Value: {value ?? 'undefined'}</Text>
    </Space>
  );
}
