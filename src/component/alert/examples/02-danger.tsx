/** Danger
 * Something failed. `Icon` takes an icon component and draws it before the title
 * in the tone's colour; no tone has a default icon. `danger` and `warning` are
 * announced as `role="alert"`, so mount them when the problem happens.
 */
import { Alert } from '@korzun/design/component';
import { AlertOctagonIcon } from '@korzun/design/icon';

export default function Danger() {
  return (
    <Alert tone="danger" title="Upload failed" Icon={AlertOctagonIcon}>
      The file is larger than 20 MB.
    </Alert>
  );
}
