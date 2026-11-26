import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, posix } from 'node:path';

import { barrelStatements, knownNames } from './barrels.mjs';
import { CATEGORIES } from './categories.mjs';
import { parseChangelog, validateTags } from './changelog.mjs';
import { readDefaults } from './defaults.mjs';
import { docFiles } from './doc-files.mjs';
import { readExample } from './examples.mjs';
import { parseFrontMatter } from './front-matter.mjs';
import { listModules } from './inventory.mjs';
import { extractTypeTables } from './props.mjs';
import { importNames, orderTables, replaceRegions, stripRegions } from './regions.mjs';
import { collectTokenPaths, resolveTokens } from './tokens.mjs';

/** @typedef {import('./types.js').ModuleInfo} ModuleInfo */
/** @typedef {import('./types.js').SiteData} SiteData */

const byName = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const readIf = (path) => (existsSync(path) ? readFileSync(path, 'utf8') : null);

function checkCategory(file, category, allowGuide) {
  if (!CATEGORIES.includes(category) && !(allowGuide && category === 'Guide')) {
    throw new Error(`${file}: unknown category "${category}"`);
  }
}

/** The single-line import form, same naming and ordering as the import region. */
function importLine(mod) {
  const names = importNames(mod);
  return names ? `import { ${names} } from '${mod.entry}'` : `import '${mod.entry}'`;
}

/** Source file of component `name`: index.tsx, or the barrel's `from` for area modules. */
function componentSource(repo, mod, name) {
  if (existsSync(join(repo, mod.srcDir, 'index.tsx'))) {
    return readIf(join(repo, mod.srcDir, 'index.tsx'));
  }
  const barrel = readIf(join(repo, mod.srcDir, 'index.ts'));
  if (!barrel) return null;
  const st = barrelStatements(barrel).find((s) => s.from && s.values.includes(name));
  if (!st) return null;
  const base = join(repo, mod.srcDir, st.from.replace(/\.js$/, ''));
  return readIf(`${base}.tsx`) ?? readIf(`${base}.ts`);
}

function withDefaults(repo, mod, tables) {
  for (const table of tables) {
    const m = /^(.+)Props$/.exec(table.name);
    if (table.kind !== 'props' || !m) continue;
    const source = componentSource(repo, mod, m[1]);
    if (!source) continue;
    const defaults = readDefaults(source, m[1]);
    for (const row of table.rows) {
      if (row.default === undefined && defaults[row.name] !== undefined) {
        row.default = defaults[row.name];
      }
    }
  }
  return tables;
}

/**
 * Token paths from a style file and the relative modules it imports, transitively
 * within src/. A module outside src/theme/ does not follow imports into it: they
 * bring the provider and global styles, not tokens the module itself uses.
 */
