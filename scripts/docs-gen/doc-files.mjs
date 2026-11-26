import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Repo-relative paths of every shipped doc, `docs/**\/*.md` without
 * docs/superpowers (internal plans and specs), sorted.
 * @param {string} repo
 * @returns {string[]}
 */
export function docFiles(repo) {
  const out = [];
  const walk = (rel) => {
    for (const d of readdirSync(join(repo, rel), { withFileTypes: true })) {
      if (d.isDirectory()) {
        if (rel === 'docs' && d.name === 'superpowers') continue;
        walk(`${rel}/${d.name}`);
      } else if (d.name.endsWith('.md')) out.push(`${rel}/${d.name}`);
    }
  };
  if (existsSync(join(repo, 'docs'))) walk('docs');
  return out.sort();
}

/**
 * Reads a repo-relative file as UTF-8.
 * @param {string} repo
 * @param {string} rel
 * @returns {string}
 */
export const readRepoFile = (repo, rel) => readFileSync(join(repo, rel), 'utf8');
