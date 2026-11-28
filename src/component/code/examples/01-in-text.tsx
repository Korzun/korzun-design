/** In text
 * A prop name inside a sentence. `Code` takes 0.875em of the text around it, so it sits in the line without looking larger.
 */
import { Code, Stack, Text } from '@korzun/design/component';

export default function InText() {
  return (
    <Stack gap="sm">
      <Text as="p">
        Set <Code>maxLength</Code> to cap the title, or <Code>onChange</Code> to follow each
        keystroke.
      </Text>
      <Text as="p" size="sm" tone="muted">
        It follows smaller text too: <Code>value</Code> and <Code>defaultValue</Code>.
      </Text>
    </Stack>
  );
}
