import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';

import { componentPropsTypes, extractTypeTables } from './props.mjs';

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
  assert.deepEqual(t.extends, ['HTMLAttributes']);
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
    assert.match(row(segmented, 'clearable').description, /clear the value\. Without it/);
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

test('a type-level JSDoc becomes the table description', () => {
  const src = `/** An item that navigates. Needs a router. */
export interface LinkItem {
  /** Path. */
  to: string;
}
/**
 * Where it opens.
 * @see Popover
 */
export type Side = 'top' | 'bottom';
export interface Bare { a?: string }`;
  const tables = extractTypeTables(
    '/x/a.d.ts',
    ['LinkItem', 'Side', 'Bare'],
    files({ '/x/a.d.ts': src })
  );
  assert.equal(tables[0].description, 'An item that navigates. Needs a router.');
  assert.equal(tables[1].description, 'Where it opens.');
  assert.equal('description' in tables[2], false);
  assert.equal(row(tables[0], 'to').description, 'Path.');
});

test('a type comment is read at the declaration, through a re-export', () => {
  const t = extractTypeTables(
    '/x/a.d.ts',
    ['Item'],
    files({
      '/x/a.d.ts': `/** Not this one. */\nexport type { Item } from './types.js';`,
      '/x/types.d.ts': `/** One entry. */\nexport declare interface Item { a?: string }`,
    })
  )[0];
  assert.equal(t.description, 'One entry.');
});

test('only a JSDoc block becomes a type description, not a line or plain block comment', () => {
  const src = `// A line comment.
export interface A { a?: string }
/* A plain block. */
export interface B { b?: string }
/** The doc. */
/* eslint-disable-next-line */
export interface C { c?: string }`;
  const tables = extractTypeTables('/x/a.d.ts', ['A', 'B', 'C'], files({ '/x/a.d.ts': src }));
  assert.deepEqual(
    tables.map((t) => t.description),
    [undefined, undefined, undefined]
  );
});

test('resolves a renamed local export: export type { Action as TextInputAction }', () => {
  const src = `/** Trailing icon button. */
type Action = {
  /** Red icon. */
  danger?: boolean;
};
export type { Action as TextInputAction };`;
  const t = table(src, 'TextInputAction');
  assert.equal(t.description, 'Trailing icon button.');
  assert.equal(row(t, 'danger').description, 'Red icon.');
});

test('resolves renamed re-exports and imports across files', () => {
  const t = extractTypeTables(
    '/x/a.d.ts',
    ['Outer', 'Props'],
    files({
      '/x/a.d.ts': `export { Inner as Outer } from './b.js';\nimport { Base as B } from './b.js';\nexport type Props = { x?: B };`,
      '/x/b.d.ts': `export type Inner = { a?: string };\nexport type Base = 'one' | 'two';`,
    })
  );
  assert.equal(row(t[0], 'a').type, 'string');
  assert.equal(row(t[1], 'x').type, "'one' | 'two'");
});

test(
  'real TextInput d.ts: TextInputAction resolves',
  { skip: !existsSync('dist/control/text-input/index.d.ts') },
  () => {
    const [t] = extractTypeTables('dist/control/text-input/index.d.ts', ['TextInputAction']);
    assert.equal(t.kind, 'object');
    assert.deepEqual(
      t.rows.map((r) => r.name),
      ['action', 'ariaLabel', 'danger', 'icon']
    );
  }
);

test('union: a @default on one branch member is kept on the merged row', () => {
  const t = table(
    `export type XProps = { a?: string } & (
  | { /** Clear on click. */ clearable: true }
  | {
      /**
       * Never clears.
       * @default false
       */
      clearable?: false;
    }
);`,
    'XProps'
  );
  assert.equal(row(t, 'clearable').default, 'false');
  assert.equal(row(t, 'clearable').type, 'boolean');
});

test('keyof an indexed type resolves to the literal union of its keys', () => {
  const extra = {
    '/x/theme.d.ts': `export interface Theme {
  color: { chip: { status: { a: string }; author: { a: string } } };
  space: { sm: string; md: string };
  gray: { readonly 50: string; readonly 100: string };
}`,
  };
  const t = extractTypeTables(
    '/x/a.d.ts',
    ['XProps', 'ChipColor'],
    files({
      '/x/a.d.ts': `import type { Theme } from './theme.js';
export type ChipColor = keyof Theme['color']['chip'];
export type Gap = keyof Theme['space'] | 'none';
export type XProps = { chip?: ChipColor; gap?: Gap; shade?: keyof Theme['gray'] };`,
      ...extra,
    })
  );
  assert.equal(row(t[0], 'chip').type, "'status' | 'author'");
  assert.equal(row(t[0], 'gap').type, "'sm' | 'md' | 'none'");
  assert.equal(row(t[0], 'shade').type, '50 | 100');
  assert.equal(t[1].kind, 'alias');
  assert.equal(t[1].text, "'status' | 'author'");
});

