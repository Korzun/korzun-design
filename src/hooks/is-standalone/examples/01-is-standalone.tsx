/** isStandalone
 * True only in the installed app (added to the home screen). Here, in a browser tab, it is
 * false. Gate install-only chrome such as `TopFade` and a pull-to-refresh indicator on it.
 */
import { Card, Text } from '@korzun/design/component';
import { isStandalone } from '@korzun/design/hooks';

export default function IsStandalone() {
  return (
    <Card title="Installed app">
      <Text>
        <code>isStandalone()</code> is {String(isStandalone())}
      </Text>
    </Card>
  );
}
