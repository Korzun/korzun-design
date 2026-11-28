/** Preview */
import { Space } from '@korzun/design/component';
import {
  BookIcon,
  CheckIcon,
  HomeIcon,
  SearchIcon,
  SettingsIcon,
  UploadIcon,
  UserIcon,
} from '@korzun/design/icon';

const icons = [HomeIcon, BookIcon, SearchIcon, UploadIcon, UserIcon, CheckIcon, SettingsIcon];

export default function Preview() {
  return (
    <Space gap="lg">
      {icons.map((Icon, index) => (
        <Icon key={index} width={28} height={28} aria-hidden />
      ))}
    </Space>
  );
}
