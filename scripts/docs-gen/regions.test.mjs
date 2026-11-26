import assert from 'node:assert/strict';
import { test } from 'node:test';

import { REGIONS, renderRegion, replaceRegions, stripRegions } from './regions.mjs';

const mod = (over = {}) => ({
  id: 'control/button',
  slug: 'button',
  entry: '@korzun/design/control',
  docPath: 'docs/control/button.md',
  title: 'Button',
  description: '',
  category: 'control',
  values: ['Button'],
  types: ['ButtonProps'],
  importLine: '',
  body: '',
  examples: [],
  tables: [],
  tokens: [],
  changelog: [],
  ...over,
});

const row = (over = {}) => ({
  name: 'size',
  type: "'s' | 'm'",
  required: false,
  description: 'Size.',
  ...over,
});

test('REGIONS order', () => {
  assert.deepEqual(REGIONS, ['import', 'examples', 'props', 'tokens', 'changelog']);
});

test('import: values then types, alphabetical', () => {
  const m = mod({ values: ['Zed', 'Button'], types: ['ZedProps', 'ButtonProps'] });
  assert.equal(
    renderRegion('import', m),
    "`import { Button, Zed, type ButtonProps, type ZedProps } from '@korzun/design/control'`"
  );
});

test('import: wraps to a ts block when over 100 chars', () => {
  const values = Array.from({ length: 8 }, (_, i) => `LongComponentName${i}`);
  const out = renderRegion('import', mod({ values, types: [] }));
  assert.ok(out.startsWith('```ts\nimport {\n  LongComponentName0,\n'));
  assert.ok(out.endsWith("} from '@korzun/design/control';\n```"));
});

test('import: empty types or values leave no stray syntax', () => {
  assert.equal(
    renderRegion('import', mod({ types: [] })),
    "`import { Button } from '@korzun/design/control'`"
  );
  assert.equal(
    renderRegion('import', mod({ values: [] })),
    "`import { type ButtonProps } from '@korzun/design/control'`"
  );
  assert.equal(
    renderRegion('import', mod({ values: [], types: [] })),
    "`import '@korzun/design/control'`"
  );
});

test('examples: heading, description, tsx block', () => {
  const ex = (title, description) => ({
    file: 'f',
    slug: 's',
    order: 1,
    title,
    description,
    code: '<Button />\n',
  });
  const out = renderRegion('examples', mod({ examples: [ex('Basic', 'Plain.'), ex('Bare', '')] }));
  assert.equal(
    out,
    '## Examples\n\n### Basic\n\nPlain.\n\n```tsx\n<Button />\n```\n\n### Bare\n\n```tsx\n<Button />\n```'
  );
});

test('props: single table, no sub-heading; required, default, escaping, deprecated', () => {
  const t = {
    name: 'ButtonProps',
    kind: 'props',
    rows: [
      row({ required: true, name: 'label', type: 'string', description: 'a|b\nc' }),
      row({ default: "'m'", deprecated: true, description: 'Old.' }),
    ],
  };
  const out = renderRegion('props', mod({ tables: [t] }));
  assert.equal(
    out,
    [
      '## Props',
      '',
      '| Prop | Type | Default | Description |',
      '| --- | --- | --- | --- |',
      '| `label` (required) | `string` |  | a\\|b c |',
      "| `size` | `'s' \\| 'm'` | `'m'` | **Deprecated.** Old. |",
    ].join('\n')
  );
});

