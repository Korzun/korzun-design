import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { parseSync } from 'oxc-parser';

/** @typedef {import('./types.js').PropRow} PropRow */
/** @typedef {import('./types.js').TypeTable} TypeTable */

const defaultRead = (p) => readFileSync(p, 'utf8');

/** Parse a .d.ts once per path and index its declarations, imports and re-exports. */
function createLoader(readFile) {
  const cache = new Map();

  function load(path) {
    if (cache.has(path)) return cache.get(path);
    const src = readFile(path);
    const { program, comments } = parseSync(path, src, { lang: 'dts' });
    const file = {
      path,
      src,
      comments: comments.filter((c) => c.type === 'Block' && c.value.startsWith('*')),
      decls: new Map(),
      imports: new Map(),
      reexports: new Map(),
      exportAll: [],
    };
    for (const stmt of program.body) {
      if (stmt.type === 'ImportDeclaration') {
        const from = String(stmt.source.value);
        for (const s of stmt.specifiers) {
          if (s.type === 'ImportSpecifier') {
            file.imports.set(s.local.name, { from, name: s.imported.name ?? s.imported.value });
          }
        }
        continue;
      }
      if (stmt.type === 'ExportAllDeclaration' && !stmt.exported) {
        file.exportAll.push(String(stmt.source.value));
        continue;
      }
      const decl = stmt.type === 'ExportNamedDeclaration' ? stmt.declaration : stmt;
      if (decl?.type === 'TSTypeAliasDeclaration' || decl?.type === 'TSInterfaceDeclaration') {
        file.decls.set(decl.id.name, decl);
      }
      if (stmt.type === 'ExportNamedDeclaration' && stmt.source) {
        const from = String(stmt.source.value);
        for (const s of stmt.specifiers) {
          file.reexports.set(s.exported.name ?? s.exported.value, {
            from,
            name: s.local.name ?? s.local.value,
          });
        }
      }
    }
    cache.set(path, file);
    return file;
  }

  /** Map a relative specifier to a .d.ts path, or null for packages (react, ...). */
  function locate(fromFile, spec) {
    if (!spec.startsWith('.')) return null;
    const base = resolve(dirname(fromFile.path), spec);
    const candidates = spec.endsWith('.js')
      ? [base.replace(/\.js$/, '.d.ts')]
      : [`${base}.d.ts`, resolve(base, 'index.d.ts')];
    for (const candidate of candidates) {
      try {
        load(candidate);
        return candidate;
      } catch {
        // try the next candidate
      }
    }
    return null;
  }

  /** Find the declaration of `name` visible from `file`: local, imported, or re-exported. */
  function resolveName(file, name, seen = new Set()) {
    const key = `${file.path}#${name}`;
    if (seen.has(key)) return null;
    seen.add(key);
    const local = file.decls.get(name);
    if (local) return { file, decl: local };
    const link = file.imports.get(name) ?? file.reexports.get(name);
    if (link) {
      const target = locate(file, link.from);
      return target ? resolveName(load(target), link.name, seen) : null;
    }
    for (const from of file.exportAll) {
      const target = locate(file, from);
      const hit = target && resolveName(load(target), name, seen);
      if (hit) return hit;
    }
    return null;
  }

  return { load, resolveName };
}

/**
 * Text of the JSDoc block directly above `node`, split into description and
 * tags. With `keywords`, `export`/`declare` may sit between the two (a type
 * declaration's own comment precedes its `export`).
 */
function readDoc(file, node, keywords = false) {
  const between = keywords ? /^\s*(?:(?:export|declare)\s+)*$/ : /^\s*$/;
  const comment = file.comments.find(
    (c) => c.end <= node.start && between.test(file.src.slice(c.end, node.start))
  );
  const out = { description: '', default: undefined, deprecated: false };
  if (!comment) return out;
  const lines = comment.value
    .replace(/^\*/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\* ?/, '').trim());
  const desc = [];
  let tag = null;
  for (const line of lines) {
    const m = /^@(\w+)\s*(.*)$/.exec(line);
    if (m) {
      tag = m[1];
      if (tag === 'default') out.default = m[2];
      else if (tag === 'deprecated') out.deprecated = true;
    } else if (tag === null) {
      if (line) desc.push(line);
    } else if (tag === 'default' && line) {
      out.default = `${out.default} ${line}`.trim();
    }
  }
  out.description = desc.join(' ');
  return out;
}

const squash = (s) => s.replace(/\s+/g, ' ').trim();

