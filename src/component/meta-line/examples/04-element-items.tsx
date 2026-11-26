/** Elements as items
 * An item can be any node, such as a `time` element or a `Tag`.
 */
import { MetaLine, Tag, Text } from '@korzun/design/component';

export default function ElementItems() {
  return (
    <Text as="div" size="sm" tone="faint">
      <MetaLine
        items={[
          <time key="added" dateTime="2026-03-12">
            12 March 2026
          </time>,
          'Kindle Scribe',
          <Tag key="sync" size="sm" tone="success">
            Synced
          </Tag>,
        ]}
      />
    </Text>
  );
}
