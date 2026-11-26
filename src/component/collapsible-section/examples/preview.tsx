/** Preview */
import { CollapsibleSection, Stack, Text } from '@korzun/design/component';

export default function Preview() {
  return (
    <CollapsibleSection title="Archived" subTitle="3 items" open>
      <Stack gap="xs">
        <Text>Middlemarch</Text>
        <Text>Bleak House</Text>
        <Text>Persuasion</Text>
      </Stack>
    </CollapsibleSection>
  );
}
