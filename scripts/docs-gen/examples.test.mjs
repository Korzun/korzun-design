import assert from 'node:assert/strict';
import { test } from 'node:test';

import { readExample } from './examples.mjs';

test('reads order, slug, title, description and code', () => {
  const src = `/** Basic usage\n * Shows the default button.\n * Second line.\n */\n\nimport x from 'y';\nexport default () => null;\n`;
  const ex = readExample('src/control/button/examples/02-basic-usage.tsx', src);
  assert.equal(ex.order, 2);
  assert.equal(ex.slug, 'basic-usage');
  assert.equal(ex.title, 'Basic usage');
  assert.equal(ex.description, 'Shows the default button.\nSecond line.');
  assert.equal(ex.code, `import x from 'y';\nexport default () => null;\n`);
});

test('title-only single-line comment', () => {
  const ex = readExample('01-a.tsx', `/** Just a title */\nconst a = 1;\n`);
  assert.equal(ex.title, 'Just a title');
  assert.equal(ex.description, '');
  assert.equal(ex.code, 'const a = 1;\n');
});

test('throws without a title comment', () => {
  assert.throws(() => readExample('01-a.tsx', 'const a = 1;'), {
    message: 'Example 01-a.tsx: needs a leading doc comment with a title',
  });
});

test('throws on a bad file name', () => {
  assert.throws(() => readExample('basic.tsx', '/** T */\nx'), {
    message: 'Example basic.tsx: name must be NN-slug.tsx',
  });
});
