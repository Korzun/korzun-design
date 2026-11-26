/** Plain list with descriptions
 * `searchable={false}` opens a plain list driven by the arrow keys. Options can
 * be plain strings or `{ label, value, description }` objects, mixed in one list.
 */
import { Stack, Text } from '@korzun/design/component';
import { Select } from '@korzun/design/control';
import { useState } from 'react';

export default function PlainList() {
  const [fit, setFit] = useState<string | undefined>('contain');
  return (
    <Stack>
      <Select
        name="fit"
        label="Cover fit"
        value={fit}
        searchable={false}
        options={[
          { label: 'Contain', value: 'contain', description: 'Letterbox the cover' },
          { label: 'Cover', value: 'cover', description: 'Crop to fill the frame' },
          'stretch',
        ]}
        onChange={setFit}
      />
      <Text tone="muted">Value: {fit ?? 'nothing'}</Text>
    </Stack>
  );
}
