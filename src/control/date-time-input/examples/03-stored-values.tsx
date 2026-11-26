/** Stored values
 * `value` is an ISO 8601 string as a server stores it, and the inputs re-sync when it
 * changes. A year or year-month shows as the 1st of the period, a timestamp shows in UTC
 * (22:30 at -05:00 is 03:30 the next day), and an unreadable string or `''` shows as empty.
 * Pick a sample, then edit the date to see what `onChange` sends back.
 */
import { Stack, Text } from '@korzun/design/component';
import { DateTimeInput, SegmentedControl } from '@korzun/design/control';
import { useState } from 'react';

const SAMPLES = [
  { value: '2023', label: 'Year' },
  { value: '2023-06', label: 'Month' },
  { value: '2023-06-06', label: 'Day' },
  { value: '2015-08-04T22:30:00-05:00', label: 'Timestamp' },
  { value: 'June 2023', label: 'Unreadable' },
  { value: '', label: 'None' },
] as const;

export default function StoredValues() {
  const [value, setValue] = useState<string | undefined>('2023-06');
  return (
    <Stack>
      <SegmentedControl
        label="Stored value"
        options={SAMPLES}
        value={value ?? null}
        onChange={setValue}
      />
      <DateTimeInput name="stored" label="Publish date" value={value} onChange={setValue} />
      <Text tone="muted">Value: {value === undefined ? 'undefined' : `'${value}'`}</Text>
    </Stack>
  );
}
