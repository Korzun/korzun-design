import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');

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
      const name = spec.replace(/^type\s+/, '').split(/\s+as\s+/).pop().trim();
      (isType ? types : values).add(name);
    }
  }
  return { values, types };
};

test('barrelExports separates values and types', () => {
  const { values, types } = barrelExports(
    "export { A, type AProps } from './a.js';\nexport type { B as C, D } from './b.js';"
  );
  assert.deepEqual([...values], ['A']);
  assert.deepEqual([...types], ['AProps', 'C', 'D']);
});

for (const area of ['control', 'component']) {
  const { values, types } = barrelExports(readFileSync(join(repo, 'src', area, 'index.ts'), 'utf8'));
  for (const name of values) {
    if (!/^[A-Z]/.test(name)) continue; // hooks and helpers take arguments, not props
    test(`${area} barrel exports ${name}Props`, () => {
      assert.ok(types.has(`${name}Props`), `src/${area}/index.ts exports ${name} but not ${name}Props`);
    });
  }
}
