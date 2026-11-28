/** Basic
 * A round glass button that pushes `to` as a new history entry, asking the
 * destination to restore its scroll position. It does not go back in history,
 * so pass the logical parent route. Mobile only: it is hidden at 641px and up,
 * where the desktop navigation takes over. It does not position itself, so you
 * place it in your own row.
 * @viewport mobile
 */
import { Space } from '@korzun/design/component';
import { BackButton } from '@korzun/design/control';

export default function Basic() {
  return (
    <Space>
      <BackButton to="/library" />
    </Space>
  );
}
