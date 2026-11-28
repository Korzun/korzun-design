/** Preview */
import { MetadataList, Tag } from '@korzun/design/component';

export default function Preview() {
  return (
    <MetadataList
      metadata={[
        { title: 'Slug', value: 'my-kindle' },
        { title: 'Cover size', value: '1860×2480' },
        {
          title: 'Status',
          value: (
            <Tag size="sm" tone="success">
              Active
            </Tag>
          ),
        },
      ]}
    />
  );
}
