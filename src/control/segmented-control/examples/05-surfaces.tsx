/** Surfaces
 * In a Card body the control paints its own track. In the shaded Card header the
 * header is the track, so `surface="row"` paints nothing and only the lens
 * shows. The corner is the same in both: the control belongs inside a card or
 * modal.
 */
import { Card, Stack, Text } from '@korzun/design/component';
import { SegmentedControl } from '@korzun/design/control';
import { useState } from 'react';

const VIEWS = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
] as const;

type View = (typeof VIEWS)[number]['value'];

export default function Surfaces() {
  const [body, setBody] = useState<View>('grid');
  const [header, setHeader] = useState<View>('list');
  return (
    <Stack>
      <Card title="surface card, in the body">
        <SegmentedControl label="Body view" options={VIEWS} value={body} onChange={setBody} />
      </Card>
      <Card
        title="surface row, in the header"
        headerAction={
          <SegmentedControl
            label="Header view"
            options={VIEWS}
            value={header}
            onChange={setHeader}
            surface="row"
          />
        }
      >
        <Text>Showing {header}.</Text>
      </Card>
    </Stack>
  );
}
