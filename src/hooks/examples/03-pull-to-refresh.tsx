/** usePullToRefresh
 * The hook draws nothing: it reports a phase and an offset, and you draw the indicator. It reads
 * the page's rubber-band overscroll, so only a touch pull on iOS moves it; with a mouse the
 * phase stays `idle`. Releasing while `armed` runs `onRefresh` until its promise settles.
 * @viewport mobile
 */
import { Card, Spinner, Stack, Text } from '@korzun/design/component';
import { usePullToRefresh } from '@korzun/design/hooks';
import { useState } from 'react';

export default function PullToRefresh() {
  const [refreshes, setRefreshes] = useState(0);
  const { phase, offset } = usePullToRefresh(async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshes((n) => n + 1);
  });
  return (
    <Card title="Library">
      <Stack gap="sm">
        {phase === 'refreshing' ? <Spinner label="Refreshing" /> : null}
        <Text>
          Phase: {phase}, offset: {Math.round(offset)}px
        </Text>
        <Text tone="muted">Refreshed {refreshes} times</Text>
      </Stack>
    </Card>
  );
}
