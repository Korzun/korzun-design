/** In a card form
 * A `Select` with no label sits directly on the `Page` and labelled ones in the
 * `Card`. Fit is a required plain list; Series takes new values with
 * `allowCreate` and shows `loading` while its options arrive. The selections are
 * state, so submit `value`: native form data never carries it.
 */
import { Card, Page, Space, Text } from '@korzun/design/component';
import { Button, Select } from '@korzun/design/control';
import { useEffect, useState } from 'react';

const LIBRARIES = ['Home library', 'Work library'];

export default function FormInCard() {
  const [library, setLibrary] = useState<string | undefined>();
  const [fit, setFit] = useState<string | undefined>('contain');
  const [series, setSeries] = useState<string | undefined>();
  const [seriesNames, setSeriesNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<string | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSeriesNames(['Discworld', 'The Expanse']);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Page type="minimal">
      <Space direction="vertical">
        <Select
          name="library"
          placeholder="Select library…"
          value={library}
          options={LIBRARIES}
          onChange={setLibrary}
        />
        <Card
          title="Cover"
          footer={
            <Button
              type="primary"
              onClick={() => setSaved(`${fit ?? ''} / ${series ?? 'no series'}`)}
            >
              Save
            </Button>
          }
        >
          <Space direction="vertical">
            <Select
              name="coverFit"
              label="Fit"
              value={fit}
              options={[
                { label: 'Contain', value: 'contain', description: 'Letterbox the cover' },
                { label: 'Cover', value: 'cover' },
              ]}
              searchable={false}
              clearable={false}
              onChange={setFit}
            />
            <Select
              name="seriesName"
              label="Series"
              value={series}
              options={seriesNames}
              loading={loading}
              allowCreate
              onChange={setSeries}
            />
            {saved !== null && <Text tone="success">Saved: {saved}</Text>}
          </Space>
        </Card>
      </Space>
    </Page>
  );
}
