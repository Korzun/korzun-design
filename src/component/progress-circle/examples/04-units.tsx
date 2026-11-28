/** Max and units
 * `max` is the value that means done (default 1, a fraction). The default `unit`, `'%'`, shows the percentage of `max`; any other `unit` shows the value itself followed by it, verbatim, so include a leading space when you want one.
 */
import { ProgressCircle, Space, Text } from '@korzun/design/component';

export default function Units() {
  return (
    <Space direction="vertical" gap="sm">
      <Space>
        <ProgressCircle value={42} max={100} ariaLabel="Upload progress" />
        <Text tone="muted">value 42, max 100</Text>
      </Space>
      <Space>
        <ProgressCircle value={3} max={12} unit=" of 12" ariaLabel="Chapters read" />
        <Text tone="muted">value 3, max 12, unit " of 12"</Text>
      </Space>
      <Space>
        <ProgressCircle value={180} max={320} unit=" pages" ariaLabel="Pages read" />
        <Text tone="muted">value 180, max 320, unit " pages"</Text>
      </Space>
      <Space>
        <ProgressCircle
          value={7}
          max={10}
          unit=""
          label="inside"
          variant="outline"
          size={48}
          ariaLabel="Steps done"
        />
        <Text tone="muted">value 7, max 10, unit "", inside</Text>
      </Space>
    </Space>
  );
}
