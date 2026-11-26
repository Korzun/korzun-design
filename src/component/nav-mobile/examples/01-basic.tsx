/** Basic
 * The bar floats above the bottom edge: the `main` side is a capsule of tabs with
 * a lens on the active one, and `settings` is a circle linking to its `collapsed`
 * destination.
 * @viewport mobile
 */
import { Card, NavMobile, Page, Text, type NavItem } from '@korzun/design/component';
import { BookIcon, HomeIcon, ListCheckIcon, SettingsIcon, UploadIcon } from '@korzun/design/icon';

const items: NavItem[] = [
  { to: '/library', label: 'Library', Icon: BookIcon, active: true },
  { to: '/upload', label: 'Upload', Icon: UploadIcon, active: false },
  { to: '/request', label: 'Request', Icon: ListCheckIcon, active: false },
];
const home: NavItem = { to: '/library', label: 'Back to library', Icon: HomeIcon, active: false };
const settings: NavItem = { to: '/settings', label: 'Settings', Icon: SettingsIcon, active: false };

export default function Basic() {
  return (
    <>
      <Page bottomNav>
        <Card title="Library">
          <Text>Your books are listed here.</Text>
        </Card>
      </Page>
      <NavMobile
        main={{ items, collapsed: home }}
        settings={{ items: [], collapsed: settings }}
        expanded="main"
      />
    </>
  );
}
