/** Preview */
import { Space, ProgressIndicator } from '@korzun/design/component';

export default function Preview() {
  return (
    <Space gap="lg">
      <ProgressIndicator value={0.25} size={40} ariaLabel="Reading progress for Persuasion" />
      <ProgressIndicator value={0.6} size={40} ariaLabel="Reading progress for Middlemarch" />
      <ProgressIndicator value={0.9} size={40} ariaLabel="Reading progress for Villette" />
    </Space>
  );
}
