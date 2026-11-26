/** Danger
 * `danger` tints the title red. Use it for a load failure, never for an
 * honestly empty list.
 */
import { EmptyState } from '@korzun/design/component';

export default function Danger() {
  return (
    <EmptyState title="Error loading requests" danger>
      Check your connection and reload the page.
    </EmptyState>
  );
}