test('keyof an unknown or external type stays as written', () => {
  const t = table(
    `import type { CSSProperties } from 'react';
export type XProps = { k?: keyof CSSProperties; j?: keyof Missing['a'] };`,
    'XProps'
  );
  assert.equal(row(t, 'k').type, 'keyof CSSProperties');
  assert.equal(row(t, 'j').type, "keyof Missing['a']");
});

test('a locally renamed type prints under its exported name', () => {
  const src = `type Action = { danger?: boolean };
type Item = { id: string };
export type { Action as TextInputAction, Item as ListItem };
export type XProps = { action?: Action; items?: Item[]; on?: (item: Item, a: Action) => void };`;
  const t = extractTypeTables(
    '/x/a.d.ts',
    ['XProps', 'TextInputAction', 'ListItem'],
    files({ '/x/a.d.ts': src })
  )[0];
  assert.equal(row(t, 'action').type, 'TextInputAction');
  assert.equal(row(t, 'items').type, 'ListItem[]');
  assert.equal(row(t, 'on').type, '(item: ListItem, a: TextInputAction) => void');
});

test('an alias block prints a locally renamed type under its exported name', () => {
  const src = `type Action = { danger?: boolean };
export type { Action as TextInputAction };
export type ActionOrName = Action | string;`;
  const [alias] = extractTypeTables(
    '/x/a.d.ts',
    ['ActionOrName', 'TextInputAction'],
    files({ '/x/a.d.ts': src })
  );
  assert.equal(alias.kind, 'alias');
  assert.equal(alias.text, 'TextInputAction | string');
});

test('type cells drop comments written inside the type', () => {
  const t = table(
    `export interface XProps {
  /** Fragments. */
  recipe: {
    input: string;
    /** The shaded row. */
    row: string;
    // a line note
    glass: string;
  };
}`,
    'XProps'
  );
  assert.equal(row(t, 'recipe').type, '{ input: string; row: string; glass: string; }');
});

test('a member typed as a nested object literal prints nested literals as { … }', () => {
  const t = table(
    `export interface Theme {
  zIndex: { base: number; stack: { lo: number; hi: number }; toast: number };
}`,
    'Theme'
  );
  assert.equal(row(t, 'zIndex').type, '{ base: number; stack: { … }; toast: number; }');
});

test('a long object literal member prints its keys only', () => {
  const keys = Array.from({ length: 12 }, (_, i) => `key${i}`);
  const t = table(
    `export interface Theme {
  space: { ${keys.map((k) => `${k}: SpaceValue;`).join(' ')} };
  radius: { sm: string; md: string };
}`,
    'Theme'
  );
  assert.equal(row(t, 'space').type, `{ ${keys.join(', ')} }`);
  assert.equal(row(t, 'radius').type, '{ sm: string; md: string }');
});

test('Record keeps its type arguments in Also accepts', () => {
  const t = table(
    `export type FieldRow = { _key: string } & Record<string, string | number | undefined>;`,
    'FieldRow'
  );
  assert.deepEqual(t.extends, ['Record<string, string | number | undefined>']);
});

test('a @default that is not an expression is marked as prose', () => {
  const t = table(
    `export type XProps = {
  /** @default accepts empty or numeric text */
  validate?: () => boolean;
  /** @default 'md' */
  size?: string;
  /** @default () => true */
  check?: () => boolean;
};`,
    'XProps'
  );
  assert.equal(row(t, 'validate').default, 'accepts empty or numeric text');
  assert.equal(row(t, 'validate').defaultProse, true);
  assert.equal(row(t, 'size').defaultProse, undefined);
  assert.equal(row(t, 'check').defaultProse, undefined);
});

test('a reference to a type this module re-aliases prints the alias the module documents', () => {
  const src = `import type { MenuIntentProps } from './menu.js';
export type PageActionIntentProps = MenuIntentProps;
export type PageActionItem = { label: string; intentProps?: MenuIntentProps };`;
  const menu = `export type MenuIntentProps = { /** Focus. */ onFocus: () => void };`;
  const [alias, item] = extractTypeTables(
    '/x/a.d.ts',
    ['PageActionIntentProps', 'PageActionItem'],
    files({ '/x/a.d.ts': src, '/x/menu.d.ts': menu })
  );
  assert.equal(row(item, 'intentProps').type, 'PageActionIntentProps');
  // The alias table itself still lists the members it shares.
  assert.equal(row(alias, 'onFocus').type, '() => void');
  // Without the alias requested, the original name stays.
  const [only] = extractTypeTables(
    '/x/a.d.ts',
    ['PageActionItem'],
    files({ '/x/a.d.ts': src, '/x/menu.d.ts': menu })
  );
  assert.equal(row(only, 'intentProps').type, 'MenuIntentProps');
});

