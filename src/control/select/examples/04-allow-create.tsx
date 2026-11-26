/** Creating a value
 * `allowCreate` adds an "Add: …" entry when what you type matches no label
 * exactly. Choosing it passes the trimmed text to `onChange`, and the typed value
 * then shows as the raw string because it is not in `options`.
 */
import { Stack, Text } from '@korzun/design/component';
import { Select } from '@korzun/design/control';
import { useState } from 'react';

const SERIES = ['Discworld', 'The Expanse', 'Earthsea'];

export default function AllowCreate() {
  const [series, setSeries] = useState<string | undefined>();
  return (
    <Stack>
      <Select
        name="series"
        label="Series"
        layout="vertical"
        placeholder="Pick or type a series…"
        value={series}
        options={SERIES}
        allowCreate
        onChange={setSeries}
      />
      <Text tone="muted">Chosen: {series ?? 'nothing'}</Text>
    </Stack>
  );
}
