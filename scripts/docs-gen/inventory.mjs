import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { barrelStatements } from './barrels.mjs';

// Internal folders that appear in no barrel as a module of their own.
const INTERNAL = new Set(['layer-stack', 'metadata']);

// Shared files that are not a module folder; their exports join the owner.
// nav-types (NavItem) is used by nav-desktop and nav-mobile; one owner only.
const SHARED_OWNER = { 'nav-types': 'nav-desktop' };

const sortedUnique = (list) => [...new Set(list)].sort();

const single = (repo, area) => {
  const text = readFileSync(join(repo, 'src', area, 'index.ts'), 'utf8');
  const values = [];
  const types = [];
  for (const s of barrelStatements(text)) {
    values.push(...s.values);
    types.push(...s.types);
  }
  return {
    id: area,
    slug: area,
    entry: `@korzun/design/${area}`,
    docPath: `docs/${area}.md`,
    values: sortedUnique(values),
    types: sortedUnique(types),
    srcDir: `src/${area}`,
    dtsDir: `dist/${area}`,
  };
};

const grouped = (repo, area) => {
  const text = readFileSync(join(repo, 'src', area, 'index.ts'), 'utf8');
  const byFolder = new Map();
  for (const { from, values, types } of barrelStatements(text)) {
    const m = from.match(/^\.\/([^/]+?)(?:\/index)?(?:\.js)?$/);
    if (!m) continue;
    const folder = SHARED_OWNER[m[1]] ?? m[1];
    if (INTERNAL.has(folder)) continue;
    const entry = byFolder.get(folder) ?? { values: [], types: [] };
    entry.values.push(...values);
    entry.types.push(...types);
    byFolder.set(folder, entry);
  }
  return [...byFolder].map(([folder, { values, types }]) => ({
    id: `${area}/${folder}`,
    slug: folder,
    entry: `@korzun/design/${area}`,
    docPath: `docs/${area}/${folder}.md`,
    values: sortedUnique(values),
    types: sortedUnique(types),
    srcDir: `src/${area}/${folder}`,
    dtsDir: `dist/${area}/${folder}`,
  }));
};

// Module skeletons from the package barrels.
export const listModules = (repo) => [
  ...grouped(repo, 'control'),
  ...grouped(repo, 'component'),
  ...grouped(repo, 'hooks'),
  single(repo, 'theme'),
  single(repo, 'toast'),
  single(repo, 'icon'),
];
