/** Basic
 * A short `title` says what is not here; `children` is the optional second
 * line with the next step.
 */
import { EmptyState } from '@korzun/design/component';

export default function Basic() {
  return <EmptyState title="No requests yet">Fill in the form above to ask for a book.</EmptyState>;
}
