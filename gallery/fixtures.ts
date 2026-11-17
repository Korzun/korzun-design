import { BookIcon } from '../src/icon/book.js';
import { HomeIcon } from '../src/icon/home.js';
import { SearchIcon } from '../src/icon/search.js';
import { SettingsIcon } from '../src/icon/settings.js';

export const FRUITS = ['Apple', 'Banana', 'Cherry', 'Date'];

export const SEGMENTS = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
] as const;

export const ICON_SEGMENTS = [
  { value: 'search', label: 'Search', Icon: SearchIcon },
  { value: 'settings', label: 'Settings', Icon: SettingsIcon },
] as const;

export const FIELD_COLUMNS = [
  { type: 'text', key: 'name', placeholder: 'Name' },
  { type: 'number', key: 'qty', placeholder: 'Qty' },
] as const;

export const NAV_ITEMS = [
  { to: '/home', label: 'Home', Icon: HomeIcon, active: true },
  { to: '/books', label: 'Books', Icon: BookIcon, active: false, badge: 3 },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon, active: false, badge: 'dot' },
] as const;