test('props: multiple props tables get headings; objects and aliases; links', () => {
  const tables = [
    { name: 'MenuProps', kind: 'props', rows: [row({ name: 'items', type: 'MenuItem[]' })] },
    { name: 'ItemProps', kind: 'props', rows: [row({ name: 'item', type: 'MenuItem' })] },
    { name: 'MenuItem', kind: 'object', rows: [row({ name: 'id', type: 'string' })] },
    { name: 'Align', kind: 'alias', rows: [], text: "'start' | 'end'" },
  ];
  const out = renderRegion('props', mod({ tables }));
  assert.ok(out.includes('### MenuProps\n\n| Prop'));
  assert.ok(out.includes('### ItemProps\n\n| Prop'));
  assert.ok(out.includes('| `items` | [MenuItem](#menuitem) `[]` |'));
  assert.ok(out.includes('| `item` | [MenuItem](#menuitem) |'));
  assert.ok(out.includes('### MenuItem\n\n| Prop'));
  assert.ok(out.includes("### Types\n\n```ts\ntype Align = 'start' | 'end';\n```"));
});

test('props: extends renders an Also accepts line under the table', () => {
  const t = {
    name: 'ButtonProps',
    kind: 'props',
    rows: [row()],
    extends: ['HTMLAttributes', 'AriaProps'],
  };
  const out = renderRegion('props', mod({ tables: [t] }));
  assert.ok(out.endsWith('Also accepts: `HTMLAttributes`, `AriaProps`.'));
  assert.ok(out.includes('|\n\nAlso accepts'));
});

test('tokens: colors, recipes, omitted when none', () => {
  const tokens = [
    { path: 'color.text.primary', kind: 'color', light: '#111', dark: '#eee' },
    { path: 'shadow.raised', kind: 'recipe', light: null, dark: null },
  ];
  const out = renderRegion('tokens', mod({ tokens }));
  assert.equal(
    out,
    [
      '## Tokens',
      '',
      '| Token | Light | Dark |',
      '| --- | --- | --- |',
      '| `theme.color.text.primary` | `#111` | `#eee` |',
      '| `theme.shadow.raised` | `recipe` | `recipe` |',
    ].join('\n')
  );
  assert.equal(renderRegion('tokens', mod()), '## Tokens\n\nThis module has no styles of its own.');
});

test('changelog: bullets, nested sub-bullets, empty', () => {
  const changelog = [
    {
      version: '0.5.0',
      date: '2026-11-24',
      tags: [],
      text: 'Depth corners.\n  - Detail one.\n  - Detail two.',
    },
    { version: '0.4.0', date: '2026-11-23', tags: [], text: 'First.' },
  ];
  assert.equal(
    renderRegion('changelog', mod({ changelog })),
    '## Changelog\n\n- **0.5.0** (2026-11-24): Depth corners.\n  - Detail one.\n  - Detail two.\n- **0.4.0** (2026-11-23): First.'
  );
  assert.equal(renderRegion('changelog', mod()), '## Changelog\n\nNo changes yet.');
});

const doc = (names = REGIONS) =>
  `# Button\n\nIntro.\n\n${names
    .map((n) => `<!-- generated:${n} -->\nstale\n<!-- /generated:${n} -->`)
    .join('\n\nBetween.\n\n')}\n\nOutro.\n`;

test('replaceRegions: replaces content, keeps markers and prose, idempotent', () => {
  const m = mod();
  const out = replaceRegions(doc(), m, 'b.md');
  assert.ok(!out.includes('stale'));
  assert.ok(out.includes('<!-- generated:import -->\n\n`import { Button'));
  assert.ok(out.includes('No changes yet.\n\n<!-- /generated:changelog -->'));
  assert.ok(out.startsWith('# Button\n\nIntro.'));
  assert.ok(out.endsWith('Outro.\n'));
  assert.equal(replaceRegions(out, m, 'b.md'), out);
});

test('replaceRegions: missing marker throws with file name', () => {
  const names = REGIONS.filter((n) => n !== 'props');
  assert.throws(() => replaceRegions(doc(names), mod(), 'docs/b.md'), {
    message: 'docs/b.md: missing <!-- generated:props -->',
  });
});

test('replaceRegions: out-of-order regions throw', () => {
  const swapped = ['import', 'props', 'examples', 'tokens', 'changelog'];
  assert.throws(() => replaceRegions(doc(swapped), mod(), 'b.md'), {
    message: 'b.md: generated regions out of order',
  });
});