function styleTokenPaths(repo, entry) {
  const seen = new Set();
  const paths = new Set();
  const inTheme = entry.startsWith('src/theme/');
  const visit = (rel) => {
    if (seen.has(rel)) return;
    seen.add(rel);
    const source = readIf(join(repo, rel));
    if (source === null) return;
    for (const p of collectTokenPaths(source)) paths.add(p);
    for (const [, spec] of source.matchAll(/(?:from|import)\s*['"](\.{1,2}\/[^'"]+)['"]/g)) {
      const base = posix.normalize(posix.join(posix.dirname(rel), spec.replace(/\.js$/, '')));
      if (!base.startsWith('src/') || (!inTheme && base.startsWith('src/theme/'))) continue;
      const hit = [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`].find((f) =>
        existsSync(join(repo, f))
      );
      if (hit) visit(hit);
    }
  };
  visit(entry);
  return [...paths].sort();
}

function loadThemes(repo) {
  const require = createRequire(join(repo, 'package.json'));
  const mod = require(join(repo, 'dist/theme/theme.js'));
  return { light: mod.lightTheme, dark: mod.darkTheme };
}

function readExamples(repo, mod) {
  const dir = join(repo, mod.srcDir, 'examples');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => readExample(`${mod.srcDir}/examples/${f}`, readFileSync(join(dir, f), 'utf8')))
    .sort((a, b) => a.order - b.order);
}

/**
 * Rebuild only the docs-index lines of AGENTS.md. Docs with front matter list
 * their description on the `[docs]` line; other entries keep their text.
 */
function rebuildIndex(agents, repo, fm) {
  const lines = agents.split('\n');
  const dirs = new Map();
  for (const [i, line] of lines.entries()) {
    const m = /^\[(docs[^\]]*)\]\|(.*)$/.exec(line);
    if (m) dirs.set(m[1], { i, items: m[2].split('|') });
  }
  const files = docFiles(repo);
  for (const [dir, { i, items }] of dirs) {
    const inDir = files
      .filter((f) => f.slice(0, f.lastIndexOf('/')) === dir)
      .map((f) => f.slice(dir.length + 1));
    if (dir === 'docs') {
      const noteOf = (name) => {
        const d = fm.get(`docs/${name}`)?.data.description;
        return d ? `${name}: ${d}` : null;
      };
      const kept = items.map((item) => noteOf(item.split(':')[0].trim()) ?? item);
      const known = new Set(items.map((item) => item.split(':')[0].trim()));
      const added = inDir.filter((n) => !known.has(n)).map((n) => noteOf(n) ?? n);
      lines[i] = `[${dir}]|${[...kept, ...added].join('|')}`;
    } else {
      const names = inDir.map((n) => n.replace(/\.md$/, '')).sort(byName);
      lines[i] = `[${dir}]|{${names.join(',')}}.md`;
    }
  }
  return lines.join('\n');
}

/**
 * Generate docs, AGENTS.md index and site data in memory.
 * @param {string} repo
 * @param {{ strict?: boolean }} [options]
 * @returns {Map<string, string>} repo-relative path to new content
 */
export function generate(repo, { strict = false } = {}) {
  if (!existsSync(join(repo, 'dist'))) throw new Error('dist/ missing: run npm run build');

  const pkg = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8'));
  const changelog = parseChangelog(readIf(join(repo, 'CHANGELOG.md')) ?? '');
  const errors = validateTags(changelog, knownNames(repo));
  if (errors.length > 0) throw new Error(errors.join('\n'));

  const out = new Map();
  const fm = new Map();
  for (const rel of docFiles(repo)) {
    const parsed = parseFrontMatter(readFileSync(join(repo, rel), 'utf8'));
    if (Object.keys(parsed.data).length > 0) fm.set(rel, parsed);
  }

  let themes = null;
  const modules = [];
  for (const skel of listModules(repo)) {
    const parsed = fm.get(skel.docPath);
    if (!parsed) {
      if (strict) throw new Error(`${skel.docPath}: missing front matter`);
      continue;
    }
    const { title, description, category } = parsed.data;
    for (const k of ['title', 'description', 'category']) {
      if (!parsed.data[k]) throw new Error(`${skel.docPath}: front matter missing ${k}`);
    }
    checkCategory(skel.docPath, category, false);

    const examples = readExamples(repo, skel);
    if (strict && examples.length === 0) throw new Error(`${skel.docPath}: no examples`);

    const tables = withDefaults(
      repo,
      skel,
      extractTypeTables(join(repo, skel.dtsDir, 'index.d.ts'), skel.types)
    );
    const stylePaths = styleTokenPaths(repo, `${skel.srcDir}/style.ts`);
    let tokens = [];
    if (stylePaths.length > 0) {
      themes ??= loadThemes(repo);
      tokens = resolveTokens(stylePaths, themes.light, themes.dark);
    }
    const values = new Set(skel.values);
    const entries = changelog.flatMap((v) =>
      v.entries.filter((e) => e.tags.some((t) => values.has(t)))
    );

    /** @type {ModuleInfo} */
    const info = {
      id: skel.id,
      slug: skel.slug,
      entry: skel.entry,
      docPath: skel.docPath,
      title,
      description,
      category,
      values: skel.values,
      types: skel.types,
      importLine: '',
      body: '',
      examples,
      tables: orderTables(tables, skel.values),
      tokens,
      changelog: entries,
    };
    info.importLine = importLine(info);

    const rewritten = replaceRegions(parsed.content, info, skel.docPath);
    const raw = readFileSync(join(repo, skel.docPath), 'utf8');
    const head = raw.slice(0, raw.length - parsed.content.length);
    out.set(skel.docPath, head + rewritten);
    info.body = stripRegions(rewritten)
      .replace(/^\s*# [^\n]*\n?/, '')
      .trim();
    modules.push(info);
  }

  const guides = [];
  for (const [rel, parsed] of fm) {
    if (parsed.data.category !== 'Guide') continue;
    const { title, description } = parsed.data;
    guides.push({
      slug: rel.split('/').pop().replace(/\.md$/, ''),
      docPath: rel,
      title,
      description,
      body: parsed.content.replace(/^\s*# [^\n]*\n?/, '').trim(),
    });
  }
  for (const [rel, parsed] of fm) {
    if (parsed.data.category === 'Guide') continue;
    if (!modules.some((m) => m.docPath === rel)) {
      checkCategory(rel, parsed.data.category, true);
    }
  }
  guides.sort((a, b) => byName(a.slug, b.slug));

  const agents = readFileSync(join(repo, 'AGENTS.md'), 'utf8');
  out.set('AGENTS.md', rebuildIndex(agents, repo, fm));

  /** @type {SiteData} */
  const site = {
    version: pkg.version,
    modules,
    guides,
    changelog: changelog.map((v) => ({ version: v.version, date: v.date, entries: v.entries })),
  };
  out.set('gallery/generated/site-data.json', `${JSON.stringify(site, null, 2)}\n`);
  return out;
}
