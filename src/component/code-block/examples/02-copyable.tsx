/** Copyable
 * `copyable` adds a Copy button that turns into Copied for two seconds; `copyLabel` names it for screen readers.
 */
import { CodeBlock } from '@korzun/design/component';

export default function Copyable() {
  return (
    <CodeBlock
      code="import { Button } from '@korzun/design/control';"
      copyable
      copyLabel="Copy import"
    />
  );
}
