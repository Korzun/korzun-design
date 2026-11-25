import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseFrontMatter } from './front-matter.mjs';

test('parses keys and content', () => {
  const { data, content } = parseFrontMatter(
    '---\ntitle: Button\ncategory: Control\n---\n# Body\n'
  );
  assert.deepEqual(data, { title: 'Button', category: 'Control' });
  assert.equal(content, '# Body\n');
});

test('values may contain colons', () => {
  const { data } = parseFrontMatter('---\ndescription: A thing: with colon\n---\nx');
  assert.equal(data.description, 'A thing: with colon');
});

test('missing block returns the input', () => {
  assert.deepEqual(parseFrontMatter('# Hi\n'), { data: {}, content: '# Hi\n' });
});
