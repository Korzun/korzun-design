import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

import { CATEGORIES, moduleOrder } from './categories.mjs';
import { parseFrontMatter } from './front-matter.mjs';
import { listModules } from './inventory.mjs';

const repo = join(import.meta.dirname, '..', '..');
const modules = listModules(repo);
const order = moduleOrder();

test('categories.mjs lists every documented module exactly once', () => {
  const listed = order.map((m) => m.slug);
  assert.equal(new Set(listed).size, listed.length, 'a module is listed twice');
  assert.deepEqual([...listed].sort(), modules.map((m) => m.slug).sort());
});

test("each doc's front matter category is its section in categories.mjs", () => {
  const placed = new Map(order.map((m) => [m.slug, m.category]));
  for (const m of modules) {
    const { data } = parseFrontMatter(readFileSync(join(repo, m.docPath), 'utf8'));
    assert.equal(data.category, placed.get(m.slug), m.docPath);
  }
});

test('Hooks is the last section and a parent is never itself nested', () => {
  assert.equal(CATEGORIES.at(-1), 'Hooks');
  const children = new Set(order.filter((m) => m.parent).map((m) => m.slug));
  for (const child of order.filter((m) => m.parent)) assert.ok(!children.has(child.parent), child.slug);
});

test('moduleOrder puts nested modules right after their parent', () => {
  const slugs = order.map((m) => m.slug);
  const page = slugs.indexOf('page');
  assert.deepEqual(order.slice(page, page + 4), [
    { slug: 'page', category: 'Layout' },
    { slug: 'page-actions-bar', category: 'Layout', parent: 'page' },
    { slug: 'page-actions-menu', category: 'Layout', parent: 'page' },
    { slug: 'page-footer-actions', category: 'Layout', parent: 'page' },
  ]);
});
