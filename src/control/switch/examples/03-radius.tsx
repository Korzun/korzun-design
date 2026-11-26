/** Radius
 * `inset` is the track corner for a switch in a shaded row: concentric with the
 * row's own corner. `pill` is the capsule for a switch with no nearby corner to
 * echo.
 */
import { Stack, Text } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Radius() {
  const [inset, setInset] = useState(true);
  const [pill, setPill] = useState(true);
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          radius="inset", in a shaded row
        </Text>
        <Switch
          name="inset"
          label="Inset track"
          layout="horizontal"
          radius="inset"
          checked={inset}
          onChange={setInset}
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          radius="pill", no corner nearby
        </Text>
        <Switch name="pill" label="Pill track" radius="pill" checked={pill} onChange={setPill} />
      </Stack>
    </Stack>
  );
}
