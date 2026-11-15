// Copies a file or folder from Bookplate's client source into this repo, rewrites its `~/`
// alias imports to relative paths, then gives every relative specifier an explicit `.js` or
// `/index.js` ending so the emitted ESM resolves under Node.
//
// Usage: node scripts/port.mjs <bookplate-relative-path> <dest-relative-path>
//        node scripts/port.mjs --extensions-only <dest-relative-path>
import { cpSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BOOKPLATE_SRC = path.join(homedir(), 'code/bookplate/app/client/src');
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const EXACT = {
  '~/provider/theme': 'src/theme',
  '~/provider/toast': 'src/toast',
  '~/icon': 'src/icon',
  '~/utils': 'src/utils',
  '~/test-utils': 'src/test-utils',
};

const HOOKS = ['use-minimize-on-scroll', 'use-pull-to-refresh', 'is-standalone'];

// Returns the repo-root-relative target for a Bookplate alias, or null when it is not mapped.
const resolveAlias = (specifier) => {
  if (EXACT[specifier]) return EXACT[specifier];
  const hook = HOOKS.find((name) => specifier === `~/lib/${name}`);
  if (hook) return `src/hooks/${hook}`;
  const module = specifier.match(/^~\/(control|component)\/(.+)$/);
  if (module) return `src/${module[1]}/${module[2]}`;
  return null;
};

const relativeSpecifier = (destFile, target) => {
  const relative = path.posix.relative(path.posix.dirname(destFile), target);
  return relative.startsWith('.') ? relative : `./${relative}`;
};

// Matches `from '~/x'`, `import '~/x'` and `import('~/x')`, keeping the quote characters.
const IMPORT_PATTERN = /(\bfrom\s*|\bimport\s*\(?\s*)(['"])(~\/[^'"]*)\2/g;

export const rewriteImports = (source, destFile) => {
  const unmapped = [];
  const output = source.replace(IMPORT_PATTERN, (match, lead, quote, specifier) => {
    const target = resolveAlias(specifier);
    if (target === null) {
      unmapped.push(`UNMAPPED ${destFile}: ${specifier}`);
      return match;
    }
    return `${lead}${quote}${relativeSpecifier(destFile, target)}${quote}`;
  });
  if (unmapped.length > 0) {
    const error = new Error(unmapped.join('\n'));
    error.output = output;
    throw error;
  }
  return output;
};

// Matches relative specifiers (`./x`, `../x`, `.`, `..`) in the same statement shapes.
const RELATIVE_PATTERN = /(\bfrom\s*|\bimport\s*\(?\s*)(['"])(\.\.?(?:\/[^'"]*)?)\2/g;

// Specifiers that already name a file Node can load as written.
const SUFFIXED = /\.(?:[cm]?js|jsx|json|css|svg|png|jpe?g|gif|webp|woff2?)$/;

// `exists(path)` takes a repo-root-relative POSIX path and returns 'file', 'dir' or null.
export const addExtensions = (source, destFile, exists) => {
  const unresolved = [];
  const dir = path.posix.dirname(destFile);
  const isFile = (candidate) => exists(candidate) === 'file';
  const output = source.replace(RELATIVE_PATTERN, (match, lead, quote, specifier) => {
    if (SUFFIXED.test(specifier)) return match;
    const base = path.posix.join(dir, specifier);
    if (isFile(`${base}.ts`) || isFile(`${base}.tsx`)) {
      return `${lead}${quote}${specifier}.js${quote}`;
    }
    if (exists(base) === 'dir' && (isFile(`${base}/index.ts`) || isFile(`${base}/index.tsx`))) {
      return `${lead}${quote}${specifier.replace(/\/$/, '')}/index.js${quote}`;
    }
    unresolved.push(`UNRESOLVED ${destFile}: ${specifier}`);
    return match;
  });
  if (unresolved.length > 0) {
    const error = new Error(unresolved.join('\n'));
    error.output = output;
    throw error;
  }
  return output;
};

const existsOnDisk = (relative) => {
  try {
    const stats = statSync(path.join(REPO_ROOT, relative));
    if (stats.isFile()) return 'file';
    return stats.isDirectory() ? 'dir' : null;
  } catch {
    return null;
  }
};

const sourceFiles = (target) => {
  if (statSync(target).isFile()) return /\.tsx?$/.test(target) ? [target] : [];
  return readdirSync(target, { recursive: true })
    .map((entry) => path.join(target, entry))
    .filter((file) => statSync(file).isFile() && /\.tsx?$/.test(file));
};

// Runs each pass over every source file under `destination`, printing misses; 1 if any.
const rewriteTree = (destination, passes) => {
  let failed = false;
  for (const file of sourceFiles(destination)) {
    const destFile = path.relative(REPO_ROOT, file).split(path.sep).join('/');
    let source = readFileSync(file, 'utf8');
    for (const pass of passes) {
      try {
        source = pass(source, destFile);
      } catch (error) {
        if (typeof error.output !== 'string') throw error;
        source = error.output;
        console.error(error.message);
        failed = true;
      }
    }
    writeFileSync(file, source);
  }
  return failed ? 1 : 0;
};

const withExtensions = (source, destFile) => addExtensions(source, destFile, existsOnDisk);

const main = (from, to) => {
  if (from === '--extensions-only' && to) {
    return rewriteTree(path.resolve(REPO_ROOT, to), [withExtensions]);
  }
  if (!from || !to) {
    console.error('Usage: node scripts/port.mjs <bookplate-relative-path> <dest-relative-path>');
    console.error('       node scripts/port.mjs --extensions-only <dest-relative-path>');
    return 1;
  }
  const destination = path.resolve(REPO_ROOT, to);
  cpSync(path.join(BOOKPLATE_SRC, from), destination, { recursive: true });
  return rewriteTree(destination, [rewriteImports, withExtensions]);
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv[2], process.argv[3]);
}
