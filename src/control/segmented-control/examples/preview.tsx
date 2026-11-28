/** Preview */
import { SegmentedControl } from '@korzun/design/control';
import { useState } from 'react';

const SORTS = [
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'added', label: 'Added' },
] as const;

export default function Preview() {
  const [sort, setSort] = useState<(typeof SORTS)[number]['value']>('title');
  return <SegmentedControl label="Sort by" options={SORTS} value={sort} onChange={setSort} />;
}
