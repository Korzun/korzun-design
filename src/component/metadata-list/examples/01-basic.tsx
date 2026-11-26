/** Basic
 * The body of a `Card` describing one record: short text values and a small `Tag` as a value. The header action flips the grayscale entry.
 */
import { Card, MetadataList, Tag } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [grayscale, setGrayscale] = useState(false);
  return (
    <Card
      title="Kindle Scribe"
      headerAction={
        <Button type="link" onClick={() => setGrayscale((on) => !on)}>
          Toggle grayscale
        </Button>
      }
    >
      <MetadataList
        metadata={[
          { title: 'Slug', value: 'my-kindle' },
          { title: 'Cover size', value: '1860×2480' },
          { title: 'Grayscale cover', value: grayscale ? 'Yes' : 'No' },
          {
            title: 'Status',
            value: (
              <Tag size="sm" tone="success">
                Active
              </Tag>
            ),
          },
        ]}
      />
    </Card>
  );
}
