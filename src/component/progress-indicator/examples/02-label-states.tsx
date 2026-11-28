/** Label states
 * The label reads "Not started" at 0, "N%" in between and "Completed" at 1. At exactly 0 or 1 only the label renders, with no pie. The label is rounded, so `0.996` shows "100%" next to a near-full pie, not "Completed". Each is labelled with its `value`.
 */
import { Space, ProgressIndicator, Text } from '@korzun/design/component';

export default function LabelStates() {
  return (
    <Space direction="vertical" gap="sm">
      <Space>
        <ProgressIndicator value={0} ariaLabel="Upload progress" />
        <Text tone="muted">value 0</Text>
      </Space>
      <Space>
        <ProgressIndicator value={0.42} ariaLabel="Upload progress" />
        <Text tone="muted">value 0.42</Text>
      </Space>
      <Space>
        <ProgressIndicator value={0.996} ariaLabel="Upload progress" />
        <Text tone="muted">value 0.996</Text>
      </Space>
      <Space>
        <ProgressIndicator value={1} ariaLabel="Upload progress" />
        <Text tone="muted">value 1</Text>
      </Space>
    </Space>
  );
}
