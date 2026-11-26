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

/** A value in backticks inside a table cell; empty stays empty. */
function code(text) {
  return text ? `\`${cell(text)}\`` : '';
}

function anchor(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '');
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

/** Type cell; names of supporting tables become links to their `###` heading. */
function typeCell(type, linkable) {
  if (linkable.size === 0) return code(type);
  const pieces = String(type).split(/([A-Za-z_$][\w$]*)/);
  const out = [];
  let plain = '';
  const flush = () => {
    if (plain.trim()) out.push(code(plain));
    plain = '';
  };
  for (const piece of pieces) {
    if (linkable.has(piece)) {
      flush();
      out.push(`[${piece}](#${anchor(piece)})`);
    } else {
      plain += piece;
    }
  }
  flush();
  return out.join(' ');
}

function rowsTable(rows, linkable) {
  const lines = ['| Prop | Type | Default | Description |', '| --- | --- | --- | --- |'];
  for (const r of rows) {
    const name = `\`${cell(r.name)}\`${r.required ? ' (required)' : ''}`;
    const desc = (r.deprecated ? '**Deprecated.** ' : '') + cell(r.description ?? '');
    lines.push(`| ${name} | ${typeCell(r.type, linkable)} | ${code(r.default)} | ${desc.trim()} |`);
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
  if (table.rows.length > 0) parts.push(rowsTable(table.rows, linkable));
  const extra = alsoAccepts(table);
  if (extra) parts.push(extra);
  return parts;
}

/**
 * Props tables first, the module's own `<Value>Props` leading, then object
 * tables, then the alias block. Every table with a `###` heading is a link
 * target for the other tables' type cells.
 */
function renderProps(mod) {
  const mains = new Set(mod.values.map((v) => `${v}Props`));
  const propsTables = mod.tables
    .filter((t) => t.kind === 'props')
    .sort((a, b) => Number(mains.has(b.name)) - Number(mains.has(a.name)));
  const objects = mod.tables.filter((t) => t.kind === 'object');
  const aliases = mod.tables.filter((t) => t.kind === 'alias');
  const headed = propsTables.length > 1;
  const targets = [...(headed ? propsTables : []), ...objects, ...aliases].map((t) => t.name);
  const linkable = (self) => new Set(targets.filter((n) => n !== self.name));
  const parts = ['## Props'];
  for (const t of propsTables) parts.push(...tableBlock(t, linkable(t), headed));
  for (const t of objects) parts.push(...tableBlock(t, linkable(t), true));
  if (aliases.length > 0) {
    const text = aliases.map((t) => `type ${t.name} = ${(t.text ?? '').trim()};`).join('\n');
    parts.push('### Types', `\`\`\`ts\n${text}\n\`\`\``);
  }
  if (parts.every((p) => /^#+ [^\n]*$/.test(p))) {
    return '## Props\n\nThis module takes no props; see Usage for its API.';
  }
  return parts.join('\n\n');
}

function renderTokens(mod) {
  if (mod.tokens.length === 0) return '## Tokens\n\nThis module has no styles of its own.';
  const rows = mod.tokens.map((t) => {
    const light = t.kind === 'recipe' ? 'recipe' : t.light;
    const dark = t.kind === 'recipe' ? 'recipe' : t.dark;
    return `| ${code(`theme.${t.path}`)} | ${code(light ?? '')} | ${code(dark ?? '')} |`;
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
 */
export function renderRegion(name, mod) {
  const render = RENDERERS[name];
  if (!render) throw new Error(`unknown region: ${name}`);
  return render(mod);
}

const open = (name) => `<!-- generated:${name} -->`;
const close = (name) => `<!-- /generated:${name} -->`;

/**
 * Replace the content of every generated region, keeping the markers.
 * @param {string} md
 * @param {ModuleInfo} mod
 * @param {string} file used in error messages
 */
export function replaceRegions(md, mod, file) {
  const spans = REGIONS.map((name) => {
    const start = md.indexOf(open(name));
    if (start === -1) throw new Error(`${file}: missing ${open(name)}`);
    const contentStart = start + open(name).length;
    const end = md.indexOf(close(name), contentStart);
    if (end === -1) throw new Error(`${file}: missing ${close(name)}`);
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
    const content = renderRegion(s.name, mod);
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
