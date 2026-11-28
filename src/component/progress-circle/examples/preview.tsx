/** Preview */
import { ProgressCircle, Space } from '@korzun/design/component';

export default function Preview() {
  return (
    <Space gap="xl">
      <ProgressCircle
        value={0.6}
        size={48}
        label="none"
        ariaLabel="Reading progress for Middlemarch"
      />
      <ProgressCircle
        value={0.6}
        size={48}
        variant="outline"
        label="inside"
        ariaLabel="Reading progress for Villette"
      />
      <ProgressCircle
        value={0.9}
        size={48}
        variant="outline"
        tone="success"
        label="none"
        ariaLabel="Reading progress for Persuasion"
      />
    </Space>
  );
}
