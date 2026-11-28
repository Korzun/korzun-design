import type { Theme } from '@korzun/design/theme';

/**
 * The site's text link: brand colour, underlined only on hover, as links in
 * the rendered docs are. Spread it into a class for a `Link` or `<a>`.
 */
export const siteLink = (theme: Theme) => ({
  color: theme.color.brand.default,
  textDecoration: 'none',
  '&:hover': { color: theme.color.brand.linkHover, textDecoration: 'underline' },
});
