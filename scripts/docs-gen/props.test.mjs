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

test('discriminated union: forbidden (never) branches drop out of type, description and required', () => {
  const t = table(
    `interface Base { /** Visible text. */ label: string }
interface ActionItem extends Base {
  /** Receives no event. */
  onClick: () => void;
  /** Not allowed on an action item. */
  to?: never;
}
interface LinkItem extends Base {
  /** Router path to navigate to. */
  to: string;
  /** Not allowed on a link item. */
  onClick?: never;
}
export type Item = ActionItem | LinkItem;`,
    'Item'
  );
  assert.equal(row(t, 'label').required, true);
  assert.equal(row(t, 'to').type, 'string');
  assert.equal(row(t, 'to').description, 'Router path to navigate to.');
  assert.equal(row(t, 'to').required, false);
  assert.equal(row(t, 'onClick').type, '() => void');
  assert.equal(row(t, 'onClick').description, 'Receives no event.');
  assert.equal(row(t, 'onClick').required, false);
});

test('union: a never part is dropped from a defining branch type', () => {
  const t = table(`export type X = { a?: string | never } | { a?: number };`, 'X');
  assert.equal(row(t, 'a').type, 'string | number');
});

test('union: a false discriminant is a value, not a forbid; true | false reads boolean; both texts kept', () => {
  const t = table(
    `export type XProps = { label: string } & ({
  /** Clicking the checked segment clears the value. */
  clearable: true;
  /** Absent means read-only. */
  onChange?: (value: string | null) => void;
} | {
  /** Off: there is no way to clear. */
  clearable?: false;
  /** Absent means read-only. */
  onChange?: (value: string) => void;
});`,
    'XProps'
  );
  assert.equal(row(t, 'clearable').type, 'boolean');
  assert.equal(row(t, 'clearable').required, false);
  assert.equal(
    row(t, 'clearable').description,
    'Clicking the checked segment clears the value. Off: there is no way to clear.'
  );
  assert.equal(row(t, 'onChange').description, 'Absent means read-only.');
});

test('union: a prop no defining branch documents gets no text from a forbidding branch', () => {
  const t = table(
    `export type X = { a: string; /** Not allowed here. */ b?: never } | { b: number };`,
    'X'
  );
  assert.equal(row(t, 'b').type, 'number');
  assert.equal(row(t, 'b').description, '');
});

test('generic props type flattens, its type parameter left by name', () => {
  const t = table(
    `type BaseProps<V extends string> = {
  /** The checked option. */
  value: V | null;
};
export type PickerProps<V extends string> = BaseProps<V> & {
  /** Called with the picked value. */
  onChange?: (value: V) => void;
};`,
    'PickerProps'
  );
  assert.equal(t.kind, 'props');
  assert.equal(row(t, 'value').type, 'V | null');
  assert.equal(row(t, 'value').required, true);
  assert.equal(row(t, 'onChange').type, '(value: V) => void');
});

test(
  'real d.ts: Button danger/success stay boolean; SegmentedControl flattens with clearable',
  {
    skip: !existsSync('dist/control/index.d.ts') && 'run npm run build first',
  },
  () => {
    const [button, segmented] = extractTypeTables('dist/control/index.d.ts', [
      'ButtonProps',
      'SegmentedControlProps',
    ]);
    assert.equal(row(button, 'danger').type, 'boolean');
    assert.match(row(button, 'danger').description, /^Red treatment/);
    assert.equal(row(button, 'success').type, 'boolean');
    assert.match(row(button, 'success').description, /^Green treatment/);
    assert.equal(segmented.kind, 'props');
    assert.equal(row(segmented, 'clearable').type, 'boolean');
    assert.equal(row(segmented, 'clearable').required, false);
    assert.match(row(segmented, 'clearable').description, /clear the value\. Off by default/);
    assert.equal(row(segmented, 'value').type, 'V | null');
    assert.equal(row(segmented, 'label').required, true);
  }
);

test(
  'real d.ts: Menu items merge without never or the forbidding text',
  {
    skip: !existsSync('dist/control/index.d.ts') && 'run npm run build first',
  },
  () => {
    const [item] = extractTypeTables('dist/control/index.d.ts', ['MenuItem']);
    assert.equal(row(item, 'to').type, 'string');
    assert.match(row(item, 'to').description, /^Router path/);
    assert.equal(row(item, 'onClick').type, '() => void');
    assert.match(row(item, 'onClick').description, /^Receives no event/);
  }
);

test('union: function types from different branches stay whole and parenthesised', () => {
  const t = table(
    `export type X = { f?: (v: string | null) => void } | { f?: (v: string) => void };`,
    'X'
  );
  assert.equal(row(t, 'f').type, '((v: string | null) => void) | ((v: string) => void)');
});
