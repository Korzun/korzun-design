import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { designAlias, galleryAlias } from './alias.js';

const here = decodeURIComponent(new URL('.', import.meta.url).pathname);

export default defineConfig(({ mode }) => ({
  root: here,
  base: mode === 'pages' ? '/korzun-design/' : '/',
  plugins: [react()],
  resolve: { alias: [...designAlias, ...galleryAlias] },
  server: { host: true },
  build: { outDir: `${here}../gallery-dist`, emptyOutDir: true },
}));
