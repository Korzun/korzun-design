/** Read-only
 * Omit `onChange` to show a value without letting it change: the segments are
 * marked `aria-disabled` and ignore clicks and keys. A `null` value checks
 * nothing and draws no lens.
 */
import { Stack, Text } from '@korzun/design/component';
import { SegmentedControl } from '@korzun/design/control';

const OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'Review' },
  { value: 'published', label: 'Published' },
] as const;

export default function ReadOnly() {
  return (
    <Stack gap="xl" align="start">
      <Stack gap="xs" align="start">
        <Text size="sm" tone="muted">
          value="review"
        </Text>
        <SegmentedControl label="Status" options={OPTIONS} value="review" />
      </Stack>
      <Stack gap="xs" align="start">
        <Text size="sm" tone="muted">
          {'value={null}'}
        </Text>
        <SegmentedControl label="Status" options={OPTIONS} value={null} />
      </Stack>
    </Stack>
  );
}
