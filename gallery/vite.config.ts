import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { designAlias } from './alias';

const here = decodeURIComponent(new URL('.', import.meta.url).pathname);

export default defineConfig({
  root: here,
  plugins: [react()],
  resolve: { alias: designAlias },
  server: { host: true },
});
