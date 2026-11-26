/** Basic
 * The "Appearance" card applies a choice at once, so the app's colours change with
 * it. It sits in a `Page` like any other Card. `Auto` follows the system setting, and the readout shows the mode in use.
 */
import { Card, Page, Text, ThemeSetting } from '@korzun/design/component';
import { useTheme, useThemeSetting } from '@korzun/design/theme';

export default function Basic() {
  const [setting] = useThemeSetting();
  const { colorScheme } = useTheme();
  return (
    <Page>
      <ThemeSetting />
      <Card title="Preview">
        <Text>
          Choice: {setting}. Mode in use: {colorScheme}.
        </Text>
      </Card>
    </Page>
  );
}
