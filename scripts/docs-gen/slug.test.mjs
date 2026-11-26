import assert from 'node:assert/strict';
import { test } from 'node:test';

import { anchor } from './slug.mjs';

test('anchor: GitHub-style heading slugs, the ids docs link to', () => {
  assert.equal(anchor('Header slot'), 'header-slot');
  assert.equal(anchor('Controlled-ish'), 'controlled-ish');
  assert.equal(anchor('MenuIntentProps'), 'menuintentprops');
  assert.equal(anchor('Choosing a tone'), 'choosing-a-tone');
  assert.equal(anchor('use_thing (beta)!'), 'use_thing-beta');
});
