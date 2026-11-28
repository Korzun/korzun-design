/** Basic
 * Chips beside a title: the label is the child. An author chip names a person; a subject or keyword chip needs no `tone`.
 */
import { Space, Tag, Text } from '@korzun/design/component';

export default function Basic() {
  return (
    <Space>
      <Text weight="semibold">Middlemarch</Text>
      <Tag tone="author">George Eliot</Tag>
      <Tag>Fiction</Tag>
    </Space>
  );
}
