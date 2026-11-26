/** Variants
 * `type` picks the look, not the HTML attribute. `primary` is the one main action,
 * `default` a secondary one, `text` a Cancel in a modal footer, `link` an inline
 * row action, and `dashed` an "add a row" affordance.
 */
import { Inline } from '@korzun/design/component';
import { Button } from '@korzun/design/control';

export default function Variants() {
  return (
    <Inline wrap>
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
      <Button type="text">Text</Button>
      <Button type="link">Link</Button>
      <Button type="dashed">Dashed</Button>
    </Inline>
  );
}
