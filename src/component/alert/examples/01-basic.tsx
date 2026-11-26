/** Basic
 * A `tone`, a short `title` and a sentence of body text. Pick the tone by
 * meaning: `warning` needs attention.
 */
import { Alert } from '@korzun/design/component';

export default function Basic() {
  return (
    <Alert tone="warning" title="Frame is overdue">
      No check-in for 2h 14m.
    </Alert>
  );
}