test('type text drops a leading React. namespace', () => {
  const t = table(
    `export type XProps = {
  icon: React.ComponentType<IconProps>;
  Icon?: (props: IconProps) => React.JSX.Element;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  ReactThing?: MyReact.Node;
};
export type Shape = React.ReactNode | string;`,
    'XProps'
  );
  assert.equal(row(t, 'icon').type, 'ComponentType<IconProps>');
  assert.equal(row(t, 'Icon').type, '(props: IconProps) => JSX.Element');
  assert.equal(row(t, 'onKeyDown').type, '(event: KeyboardEvent<HTMLInputElement>) => void');
  assert.equal(row(t, 'ReactThing').type, 'MyReact.Node');
  const shape = extractTypeTables(
    '/x/a.d.ts',
    ['Shape'],
    files({ '/x/a.d.ts': `export type Shape = React.ReactNode | Array<string>;` })
  )[0];
  assert.equal(shape.text, 'ReactNode | Array<string>');
  const ext = table(
    `export interface XProps extends React.HTMLAttributes<HTMLDivElement> { a?: string }`,
    'XProps'
  );
  assert.deepEqual(ext.extends, ['HTMLAttributes']);
});

test('@member on a type adds a note to that member row of this table only', () => {
  const src = `import type { MenuActionItem } from './menu.js';
/**
 * One page action.
 * @member Icon Ignored by PageActionsBar's primary Buttons,
 *   which draw no icon.
 */
export type PageActionItem = MenuActionItem & { primary?: boolean };`;
  const menu = `export type MenuActionItem = {
  /** Leading icon component. */
  Icon?: unknown;
  /** Visible text. */
  label: string;
};`;
  const [item] = extractTypeTables(
    '/x/a.d.ts',
    ['PageActionItem'],
    files({ '/x/a.d.ts': src, '/x/menu.d.ts': menu })
  );
  assert.equal(item.description, 'One page action.');
  assert.equal(
    row(item, 'Icon').description,
    "Leading icon component. Ignored by PageActionsBar's primary Buttons, which draw no icon."
  );
  assert.equal(row(item, 'label').description, 'Visible text.');
  assert.equal(item.rows.length, 3);
  // The source type's own table is unchanged.
  const [base] = extractTypeTables(
    '/x/menu.d.ts',
    ['MenuActionItem'],
    files({ '/x/menu.d.ts': menu })
  );
  assert.equal(row(base, 'Icon').description, 'Leading icon component.');
  // A note for a member the type does not have is an error, not a lost note.
  assert.throws(
    () =>
      extractTypeTables(
        '/x/a.d.ts',
        ['PageActionItem'],
        files({
          '/x/a.d.ts': src.replace('@member Icon', '@member Icn'),
          '/x/menu.d.ts': menu,
        })
      ),
    /PageActionItem: @member Icn: no such member/
  );
});

const propsTypes = (src) =>
  Object.fromEntries(
    componentPropsTypes(
      '/x/a.d.ts',
      [...src.matchAll(/declare (?:const|function) ([A-Z]\w*)/g)].map((m) => m[1]),
      files({ '/x/a.d.ts': src })
    )
  );

test('componentPropsTypes: a component function or a component wrapper, by its props type', () => {
  assert.deepEqual(
    propsTypes(`export declare function A(props: AProps): null;
export declare const B: ({ x }: BProps) => null;
export declare const C: import("react").ForwardRefExoticComponent<CProps & import("react").RefAttributes<HTMLDivElement>>;
export declare const D: React.MemoExoticComponent<(props: DProps) => null>;
export declare const E: FC<EProps>;
export declare const F: React.FunctionComponent<FProps>;
export declare function G(): null;
export declare const H: ({ x }: { x: string }) => null;`),
    { A: 'AProps', B: 'BProps', C: 'CProps', D: 'DProps', E: 'EProps', F: 'FProps' }
  );
});

test('componentPropsTypes: a non-component generic value is not a component', () => {
  assert.deepEqual(
    propsTypes(`export declare const ThemeContext: React.Context<Theme>;
export declare const Items: Array<Item>;
export declare const Boxed: import("react").Context<Box>;`),
    {}
  );
});

test('componentPropsTypes: Readonly and PropsWithChildren unwrap, qualified or not', () => {
  assert.deepEqual(
    propsTypes(`export declare function A(props: Readonly<AProps>): null;
export declare const B: FC<PropsWithChildren<BProps>>;
export declare const C: React.FC<React.PropsWithChildren<CProps>>;
export declare function D(props: React.PropsWithChildren<Readonly<DProps>>): null;`),
    { A: 'AProps', B: 'BProps', C: 'CProps', D: 'DProps' }
  );
});
