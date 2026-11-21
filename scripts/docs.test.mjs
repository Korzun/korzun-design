import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');
const internal = ['control/action-menu-list', 'component/metadata'];

const moduleDirs = (area) =>
  readdirSync(join(repo, 'src', area), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .filter((d) => ['index.ts', 'index.tsx'].some((f) => existsSync(join(repo, 'src', area, d.name, f))))
    .map((d) => `${area}/${d.name}`);

// docs/superpowers holds internal plans and specs; it is not shipped or indexed.
const docFiles = (dir = join(repo, 'docs')) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory()
      ? d.name === 'superpowers'
        ? []
        : docFiles(join(dir, d.name))
      : d.name.endsWith('.md')
        ? [join(dir, d.name)]
        : []
  );

// AGENTS.md index lines: `[docs/control]|{a,b}.md` or `[docs]|a.md: note|b.md`.
export const parseIndex = (text) =>
  text
    .split('\n')
    .filter((l) => /^\[docs[^\]]*\]\|/.test(l))
    .flatMap((line) => {
      const [head, ...items] = line.split('|');
      const dir = head.slice(1, -1);
      return items.flatMap((item) => {
        const name = item.split(':')[0].trim();
        const group = name.match(/^\{(.+)\}\.md$/);
        return (group ? group[1].split(',').map((n) => `${n}.md`) : [name]).map((n) => `${dir}/${n}`);
      });
    });

const indexed = parseIndex(readFileSync(join(repo, 'AGENTS.md'), 'utf8'));

test('parseIndex expands groups and strips notes', () => {
  assert.deepEqual(parseIndex('x\n[docs]|a.md: note|b.md\n[docs/c]|{d,e}.md'), [
    'docs/a.md',
    'docs/b.md',
    'docs/c/d.md',
    'docs/c/e.md',
  ]);
});

for (const mod of [...moduleDirs('control'), ...moduleDirs('component')]) {
  if (internal.includes(mod)) continue;
  test(`${mod} has docs/${mod}.md`, () => {
    assert.ok(existsSync(join(repo, 'docs', `${mod}.md`)), `missing docs/${mod}.md`);
  });
}

test('every AGENTS.md index entry exists', () => {
  for (const p of indexed) assert.ok(existsSync(join(repo, p)), `AGENTS.md indexes missing ${p}`);
});

test('every doc is in the AGENTS.md index', () => {
  for (const f of docFiles()) {
    const p = relative(repo, f);
    assert.ok(indexed.includes(p), `${p} is not in the AGENTS.md docs index`);
  }
});

test('relative links in AGENTS.md and docs resolve', () => {
  for (const f of [join(repo, 'AGENTS.md'), ...docFiles()]) {
    for (const [, target] of readFileSync(f, 'utf8').matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)) {
      if (/^[a-z]+:/.test(target)) continue;
      assert.ok(existsSync(join(dirname(f), target)), `${relative(repo, f)} links to missing ${target}`);
    }
  }
});
