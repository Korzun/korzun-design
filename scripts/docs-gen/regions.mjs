import { anchor } from './slug.mjs';

/** @typedef {import('./types.js').ModuleInfo} ModuleInfo */
/** @typedef {import('./types.js').PropRow} PropRow */
/** @typedef {import('./types.js').TypeTable} TypeTable */

/** Region names, in the order they must appear in a doc. */
export const REGIONS = ['import', 'examples', 'props', 'tokens', 'changelog'];

const MAX_LINE = 100;

const byName = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** Make text safe inside a table cell. */
function cell(text) {
  return String(text).replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim();
}

/**
 * A value as a code span inside a table cell; empty stays empty. The fence is
 * one backtick longer than the longest run inside (a template literal type),
 * with a space inside each end when the text starts or ends with a backtick.
 */
function code(text) {
  if (!text) return '';
  const body = cell(text);
  const longest = Math.max(0, ...(body.match(/`+/g) ?? []).map((run) => run.length));
  const fence = '`'.repeat(longest + 1);
  const pad = /^`|`$/.test(body) ? ' ' : '';
  return `${fence}${pad}${body}${pad}${fence}`;
}

/**
 * Link from the doc at `from` to `to`, a repo path with its anchor
 * (`docs/control/menu.md#menuitem`, `docs/theme.md#theme`). From an area
 * folder the link goes up to `docs/` first, as hand-written doc links do
 * (`../control/menu.md#menuitem`).
 */
function docLink(from, to) {
  const up = from.split('/').length > 2 ? '../' : '';
  return `${up}${to.slice('docs/'.length)}`;
}

/** Import specifiers as written in an import line: `A, B, type C`. Empty when none. */
export function importNames(mod) {
  return [
    ...[...mod.values].sort(byName),
    ...[...mod.types].sort(byName).map((t) => `type ${t}`),
  ].join(', ');
}

function renderImport(mod) {
  const names = importNames(mod) === '' ? [] : importNames(mod).split(', ');
  if (names.length === 0) return `\`import '${mod.entry}'\``;
  const line = `import { ${names.join(', ')} } from '${mod.entry}'`;
  if (line.length <= MAX_LINE) return `\`${line}\``;
  return `\`\`\`ts\nimport {\n${names.map((n) => `  ${n},`).join('\n')}\n} from '${mod.entry}';\n\`\`\``;
}

function renderExamples(mod) {
  if (mod.examples.length === 0) return '## Examples\n\nNo examples yet.';
  const parts = ['## Examples'];
  for (const ex of mod.examples) {
    parts.push(`### ${ex.title}`);
    if (ex.description) parts.push(ex.description.trim());
    parts.push(`\`\`\`tsx\n${ex.code.replace(/\n+$/, '')}\n\`\`\``);
  }
  return parts.join('\n\n');
}

/**
 * Type cell; names in `linkable` (name -> link) become links to their table,
 * in this doc or another. The text between links is code; its edge spaces sit
 * outside the code span, so the cell reads as the type does (`MenuItem[]`,
 * `(item: MenuItem) => void`).
 */
function typeCell(type, linkable) {
  if (linkable.size === 0) return code(type);
  const pieces = String(type).split(/([A-Za-z_$][\w$]*)/);
  const out = [];
  let plain = '';
  const flush = () => {
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(plain.replace(/\r?\n/g, ' '));
    if (m[1]) out.push(' ');
    if (m[2]) out.push(code(m[2]));
    if (m[3] && m[2]) out.push(' ');
    plain = '';
  };
  for (const piece of pieces) {
    if (linkable.has(piece)) {
      flush();
      out.push(`[${piece}](${linkable.get(piece)})`);
    } else {
      plain += piece;
    }
  }
  flush();
  return out.join('').trim();
}

function rowsTable(rows, linkable) {
  const lines = ['| Prop | Type | Default | Description |', '| --- | --- | --- | --- |'];
  for (const r of rows) {
    const name = `\`${cell(r.name)}\`${r.required ? ' (required)' : ''}`;
    const desc = (r.deprecated ? '**Deprecated.** ' : '') + cell(r.description ?? '');
    const def = r.defaultProse ? cell(r.default ?? '') : code(r.default);
    lines.push(`| ${name} | ${typeCell(r.type, linkable)} | ${def} | ${desc.trim()} |`);
  }
  return lines.join('\n');
}

function alsoAccepts(table) {
  if (!table.extends || table.extends.length === 0) return '';
  return `Also accepts: ${table.extends.map((e) => `\`${e}\``).join(', ')}.`;
}

function tableBlock(table, linkable, heading) {
  const parts = [];
  if (heading) parts.push(`### ${table.name}`);
  if (table.description) parts.push(table.description);
  if (table.rows.length > 0) parts.push(rowsTable(table.rows, linkable));
  const extra = alsoAccepts(table);
  if (extra) parts.push(extra);
  return parts;
}

/**
 * Props tables first, the module's own `<Value>Props` leading, then object
 * tables, then aliases, each group in its given order. The props region
 * renders in this order and the site data stores it, so both read the same.
 * @param {TypeTable[]} tables
 * @param {string[]} values
 * @returns {TypeTable[]}
 */
export function orderTables(tables, values) {
  const mains = new Set(values.map((v) => `${v}Props`));
  const propsTables = tables
    .filter((t) => t.kind === 'props')
    .sort((a, b) => Number(mains.has(b.name)) - Number(mains.has(a.name)));
  return [
    ...propsTables,
    ...tables.filter((t) => t.kind === 'object'),
    ...tables.filter((t) => t.kind === 'alias'),
  ];
}

/**
 * The anchor of each table the props region gives a heading, by type name, in
 * render order: an object's `###` heading, every props table's when there are
 * several, and the shared `### Types` block for an alias. Other docs link
 * to these too.
 * @param {ModuleInfo} mod
 * @returns {Map<string, string>}
 */
export function tableAnchors(mod) {
  const ordered = orderTables(mod.tables, mod.values);
  const headed = ordered.filter((t) => t.kind === 'props').length > 1;
  return new Map(
    ordered
      .filter((t) => headed || t.kind !== 'props')
      .map((t) => [t.name, t.kind === 'alias' ? 'types' : anchor(t.name)])
  );
}

/**
 * The tables in `orderTables` order: props, objects, then one alias block,
 * each with its type description under the heading (an alias's as a doc
 * comment in the block). Every headed table is a link target for the other
 * tables' type cells (see `tableAnchors`). `typeDocs` (type name -> doc path
 * and anchor) adds the tables of other docs; a name this doc has wins.
 */
function renderProps(mod, { typeDocs = new Map() } = {}) {
  const ordered = orderTables(mod.tables, mod.values);
  const propsTables = ordered.filter((t) => t.kind === 'props');
  const objects = ordered.filter((t) => t.kind === 'object');
  const aliases = ordered.filter((t) => t.kind === 'alias');
  const headed = propsTables.length > 1;
  const own = new Set(mod.tables.map((t) => t.name));
  const external = [...typeDocs]
    .filter(([name]) => !own.has(name))
    .map(([name, to]) => [name, docLink(mod.docPath, to)]);
  const anchors = [...tableAnchors(mod)].map(([name, id]) => [name, `#${id}`]);
  const linkable = (self) => new Map([...external, ...anchors.filter(([n]) => n !== self.name)]);
  const parts = ['## Props'];
  for (const t of propsTables) parts.push(...tableBlock(t, linkable(t), headed));
  for (const t of objects) parts.push(...tableBlock(t, linkable(t), true));
  if (aliases.length > 0) {
    const text = aliases
      .map((t) => {
        const decl = `type ${t.name} = ${(t.text ?? '').trim()};`;
        return t.description ? `/** ${t.description} */\n${decl}` : decl;
      })
      .join('\n');
    parts.push('### Types', `\`\`\`ts\n${text}\n\`\`\``);
  }
  if (parts.every((p) => /^#+ [^\n]*$/.test(p))) {
    return '## Props\n\nThis module takes no props; see Usage for its API.';
  }
  return parts.join('\n\n');
}

function renderTokens(mod) {
  if (mod.tokens.length === 0) return '## Tokens\n\nThis module has no styles of its own.';
  // A recipe is a style fragment, not one value: link to its entry in the tokens guide.
  const recipe = `[recipe](${docLink(mod.docPath, 'docs/tokens.md#recipe')})`;
  const rows = mod.tokens.map((t) => {
    if (t.kind === 'recipe') return `| ${code(`theme.${t.path}`)} | ${recipe} | ${recipe} |`;
    return `| ${code(`theme.${t.path}`)} | ${code(t.light ?? '')} | ${code(t.dark ?? '')} |`;
  });
  return ['## Tokens', '', '| Token | Light | Dark |', '| --- | --- | --- |', ...rows].join('\n');
}

function renderChangelog(mod) {
  if (mod.changelog.length === 0) return '## Changelog\n\nNo changes yet.';
  const bullets = mod.changelog.map((e) => {
    const [first, ...rest] = e.text.split('\n');
    const nested = rest
      .map((l) => l.trimEnd())
      .filter((l) => l.trim() !== '')
      .map((l) => (/^ {2,}/.test(l) ? l : `  ${l}`));
    return [`- **${e.version}** (${e.date}): ${first.trim()}`, ...nested].join('\n');
  });
  return `## Changelog\n\n${bullets.join('\n')}`;
}

const RENDERERS = {
  import: renderImport,
  examples: renderExamples,
  props: renderProps,
  tokens: renderTokens,
  changelog: renderChangelog,
};

/**
 * @param {string} name one of REGIONS
 * @param {ModuleInfo} mod
 * @param {{ typeDocs?: Map<string, string> }} [ctx] type name -> `docs/…md#anchor` of its table in another doc
 */
export function renderRegion(name, mod, ctx = {}) {
  const render = RENDERERS[name];
  if (!render) throw new Error(`unknown region: ${name}`);
  return render(mod, ctx);
}

const open = (name) => `<!-- generated:${name} -->`;
const close = (name) => `<!-- /generated:${name} -->`;

/**
 * Replace the content of every generated region, keeping the markers.
 * @param {string} md
 * @param {ModuleInfo} mod
 * @param {string} file used in error messages
 * @param {{ typeDocs?: Map<string, string> }} [ctx] passed to each region's renderer
 */
export function replaceRegions(md, mod, file, ctx = {}) {
  const spans = REGIONS.map((name) => {
    const start = md.indexOf(open(name));
    if (start === -1) throw new Error(`${file}: missing ${open(name)}`);
    const contentStart = start + open(name).length;
    const end = md.indexOf(close(name), contentStart);
    if (end === -1) throw new Error(`${file}: missing ${close(name)}`);
    // A second pair would keep its stale content silently.
    if (md.indexOf(open(name), contentStart) !== -1 || md.indexOf(close(name), end + 1) !== -1) {
      throw new Error(`${file}: duplicate ${open(name)}`);
    }
    return { name, start, contentStart, end };
  });
  for (let i = 1; i < spans.length; i++) {
    if (spans[i].start < spans[i - 1].end) {
      throw new Error(`${file}: generated regions out of order`);
    }
  }
  let out = '';
  let cursor = 0;
  for (const s of spans) {
    const content = renderRegion(s.name, mod, ctx);
    out += md.slice(cursor, s.contentStart);
    out += `\n\n${content}\n\n`;
    cursor = s.end;
  }
  return out + md.slice(cursor);
}

/** Remove every generated region, markers included. */
export function stripRegions(md) {
  let out = md;
  for (const name of REGIONS) {
    const start = out.indexOf(open(name));
    if (start === -1) continue;
    const end = out.indexOf(close(name), start);
    if (end === -1) continue;
    out = out.slice(0, start) + out.slice(end + close(name).length);
  }
  return out.replace(/\n{3,}/g, '\n\n').trim();
}
