/** Loading and disabled
 * `loading` shows a spinner and blocks clicks; `disabled` greys the item out.
 * The label can change between renders (`Save` to `Saving…`) without
 * remounting the button. Both switches hold their state on.
 */
import { Stack, Text } from '@korzun/design/component';
import { PageFooterActions, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function LoadingAndDisabled() {
  const [saving, setSaving] = useState(true);
  const [invalid, setInvalid] = useState(true);
  const [last, setLast] = useState('nothing yet');
  return (
    <Stack>
      <Switch name="saving" label="Saving" checked={saving} onChange={setSaving} />
      <Switch name="invalid" label="Form invalid" checked={invalid} onChange={setInvalid} />
      <PageFooterActions
        items={[
          { label: 'Cancel', onClick: () => setLast('Cancel'), disabled: saving },
          {
            label: saving ? 'Saving…' : 'Save',
            onClick: () => setLast('Save'),
            emphasis: true,
            loading: saving,
            disabled: invalid,
          },
        ]}
      />
      <Text tone="muted">Last pressed: {last}</Text>
    </Stack>
  );
}
