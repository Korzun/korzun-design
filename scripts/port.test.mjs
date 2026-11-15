import assert from 'node:assert/strict';
import { test } from 'node:test';

import { rewriteImports } from './port.mjs';

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
