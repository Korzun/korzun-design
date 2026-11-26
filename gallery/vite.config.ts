import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { designAlias } from './alias.js';
import { llmsPlugin } from './llms-plugin.js';

const here = decodeURIComponent(new URL('.', import.meta.url).pathname);

export default defineConfig(({ mode }) => ({
  root: here,
  base: mode === 'pages' ? '/korzun-design/' : '/',
  plugins: [
    react(),
    llmsPlugin({ siteUrl: mode === 'pages' ? 'https://korzun.github.io/korzun-design/' : '/' }),
  ],
  resolve: { alias: designAlias },
  server: { host: true },
  build: { outDir: `${here}../gallery-dist`, emptyOutDir: true },
}));
