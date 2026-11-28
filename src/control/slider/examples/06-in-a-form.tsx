/** In a form
 * `name` submits the value with the form through a hidden input. Submit shows what the form sent.
 */
import { Card, Space, Text } from '@korzun/design/component';
import { Button, Slider } from '@korzun/design/control';
import { type FormEvent, useState } from 'react';

export default function InAForm() {
  const [goal, setGoal] = useState(20);
  const [sent, setSent] = useState<string | null>(null);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(String(new FormData(e.currentTarget).get('goal')));
  };
  return (
    <Card title="Reading goal">
      <form onSubmit={submit}>
        <Space direction="vertical">
          <Text>Books this year: {goal}</Text>
          <Slider
            value={goal}
            onChange={setGoal}
            min={0}
            max={52}
            name="goal"
            startLabel="0"
            endLabel="52"
            ariaLabel="Books this year"
          />
          <Space justify="end">
            <Button type="primary" submit>
              Save
            </Button>
          </Space>
          {sent !== null && <Text tone="muted">Sent goal={sent}</Text>}
        </Space>
      </form>
    </Card>
  );
}
