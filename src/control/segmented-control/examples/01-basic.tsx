/** Basic
 * A few short text options. Declare them `as const` so `value` and `onChange`
 * are typed to the option values. The `label` names the group for assistive tech
 * and is not drawn, so put a visible label beside the control yourself.
 */
import { Stack, Text } from '@korzun/design/component';
import { SegmentedControl } from '@korzun/design/control';
import { useState } from 'react';

const SORTS = [
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'added', label: 'Added' },
] as const;

export default function Basic() {
  const [sort, setSort] = useState<(typeof SORTS)[number]['value']>('title');
  return (
    <Stack>
      <Text tone="muted">Sort by</Text>
      <SegmentedControl label="Sort by" options={SORTS} value={sort} onChange={setSort} />
      <Text tone="muted">Sorted by: {sort}</Text>
    </Stack>
  );
}
