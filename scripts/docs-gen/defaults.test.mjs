import assert from 'node:assert/strict';
import { test } from 'node:test';

import { readDefaults } from './defaults.mjs';

test('reads literal defaults from a function declaration', () => {
  const src = `export function Menu({ type = 'default', size = 3, on = false, v = null, a = [], o = {}, neg = -1 }: P) { return null; }`;
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

test('reads function defaults by their source text, so no @default tag is needed', () => {
  const src = `export function X({ onChange = () => {}, validate = (v) =>
    v === '' }) {}`;
  assert.deepEqual(readDefaults(src, 'X'), {
    onChange: '() => {}',
    validate: "(v) => v === ''",
  });
});

test('reads other non-literal defaults by source text, without a type assertion', () => {
  const src = `export function X({ onClick = noop, type = Type.Default as TypeValue, gap = \`\${n}px\` }) {}`;
  assert.deepEqual(readDefaults(src, 'X'), {
    onClick: 'noop',
    type: 'Type.Default',
    gap: '`${n}px`',
  });
});

test('keeps renamed destructures under the prop name', () => {
  const src = `export function X({ prefix: Prefix = 'a' }) {}`;
  assert.deepEqual(readDefaults(src, 'X'), { prefix: "'a'" });
});

test('returns empty for unknown component or non-object params', () => {
  assert.deepEqual(readDefaults(`export function X(props) {}`, 'X'), {});
  assert.deepEqual(readDefaults(`export function X({a = 1}) {}`, 'Y'), {});
});