/** Type members of a flattened type: name -> row. Returns null when it cannot be flattened. */
function createFlattener(loader) {
  function flattenNode(node, file, depth) {
    if (depth > 20) return null;
    switch (node.type) {
      case 'TSParenthesizedType':
        return flattenNode(node.typeAnnotation, file, depth + 1);
      case 'TSTypeLiteral':
        return literalRows(node, file);
      case 'TSIntersectionType': {
        const rows = new Map();
        const failed = [];
        for (const part of node.types) {
          const sub = flattenNode(part, file, depth + 1);
          if (!sub) failed.push(part);
          else for (const [k, v] of sub) rows.set(k, v);
        }
        if (failed.length === node.types.length) return null;
        for (const part of failed) skip(skipName(part, file));
        return rows;
      }
      case 'TSUnionType':
        return unionRows(node, file, depth);
      case 'TSTypeReference':
        return referenceRows(node, file, depth);
      default:
        return null;
    }
  }

  const isObjectShaped = (n) =>
    n.type === 'TSTypeLiteral' ||
    n.type === 'TSIntersectionType' ||
    (n.type === 'TSParenthesizedType' && isObjectShaped(n.typeAnnotation));

  // Source text of a type, with the package's own non-generic, non-object aliases
  // substituted by their text. React/DOM, generic and object-shaped types stay by name.
  function inlineType(node, file, depth) {
    const plain = () => squash(file.src.slice(node.start, node.end));
    if (depth > 20) return plain();
    if (node.type === 'TSUnionType') {
      const parts = [];
      for (const t of node.types) {
        for (const piece of inlineType(t, file, depth + 1).split(' | ')) {
          if (!parts.includes(piece)) parts.push(piece);
        }
      }
      return parts.join(' | ');
    }
    if (
      node.type === 'TSTypeReference' &&
      node.typeName.type === 'Identifier' &&
      !node.typeArguments
    ) {
      const found = loader.resolveName(file, node.typeName.name);
      const decl = found?.decl;
      if (
        decl?.type === 'TSTypeAliasDeclaration' &&
        !decl.typeParameters?.params?.length &&
        !isObjectShaped(decl.typeAnnotation)
      ) {
        return inlineType(decl.typeAnnotation, found.file, depth + 1);
      }
    }
    return plain();
  }

  function literalRows(node, file) {
    const rows = new Map();
    for (const m of node.members ?? node.body) {
      if (m.type !== 'TSPropertySignature' || m.computed) continue;
      const name = m.key.name ?? String(m.key.value);
      const doc = readDoc(file, m);
      const ann = m.typeAnnotation?.typeAnnotation;
      const row = {
        name,
        type: ann ? inlineType(ann, file, 0) : 'any',
        required: !m.optional,
        description: doc.description,
      };
      if (doc.default !== undefined) row.default = doc.default;
      if (doc.deprecated) row.deprecated = true;
      rows.set(name, row);
    }
    return rows;
  }

  // Top-level members of a union type text: `(a: X | Y) => void | Z` is two.
  const splitTop = (text) => {
    const parts = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if ('([{<'.includes(c)) depth++;
      else if (')]}'.includes(c) || (c === '>' && text[i - 1] !== '=')) depth--;
      else if (c === '|' && depth === 0) {
        parts.push(text.slice(start, i).trim());
        start = i + 1;
      }
    }
    parts.push(text.slice(start).trim());
    return parts.filter(Boolean);
  };
  const FORBIDS = new Set(['never', 'undefined']);
  const joinTypes = (parts) => {
    const set = new Set(parts);
    const bool = set.has('boolean') || (set.has('true') && set.has('false'));
    const named = parts.map((t) => (bool && (t === 'true' || t === 'false') ? 'boolean' : t));
    const unique = [...new Set(named)];
    // A function type joined with others needs parentheses to read as one member.
    return unique.length > 1
      ? unique.map((t) => (t.includes('=>') && !/^\(.*\)$/.test(t) ? `(${t})` : t)).join(' | ')
      : unique[0];
  };
  // Each prop listed once. A branch typing the prop only `never`/`undefined`
  // forbids it and does not define it. The row's type joins the defining
  // branches' types without `never`/`undefined`, reading `true`/`false` as
  // `boolean` when it has both or `boolean` already (so a `false` discriminant
  // or a `false | undefined` mutual exclusion reads `boolean`). Its description
  // joins the defining branches' distinct texts, and it is required only when
  // every branch defines it as required.
  function unionRows(node, file, depth) {
    const branches = [];
    for (const part of node.types) {
      const sub = flattenNode(part, file, depth + 1);
      if (!sub) return null;
      branches.push(sub);
    }
    const names = [...new Set(branches.flatMap((b) => [...b.keys()]))];
    const rows = new Map();
    for (const name of names) {
      const present = branches.map((b) => b.get(name)).filter(Boolean);
      const defining = present.filter((row) => !splitTop(row.type).every((t) => FORBIDS.has(t)));
      const types = defining.flatMap((r) => splitTop(r.type)).filter((t) => !FORBIDS.has(t));
      const texts = [...new Set(defining.map((r) => r.description).filter(Boolean))];
      const merged = {
        ...(defining.find((r) => r.description) ?? defining[0] ?? present[0]),
        type: types.length ? joinTypes(types) : present[0].type,
        description: texts.join(' '),
        required: defining.length === branches.length && defining.every((r) => r.required),
      };
      rows.set(name, merged);
    }
    return rows;
  }

  // Name of an external type that was left out of a table, looking through Omit/Pick-style wrappers.
  function skipName(node, file) {
    if (node.type === 'TSParenthesizedType') return skipName(node.typeAnnotation, file);
    if (node.type === 'TSTypeReference') {
      const args = node.typeArguments?.params ?? [];
      const tn = node.typeName;
      const wrapper =
        tn.type === 'Identifier' && ['Omit', 'Pick', 'Partial', 'Required'].includes(tn.name);
      if (wrapper && args.length) return skipName(args[0], file);
      return squash(file.src.slice(tn.start, tn.end));
    }
    return squash(file.src.slice(node.start, node.end));
  }

  let skipped = [];
  const skip = (name) => {
    if (!skipped.includes(name)) skipped.push(name);
  };

  function literalKeys(node) {
    if (node.type === 'TSLiteralType' && typeof node.literal.value === 'string') {
      return [node.literal.value];
    }
    if (node.type === 'TSUnionType') {
      const keys = node.types.map(literalKeys);
      return keys.every(Boolean) ? keys.flat() : null;
    }
    return null;
  }

  function referenceRows(node, file, depth) {
    const tn = node.typeName;
    const name = tn.type === 'TSQualifiedName' ? tn.right.name : tn.name;
    const args = node.typeArguments?.params ?? [];
    if (name === 'PropsWithChildren' && args.length === 1) {
      const inner = flattenNode(args[0], file, depth + 1);
      if (!inner) return null;
      const rows = new Map([
        ['children', { name: 'children', type: 'ReactNode', required: false, description: '' }],
      ]);
      for (const [k, v] of inner) rows.set(k, v);
      return rows;
    }
    if ((name === 'Omit' || name === 'Pick') && args.length === 2) {
      const keys = literalKeys(args[1]);
      const inner = flattenNode(args[0], file, depth + 1);
      if (!keys || !inner) return null;
      return new Map([...inner].filter(([k]) => (name === 'Omit') !== keys.includes(k)));
    }
    // A generic of this package (`BaseProps<V>`) flattens with its type
    // parameters left by name; library generics do not resolve and stay out.
    if (tn.type !== 'Identifier') return null;
    const found = loader.resolveName(file, tn.name);
    return found ? flattenDecl(found.decl, found.file, depth + 1) : null;
  }

  function flattenDecl(decl, file, depth) {
    if (decl.type === 'TSTypeAliasDeclaration') {
      return flattenNode(decl.typeAnnotation, file, depth);
    }
    const rows = new Map();
    for (const ext of decl.extends ?? []) {
      const ref = {
        type: 'TSTypeReference',
        typeName: ext.expression,
        typeArguments: ext.typeArguments,
        start: ext.start,
        end: ext.end,
      };
      const sub = flattenNode(ref, file, depth + 1);
      if (!sub) {
        skip(skipName(ref, file));
        continue;
      }
      for (const [k, v] of sub) rows.set(k, v);
    }
    for (const [k, v] of literalRows(decl.body, file)) rows.set(k, v);
    return rows;
  }

  return (decl, file) => {
    skipped = [];
    const rows = flattenDecl(decl, file, 0);
    return { rows, skipped: rows ? skipped : [] };
  };
}

