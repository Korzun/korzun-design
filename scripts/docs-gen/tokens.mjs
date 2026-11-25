import { parseSync } from 'oxc-parser';

/** @typedef {import('./types.js').TokenRow} TokenRow */

/** Walk every node of an oxc AST. */
function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const n of node) walk(n, visit);
    return;
  }
  if (typeof node.type === 'string') visit(node);
  for (const key of Object.keys(node)) {
    if (key === 'parent') continue;
    walk(node[key], visit);
  }
}

/** Unique, sorted `theme.<a>.<b>` member paths (without `theme.`); stops at computed access. */
export function collectTokenPaths(styleSource) {
  const { program } = parseSync('style.ts', styleSource, { lang: 'ts' });
  const inner = new Set();
  const members = [];
  walk(program, (node) => {
    if (node.type !== 'MemberExpression') return;
    members.push(node);
    inner.add(node.object);
  });
  const paths = new Set();
  for (const node of members) {
    if (inner.has(node)) continue;
    let cur = node;
    let parts = [];
    while (cur.type === 'MemberExpression') {
      // a computed access ends the path: keep only what lies below it
      parts = cur.computed ? [] : [cur.property.name, ...parts];
      cur = cur.object;
    }
    if (cur.type === 'Identifier' && cur.name === 'theme' && parts.length) {
      paths.add(parts.join('.'));
    }
  }
  return [...paths].sort();
}

function lookup(obj, path) {
  let cur = obj;
  for (const key of path.split('.')) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[key];
  }
  return cur;
}

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Leaf paths under `path` in either theme, sorted. */
function leafPaths(path, light, dark) {
  const out = new Set();
  const visit = (prefix, l, d) => {
    const keys = new Set([
      ...Object.keys(isPlainObject(l) ? l : {}),
      ...Object.keys(isPlainObject(d) ? d : {}),
    ]);
    for (const key of keys) {
      const lv = isPlainObject(l) ? l[key] : undefined;
      const dv = isPlainObject(d) ? d[key] : undefined;
      if (isPlainObject(lv) || isPlainObject(dv)) visit(`${prefix}.${key}`, lv, dv);
      else out.add(`${prefix}.${key}`);
    }
  };
  visit(path, lookup(light, path), lookup(dark, path));
  return [...out].sort();
}

/**
 * Recipes keep one row each. Any other path that resolves to an object
 * expands into one row per leaf; paths that resolve to nothing are dropped.
 * @param {string[]} paths
 * @param {object} light
 * @param {object} dark
 * @returns {TokenRow[]}
 */
export function resolveTokens(paths, light, dark) {
  const str = (v) => (typeof v === 'string' ? v : null);
  const row = (path) => {
    const l = str(lookup(light, path));
    const d = str(lookup(dark, path));
    const kind = path.startsWith('recipe.')
      ? 'recipe'
      : l !== null && /^(#|rgb|hsl)/.test(l)
        ? 'color'
        : 'value';
    return { path, kind, light: l, dark: d };
  };
  const seen = new Set();
  const rows = [];
  for (const path of paths) {
    const isRecipe = path.startsWith('recipe.');
    const expanded =
      !isRecipe && (isPlainObject(lookup(light, path)) || isPlainObject(lookup(dark, path)))
        ? leafPaths(path, light, dark)
        : [path];
    for (const p of expanded) {
      if (seen.has(p)) continue;
      seen.add(p);
      const r = row(p);
      if (r.kind !== 'recipe' && r.light === null && r.dark === null) continue;
      rows.push(r);
    }
  }
  return rows;
}
