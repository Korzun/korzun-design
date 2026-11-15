import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// No `node:` imports: the repo has no @types/node, and `tsc` checks this file.
const here = decodeURIComponent(new URL('.', import.meta.url).pathname);
const src = (path: string) => `${here}../src/${path}`;

export default defineConfig({
  root: here,
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@korzun\/design\/(.*)$/, replacement: src('$1') },
      { find: /^@korzun\/design$/, replacement: src('index.ts') },
    ],
  },
  server: { host: true },
});
