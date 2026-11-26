/** Basic
 * A frosted band fixed to the top of the viewport that blurs content under the
 * device status bar and fades to nothing below it. Render it only in the
 * installed app: the switch stands in for the `isStandalone()` check.
 * @viewport mobile
 */
import { Stack, Text, TopFade } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [installed, setInstalled] = useState(true);
  return (
    <>
      {installed && <TopFade />}
      <Stack>
        <Text>Scroll content under the fade band, line 1.</Text>
        <Text>Scroll content under the fade band, line 2.</Text>
        <Switch
          name="installed"
          label="Installed app"
          checked={installed}
          onChange={setInstalled}
        />
      </Stack>
    </>
  );
}
