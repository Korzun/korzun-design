import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generate } from './generate.mjs';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const check = process.argv.includes('--check');

let files;
try {
  files = generate(repo);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const read = (path) => {
  try {
    return readFileSync(join(repo, path), 'utf8');
  } catch {
    return null;
  }
};

if (check) {
  const stale = [...files].filter(([path, content]) => read(path) !== content).map(([p]) => p);
  if (stale.length > 0) {
    for (const path of stale) console.error(`docs:check: stale ${path}`);
    console.error('run npm run docs:gen');
    process.exit(1);
  }
  console.log('docs:check: ok');
} else {
  for (const [path, content] of files) {
    if (read(path) === content) continue;
    mkdirSync(dirname(join(repo, path)), { recursive: true });
    writeFileSync(join(repo, path), content);
    console.log(`wrote ${path}`);
  }
}
