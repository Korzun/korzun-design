import { createUseStyles, type Theme } from '@korzun/design/theme';
import cx from 'classnames';
import { Marked, type Token, type Tokens } from 'marked';
import { useMemo, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { anchor } from '../../scripts/docs-gen/slug.mjs';
import { highlight, useHighlightStyle } from './highlight.js';

// Schemes a rendered link may use; any other (`javascript:`, `data:`) becomes `#`.
const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:']);

/**
 * The site href for a link in a doc at `from`, shown on the page at `route`:
 * - `#section` goes after the route (`#/components/popover#layers`): the
 *   route lives in the hash, so a bare fragment would be read as a route.
 * - A relative link to a doc becomes its route, fragment kept: a top-level
 *   doc is a guide (`#/guides/tokens#recipe`), an area doc a component page.
 * - http(s) and mailto links and other relative links pass through; any
 *   other scheme becomes `#`.
 */
export const docHref = (href: string, from: string, route: string): string => {
  // Browsers ignore control characters and spaces in a scheme; so does this check.
  // oxlint-disable-next-line no-control-regex
  const scheme = /^([a-z][a-z0-9+.-]*:)/i.exec(href.replace(/[\u0000-\u0020]/g, ''));
  if (scheme) return SAFE_SCHEMES.has(scheme[1]!.toLowerCase()) ? href : '#';
  if (href.startsWith('#')) return `#${route}${href}`;
  if (href.startsWith('/')) return href;
  const hashAt = href.indexOf('#');
  const path = hashAt === -1 ? href : href.slice(0, hashAt);
  const fragment = hashAt === -1 ? '' : href.slice(hashAt);
  if (!path.endsWith('.md')) return href;
  const resolved = new URL(path, `file:///${from}`).pathname.slice(1);
  const guide = /^docs\/([^/]+)\.md$/.exec(resolved);
  if (guide) return `#/guides/${guide[1]}${fragment}`;
  const component = /^docs\/[^/]+\/([^/]+)\.md$/.exec(resolved);
  if (component) return `#/components/${component[1]}${fragment}`;
  return href;
};

/** A heading's plain text: the words of its inline tokens, markup dropped. */
const plainText = (tokens: Token[]): string =>
  tokens
    .map((t) => ('tokens' in t && t.tokens ? plainText(t.tokens) : 'text' in t ? t.text : ''))
    .join('');

/**
 * Heading ids for one page, GitHub style: the generator's `anchor`, with a
 * repeat numbered (`notes`, `notes-1`) so every id stays unique.
 */
export const createSlugger = () => {
  const seen = new Map<string, number>();
  return (text: string): string => {
    const base = anchor(text);
    let count = seen.get(base) ?? 0;
    let id = count === 0 ? base : `${base}-${count}`;
    // A numbered id can itself be a heading further down (`Notes 1`).
    while (count > 0 && seen.has(id)) id = `${base}-${++count}`;
    seen.set(base, count + 1);
    if (id !== base) seen.set(id, 1);
    return id;
  };
};

/** The plain text of each heading in `source`, in order. */
export const headingTexts = (source: string): string[] =>
  new Marked()
    .lexer(source)
    .flatMap((t) => (t.type === 'heading' ? [plainText((t as Tokens.Heading).tokens)] : []));

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const render = (source: string, from: string, inline: boolean, route: string): string => {
  const slug = createSlugger();
  const marked = new Marked({
    walkTokens: (token: Token) => {
      if (token.type === 'link' || token.type === 'image')
        token.href = docHref(token.href, from, route);
    },
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const id = slug(plainText(tokens));
        return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },
      // Fenced code is highlighted; unfenced or unknown-language code is only escaped.
      code({ text, lang }: Tokens.Code) {
        // Only word characters reach the class attribute.
        const language = (lang ?? '').split(/\s/)[0]!.replace(/[^\w-]/g, '') || 'plaintext';
        return `<pre><code class="language-${language}">${highlight(text, language)}</code></pre>\n`;
      },
      // The docs have no raw HTML; any that appears shows as text, never as markup.
      html({ text }: Tokens.HTML | Tokens.Tag) {
        return escapeHtml(text);
      },
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
      // A box on the page background.
      borderRadius: theme.radius.lg,
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
  /** Markdown from the repo. Raw HTML in it shows as text; links outside http(s), mailto and relative become `#`. */
  source: string;
  /** The doc the source comes from, which relative links resolve against. Default `docs/index.md`. */
  from?: string;
  /** Render as an inline `<span>` (no paragraphs), for a table cell or a one-line description. */
  inline?: boolean;
  /** Extra class on the root. */
  className?: string;
};

/**
 * Renders repo markdown with `marked`: relative doc links become site routes,
 * headings get slug ids, and a `#section` link scrolls to its heading.
 */
export const Markdown = ({
  source,
  from = 'docs/index.md',
  inline = false,
  className,
}: MarkdownProps) => {
  const styles = useStyle();
  const tokens = useHighlightStyle();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const html = useMemo(
    () => render(source, from, inline, pathname),
    [source, from, inline, pathname]
  );

  // A link to a section of this page scrolls there and records the fragment;
  // the browser would otherwise route the whole hash. Modified clicks stay native.
  const onClick = (event: MouseEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element)) return;
    const prefix = `#${pathname}#`;
    const href = event.target.closest('a')?.getAttribute('href');
    if (!href?.startsWith(prefix)) return;
    event.preventDefault();
    const id = href.slice(prefix.length);
    navigate({ pathname, hash: `#${id}` });
    document.getElementById(id)?.scrollIntoView({ block: 'start' });
  };

  const Tag = inline ? 'span' : 'div';
  return (
    <Tag
      className={cx(styles.text, !inline && styles.root, tokens.tokens, className)}
      onClick={onClick}
      // Repo docs and JSDoc, with raw HTML escaped and link schemes allowlisted above.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
