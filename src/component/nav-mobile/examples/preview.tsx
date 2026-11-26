/** Preview
 * @viewport mobile
 */
import { NavMobile, type NavItem } from '@korzun/design/component';
import { BookIcon, HomeIcon, ListCheckIcon, SettingsIcon, UploadIcon } from '@korzun/design/icon';

const items: NavItem[] = [
  { to: '/library', label: 'Library', Icon: BookIcon, active: true },
  { to: '/upload', label: 'Upload', Icon: UploadIcon, active: false },
  { to: '/request', label: 'Request', Icon: ListCheckIcon, active: false },
];
const home: NavItem = { to: '/library', label: 'Back to library', Icon: HomeIcon, active: false };
const settings: NavItem = { to: '/settings', label: 'Settings', Icon: SettingsIcon, active: false };

export default function Preview() {
  return (
    <NavMobile
      main={{ items, collapsed: home }}
      settings={{ items: [], collapsed: settings }}
      expanded="main"
    />
  );
}
