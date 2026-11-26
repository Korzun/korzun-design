import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';

import { extractTypeTables } from './props.mjs';

const files = (map) => (p) => {
  if (!(p in map)) throw new Error(`no such file ${p}`);
  return map[p];
};
const table = (src, name, extra = {}) =>
  extractTypeTables('/x/a.d.ts', [name], files({ '/x/a.d.ts': src, ...extra }))[0];
const row = (t, name) => t.rows.find((r) => r.name === name);

test('flattens an alias imported from a sibling .d.ts', () => {
  const t = table(
    `import { ButtonTypeValue } from './style.js';
export type ButtonProps = { type?: ButtonTypeValue };`,
    'ButtonProps',
    { '/x/style.d.ts': `export type ButtonTypeValue = 'default' | 'primary';` }
  );
  assert.equal(row(t, 'type').type, "'default' | 'primary'");
  // The alias itself is still reachable as its own table.
  const alias = extractTypeTables(
    '/x/a.d.ts',
    ['ButtonTypeValue'],
    files({
      '/x/a.d.ts': `export type { ButtonTypeValue } from './style.js';`,
      '/x/style.d.ts': `export type ButtonTypeValue = 'default' | 'primary';`,
    })
  )[0];
  assert.equal(alias.kind, 'alias');
  assert.equal(alias.text, "'default' | 'primary'");
});

test('PropsWithChildren adds children: ReactNode', () => {
  const t = table(`export type XProps = React.PropsWithChildren<{ a?: string }>;`, 'XProps');
  assert.deepEqual(row(t, 'children'), {
    name: 'children',
    type: 'ReactNode',
    required: false,
    description: '',
  });
  assert.equal(t.rows[0].name, 'children');
});

test('rows sort case-insensitively, children first', () => {
  const t = table(
    `export interface XProps { tone: string; Icon?: string; action?: string; children?: string; className?: string }`,
    'XProps'
  );
  assert.deepEqual(
    t.rows.map((r) => r.name),
    ['children', 'action', 'className', 'Icon', 'tone']
  );
});

test('intersection merges members; later wins', () => {
  const t = table(`export type XProps = { a: string; b?: number } & { a?: boolean };`, 'XProps');
  assert.equal(row(t, 'a').type, 'boolean');
  assert.equal(row(t, 'a').required, false);
  assert.equal(row(t, 'b').type, 'number');
});

test('union of object branches lists each prop once', () => {
  const t = table(
    `type V = {
  /** Red treatment for destructive actions. */
  danger?: boolean;
  success?: false | undefined;
} | {
  /** Green treatment. */
  success?: boolean;
  danger?: false | undefined;
};
export type XProps = { a?: string } & V;`,
    'XProps'
  );
  assert.deepEqual(
    t.rows.map((r) => r.name),
    ['a', 'danger', 'success']
  );
  assert.equal(row(t, 'danger').type, 'boolean');
  assert.equal(row(t, 'danger').description, 'Red treatment for destructive actions.');
  assert.equal(row(t, 'danger').required, false);
  assert.equal(row(t, 'success').description, 'Green treatment.');
});

test('interface with extends is flattened', () => {
  const t = table(
    `interface B { /** from b */ b: string }
export interface AProps extends B { x: string }`,
    'AProps'
  );
  assert.deepEqual(
    t.rows.map((r) => [r.name, r.required]),
    [
      ['b', true],
      ['x', true],
    ]
  );
  assert.equal(row(t, 'b').description, 'from b');
});

test("Omit<T, 'a' | 'b'> and Pick<T, 'c'> with literal keys", () => {
  const src = `type T = { a: 1; b: 2; c: 3; d: 4 };
export type OProps = Omit<T, 'a' | 'b'>;
export type PProps = Pick<T, 'c'>;`;
  assert.deepEqual(
    table(src, 'OProps').rows.map((r) => r.name),
    ['c', 'd']
  );
  assert.deepEqual(
    table(src, 'PProps').rows.map((r) => r.name),
    ['c']
  );
});

test('required is true only without ?', () => {
  const t = table(`export type XProps = { a: string; b?: string };`, 'XProps');
  assert.equal(row(t, 'a').required, true);
  assert.equal(row(t, 'b').required, false);
});

