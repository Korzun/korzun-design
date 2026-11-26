/** Surfaces
 * The corners and elevation follow where the select sits, so none of these
 * passes `surface`: `'page'` directly on a `Page` (16px, with a shadow),
 * `'card'` in a `Card` (8px, flat), `'inset'` in a `Card` inside a `Card` (4px, flat).
 */
import { Card, Page, Stack, Text } from '@korzun/design/component';
import { Select } from '@korzun/design/control';
import { useState } from 'react';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Fig'];

export default function Surfaces() {
  const [onPage, setOnPage] = useState<string | undefined>('Apple');
  const [inCard, setInCard] = useState<string | undefined>('Banana');
  const [nested, setNested] = useState<string | undefined>('Cherry');
  return (
    <Page type="minimal">
      <Stack>
        <Text tone="muted">On a Page: page</Text>
        <Select name="on-page" value={onPage} options={FRUITS} onChange={setOnPage} />
        <Card title="In a Card: card">
          <Select name="in-card" value={inCard} options={FRUITS} onChange={setInCard} />
          <Card title="In a Card in a Card: inset">
            <Select name="nested" value={nested} options={FRUITS} onChange={setNested} />
          </Card>
        </Card>
      </Stack>
    </Page>
  );
}
