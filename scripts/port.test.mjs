import assert from 'node:assert/strict';
import { test } from 'node:test';

import { addExtensions, rewriteImports } from './port.mjs';

test('rewrites control and provider aliases relative to the destination file', () => {
  const source =
    "import { Button } from '~/control/button';\nimport { useTheme } from '~/provider/theme';";
  assert.equal(
    rewriteImports(source, 'src/component/page/index.tsx'),
    "import { Button } from '../../control/button';\nimport { useTheme } from '../../theme';"
  );
});

test('rewrites a theme import from a control style file', () => {
  assert.equal(
    rewriteImports("import { useTheme } from '~/provider/theme';", 'src/control/button/style.ts'),
    "import { useTheme } from '../../theme';"
  );
});

test('rewrites a utils import to a file path without index', () => {
  assert.equal(
    rewriteImports("import { x } from '~/utils';", 'src/theme/theme.ts'),
    "import { x } from '../utils';"
  );
});

test('prefixes ./ when the target is in the same folder', () => {
  assert.equal(
    rewriteImports("import { x } from '~/utils';", 'src/foo.ts'),
    "import { x } from './utils';"
  );
});

test('maps hooks, icon, toast and test-utils', () => {
  const source = [
    "import a from '~/lib/use-pull-to-refresh';",
    "import b from '~/icon';",
    "import c from '~/provider/toast';",
    "import d from '~/test-utils';",
  ].join('\n');
  assert.equal(
    rewriteImports(source, 'src/component/x/index.tsx'),
    [
      "import a from '../../hooks/use-pull-to-refresh';",
      "import b from '../../icon';",
      "import c from '../../toast';",
      "import d from '../../test-utils';",
    ].join('\n')
  );
});

test('handles type imports, re-exports, side-effect imports and double quotes', () => {
  const source = [
    "import type { T } from '~/utils';",
    "export { y } from '~/icon';",
    "import '~/utils';",
    'import { z } from "~/utils";',
  ].join('\n');
  assert.equal(
    rewriteImports(source, 'src/theme/a.ts'),
    [
      "import type { T } from '../utils';",
      "export { y } from '../icon';",
      "import '../utils';",
      'import { z } from "../utils";',
    ].join('\n')
  );
});

test('leaves relative and package imports alone', () => {
  const source = "import a from './a';\nimport b from 'react';";
  assert.equal(rewriteImports(source, 'src/x.ts'), source);
});

test('throws UNMAPPED for a bare barrel import', () => {
  assert.throws(
    () => rewriteImports("import { Button } from '~/control';", 'src/component/page/index.tsx'),
    /UNMAPPED src\/component\/page\/index\.tsx: ~\/control/
  );
});

test('throws UNMAPPED for an unknown alias and reports every miss', () => {
  assert.throws(
    () => rewriteImports("import a from '~/gql';\nimport b from '~/api';", 'src/x.ts'),
    (error) =>
      error.message.includes('UNMAPPED src/x.ts: ~/gql') &&
      error.message.includes('UNMAPPED src/x.ts: ~/api')
  );
});

const tree = (entries) => (candidate) => entries[candidate] ?? null;

test('addExtensions appends .js to a file specifier', () => {
  const exists = tree({ 'src/theme/theme.ts': 'file', 'src/control/x/style.ts': 'file' });
  assert.equal(
    addExtensions("import a from './theme';", 'src/theme/index.ts', exists),
    "import a from './theme.js';"
  );
  assert.equal(
    addExtensions("export { s } from './style';", 'src/control/x/index.tsx', exists),
    "export { s } from './style.js';"
  );
});

test('addExtensions appends .js for a .tsx file', () => {
  const exists = tree({ 'src/theme/provider.tsx': 'file' });
  assert.equal(
    addExtensions("export * from './provider';", 'src/theme/index.ts', exists),
    "export * from './provider.js';"
  );
});

test('addExtensions appends /index.js to a directory specifier', () => {
  const exists = tree({
    'src/theme': 'dir',
    'src/theme/index.ts': 'file',
    'src/control/back-button': 'dir',
    'src/control/back-button/index.tsx': 'file',
  });
  const source = [
    "export * from './theme';",
    "import { B } from './control/back-button';",
    "const m = import('./theme');",
  ].join('\n');
  const destFile = 'src/index.ts';
  assert.equal(
    addExtensions(source, destFile, exists),
    [
      "export * from './theme/index.js';",
      "import { B } from './control/back-button/index.js';",
      "const m = import('./theme/index.js');",
    ].join('\n')
  );
});

test('addExtensions leaves already-suffixed specifiers alone', () => {
  const source = [
    "import a from './theme.js';",
    "import b from './data.json';",
    "import './reset.css';",
    "export * from '../x/index.js';",
  ].join('\n');
  assert.equal(addExtensions(source, 'src/theme/index.ts', tree({})), source);
});

test('addExtensions leaves package specifiers alone', () => {
  const source = "import a from 'react';\nimport b from '@korzun/design/theme';\nimport c from '~/x';";
  assert.equal(addExtensions(source, 'src/x.ts', tree({})), source);
});

test('addExtensions reports every unresolved specifier and keeps the rest rewritten', () => {
  const exists = tree({ 'src/a.ts': 'file' });
  assert.throws(
    () => addExtensions("import a from './a';\nimport b from './missing';", 'src/x.ts', exists),
    (error) =>
      error.message === 'UNRESOLVED src/x.ts: ./missing' &&
      error.output === "import a from './a.js';\nimport b from './missing';"
  );
});

test('addExtensions treats a directory without an index as unresolved', () => {
  assert.throws(
    () => addExtensions("import a from './empty';", 'src/x.ts', tree({ 'src/empty': 'dir' })),
    /UNRESOLVED src\/x\.ts: \.\/empty/
  );
});
