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

test("a parameter typed Theme['group'] reads that group: the group passed whole is not listed", () => {
  const src = `import type { Theme } from '../../theme/theme.js';
export const pick = (radius: Theme['radius'], depth: number): string =>
  depth <= 0 ? radius.lg : radius.sm;
export const useR = () => { const theme = useTheme(); return pick(theme.radius, 0); };`;
  assert.deepEqual(collectTokenPaths(src, 'index.tsx'), ['radius.lg', 'radius.sm']);
});

test("a nested Theme['color']['text'] parameter keeps both levels", () => {
  const src = `const f = (text: Theme['color']['text']) => text.primary;
const g = (theme) => ({ a: f(theme.color.text), b: theme.space.md });`;
  assert.deepEqual(collectTokenPaths(src), ['color.text.primary', 'space.md']);
});

test("a computed access on a Theme['group'] parameter lists the whole group", () => {
  const src = `const f = (space: Theme['space'], k: string) => space[k];`;
  assert.deepEqual(collectTokenPaths(src), ['space']);
});

test('reads tsx source (an entry index.tsx)', () => {
  const src = `export const X = () => { const theme = useTheme(); return <div style={{ gap: theme.space.sm }} />; };`;
  assert.deepEqual(collectTokenPaths(src, 'index.tsx'), ['space.sm']);
});

const themePath = resolve(root, 'dist/theme/theme.js');

test(
  'resolves tokens against the built themes',
  { skip: !existsSync(themePath) && 'dist missing; run npm run build' },
  async () => {
    const { lightTheme, darkTheme } = await import(pathToFileURL(themePath).href);
    const rows = resolveTokens(
      [
        'color.text.primary',
        'recipe.focusRing',
        'space.md',
        'nope.x',
        'color.chip.danger',
        'fontWeight.bold',
      ],
      lightTheme,
      darkTheme
    );
    const fw = rows.find((r) => r.path.startsWith('fontWeight.'));
    assert.match(fw.light, /^\d+$/);
    assert.equal(fw.kind, 'value');
    const [text, recipe, space, ...chip] = rows.filter((r) => !r.path.startsWith('fontWeight.'));
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
