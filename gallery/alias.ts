import type { Alias } from 'vite';

// No `node:` imports: the repo has no @types/node, and `tsc` checks this file.
const here = decodeURIComponent(new URL('.', import.meta.url).pathname);
const src = (path: string) => `${here}../src/${path}`;

export const galleryAlias: Alias[] = [{ find: /^@gallery\/(.*)$/, replacement: `${here}$1` }];

// Resolves `@korzun/design` and its subpaths to the source tree, so the gallery and its
// tests never depend on a built `dist/`.
export const designAlias: Alias[] = [
  { find: /^@korzun\/design\/(.*)$/, replacement: src('$1') },
  { find: /^@korzun\/design$/, replacement: src('index.ts') },
];
