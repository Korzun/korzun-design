/** Danger and success
 * Add `danger` to a destructive action: on `primary` when it confirms the
 * deletion, on `default` otherwise. `success` is the green treatment. The two
 * cannot both be set; TypeScript rejects it.
 */
import { Inline } from '@korzun/design/component';
import { Button } from '@korzun/design/control';

export default function DangerAndSuccess() {
  return (
    <Inline wrap>
      <Button danger>Log out</Button>
      <Button type="primary" danger>
        Delete book
      </Button>
      <Button type="primary" success>
        Mark as read
      </Button>
    </Inline>
  );
}
