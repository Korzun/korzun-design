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

test('@viewport mobile in the doc comment marks a phone-width example, off the description', () => {
  const src = `/** Back
 * Shown on phones only.
 * @viewport mobile
 */
const a = 1;
`;
  const ex = readExample('src/component/back-button/examples/01-back.tsx', src);
  assert.equal(ex.viewport, 'mobile');
  assert.equal(ex.description, 'Shown on phones only.');
  assert.equal(ex.code, 'const a = 1;\n');
  assert.equal(readExample('01-a.tsx', `/** T */\nx`).viewport, undefined);
});

test('an unknown @viewport value throws', () => {
  assert.throws(() => readExample('01-a.tsx', `/** T\n * @viewport tablet\n */\nx`), {
    message: 'Example 01-a.tsx: @viewport must be "mobile" or "desktop", not "tablet"',
  });
});

test('preview.tsx reads as the module preview: slug "preview", order 0', () => {
  const ex = readExample('src/control/button/examples/preview.tsx', `/** Preview */\nx\n`);
  assert.equal(ex.slug, 'preview');
  assert.equal(ex.order, 0);
  assert.equal(ex.title, 'Preview');
});

test('@viewport desktop marks a desktop-only example', () => {
  const ex = readExample('src/control/x/examples/preview.tsx', `/** Preview\n * @viewport desktop\n */\nx\n`);
  assert.equal(ex.viewport, 'desktop');
});
