import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';

import { collectTokenPaths, resolveTokens } from './tokens.mjs';

const root = resolve(import.meta.dirname, '../..');

test('collects member paths from the real button style', () => {
  const paths = collectTokenPaths(
    readFileSync(resolve(root, 'src/control/button/style.ts'), 'utf8')
  );
  assert.ok(paths.includes('color.text.primary'));
  assert.ok(paths.includes('recipe.focusRing'));
  assert.deepEqual(paths, [...new Set(paths)].sort());
  assert.ok(paths.every((p) => !p.startsWith('theme.')));
});

test('stops at computed access and keeps shared prefixes', () => {
  const src = `const s = (theme) => ({ a: theme.space[gap], b: theme.space.md, c: theme.color[k].x, d: theme.radius.lg });`;
  assert.deepEqual(collectTokenPaths(src), ['color', 'radius.lg', 'space', 'space.md']);
});

const themePath = resolve(root, 'dist/theme/theme.js');

test(
  'resolves tokens against the built themes',
  { skip: !existsSync(themePath) && 'dist missing; run npm run build' },
  async () => {
    const { lightTheme, darkTheme } = await import(pathToFileURL(themePath).href);
    const rows = resolveTokens(
      ['color.text.primary', 'recipe.focusRing', 'space.md', 'nope.x', 'color.chip.danger'],
      lightTheme,
      darkTheme
    );
    const [text, recipe, space, ...chip] = rows;
    assert.equal(text.kind, 'color');
    assert.equal(typeof text.light, 'string');
    assert.notEqual(text.light, text.dark);
    assert.equal(recipe.kind, 'recipe');
    assert.equal(recipe.light, null);
    assert.equal(space.kind, 'value');
    assert.ok(!rows.some((r) => r.path === 'nope.x'));
    assert.ok(chip.length > 0);
    for (const r of chip) {
      assert.match(r.path, /^color\.chip\.danger\./);
      assert.ok(r.light !== null || r.dark !== null);
    }
  }
);