const cmp = (x, y) => (x < y ? -1 : x > y ? 1 : 0);

/** `children` first, then case-insensitive alphabetical (ties by exact name). */
const byName = (a, b) => {
  if (a.name === 'children') return -1;
  if (b.name === 'children') return 1;
  return cmp(a.name.toLowerCase(), b.name.toLowerCase()) || cmp(a.name, b.name);
};

/**
 * Build one table per requested exported type name, following relative imports
 * between .d.ts files. Types that cannot be flattened fall back to their declared text.
 * @param {string} dtsPath
 * @param {string[]} names
 * @param {(p: string) => string} [readFile]
 * @returns {TypeTable[]}
 */
export function extractTypeTables(dtsPath, names, readFile = defaultRead) {
  const loader = createLoader(readFile);
  const flatten = createFlattener(loader);
  const entry = loader.load(resolve(dtsPath));
  return names.map((name) => {
    const found = loader.resolveName(entry, name);
    if (!found) throw new Error(`type ${name} not found from ${dtsPath}`);
    const { decl, file } = found;
    const { rows, skipped } = flatten(decl, file);
    const { description } = readDoc(file, decl, true);
    let out;
    if (!rows) {
      const body = decl.type === 'TSTypeAliasDeclaration' ? decl.typeAnnotation : decl;
      out = { name, kind: 'alias', rows: [], text: file.src.slice(body.start, body.end) };
    } else {
      out = {
        name,
        kind: name.endsWith('Props') ? 'props' : 'object',
        rows: [...rows.values()].sort(byName),
      };
      if (skipped.length) out.extends = skipped;
    }
    if (description) out.description = description;
    return out;
  });
}
