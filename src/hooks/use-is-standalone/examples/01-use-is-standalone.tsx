/** useIsStandalone
 * True only in the installed app (added to the home screen). Here, in a browser tab, it is
 * false. Gate install-only chrome such as `TopFade` and a pull-to-refresh indicator on it.
 */
import { Card, Text } from '@korzun/design/component';
import { useIsStandalone } from '@korzun/design/hooks';

export default function IsStandalone() {
  const standalone = useIsStandalone();
  return (
    <Card title="Installed app">
      <Text>
        <code>useIsStandalone()</code> is {String(standalone)}
      </Text>
    </Card>
  );
}
