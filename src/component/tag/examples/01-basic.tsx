/** Basic
 * Chips beside a title: the label is the child. An author chip names a person; an unset `tone` suits a subject or keyword.
 */
import { Inline, Tag, Text } from '@korzun/design/component';

export default function Basic() {
  return (
    <Inline>
      <Text weight="semibold">Middlemarch</Text>
      <Tag tone="author">George Eliot</Tag>
      <Tag>Fiction</Tag>
    </Inline>
  );
}
