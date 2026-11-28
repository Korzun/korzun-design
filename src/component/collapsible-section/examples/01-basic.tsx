/** Basic
 * Without `open` the section keeps its own state and starts closed. `subTitle`
 * is faint text after the title, such as a count; the header toggles on click,
 * Enter or Space.
 */
import { CollapsibleSection, Space, Text } from '@korzun/design/component';

export default function Basic() {
  return (
    <CollapsibleSection title="Archived" subTitle="3 items">
      <Space direction="vertical" gap="xs">
        <Text>Middlemarch</Text>
        <Text>Bleak House</Text>
        <Text>Persuasion</Text>
      </Space>
    </CollapsibleSection>
  );
}
