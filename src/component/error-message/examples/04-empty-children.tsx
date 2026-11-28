/** What counts as empty
 * `undefined`, `null`, `false` and `''` render nothing, not an empty alert.
 * `0` is not empty and renders.
 */
import { ErrorMessage, Space, Text } from '@korzun/design/component';

export default function EmptyChildren() {
  return (
    <Space direction="vertical" gap="sm">
      <Space>
        <Text tone="muted" size="sm">
          undefined:
        </Text>
        <ErrorMessage>{undefined}</ErrorMessage>
      </Space>
      <Space>
        <Text tone="muted" size="sm">
          null:
        </Text>
        <ErrorMessage>{null}</ErrorMessage>
      </Space>
      <Space>
        <Text tone="muted" size="sm">
          false:
        </Text>
        <ErrorMessage>{false}</ErrorMessage>
      </Space>
      <Space>
        <Text tone="muted" size="sm">
          empty string:
        </Text>
        <ErrorMessage>{''}</ErrorMessage>
      </Space>
      <Space>
        <Text tone="muted" size="sm">
          0:
        </Text>
        <ErrorMessage>{0}</ErrorMessage>
      </Space>
    </Space>
  );
}
