/** Basic
 * A controlled tag box in a `Card`. Typing filters the suggestions and Enter
 * adds the highlighted one, or the typed text; Backspace on an empty field
 * removes the last chip. `onChange` receives the whole new array, not an event.
 */
import { Card, Space, Text } from '@korzun/design/component';
import { ChipsInput } from '@korzun/design/control';
import { useState } from 'react';

const SUBJECTS = ['Astronomy', 'Biology', 'Cooking', 'History', 'Poetry', 'Travel'];

export default function Basic() {
  const [subjects, setSubjects] = useState(['History']);
  return (
    <Card title="Subjects">
      <Space direction="vertical">
        <ChipsInput
          value={subjects}
          suggestions={SUBJECTS}
          onChange={setSubjects}
          placeholder="Add subject…"
        />
        <Text tone="muted">Chosen: {subjects.join(', ') || 'nothing'}</Text>
      </Space>
    </Card>
  );
}
