import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { barrelExports } from './docs-gen/barrels.mjs';
import { componentPropsTypes } from './docs-gen/props.mjs';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');

test('barrelExports separates values and types', () => {
  const { values, types } = barrelExports(
    "export { A, type AProps } from './a.js';\nexport type { B as C, D } from './b.js';"
  );
  assert.deepEqual([...values], ['A']);
  assert.deepEqual([...types], ['AProps', 'C', 'D']);
});

// The entry points have no one-name-one-module rule (every icon takes
// IconProps), so each component's props type, read from its built .d.ts,
// must be one the entry exports.
const ENTRIES = ['theme', 'toast', 'icon'];
const built = existsSync(join(repo, 'dist'));

for (const area of ENTRIES) {
  const { values, types } = barrelExports(
    readFileSync(join(repo, 'src', area, 'index.ts'), 'utf8')
  );
  const components = [...values].filter((name) => /^[A-Z]/.test(name));
  const taken = built
    ? componentPropsTypes(join(repo, 'dist', area, 'index.d.ts'), components)
    : new Map();
  for (const name of components) {
    test(
      `${area} entry exports the props type ${name} takes`,
      { skip: !built && 'dist missing; run npm run build' },
      () => {
        const type = taken.get(name);
        if (!type) return; // no parameter (GlobalStyles) or an inline type
        assert.ok(types.has(type), `src/${area}/index.ts exports ${name} but not ${type}`);
      }
    );
  }
}

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
