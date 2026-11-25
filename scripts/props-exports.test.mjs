import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { barrelExports } from './docs-gen/barrels.mjs';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');

test('barrelExports separates values and types', () => {
  const { values, types } = barrelExports(
    "export { A, type AProps } from './a.js';\nexport type { B as C, D } from './b.js';"
  );
  assert.deepEqual([...values], ['A']);
  assert.deepEqual([...types], ['AProps', 'C', 'D']);
});

for (const area of ['control', 'component']) {
  const { values, types } = barrelExports(
    readFileSync(join(repo, 'src', area, 'index.ts'), 'utf8')
  );
  for (const name of values) {
    if (!/^[A-Z]/.test(name)) continue; // hooks and helpers take arguments, not props
    test(`${area} barrel exports ${name}Props`, () => {
      assert.ok(
        types.has(`${name}Props`),
        `src/${area}/index.ts exports ${name} but not ${name}Props`
      );
    });
  }
}
