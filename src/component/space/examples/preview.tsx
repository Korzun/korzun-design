/** Preview */
import { Space } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyle = createUseStyles((theme: Theme) => ({
  block: {
    width: 64,
    height: 28,
    backgroundColor: theme.color.brand.light,
    border: `1px solid ${theme.color.brand.outline}`,
    borderRadius: theme.radius.md,
  },
}));

export default function Preview() {
  const styles = useStyle();
  return (
    <Space align="start" gap="xxl">
      <Space>
        <div className={styles.block} />
        <div className={styles.block} />
        <div className={styles.block} />
      </Space>
      <Space direction="vertical">
        <div className={styles.block} />
        <div className={styles.block} />
        <div className={styles.block} />
      </Space>
    </Space>
  );
}
