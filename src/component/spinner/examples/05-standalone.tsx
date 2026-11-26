/** Standalone
 * With no text beside it, a spinner stands alone and the `label` is what a screen reader announces: make it specific.
 */
import { Spinner } from '@korzun/design/component';

export default function Standalone() {
  return <Spinner size="xl" label="Loading books" />;
}
