import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { barrelStatements } from './barrels.mjs';
import { listModules } from './inventory.mjs';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const modules = listModules(repo);
const byId = (id) => modules.find((m) => m.id === id);

test('barrelStatements keeps each statement with its from path', () => {
  const s = barrelStatements(
    "export { A, type B } from './a/index.js';\nexport type { C as D } from './c.js';"
  );
  assert.deepEqual(s, [
    { from: './a/index.js', values: ['A'], types: ['B'] },
    { from: './c.js', values: [], types: ['D'] },
  ]);
});

test('component/surface groups values and types', () => {
  const m = byId('component/surface');
  assert.deepEqual(m.values, ['Surface', 'useSurfaceRadius']);
  assert.deepEqual(m.types, ['SurfaceProps']);
  assert.equal(m.slug, 'surface');
  assert.equal(m.entry, '@korzun/design/component');
  assert.equal(m.docPath, 'docs/component/surface.md');
  assert.equal(m.srcDir, 'src/component/surface');
  assert.equal(m.dtsDir, 'dist/component/surface');
});

test('control/menu includes MenuItem', () => {
  assert.ok(byId('control/menu').types.includes('MenuItem'));
});

test('nav-types join nav-desktop only', () => {
  assert.ok(byId('component/nav-desktop').types.includes('NavItem'));
  assert.ok(!byId('component/nav-mobile').types.includes('NavItem'));
});

test('single-module areas', () => {
  assert.ok(byId('icon').values.includes('CheckIcon'));
  assert.ok(byId('theme').values.includes('createUseStyles'));
  assert.equal(byId('toast').docPath, 'docs/toast.md');
  assert.equal(byId('icon').dtsDir, 'dist/icon');
});

test('internal folders are excluded', () => {
  for (const m of modules) assert.ok(!/layer-stack/.test(m.id), m.id);
  assert.ok(byId('component/meta-line'));
});

test('control+component module count equals their doc files', () => {
  const docs = ['control', 'component'].flatMap((a) =>
    readdirSync(join(repo, 'docs', a)).filter((f) => f.endsWith('.md'))
  );
  const n = modules.filter((m) => /^(control|component)\//.test(m.id)).length;
  assert.equal(n, docs.length);
});

test('hooks are one module per folder, each with its constants and types', () => {
  const pull = byId('hooks/use-pull-to-refresh');
  assert.deepEqual(pull.values, ['PULL_THRESHOLD', 'usePullToRefresh']);
  assert.deepEqual(pull.types, ['PullPhase', 'PullState']);
  assert.equal(pull.slug, 'use-pull-to-refresh');
  assert.equal(pull.entry, '@korzun/design/hooks');
  assert.equal(pull.docPath, 'docs/hooks/use-pull-to-refresh.md');
  assert.equal(pull.dtsDir, 'dist/hooks/use-pull-to-refresh');
  assert.deepEqual(byId('hooks/use-minimize-on-scroll').values, [
    'EXPAND_AFTER',
    'MINIMIZE_SPEED',
    'useMinimizeOnScroll',
  ]);
  assert.deepEqual(byId('hooks/use-minimize-on-scroll').types, ['MinimizeOnScroll']);
  assert.deepEqual(byId('hooks/use-is-standalone').values, ['useIsStandalone']);
  assert.equal(byId('hooks'), undefined);
});

test('hooks module count equals their doc files', () => {
  const docs = readdirSync(join(repo, 'docs', 'hooks')).filter((f) => f.endsWith('.md'));
  assert.equal(modules.filter((m) => m.id.startsWith('hooks/')).length, docs.length);
});
