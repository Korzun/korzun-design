/** Basic
 * A hand-made bordered box inside a `Card`. The box reads its own radius from `useSurfaceRadius()` and wraps its contents in `Surface`, so the Button inside is one corner step smaller than the box.
 */
import { Card, Space, Surface, Text, useSurfaceRadius } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState, type ReactNode } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  box: {
    border: `1px solid ${theme.color.border.default}`,
    padding: theme.space.lg,
  },
}));

const InsetBox = ({ children }: { children: ReactNode }) => {
  const styles = useStyle();
  const borderRadius = useSurfaceRadius();
  return (
    <div className={styles.box} style={{ borderRadius }}>
      <Surface>{children}</Surface>
    </div>
  );
};

export default function Basic() {
  const [saves, setSaves] = useState(0);
  return (
    <Card title="Settings">
      <InsetBox>
        <Space direction="vertical" gap="sm">
          <Text>
            Your own box: its corners follow the card, and the button inside is one step smaller.
          </Text>
          <Space>
            <Button onClick={() => setSaves((n) => n + 1)}>Save</Button>
          </Space>
          <Text tone="muted">Saves: {saves}</Text>
        </Space>
      </InsetBox>
    </Card>
  );
}
