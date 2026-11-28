/** Weights
 * `weight` sets the font weight, whatever the level.
 */
import { Heading, Space } from '@korzun/design/component';

const weights = ['regular', 'medium', 'semibold', 'bold', 'extrabold'] as const;

export default function Weights() {
  return (
    <Space direction="vertical" gap="sm">
      {weights.map((weight) => (
        <Heading key={weight} level={3} weight={weight}>
          {`weight="${weight}"`}
        </Heading>
      ))}
    </Space>
  );
}
