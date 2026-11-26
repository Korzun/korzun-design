/** Without a label
 * A field with no visible `label` takes `ariaLabel`, so assistive tech can
 * still name it. With a `label`, the label names the field instead.
 */
import { Inline, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function WithoutLabel() {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  return (
    <Inline>
      <TextInput
        name="filter"
        layout="inline"
        ariaLabel="Filter books"
        placeholder="Filter books"
        value={filter}
        onChange={setFilter}
      />
      <Text tone="muted">Filter: {filter === undefined ? 'none' : `“${filter}”`}</Text>
    </Inline>
  );
}
