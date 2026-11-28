/** Tones
 * `tone` colours the progress: `brand` (the default), a status colour, or a quiet `neutral` grey. The ring of a filled circle stays in the text colour.
 */
import { ProgressCircle, Space } from '@korzun/design/component';

const TONES = ['brand', 'success', 'warning', 'danger', 'info', 'neutral'] as const;

export default function Tones() {
  return (
    <Space direction="vertical" gap="lg">
      <Space wrap gap="lg">
        {TONES.map((tone) => (
          <ProgressCircle
            key={tone}
            value={0.6}
            tone={tone}
            label="none"
            ariaLabel={`${tone} progress`}
          />
        ))}
      </Space>
      <Space wrap gap="lg">
        {TONES.map((tone) => (
          <ProgressCircle
            key={tone}
            value={0.6}
            tone={tone}
            variant="outline"
            label="inside"
            size={48}
            ariaLabel={`${tone} progress`}
          />
        ))}
      </Space>
    </Space>
  );
}
