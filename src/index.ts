export { applyTransparency } from './utils.js';
export * from './theme/index.js';
export * from './icon/index.js';
export * from './toast/index.js';
export * from './control/index.js';
export * from './hooks/index.js';
export * from './component/index.js';
// `./theme` exports the `ThemeSetting` type and `./component` the `ThemeSetting`
// component. Explicit exports resolve the star-export clash: the component keeps
// the name, the type is available as `ThemeSettingValue`.
export { ThemeSetting } from './component/index.js';
export type { ThemeSetting as ThemeSettingValue } from './theme/index.js';
