import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, posix, sep } from 'node:path';

import { barrelStatements, knownNames } from './barrels.mjs';
import { CATEGORIES, moduleOrder } from './categories.mjs';
import { parseChangelog, validateTags } from './changelog.mjs';
import { readDefaults } from './defaults.mjs';
import { docFiles } from './doc-files.mjs';
import { PREVIEW_FILE, readExample } from './examples.mjs';
import { parseFrontMatter } from './front-matter.mjs';
import { listModules } from './inventory.mjs';
import { parseOrThrow } from './parse.mjs';
import { componentPropsTypes, declarationFiles, extractTypeTables } from './props.mjs';
import {
  importNames,
  orderTables,
  replaceRegions,
  stripRegions,
  tableAnchors,
} from './regions.mjs';
import { collectTokenPaths, resolveTokens } from './tokens.mjs';

/** @typedef {import('./types.js').ModuleInfo} ModuleInfo */
/** @typedef {import('./types.js').SiteData} SiteData */

const byName = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const readIf = (path) => (existsSync(path) ? readFileSync(path, 'utf8') : null);

function checkCategory(file, category, allowDocKinds) {
  const docKind = category === 'Guide' || category === 'Recipe';
  if (!CATEGORIES.includes(category) && !(allowDocKinds && docKind)) {
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
 * Relative specifiers `source` imports or re-exports for a value: `import type`,
 * `import { type A }` with only type specifiers, and `export type … from` bring
 * no styles and are left out.
 */
function valueImports(file, source) {
  const { program } = parseOrThrow(file, source, file.endsWith('x') ? 'tsx' : 'ts');
  const specs = [];
  for (const st of program.body) {
    if (!st.source || !String(st.source.value).startsWith('.')) continue;
    if (st.type === 'ImportDeclaration') {
      if (st.importKind === 'type') continue;
      const list = st.specifiers ?? [];
      if (list.length > 0 && list.every((sp) => sp.importKind === 'type')) continue;
    } else if (st.type === 'ExportNamedDeclaration' || st.type === 'ExportAllDeclaration') {
      if (st.exportKind === 'type') continue;
    } else continue;
    specs.push(String(st.source.value));
  }
  return specs;
}

/**
 * Token paths of a module: from its `style.ts` and the relative modules that
 * imports for a value, transitively within src/; from `theme.*` read in its
 * entry (`index.tsx`/`index.ts`) itself, as through `useTheme()`; and from the
 * style modules the entry imports for a value (Heading renders with Text's
 * `useTypography` from `../text/style.js`). An internal module the entry
 * imports for a value (a folder in no barrel, such as `layer-stack` under
 * Popover) is part of this module, so it is read the same way. The
 * entry's other imports (exported components, helpers) are not followed: a
 * component it renders lists its own tokens. A module outside src/theme/ does
 * not follow imports into it: they bring the provider and global styles, not
 * tokens the module itself uses.
 * @param {string} repo
 * @param {string} srcDir
 * @param {Set<string>} moduleDirs every module's `srcDir`; a folder outside it is internal
 */
function styleTokenPaths(repo, srcDir, moduleDirs = new Set()) {
  const seen = new Set();
  const paths = new Set();
  const inTheme = srcDir.startsWith('src/theme');
  const resolveSpec = (rel, spec) => {
    const base = posix.normalize(posix.join(posix.dirname(rel), spec.replace(/\.js$/, '')));
    if (!base.startsWith('src/') || (!inTheme && base.startsWith('src/theme/'))) return null;
    return (
      [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`].find((f) =>
        existsSync(join(repo, f))
      ) ?? null
    );
  };
  const visit = (rel) => {
    if (seen.has(rel)) return;
    seen.add(rel);
    const source = readIf(join(repo, rel));
    if (source === null) return;
    for (const p of collectTokenPaths(source, rel)) paths.add(p);
    for (const spec of valueImports(rel, source)) {
      const hit = resolveSpec(rel, spec);
      if (hit) visit(hit);
    }
  };
  const seenDirs = new Set();
  const visitModule = (dir) => {
    if (seenDirs.has(dir)) return;
    seenDirs.add(dir);
    visit(`${dir}/style.ts`);
    const entry = [`${dir}/index.tsx`, `${dir}/index.ts`].find((f) => existsSync(join(repo, f)));
    const entrySource = entry && readIf(join(repo, entry));
    if (!entrySource) return;
    for (const p of collectTokenPaths(entrySource, entry)) paths.add(p);
    for (const spec of valueImports(entry, entrySource)) {
      const hit = resolveSpec(entry, spec);
      if (!hit) continue;
      if (/(^|\/)style\.tsx?$/.test(hit)) visit(hit);
      const internal = /^(src\/(?:control|component)\/[^/]+)\/index\.tsx?$/.exec(hit);
      if (internal && !moduleDirs.has(internal[1])) visitModule(internal[1]);
    }
  };
  visitModule(srcDir);
  return [...paths].sort();
}

function loadThemes(repo) {
  const require = createRequire(join(repo, 'package.json'));
  const mod = require(join(repo, 'dist/theme/theme.js'));
  return { light: mod.lightTheme, dark: mod.darkTheme };
}

/** The examples in repo-relative folder `rel`, by order; none when it is missing. */
function readExamplesIn(repo, rel) {
  const dir = join(repo, rel);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.tsx') && f !== PREVIEW_FILE)
    .map((f) => readExample(`${rel}/${f}`, readFileSync(join(dir, f), 'utf8')))
    .sort((a, b) => a.order - b.order);
}

const readExamples = (repo, mod) => readExamplesIn(repo, `${mod.srcDir}/examples`);

const RECIPE_DOCS = 'docs/recipes/';

/**
 * Recipes: each `docs/recipes/<slug>.md` (category Recipe) with its runnable
 * examples in `recipes/<slug>/`. Fills each doc's `examples` region into `out`.
 * A doc without examples, or a folder without a doc, throws: a recipe is both.
 * @returns {import('./types.js').Recipe[]}
 */
function collectRecipes(repo, fm, out) {
  const recipes = [];
  for (const [rel, parsed] of fm) {
    const inDir = rel.startsWith(RECIPE_DOCS);
    const isRecipe = parsed.data.category === 'Recipe';
    if (isRecipe && !inDir) throw new Error(`${rel}: category Recipe belongs in docs/recipes/`);
    if (!inDir) continue;
    if (!isRecipe) throw new Error(`${rel}: category must be Recipe`);
    const slug = rel.slice(RECIPE_DOCS.length).replace(/\.md$/, '');
    const examples = readExamplesIn(repo, `recipes/${slug}`);
    if (examples.length === 0) throw new Error(`${rel}: no examples in recipes/${slug}/`);
    const { title, description } = parsed.data;
    const recipe = { slug, docPath: rel, title, description, body: '', examples };
    const rewritten = replaceRegions(parsed.content, recipe, rel, {}, ['examples']);
    const raw = readFileSync(join(repo, rel), 'utf8');
    out.set(rel, raw.slice(0, raw.length - parsed.content.length) + rewritten);
    recipe.body = stripRegions(rewritten)
      .replace(/^\s*# [^\n]*\n?/, '')
      .trim();
    recipes.push(recipe);
  }
  const dir = join(repo, 'recipes');
  if (existsSync(dir)) {
    for (const d of readdirSync(dir, { withFileTypes: true })) {
      if (d.isDirectory() && !recipes.some((r) => r.slug === d.name)) {
        throw new Error(`recipes/${d.name}/: no docs/recipes/${d.name}.md`);
      }
    }
  }
  return recipes.sort((a, b) => byName(a.slug, b.slug));
}

/** The module's `examples/preview.tsx`, shown only as its overview thumbnail. */
function readPreview(repo, mod) {
  const rel = `${mod.srcDir}/examples/${PREVIEW_FILE}`;
  const source = readIf(join(repo, rel));
  return source === null ? undefined : readExample(rel, source);
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
 * @param {{ strict?: boolean, warn?: (message: string) => void }} [options]
 * @returns {Map<string, string>} repo-relative path to new content
 */
export function generate(repo, { strict = false, warn = console.warn } = {}) {
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
  /** @type {Map<ModuleInfo, Set<string>>} the types each module's own .d.ts files declare */
  const defines = new Map();
  const skeletons = listModules(repo);
  const order = new Map(moduleOrder().map((m, i) => [m.slug, { ...m, index: i }]));
  const moduleDirs = new Set(skeletons.map((s) => s.srcDir));
  for (const skel of skeletons) {
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
    const placed = order.get(skel.slug);
    if (placed && placed.category !== category) {
      throw new Error(
        `${skel.docPath}: category "${category}", but categories.mjs lists ${skel.slug} under "${placed.category}"`
      );
    }

    const examples = readExamples(repo, skel);
    if (strict && examples.length === 0) throw new Error(`${skel.docPath}: no examples`);
    const preview = readPreview(repo, skel);
    if (strict && !preview) {
      throw new Error(`${skel.docPath}: no preview (examples/${PREVIEW_FILE})`);
    }

    // A component whose props type is not exported would get no table and a
    // "takes no props" line; that is a missing export, so stop.
    const dts = join(repo, skel.dtsDir, 'index.d.ts');
    const components = skel.values.filter((v) => /^[A-Z]/.test(v));
    for (const [value, type] of componentPropsTypes(dts, components)) {
      if (!skel.types.includes(type)) {
        throw new Error(
          `${skel.docPath}: ${value} takes ${type}, which ${skel.entry} does not export`
        );
      }
    }

    const tables = withDefaults(
      repo,
      skel,
      extractTypeTables(join(repo, skel.dtsDir, 'index.d.ts'), skel.types)
    );
    const stylePaths = styleTokenPaths(repo, skel.srcDir, moduleDirs);
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
      ...(order.get(skel.slug)?.parent ? { parent: order.get(skel.slug).parent } : {}),
      values: skel.values,
      types: skel.types,
      importLine: '',
      body: '',
      examples,
      ...(preview ? { preview } : {}),
      tables: orderTables(tables, skel.values),
      tokens,
      changelog: entries,
    };
    info.importLine = importLine(info);
    modules.push(info);
    const dtsRoot = join(repo, skel.dtsDir) + sep;
    const declared = declarationFiles(join(repo, skel.dtsDir, 'index.d.ts'), skel.types);
    defines.set(
      info,
      new Set([...declared].filter(([, file]) => file.startsWith(dtsRoot)).map(([n]) => n))
    );
  }

  // Display order: as categories.mjs lists them; a module it does not list
  // goes after the listed ones (the categories test keeps the real repo complete).
  const rank = (m) => order.get(m.slug)?.index ?? Infinity;
  modules.sort((a, b) => rank(a) - rank(b));

  // The module whose page owns each type's table: the one that declares it
  // when several document it (one re-exports it), else the first; warn then.
  const owners = new Map();
  for (const info of modules) {
    for (const table of info.tables) {
      const prev = owners.get(table.name);
      if (!prev) {
        owners.set(table.name, info);
        continue;
      }
      const takes = defines.get(info).has(table.name) && !defines.get(prev).has(table.name);
      const owner = takes ? info : prev;
      warn(
        `docs-gen: ${table.name} is documented in ${prev.docPath} and ${info.docPath}; ` +
          `links go to ${owner.docPath}`
      );
      owners.set(table.name, owner);
    }
  }
  // Every type with a headed table in its owner's doc, so another doc's type cells link to it.
  const typeDocs = new Map();
  for (const [name, owner] of owners) {
    const id = tableAnchors(owner).get(name);
    if (id) typeDocs.set(name, `${owner.docPath}#${id}`);
  }
  for (const info of modules) {
    const parsed = fm.get(info.docPath);
    const rewritten = replaceRegions(parsed.content, info, info.docPath, { typeDocs });
    const raw = readFileSync(join(repo, info.docPath), 'utf8');
    const head = raw.slice(0, raw.length - parsed.content.length);
    out.set(info.docPath, head + rewritten);
    info.body = stripRegions(rewritten)
      .replace(/^\s*# [^\n]*\n?/, '')
      .trim();
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
  const recipes = collectRecipes(repo, fm, out);

  const agents = readFileSync(join(repo, 'AGENTS.md'), 'utf8');
  out.set('AGENTS.md', rebuildIndex(agents, repo, fm));

  /** @type {SiteData} */
  const site = {
    version: pkg.version,
    modules,
    guides,
    recipes,
    changelog: changelog.map((v) => ({ version: v.version, date: v.date, entries: v.entries })),
    typePages: Object.fromEntries([...owners].map(([name, owner]) => [name, owner.slug])),
  };
  out.set('gallery/generated/site-data.json', `${JSON.stringify(site, null, 2)}\n`);
  return out;
}
