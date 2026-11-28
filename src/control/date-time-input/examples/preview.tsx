/** Preview */
import { DateTimeInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Preview() {
  const [value, setValue] = useState<string | undefined>('2023-06-06T09:30');
  return (
    <DateTimeInput
      name="publishDate"
      label="Publish date"
      layout="vertical"
      value={value}
      onChange={setValue}
    />
  );
}
