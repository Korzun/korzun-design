/** Elements
 * `as` picks the element: `span` for a run inside a line, `p` and `div` for
 * blocks, `strong` and `em` for emphasis, `label` for a control.
 */
import { Stack, Text } from '@korzun/design/component';

const elements = ['span', 'p', 'div', 'strong', 'em', 'label'] as const;

export default function Elements() {
  return (
    <Stack gap="xs">
      {elements.map((as) => (
        <Text key={as} as={as}>
          {`as="${as}"`}
        </Text>
      ))}
    </Stack>
  );
}