test('replaceRegions: replacement text with $ patterns is literal', () => {
  const m = mod({
    examples: [{ file: 'f', slug: 's', order: 1, title: 'T', description: '', code: "a = '$&'" }],
  });
  assert.ok(replaceRegions(doc(), m, 'b.md').includes("a = '$&'"));
});

test('stripRegions removes markers and contents', () => {
  const out = stripRegions(replaceRegions(doc(), mod(), 'b.md'));
  assert.ok(!out.includes('generated:'));
  assert.ok(!out.includes('## Props'));
  assert.ok(out.includes('Intro.') && out.includes('Between.') && out.includes('Outro.'));
  assert.ok(!/\n{3,}/.test(out));
});

test('empty examples and props render a placeholder', () => {
  assert.equal(renderRegion('examples', mod()), '## Examples\n\nNo examples yet.');
  assert.equal(
    renderRegion('props', mod()),
    '## Props\n\nThis module takes no props; see Usage for its API.'
  );
});

test('no region is empty or heading-only for a bare module', () => {
  for (const name of REGIONS) {
    const out = renderRegion(name, mod());
    const body = out.replace(/^#+ .*$/gm, '').trim();
    assert.ok(body.length > 0, name);
  }
  const out = replaceRegions(doc(), mod(), 'b.md');
  for (const name of REGIONS) {
    const m = out.match(
      new RegExp(`<!-- generated:${name} -->([\\s\\S]*?)<!-- /generated:${name} -->`)
    );
    assert.ok(m[1].replace(/^#+ .*$/gm, '').trim().length > 0, name);
  }
});

test('props: zero-row table renders placeholder, or just its Also accepts line', () => {
  const empty = { name: 'XProps', kind: 'props', rows: [] };
  assert.equal(
    renderRegion('props', mod({ tables: [empty] })),
    '## Props\n\nThis module takes no props; see Usage for its API.'
  );
  assert.equal(
    renderRegion('props', mod({ tables: [{ ...empty, extends: ['HTMLAttributes'] }] })),
    '## Props\n\nAlso accepts: \`HTMLAttributes\`.'
  );
});

test('props: object tables link type cells to other supporting tables, Props-named ones too', () => {
  const tables = [
    {
      name: 'MenuIntentProps',
      kind: 'props',
      rows: [row({ name: 'onFocus', type: '() => void' })],
    },
    {
      name: 'MenuItem',
      kind: 'object',
      rows: [row({ name: 'intentProps', type: 'MenuIntentProps' })],
    },
    { name: 'MenuProps', kind: 'props', rows: [row({ name: 'items', type: 'MenuItem[]' })] },
  ];
  const out = renderRegion('props', mod({ values: ['Menu'], tables }));
  assert.ok(out.includes('| `intentProps` | [MenuIntentProps](#menuintentprops) |'));
  assert.ok(out.includes('| `items` | [MenuItem](#menuitem) `[]` |'));
});

test('props: main <Name>Props first, then other props tables, then objects, then aliases', () => {
  const tables = [
    { name: 'Align', kind: 'alias', rows: [], text: "'start' | 'end'" },
    { name: 'MenuIntentProps', kind: 'props', rows: [row()] },
    { name: 'MenuItem', kind: 'object', rows: [row()] },
    { name: 'MenuProps', kind: 'props', rows: [row()] },
    { name: 'MenuTriggerProps', kind: 'props', rows: [row()] },
  ];
  const out = renderRegion('props', mod({ values: ['Menu'], tables }));
  const headings = [...out.matchAll(/^### (\w+)/gm)].map((m) => m[1]);
  assert.deepEqual(headings, [
    'MenuProps',
    'MenuIntentProps',
    'MenuTriggerProps',
    'MenuItem',
    'Types',
  ]);
});
