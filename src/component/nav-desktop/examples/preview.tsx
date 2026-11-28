/** Preview
 * @viewport desktop
 */
import { NavDesktop, type NavItem } from '@korzun/design/component';
import { BookIcon, SettingsIcon, UploadIcon } from '@korzun/design/icon';

const items: NavItem[] = [
  { to: '/library', label: 'Library', Icon: BookIcon, active: true },
  { to: '/upload', label: 'Upload', Icon: UploadIcon, active: false },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon, active: false },
];

export default function Preview() {
  return <NavDesktop items={items} />;
}
