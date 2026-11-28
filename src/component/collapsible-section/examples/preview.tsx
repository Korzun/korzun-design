/** Preview */
import { CollapsibleSection, Space, Text } from '@korzun/design/component';

export default function Preview() {
  return (
    <CollapsibleSection title="Archived" subTitle="3 items" open>
      <Space direction="vertical" gap="xs">
        <Text>Middlemarch</Text>
        <Text>Bleak House</Text>
        <Text>Persuasion</Text>
      </Space>
    </CollapsibleSection>
  );
}
