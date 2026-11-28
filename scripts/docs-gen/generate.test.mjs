import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { generate } from './generate.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const realRepo = join(here, '..', '..');
const roots = [];
after(() => roots.forEach((r) => rmSync(r, { recursive: true, force: true })));

const put = (root, rel, text) => {
  mkdirSync(dirname(join(root, rel)), { recursive: true });
  writeFileSync(join(root, rel), text);
};

const DOC = `---
title: Widget
description: A fixture widget.
category: Actions
---

# Widget

Intro prose.

<!-- generated:import -->
<!-- /generated:import -->

<!-- generated:examples -->
<!-- /generated:examples -->

<!-- generated:props -->
<!-- /generated:props -->

<!-- generated:tokens -->
<!-- /generated:tokens -->

<!-- generated:changelog -->
<!-- /generated:changelog -->
`;

const DTS = `export interface WidgetProps {
  /** Visible label. */
  label: string;
  /** Size of the widget. */
  size?: 'sm' | 'lg';
}
export declare function Widget(props: WidgetProps): null;
`;

function fixture({ doc = DOC } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'docs-gen-'));
  roots.push(root);
  put(root, 'package.json', JSON.stringify({ name: 'x', version: '1.2.3' }));
  for (const area of ['control', 'component', 'theme', 'toast', 'icon', 'hooks']) {
    put(
      root,
      `src/${area}/index.ts`,
      area === 'control' ? "export { Widget, type WidgetProps } from './widget/index.js';\n" : ''
    );
  }
  put(
    root,
    'src/control/widget/index.tsx',
    "export function Widget({ label, size = 'sm' }: { label: string; size?: string }) { return null; }\n"
  );
  put(
    root,
    'src/control/widget/style.ts',
    'export const s = (theme) => ({ color: theme.color.text });\n'
  );
  put(
    root,
    'src/control/widget/examples/01-basic.tsx',
    '/**\n * Basic\n *\n * Plain use.\n */\nexport default () => null;\n'
  );
  put(
    root,
    'src/control/widget/examples/preview.tsx',
    '/** Preview */\nexport default () => null;\n'
  );
  put(root, 'dist/control/widget/index.d.ts', DTS);
  put(
    root,
    'dist/theme/theme.js',
    "export const lightTheme = { color: { text: '#111111' } };\nexport const darkTheme = { color: { text: '#eeeeee' } };\n"
  );
  put(root, 'docs/control/widget.md', doc);
  put(
    root,
    'docs/guide.md',
    '---\ntitle: Guide\ndescription: A guide.\ncategory: Guide\n---\n\n# Guide\n\nHello.\n'
  );
  put(root, 'docs/plain.md', '# Plain\n');
  put(
    root,
    'AGENTS.md',
    'intro\n[docs]|guide.md|plain.md: keep me\n[docs/control]|{widget}.md\ntail\n'
  );
  put(
    root,
    'CHANGELOG.md',
    '# Changelog\n\n## 1.2.3 — 2026-01-02\n\n- [Widget] Added the widget.\n- [General] Misc.\n'
  );
  return root;
}

