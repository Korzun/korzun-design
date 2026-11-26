/** Bottom nav
 * `bottomNav` reserves space under the content so the last card clears the
 * floating `NavMobile`. Pass it on every page shown under that bar.
 * @viewport mobile
 */
import { Card, NavMobile, Page, Text } from '@korzun/design/component';
import { BookIcon, HomeIcon, SettingsIcon, UploadIcon } from '@korzun/design/icon';

export default function BottomNav() {
  return (
    <>
      <NavMobile
        main={{
          items: [
            { to: '/library', label: 'Library', Icon: BookIcon, active: true },
            { to: '/upload', label: 'Upload', Icon: UploadIcon, active: false },
          ],
          collapsed: { to: '/library', label: 'Back to library', Icon: HomeIcon, active: false },
        }}
        settings={{
          items: [],
          collapsed: { to: '/settings', label: 'Settings', Icon: SettingsIcon, active: false },
        }}
        expanded="main"
      />
      <Page bottomNav>
        <Card title="Reading now">
          <Text>Dune</Text>
        </Card>
        <Card title="Up next">
          <Text>Hyperion</Text>
        </Card>
      </Page>
    </>
  );
}
