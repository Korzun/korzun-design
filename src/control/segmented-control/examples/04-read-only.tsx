/** Read-only
 * Omit `onChange` to show a value without letting it change: the segments are
 * marked `aria-disabled` and ignore clicks and keys. A `null` value checks
 * nothing and draws no lens.
 */
import { Space, Text } from '@korzun/design/component';
import { SegmentedControl } from '@korzun/design/control';

const OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'Review' },
  { value: 'published', label: 'Published' },
] as const;

export default function ReadOnly() {
  return (
    <Space direction="vertical" gap="xl" align="start">
      <Space direction="vertical" gap="xs" align="start">
        <Text size="sm" tone="muted">
          value="review"
        </Text>
        <SegmentedControl label="Status" options={OPTIONS} value="review" />
      </Space>
      <Space direction="vertical" gap="xs" align="start">
        <Text size="sm" tone="muted">
          {'value={null}'}
        </Text>
        <SegmentedControl label="Status" options={OPTIONS} value={null} />
      </Space>
    </Space>
  );
}
