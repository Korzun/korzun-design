export { applyTransparency } from './utils';
export * from './theme';
export * from './icon';
export * from './toast';
export * from './control';
export * from './hooks';
export * from './component';
// `./theme` exports the `ThemeSetting` type and `./component` the `ThemeSetting`
// component. Explicit exports resolve the star-export clash: the component keeps
// the name, the type is available as `ThemeSettingValue`.
export { ThemeSetting } from './component';
export type { ThemeSetting as ThemeSettingValue } from './theme';
