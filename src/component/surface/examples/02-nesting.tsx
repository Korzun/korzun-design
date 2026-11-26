/** Nesting
 * Each hand-made box inside another sits one level deeper, so corners step down one radius per level and stop at `sm`. Each box shows the radius `useSurfaceRadius()` returned for where it sits.
 */
import { Card, Inline, Stack, Surface, Text, useSurfaceRadius } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState, type ReactNode } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  box: {
    border: `1px solid ${theme.color.border.default}`,
    padding: theme.space.lg,
  },
}));

const LevelBox = ({ name, children }: { name: string; children?: ReactNode }) => {
  const styles = useStyle();
  const borderRadius = useSurfaceRadius();
  const [taps, setTaps] = useState(0);
  return (
    <div className={styles.box} style={{ borderRadius }}>
      <Surface>
        <Stack gap="sm">
          <Inline>
            <Button onClick={() => setTaps((n) => n + 1)}>{name}</Button>
            <Text tone="muted">
              Radius {borderRadius}, taps: {taps}
            </Text>
          </Inline>
          {children}
        </Stack>
      </Surface>
    </div>
  );
};

export default function Nesting() {
  return (
    <Card title="Card">
      <LevelBox name="Box">
        <LevelBox name="Box in box">
          <LevelBox name="Box in box in box" />
        </LevelBox>
      </LevelBox>
    </Card>
  );
}
