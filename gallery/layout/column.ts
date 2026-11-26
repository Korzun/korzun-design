import type { Theme } from '@korzun/design/theme';

/**
 * The site's centred content column, shared by the header and wide pages so
 * their edges line up. 75rem (1200px) fits four overview cards per row; it is
 * wider than `Page`'s 800px app column, which suits the overview grid.
 */
export const siteColumn = (theme: Theme) => ({
  maxWidth: `calc(${theme.space.xxxxxl} * 37.5)`,
  margin: '0 auto',
  padding: `0 ${theme.space.xxl}`,
  boxSizing: 'border-box' as const,
});
