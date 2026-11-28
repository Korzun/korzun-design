/** Preview */
import { Card, Surface, useSurfaceRadius } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyle = createUseStyles((theme: Theme) => ({
  box: {
    border: `1px solid ${theme.color.border.default}`,
    padding: theme.space.lg,
  },
}));

const InsetBox = () => {
  const styles = useStyle();
  const borderRadius = useSurfaceRadius();
  return (
    <div className={styles.box} style={{ borderRadius }}>
      <Surface>
        <Button>Save</Button>
      </Surface>
    </div>
  );
};

export default function Preview() {
  return (
    <Card title="Settings">
      <InsetBox />
    </Card>
  );
}
