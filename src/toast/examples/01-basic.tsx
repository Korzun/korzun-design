/** Basic
 * `useToast` returns a function that takes a one-line message and a `type`. `success` shows a green check, `error` a red X and is announced assertively, and `info` a blue info icon.
 */
import { Space } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useToast } from '@korzun/design/toast';

export default function Basic() {
  const showToast = useToast();
  return (
    <Space>
      <Button onClick={() => showToast('Password changed', 'success')}>Success</Button>
      <Button onClick={() => showToast('Failed to reset password', 'error')}>Error</Button>
      <Button onClick={() => showToast('Reading progress syncs when online', 'info')}>Info</Button>
    </Space>
  );
}
