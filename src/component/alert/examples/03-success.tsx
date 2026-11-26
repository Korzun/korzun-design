/** Success
 * Something finished. `success` and `info` are polite (`role="status"`).
 */
import { Alert } from '@korzun/design/component';
import { CheckIcon } from '@korzun/design/icon';

export default function Success() {
  return (
    <Alert tone="success" title="Library synced" Icon={CheckIcon}>
      42 books are up to date on this device.
    </Alert>
  );
}
