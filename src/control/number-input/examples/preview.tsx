/** Preview */
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Preview() {
  const [pages, setPages] = useState<number | undefined>(42);
  return <NumberInput name="pages" label="Pages" value={pages} onChange={setPages} />;
}
