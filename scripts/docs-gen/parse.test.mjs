import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseOrThrow } from './parse.mjs';

test('parseOrThrow: returns the program and comments of valid source', () => {
  const { program, comments } = parseOrThrow('a.ts', '/** doc */\nconst a = 1;', 'ts');
  assert.equal(program.body.length, 1);
  assert.equal(comments.length, 1);
});

test('parseOrThrow: a syntax error throws naming the file and the message', () => {
  assert.throws(
    () => parseOrThrow('src/x/style.ts', 'const = ;', 'ts'),
    (err) => {
      assert.match(err.message, /^src\/x\/style\.ts: /);
      assert.ok(err.message.length > 'src/x/style.ts: '.length);
      return true;
    }
  );
});
