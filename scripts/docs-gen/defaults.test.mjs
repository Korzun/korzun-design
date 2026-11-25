import assert from 'node:assert/strict';
import { test } from 'node:test';

import { readDefaults } from './defaults.mjs';

test('reads literal defaults from a function declaration', () => {
  const src = `export function Menu({ type = 'default', size = 3, on = false, v = null, a = [], o = {}, neg = -1, onClick = noop }: P) { return null; }`;
  assert.deepEqual(readDefaults(src, 'Menu'), {
    type: "'default'",
    size: '3',
    on: 'false',
    v: 'null',
    a: '[]',
    o: '{}',
    neg: '-1',
  });
});

test('reads defaults from a const arrow component', () => {
  const src = `export const Button = ({ variant = "solid", disabled = false, ...rest }: ButtonProps) => null;`;
  assert.deepEqual(readDefaults(src, 'Button'), { variant: '"solid"', disabled: 'false' });
});

test('omits non-literal defaults', () => {
  const src = `export function X({ onClick = noop, n = 1 }) {}`;
  const out = readDefaults(src, 'X');
  assert.equal('onClick' in out, false);
  assert.equal(out.n, '1');
});

test('keeps renamed destructures under the prop name', () => {
  const src = `export function X({ prefix: Prefix = 'a' }) {}`;
  assert.deepEqual(readDefaults(src, 'X'), { prefix: "'a'" });
});

test('returns empty for unknown component or non-object params', () => {
  assert.deepEqual(readDefaults(`export function X(props) {}`, 'X'), {});
  assert.deepEqual(readDefaults(`export function X({a = 1}) {}`, 'Y'), {});
});
