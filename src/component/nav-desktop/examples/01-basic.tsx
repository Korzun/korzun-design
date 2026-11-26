/** Basic
 * Icon and label links in a centred row, the active one underlined. `active` is
 * yours to compute from the route; here Library is the current page.
 */
import { NavDesktop, type NavItem } from '@korzun/design/component';
import { BookIcon, SettingsIcon, UploadIcon } from '@korzun/design/icon';

const items: NavItem[] = [
  { to: '/library', label: 'Library', Icon: BookIcon, active: true },
  { to: '/upload', label: 'Upload', Icon: UploadIcon, active: false },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon, active: false },
];

export default function Basic() {
  return <NavDesktop items={items} />;
}