test('@default tag fills default, @deprecated sets deprecated, description excludes tags', () => {
  const t = table(
    `export type XProps = {
  /**
   * Spans two
   * lines.
   * @default 'md'
   * @deprecated use b
   */
  a?: string;
  /** Plain. */
  b?: string;
};`,
    'XProps'
  );
  assert.equal(row(t, 'a').description, 'Spans two lines.');
  assert.equal(row(t, 'a').default, "'md'");
  assert.equal(row(t, 'a').deprecated, true);
  assert.equal('default' in row(t, 'b'), false);
  assert.equal('deprecated' in row(t, 'b'), false);
});

test('unflattenable type falls back to declared text', () => {
  const t = table(`export type XProps = SomeGeneric<X>[keyof X];`, 'XProps');
  assert.equal(t.kind, 'alias');
  assert.deepEqual(t.rows, []);
  assert.equal(t.text, 'SomeGeneric<X>[keyof X]');
});

test("union alias (AlertTone) yields kind 'alias' with text; object alias not ending in Props is 'object'", () => {
  const src = `export type AlertTone = 'info' | 'danger';
export type Shape = { a: string };`;
  const [tone, shape] = extractTypeTables(
    '/x/a.d.ts',
    ['AlertTone', 'Shape'],
    files({ '/x/a.d.ts': src })
  );
  assert.equal(tone.kind, 'alias');
  assert.equal(tone.text, "'info' | 'danger'");
  assert.equal(shape.kind, 'object');
});

test('unknown type name throws', () => {
  assert.throws(() => table(`export type A = {};`, 'Nope'), /Nope/);
});

const realDts = 'dist/control/button/index.d.ts';
test(
  'real ButtonProps',
  { skip: !existsSync(realDts) && `${realDts} missing; run npm run build` },
  () => {
    const [t] = extractTypeTables(realDts, ['ButtonProps']);
    const names = t.rows.map((r) => r.name);
    for (const n of ['type', 'radius', 'danger', 'success', 'children'])
      assert.ok(names.includes(n), n);
    assert.equal(names[0], 'children');
    const lower = names.slice(1).map((n) => n.toLowerCase());
    assert.deepEqual(lower, [...lower].sort());
    assert.equal(row(t, 'danger').type, 'boolean');
    assert.equal(row(t, 'type').type, "'default' | 'primary' | 'text' | 'link' | 'dashed'");
  }
);

test('object-shaped, generic and external alias references stay by name', () => {
  const t = table(
    `import { ComponentType } from 'react';
type Box = { w: number };
type Wrap<T> = T[];
export type XProps = { a?: Box; b?: Wrap<string>; c?: ComponentType<{}>; d?: Gap | null };
type Gap = 'sm' | 'lg';`,
    'XProps'
  );
  assert.equal(row(t, 'a').type, 'Box');
  assert.equal(row(t, 'b').type, 'Wrap<string>');
  assert.equal(row(t, 'c').type, 'ComponentType<{}>');
  assert.equal(row(t, 'd').type, "'sm' | 'lg' | null");
});

test('external extends are skipped, own rows kept, names recorded', () => {
  const t = table(
    `import type { HTMLAttributes } from 'react';
export interface StackProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Space between children. */
  gap?: 'sm';
}`,
    'StackProps'
  );
  assert.equal(t.kind, 'props');
  assert.deepEqual(
    t.rows.map((r) => r.name),
    ['gap']
  );
  assert.deepEqual(t.extends, ['HTMLAttributes']);
});

test('external intersection part is skipped, own rows kept', () => {
  const t = table(
    `export type XProps = { a: string } & React.HTMLAttributes<HTMLElement>;`,
    'XProps'
  );
  assert.deepEqual(
    t.rows.map((r) => r.name),
    ['a']
  );
  assert.deepEqual(t.extends, ['React.HTMLAttributes']);
});

test('export * barrels are searched when resolving a name', () => {
  const [t] = extractTypeTables(
    '/x/index.d.ts',
    ['XProps'],
    files({
      '/x/index.d.ts': `export * from './a.js';\nexport * from './loop.js';`,
      '/x/loop.d.ts': `export * from './index.js';`,
      '/x/a.d.ts': `export type XProps = { a: string };`,
    })
  );
  assert.deepEqual(
    t.rows.map((r) => r.name),
    ['a']
  );
});

test(
  'real StackProps has gap and records HTMLAttributes',
  { skip: !existsSync('dist/component/stack/index.d.ts') && 'dist missing; run npm run build' },
  () => {
    const [t] = extractTypeTables('dist/component/stack/index.d.ts', ['StackProps']);
    assert.equal(t.kind, 'props');
    assert.ok(row(t, 'gap'));
    assert.ok(t.extends.includes('HTMLAttributes'));
  }
);