test('generates regions, index and site data', () => {
  const root = fixture();
  const files = generate(root);
  const doc = files.get('docs/control/widget.md');
  assert.ok(doc.startsWith('---\ntitle: Widget'));
  assert.match(doc, /import \{ Widget, type WidgetProps \} from '@korzun\/design\/control'/);
  assert.match(doc, /### Basic/);
  assert.match(doc, /\| `label` \(required\)/);
  assert.match(doc, /`'sm'`/);
  assert.match(doc, /theme\.color\.text/);
  assert.match(doc, /\*\*1\.2\.3\*\* \(2026-01-02\): Added the widget\./);

  const agents = files.get('AGENTS.md');
  assert.match(agents, /^\[docs\]\|guide\.md: A guide\.\|plain\.md: keep me$/m);
  assert.match(agents, /^\[docs\/control\]\|\{widget\}\.md$/m);
  assert.ok(agents.startsWith('intro\n') && agents.endsWith('tail\n'));

  const site = JSON.parse(files.get('gallery/generated/site-data.json'));
  assert.equal(site.version, '1.2.3');
  assert.equal(site.modules.length, 1);
  const m = site.modules[0];
  assert.equal(m.importLine, "import { Widget, type WidgetProps } from '@korzun/design/control'");
  assert.equal(m.body.startsWith('Intro prose.'), true);
  assert.ok(!m.body.includes('generated:'));
  assert.equal(m.tokens[0].light, '#111111');
  assert.equal(m.changelog.length, 1);
  assert.equal(site.guides[0].slug, 'guide');
  assert.ok(files.get('gallery/generated/site-data.json').endsWith('}\n'));
});

test('site data lists tables in the doc order: the main <Name>Props first', () => {
  const root = fixture();
  put(
    root,
    'src/control/index.ts',
    "export { Widget, type WidgetExtraProps, type WidgetProps } from './widget/index.js';\n"
  );
  put(
    root,
    'dist/control/widget/index.d.ts',
    `${DTS}/** Extra fields. */\nexport interface WidgetExtraProps { /** More. */ more?: string }\n`
  );
  const files = generate(root);
  const doc = files.get('docs/control/widget.md');
  const headings = [...doc.matchAll(/^### (\w+Props)$/gm)].map((m) => m[1]);
  assert.deepEqual(headings, ['WidgetProps', 'WidgetExtraProps']);
  assert.ok(doc.includes('### WidgetExtraProps\n\nExtra fields.\n'));
  const site = JSON.parse(files.get('gallery/generated/site-data.json'));
  assert.deepEqual(
    site.modules[0].tables.map((t) => t.name),
    headings
  );
  assert.equal(site.modules[0].tables[1].description, 'Extra fields.');
});

test("a type cell links to a type whose table is in another module's doc", () => {
  const root = fixture();
  put(
    root,
    'src/control/index.ts',
    "export { Widget, type WidgetItem, type WidgetProps } from './widget/index.js';\n" +
      "export { Gadget, type GadgetProps } from './gadget/index.js';\n"
  );
  put(
    root,
    'dist/control/widget/index.d.ts',
    `${DTS}export type WidgetItem = { /** Item label. */ label: string };\n`
  );
  put(
    root,
    'dist/control/gadget/index.d.ts',
    "import type { WidgetItem } from '../widget/index.js';\n" +
      'export interface GadgetProps {\n  /** Shown items. */\n  items: WidgetItem[];\n}\n'
  );
  put(root, 'src/control/gadget/index.tsx', 'export function Gadget() { return null; }\n');
  put(root, 'docs/control/gadget.md', DOC.replaceAll('Widget', 'Gadget'));
  const files = generate(root);
  const gadget = files.get('docs/control/gadget.md');
  assert.ok(
    gadget.includes('| `items` (required) | [WidgetItem](../control/widget.md#widgetitem)`[]` |'),
    gadget
  );
  assert.ok(files.get('docs/control/widget.md').includes('### WidgetItem'));
});

test('a type two modules document links to the module that declares it, with a warning', () => {
  const root = fixture();
  // Gadget declares Shared; Widget (listed after it) re-exports it and documents it too.
  put(
    root,
    'src/control/index.ts',
    "export { Gadget, type GadgetProps, type Shared } from './gadget/index.js';\n" +
      "export { Widget, type WidgetProps } from './widget/index.js';\n" +
      "export { type Shared } from './widget/index.js';\n" +
      "export { Thing, type ThingProps } from './thing/index.js';\n"
  );
  put(
    root,
    'dist/control/gadget/index.d.ts',
    'export type Shared = { /** Id. */ id: string };\n' +
      'export interface GadgetProps {\n  /** S. */\n  s?: Shared;\n}\n'
  );
  put(
    root,
    'dist/control/widget/index.d.ts',
    `${DTS}export type { Shared } from '../gadget/index.js';\n`
  );
  put(
    root,
    'dist/control/thing/index.d.ts',
    "import type { Shared } from '../gadget/index.js';\n" +
      'export interface ThingProps {\n  /** S. */\n  s?: Shared;\n}\n'
  );
  for (const m of ['gadget', 'thing']) {
    put(root, `src/control/${m}/index.tsx`, 'export function X() { return null; }\n');
    const name = m[0].toUpperCase() + m.slice(1);
    put(root, `docs/control/${m}.md`, DOC.replaceAll('Widget', name));
  }
  const warnings = [];
  const files = generate(root, { warn: (w) => warnings.push(w) });
  assert.ok(
    files.get('docs/control/thing.md').includes('[Shared](../control/gadget.md#shared)'),
    files.get('docs/control/thing.md')
  );
  const site = JSON.parse(files.get('gallery/generated/site-data.json'));
  assert.equal(site.typePages.Shared, 'gadget');
  assert.equal(site.typePages.WidgetProps, 'widget');
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /Shared.*gadget\.md.*widget\.md/);
});

test('a component whose props type the module does not export fails, not "takes no props"', () => {
  const root = fixture();
  put(root, 'src/control/index.ts', "export { Widget } from './widget/index.js';\n");
  assert.throws(
    () => generate(root),
    /docs\/control\/widget\.md: Widget takes WidgetProps, which @korzun\/design\/control does not export/
  );
});

test('tokens follow style.ts imports transitively, cycle-safe', () => {
  const root = fixture();
  put(
    root,
    'src/control/widget/style.ts',
    "import { g } from './gap.js';\nexport const s = (theme) => ({ color: theme.color.text, ...g(theme) });\n"
  );
  put(
    root,
    'src/control/widget/gap.ts',
    "import './style.js';\nexport const g = (theme) => ({ x: theme.space.md });\n"
  );
  put(
    root,
    'dist/theme/theme.js',
    "export const lightTheme = { color: { text: '#111111' }, space: { md: '1rem' } };\nexport const darkTheme = lightTheme;\n"
  );
  const site = JSON.parse(generate(root).get('gallery/generated/site-data.json'));
  assert.deepEqual(
    site.modules[0].tokens.map((t) => t.path),
    ['color.text', 'space.md']
  );
});

// A second style module whose tokens show only when it is imported for its values.
const withOtherStyle = (root) => {
  put(
    root,
    'src/control/other/style.ts',
    'export type OtherSize = string;\nexport const useOther = (theme) => ({ c: theme.color.other });\n'
  );
  put(
    root,
    'dist/theme/theme.js',
    "export const lightTheme = { color: { text: '#111111', other: '#222222' } };\nexport const darkTheme = lightTheme;\n"
  );
};
const tokenPaths = (root) =>
  JSON.parse(generate(root).get('gallery/generated/site-data.json')).modules[0].tokens.map(
    (t) => t.path
  );

test('tokens do not follow type-only imports in a style file', () => {
  const root = fixture();
  withOtherStyle(root);
  put(
    root,
    'src/control/widget/style.ts',
    "import type { OtherSize } from '../other/style.js';\n" +
      "import { type OtherSize as O2 } from '../other/style.js';\n" +
      'export const s = (theme) => ({ color: theme.color.text });\n'
  );
  assert.deepEqual(tokenPaths(root), ['color.text']);
  put(
    root,
    'src/control/widget/style.ts',
    "import { useOther, type OtherSize } from '../other/style.js';\n" +
      'export const s = (theme) => ({ color: theme.color.text, ...useOther(theme) });\n'
  );
  assert.deepEqual(tokenPaths(root), ['color.other', 'color.text']);
});

test("tokens follow the entry's value imports of style modules, not of components", () => {
  const root = fixture();
  withOtherStyle(root);
  // Other is a component of its own (exported from the barrel), so it lists its own tokens.
  put(
    root,
    'src/control/index.ts',
    "export { Widget, type WidgetProps } from './widget/index.js';\n" +
      "export { Other } from './other/index.js';\n"
  );
  put(root, 'src/control/other/index.tsx', 'export const Other = (theme) => theme.color.other;\n');
  put(
    root,
    'src/control/widget/index.tsx',
    "import { Other } from '../other/index.js';\n" +
      "import type { OtherSize } from '../other/style.js';\n" +
      'export function Widget() { return Other; }\n'
  );
  assert.deepEqual(tokenPaths(root), ['color.text']);
  put(
    root,
    'src/control/widget/index.tsx',
    "import { useOther } from '../other/style.js';\n" +
      'export function Widget() { return useOther; }\n'
  );
  assert.deepEqual(tokenPaths(root), ['color.other', 'color.text']);
});

test('tokens include theme.* read in the entry itself (through useTheme())', () => {
  const root = fixture();
  withOtherStyle(root);
  put(
    root,
    'src/control/widget/index.tsx',
    'export function Widget() { const theme = useTheme(); return <i style={{ color: theme.color.other }} />; }\n'
  );
  assert.deepEqual(tokenPaths(root), ['color.other', 'color.text']);
});

test('tokens follow an internal module the entry renders (in no barrel), with its own entry', () => {
  const root = fixture();
  withOtherStyle(root);
  put(
    root,
    'dist/theme/theme.js',
    "export const lightTheme = { color: { text: '#111111', other: '#222222' }, space: { xs: '2px', md: '8px' } };\nexport const darkTheme = lightTheme;\n"
  );
  // `inner` is in no barrel: an internal building block of Widget.
  put(root, 'src/control/inner/style.ts', 'export const s = (theme) => ({ g: theme.space.xs });\n');
  put(
    root,
    'src/control/inner/index.tsx',
    "import { s } from './style.js';\nimport { useOther } from '../other/style.js';\n" +
      'export const Inner = () => { const theme = useTheme(); return theme.space.md; };\n'
  );
  put(
    root,
    'src/control/widget/index.tsx',
    "import { Inner } from '../inner/index.js';\nexport function Widget() { return Inner; }\n"
  );
  assert.deepEqual(tokenPaths(root), ['color.other', 'color.text', 'space.md', 'space.xs']);
});

test('a computed token access (theme.fontSize[size]) lists the whole group', () => {
  const root = fixture();
  put(
    root,
    'src/control/widget/style.ts',
    'export const s = (theme) => Object.keys(theme.fontSize).map((k) => theme.fontSize[k]);\n'
  );
  put(
    root,
    'dist/theme/theme.js',
    "export const lightTheme = { fontSize: { sm: '12px', md: '14px' } };\nexport const darkTheme = lightTheme;\n"
  );
  assert.deepEqual(tokenPaths(root), ['fontSize.md', 'fontSize.sm']);
});

test('tokens do not follow imports into src/theme (the provider and global styles)', () => {
  const root = fixture();
  put(
    root,
    'src/control/widget/style.ts',
    "import { createUseStyles } from '../../theme/index.js';\nexport const s = (theme) => ({ color: theme.color.text });\n"
  );
  put(
    root,
    'src/theme/index.ts',
    'export const createUseStyles = (theme) => ({ bg: theme.color.page });\n'
  );
  put(
    root,
    'dist/theme/theme.js',
    "export const lightTheme = { color: { text: '#111111', page: '#ffffff' } };\nexport const darkTheme = lightTheme;\n"
  );
  const site = JSON.parse(generate(root).get('gallery/generated/site-data.json'));
  assert.deepEqual(
    site.modules[0].tokens.map((t) => t.path),
    ['color.text']
  );
});

test(
  'real repo: stack tokens are exactly space paths',
  { skip: !existsSync(join(realRepo, 'dist')) && 'dist missing; run npm run build' },
  () => {
    const root = mkdtempSync(join(tmpdir(), 'docs-gen-real-'));
    roots.push(root);
    for (const p of ['package.json', 'src', 'dist', 'docs', 'recipes', 'AGENTS.md', 'CHANGELOG.md']) {
      cpSync(join(realRepo, p), join(root, p), { recursive: true });
    }
    const site = JSON.parse(generate(root).get('gallery/generated/site-data.json'));
    const stack = site.modules.find((m) => m.id === 'component/stack');
    assert.ok(stack.tokens.length > 0);
    assert.ok(stack.tokens.every((t) => t.path.startsWith('space.')));
  }
);

test('generating twice gives identical output, and feeding output back is stable', () => {
  const root = fixture();
  const a = generate(root);
  assert.deepEqual([...generate(root)], [...a]);
  put(root, 'docs/control/widget.md', a.get('docs/control/widget.md'));
  assert.equal(generate(root).get('docs/control/widget.md'), a.get('docs/control/widget.md'));
});

test('unknown category throws', () => {
  const root = fixture({ doc: DOC.replace('Actions', 'Bogus') });
  assert.throws(() => generate(root), /docs\/control\/widget\.md: unknown category "Bogus"/);
});

test('non-strict skips docs without front matter, strict throws', () => {
  const root = fixture({ doc: '# Widget\n' });
  const files = generate(root);
  assert.equal(files.has('docs/control/widget.md'), false);
  assert.deepEqual(JSON.parse(files.get('gallery/generated/site-data.json')).modules, []);
  assert.throws(
    () => generate(root, { strict: true }),
    /docs\/control\/widget\.md: missing front matter/
  );
});

test('the preview is site data only, never a doc example; strict requires one', () => {
  const root = fixture();
  const files = generate(root);
  const [mod] = JSON.parse(files.get('gallery/generated/site-data.json')).modules;
  assert.equal(mod.preview.file, 'src/control/widget/examples/preview.tsx');
  assert.deepEqual(
    mod.examples.map((e) => e.slug),
    ['basic']
  );
  assert.doesNotMatch(files.get('docs/control/widget.md'), /Preview/);
  rmSync(join(root, 'src/control/widget/examples/preview.tsx'));
  assert.throws(
    () => generate(root, { strict: true }),
    /docs\/control\/widget\.md: no preview \(examples\/preview\.tsx\)/
  );
});

test('missing dist throws', () => {
  const root = fixture();
  rmSync(join(root, 'dist'), { recursive: true });
  assert.throws(() => generate(root), /dist\/ missing: run npm run build/);
});

test('unknown changelog tags throw', () => {
  const root = fixture();
  put(root, 'CHANGELOG.md', '## 1.0.0 — 2026-01-01\n\n- [Nope] x\n');
  assert.throws(() => generate(root), /unknown tag "Nope"/);
});

test('real repo: generate runs and AGENTS.md index is unchanged', () => {
  const files = generate(realRepo);
  assert.ok(files.has('gallery/generated/site-data.json'));
  assert.equal(files.get('AGENTS.md'), readFileSync(join(realRepo, 'AGENTS.md'), 'utf8'));
});

test('strict mode on the real repo throws for none', () => {
  assert.doesNotThrow(() => generate(realRepo, { strict: true, warn: () => {} }));
});

test('--check exits 0 when current, 1 after a JSDoc edit', () => {
  const root = mkdtempSync(join(tmpdir(), 'docs-gen-cli-'));
  roots.push(root);
  cpSync(join(realRepo, 'scripts'), join(root, 'scripts'), { recursive: true });
  const fx = fixture();
  roots.push(fx);
  for (const p of ['package.json', 'src', 'dist', 'docs', 'AGENTS.md', 'CHANGELOG.md']) {
    cpSync(join(fx, p), join(root, p), { recursive: true });
  }
  // The CLI is strict: every module, entry points included, needs front matter and an example.
  for (const [area, category] of [
    ['theme', 'Theme'],
    ['toast', 'Feedback'],
    ['icon', 'Data display'],
  ]) {
    put(
      root,
      `docs/${area}.md`,
      DOC.replace('Widget', area).replace('Actions', category).replace('# Widget', `# ${area}`)
    );
    put(
      root,
      `src/${area}/examples/01-basic.tsx`,
      '/**\n * Basic\n *\n * Plain use.\n */\nexport default () => null;\n'
    );
    put(root, `src/${area}/examples/preview.tsx`, '/** Preview */\nexport default () => null;\n');
    put(root, `dist/${area}/index.d.ts`, 'export {};\n');
  }
  symlinkNodeModules(root);
  const cli = join(root, 'scripts/docs-gen/cli.mjs');
  const run = (...args) => spawnSync('node', [cli, ...args], { encoding: 'utf8' });
  const first = run();
  assert.equal(first.status, 0, first.stderr);
  const ok = run('--check');
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /docs:check: ok/);
  put(root, 'dist/control/widget/index.d.ts', DTS.replace('Visible label.', 'Changed label.'));
  const stale = run('--check');
  assert.equal(stale.status, 1);
  assert.match(stale.stderr, /docs:check: stale docs\/control\/widget\.md/);
  assert.match(stale.stderr, /run npm run docs:gen/);
});

function symlinkNodeModules(root) {
  spawnSync('ln', ['-s', join(realRepo, 'node_modules'), join(root, 'node_modules')]);
}

const RECIPE_DOC = `---
title: Sign in
description: A sign-in screen.
category: Recipe
---

# Sign in

Why prose.

<!-- generated:examples -->
<!-- /generated:examples -->
`;

function recipeFixture({ doc = true, folder = true } = {}) {
  const root = fixture();
  if (doc) put(root, 'docs/recipes/login.md', RECIPE_DOC);
  if (folder) put(root, 'recipes/login/01-sign-in.tsx', '/** Sign in */\nexport default () => null;\n');
  return root;
}

test('collects a recipe: site data and its examples region', () => {
  const files = generate(recipeFixture());
  const doc = files.get('docs/recipes/login.md');
  assert.ok(doc.startsWith('---\ntitle: Sign in'));
  assert.match(doc, /### Sign in/);
  assert.match(doc, /```tsx\nexport default \(\) => null;\n```/);
  const site = JSON.parse(files.get('gallery/generated/site-data.json'));
  assert.equal(site.recipes.length, 1);
  const r = site.recipes[0];
  assert.equal(r.slug, 'login');
  assert.equal(r.docPath, 'docs/recipes/login.md');
  assert.equal(r.title, 'Sign in');
  assert.equal(r.description, 'A sign-in screen.');
  assert.equal(r.examples[0].file, 'recipes/login/01-sign-in.tsx');
  assert.ok(r.body.startsWith('Why prose.'));
  assert.ok(!r.body.includes('generated:'));
  assert.ok(!site.guides.some((g) => g.slug === 'login'));
});

test('a recipe doc fed back is stable', () => {
  const root = recipeFixture();
  const a = generate(root).get('docs/recipes/login.md');
  put(root, 'docs/recipes/login.md', a);
  assert.equal(generate(root).get('docs/recipes/login.md'), a);
});

test('a recipe doc with no examples throws', () => {
  assert.throws(
    () => generate(recipeFixture({ folder: false })),
    /docs\/recipes\/login\.md: no examples in recipes\/login\//
  );
});

test('a recipe folder with no doc throws', () => {
  assert.throws(
    () => generate(recipeFixture({ doc: false })),
    /recipes\/login\/: no docs\/recipes\/login\.md/
  );
});

test('category Recipe outside docs/recipes throws', () => {
  const root = fixture();
  put(root, 'docs/stray.md', RECIPE_DOC);
  assert.throws(() => generate(root), /docs\/stray\.md: category Recipe belongs in docs\/recipes\//);
});

test('a doc in docs/recipes must have category Recipe', () => {
  const root = recipeFixture();
  put(root, 'docs/recipes/login.md', RECIPE_DOC.replace('category: Recipe', 'category: Guide'));
  assert.throws(() => generate(root), /docs\/recipes\/login\.md: category must be Recipe/);
});

test('a fixture without recipes/ gives recipes: []', () => {
  const site = JSON.parse(generate(fixture()).get('gallery/generated/site-data.json'));
  assert.deepEqual(site.recipes, []);
});
