import { createUseStyles, type Theme } from '@korzun/design/theme';
import cx from 'classnames';
import { Marked, type Token } from 'marked';
import { useMemo } from 'react';

/**
 * Maps a relative link between docs (`../corners.md`, `./card.md`) to the site
 * route for it: a top-level doc is a guide, an area doc is a component page.
 * External links, anchors and anything else pass through unchanged.
 */
export const docHref = (href: string, from: string): string => {
  if (/^([a-z][a-z0-9+.-]*:|#|\/)/i.test(href)) return href;
  const path = href.split('#')[0]!;
  if (!path.endsWith('.md')) return href;
  const resolved = new URL(path, `file:///${from}`).pathname.slice(1);
  const guide = /^docs\/([^/]+)\.md$/.exec(resolved);
  if (guide) return `#/guides/${guide[1]}`;
  const component = /^docs\/[^/]+\/([^/]+)\.md$/.exec(resolved);
  if (component) return `#/components/${component[1]}`;
  return href;
};

const render = (source: string, from: string, inline: boolean): string => {
  const marked = new Marked({
    walkTokens: (token: Token) => {
      if (token.type === 'link') token.href = docHref(token.href, from);
    },
  });
  return inline
    ? marked.parseInline(source, { async: false })
    : marked.parse(source, { async: false });
};

const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    lineHeight: theme.lineHeight.body,
    '& > :first-child': { marginTop: 0 },
    '& > :last-child': { marginBottom: 0 },
    '& h2': {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.semibold,
      margin: `${theme.space.xxxxl} 0 ${theme.space.lg}`,
    },
    '& h3': {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      margin: `${theme.space.xxxl} 0 ${theme.space.md}`,
    },
    '& p, & ul, & ol': { margin: `0 0 ${theme.space.lg}` },
    '& ul, & ol': { paddingLeft: theme.space.xxxl },
    '& li + li': { marginTop: theme.space.xs },
    '& li > ul': { margin: `${theme.space.xs} 0 0` },
    '& pre': {
      margin: `0 0 ${theme.space.lg}`,
      padding: theme.space.xl,
      overflowX: 'auto',
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.bg.cardHeader,
    },
    '& pre code': { padding: 0, backgroundColor: 'transparent' },
    // Guides lean on tables (corners, tokens): ruled rows, left-aligned heads.
    '& table': {
      display: 'block',
      maxWidth: '100%',
      overflowX: 'auto',
      margin: `0 0 ${theme.space.lg}`,
      borderCollapse: 'collapse',
      fontSize: theme.fontSize.md,
    },
    '& th, & td': {
      padding: `${theme.space.sm} ${theme.space.lg} ${theme.space.sm} 0`,
      borderBottom: `1px solid ${theme.color.border.default}`,
      textAlign: 'left',
      verticalAlign: 'top',
    },
    '& th': { fontWeight: theme.fontWeight.semibold, color: theme.color.text.secondary },
  },
  // Inline runs (a prop or example description) share the code and link look.
  text: {
    '& code': {
      fontFamily: theme.fontFamily.mono,
      fontSize: theme.fontSize.sm,
      padding: `0 ${theme.space.xxs}`,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.color.bg.cardHeader,
      overflowWrap: 'anywhere',
    },
    '& a': {
      color: theme.color.brand.default,
      textDecoration: 'none',
      '&:hover': { color: theme.color.brand.linkHover, textDecoration: 'underline' },
    },
  },
}));

export type MarkdownProps = {
  /** Markdown from the repo (trusted: rendered as HTML without sanitising). */
  source: string;
  /** The doc the source comes from, which relative links resolve against. Default `docs/index.md`. */
  from?: string;
  /** Render as an inline `<span>` (no paragraphs), for a table cell or a one-line description. */
  inline?: boolean;
  /** Extra class on the root. */
  className?: string;
};

/** Renders repo markdown with `marked`; relative doc links become site routes. */
export const Markdown = ({
  source,
  from = 'docs/index.md',
  inline = false,
  className,
}: MarkdownProps) => {
  const styles = useStyle();
  const html = useMemo(() => render(source, from, inline), [source, from, inline]);
  const Tag = inline ? 'span' : 'div';
  return (
    <Tag
      className={cx(styles.text, !inline && styles.root, className)}
      // Trusted content: the docs and JSDoc in this repo, never user input.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
