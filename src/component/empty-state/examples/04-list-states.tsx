/** A list's states on the page
 * Directly on the page background, as a sibling of the Cards: loading, a
 * load failure with `danger`, an empty list, and the rows once there are any.
 * The buttons switch the state.
 */
import { Card, EmptyState, Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

type State = 'loading' | 'error' | 'empty' | 'loaded';

const states: State[] = ['loading', 'error', 'empty', 'loaded'];

export default function ListStates() {
  const [state, setState] = useState<State>('empty');

  let list;
  if (state === 'loading') {
    list = <EmptyState title="Loading…" />;
  } else if (state === 'error') {
    list = <EmptyState title="Error loading requests" danger />;
  } else if (state === 'empty') {
    list = (
      <EmptyState title="No requests yet">Fill in the form above to ask for a book.</EmptyState>
    );
  } else {
    list = (
      <Card>
        <Text>Middlemarch by George Eliot</Text>
      </Card>
    );
  }

  return (
    <Stack>
      <Inline wrap>
        {states.map((s) => (
          <Button key={s} type={s === state ? 'primary' : 'default'} onClick={() => setState(s)}>
            {s}
          </Button>
        ))}
      </Inline>
      <Card title="New request">
        <Text tone="muted">Title and author go here.</Text>
      </Card>
      {list}
    </Stack>
  );
}
