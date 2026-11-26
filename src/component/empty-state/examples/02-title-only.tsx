/** Title only
 * With no `children` there is no second line: a list's loading state needs
 * only the title.
 */
import { EmptyState } from '@korzun/design/component';

export default function TitleOnly() {
  return <EmptyState title="Loading…" />;
}
