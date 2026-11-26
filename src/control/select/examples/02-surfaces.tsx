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
      <Stack gap="xl">
        <Stack gap="xs">
          <Text size="sm" tone="muted">
            On a Page: 'page'
          </Text>
          <Select name="on-page" value={onPage} options={FRUITS} onChange={setOnPage} />
        </Stack>
        <Card title="In a Card">
          <Stack gap="xl">
            <Stack gap="xs">
              <Text size="sm" tone="muted">
                In a Card: 'card'
              </Text>
              <Select name="in-card" value={inCard} options={FRUITS} onChange={setInCard} />
            </Stack>
            <Card title="In a Card in a Card">
              <Stack gap="xs">
                <Text size="sm" tone="muted">
                  In a Card in a Card: 'inset'
                </Text>
                <Select name="nested" value={nested} options={FRUITS} onChange={setNested} />
              </Stack>
            </Card>
          </Stack>
        </Card>
      </Stack>
    </Page>
  );
}
