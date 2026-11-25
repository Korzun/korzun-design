import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Names a barrel exports, split into runtime values and types. Handles
// `export { A, type B } from` and `export type { C, D as E } from`.
export const barrelExports = (text) => {
  const values = new Set();
  const types = new Set();
  for (const [, typeOnly, list] of text.matchAll(/export\s+(type\s+)?\{([^}]*)\}/g)) {
    for (const raw of list.split(',')) {
      const spec = raw.trim();
      if (!spec) continue;
      const isType = Boolean(typeOnly) || spec.startsWith('type ');
      const name = spec
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)
        .pop()
        .trim();
      (isType ? types : values).add(name);
    }
  }
  return { values, types };
};

// One entry per `export { ... } from '<from>'` statement, so callers can group
// names by the module they come from. `from` is '' for a local `export { A }`.
export const barrelStatements = (text) => {
  const out = [];
  const re = /export\s+(type\s+)?\{([^}]*)\}(?:\s*from\s*['"]([^'"]+)['"])?/g;
  for (const [, typeOnly, list, from = ''] of text.matchAll(re)) {
    const values = [];
    const types = [];
    for (const raw of list.split(',')) {
      const spec = raw.trim();
      if (!spec) continue;
      const name = spec
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)
        .pop()
        .trim();
      (typeOnly || spec.startsWith('type ') ? types : values).push(name);
    }
    out.push({ from, values, types });
  }
  return out;
};

export const BARREL_AREAS = ['control', 'component', 'theme', 'toast', 'icon', 'hooks'];

// Every runtime value the package barrels export: the valid changelog tags
// besides `General`. Type names (ButtonProps, TagTone) are not tags.
export const knownNames = (repo) => {
  const names = new Set();
  for (const area of BARREL_AREAS) {
    const { values } = barrelExports(readFileSync(join(repo, 'src', area, 'index.ts'), 'utf8'));
    for (const name of values) names.add(name);
  }
  return names;
};
