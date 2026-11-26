import type { Plugin } from 'vite';

import { CATEGORIES } from '../scripts/docs-gen/categories.mjs';
import { docFiles, readRepoFile } from '../scripts/docs-gen/doc-files.mjs';
import type { SiteData } from '../scripts/docs-gen/types.js';

// File access goes through scripts/docs-gen/doc-files.mjs: the repo has no
// @types/node, and `tsc` checks this file (see alias.ts).
const repo = decodeURIComponent(new URL('..', import.meta.url).pathname);

/** The first paragraph after AGENTS.md's title, joined onto one line. */
const summary = (agentsMd: string): string => {
  const paragraphs = agentsMd
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('#'));
  return (paragraphs[0] ?? '').replace(/\s*\n\s*/g, ' ');
};

const item = (title: string, url: string, description: string) =>
  `- [${title}](${url}): ${description}`;

/**
 * `llms.txt` in the llmstxt.org format: the package name, AGENTS.md's summary,
 * one link per documented module grouped by category, the guides, and the
 * full file under `## Optional`. Links are absolute under `siteUrl`.
 */
export const buildLlmsTxt = (data: SiteData, agentsMd: string, siteUrl: string): string => {
  const sections = CATEGORIES.map((category) => ({
    title: category,
    items: data.modules
      .filter((m) => m.category === category)
      .map((m) => item(m.title, `${siteUrl}${m.docPath}`, m.description)),
  }));
  sections.push({
    title: 'Guides',
    items: data.guides.map((g) => item(g.title, `${siteUrl}${g.docPath}`, g.description)),
  });
  sections.push({
    title: 'Optional',
    items: [`- [Everything in one file](${siteUrl}llms-full.txt)`],
  });
  const body = sections
    .filter((s) => s.items.length > 0)
    .map((s) => `## ${s.title}\n\n${s.items.join('\n')}`);
  return `${['# @korzun/design', `> ${summary(agentsMd)}`, ...body].join('\n\n')}\n`;
};

/** `llms-full.txt`: AGENTS.md, then every doc in turn, each after a comment naming its path. */
export const buildLlmsFull = (agentsMd: string, docs: { path: string; content: string }[]) =>
  [agentsMd.trimEnd(), ...docs.map((d) => `<!-- ${d.path} -->\n\n${d.content.trimEnd()}`)].join(
    '\n\n'
  ) + '\n';

/** Every file the plugin publishes, keyed by its path under the site root. */
const llmsFiles = (siteUrl: string): Map<string, string> => {
  const agentsMd = readRepoFile(repo, 'AGENTS.md');
  const data = JSON.parse(readRepoFile(repo, 'gallery/generated/site-data.json')) as SiteData;
  const docs = docFiles(repo).map((path) => ({ path, content: readRepoFile(repo, path) }));
  return new Map([
    ['llms.txt', buildLlmsTxt(data, agentsMd, siteUrl)],
    ['llms-full.txt', buildLlmsFull(agentsMd, docs)],
    ...docs.map((d) => [d.path, d.content] as [string, string]),
  ]);
};

/**
 * Publishes `llms.txt`, `llms-full.txt` and the raw `docs/**\/*.md` (without
 * docs/superpowers) beside the site: emitted into the build, served by the dev
 * server at the same paths, read fresh on every request.
 */
export const llmsPlugin = ({ siteUrl }: { siteUrl: string }): Plugin => {
  let base = '/';
  return {
    name: 'korzun-design:llms',
    configResolved(config) {
      base = config.base;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Typed loosely: without @types/node, vite's request type has no url.
        const url = ((req as { url?: string }).url ?? '').split(/[?#]/)[0]!;
        const path = url.startsWith(base) ? decodeURIComponent(url.slice(base.length)) : null;
        const isLlms = path === 'llms.txt' || path === 'llms-full.txt';
        if (!path || !(isLlms || (path.startsWith('docs/') && path.endsWith('.md')))) return next();
        const content = llmsFiles(siteUrl).get(path);
        if (content === undefined) return next();
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(content);
      });
    },
    generateBundle() {
      for (const [fileName, source] of llmsFiles(siteUrl))
        this.emitFile({ type: 'asset', fileName, source });
    },
  };
};
