/** In a Card
 * A form field beside the others in a Card. Keep the composed string from
 * `onChange` in state and send that: native form data holds the date and the time as
 * two separate fields (`publishDate`, `publishDateTime`).
 */
import { Card, Stack, Text } from '@korzun/design/component';
import { Button, DateTimeInput } from '@korzun/design/control';
import { useState } from 'react';

export default function InACard() {
  const [publishDate, setPublishDate] = useState<string | undefined>('2023-06-06T16:30:00Z');
  const [sent, setSent] = useState<string | null>(null);
  return (
    <Card
      title="Publication"
      footer={
        <Button type="primary" onClick={() => setSent(publishDate ?? 'no date')}>
          Save
        </Button>
      }
    >
      <Stack>
        <DateTimeInput
          name="publishDate"
          label="Publish date"
          value={publishDate}
          onChange={setPublishDate}
        />
        {sent !== null && <Text tone="success">Sent: {sent}</Text>}
      </Stack>
    </Card>
  );
}
