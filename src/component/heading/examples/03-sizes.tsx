/** Sizes
 * `size` changes the look without changing the level: every heading here is
 * an `h2`.
 */
import { Heading, Space } from '@korzun/design/component';

const sizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

export default function Sizes() {
  return (
    <Space direction="vertical" gap="sm">
      {sizes.map((size) => (
        <Heading key={size} level={2} size={size}>
          {`size="${size}"`}
        </Heading>
      ))}
    </Space>
  );
}
