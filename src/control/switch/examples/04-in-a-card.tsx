/** In a Card
 * A setting row in the body takes the default `inset` track. A switch in the
 * header, with no nearby corner, takes `radius="pill"`; with no visible label it
 * needs an `ariaLabel`.
 */
import { Card, Stack, Text } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function InACard() {
  const [isSeries, setIsSeries] = useState(false);
  const [bwCover, setBwCover] = useState(true);
  return (
    <Card
      title="Series"
      headerAction={
        <Switch
          name="isSeries"
          ariaLabel="Part of a series"
          radius="pill"
          checked={isSeries}
          onChange={setIsSeries}
        />
      }
    >
      <Stack>
        <Switch
          name="bwCover"
          label="Grayscale"
          layout="horizontal"
          description="Convert the cover to grayscale for monochrome screens."
          checked={bwCover}
          onChange={setBwCover}
        />
        <Text tone="muted">Part of a series: {isSeries ? 'yes' : 'no'}</Text>
      </Stack>
    </Card>
  );
}
