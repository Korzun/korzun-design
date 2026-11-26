/** Inherit
 * A bare `Text` adds no size, tone or weight, so it looks like the text
 * around it. Set only what should change: the first inner `Text` matches the
 * large, muted `Text` that holds it, and the second overrides only `weight`.
 */
import { Text } from '@korzun/design/component';

export default function Inherit() {
  return (
    <Text as="p" size="lg" tone="muted">
      Outer text, large and muted. <Text>A bare Text inherits both.</Text>{' '}
      <Text weight="bold">This one only adds weight.</Text>
    </Text>
  );
}
