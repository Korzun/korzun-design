import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import { designAlias, galleryAlias } from './gallery/alias';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: [...designAlias, ...galleryAlias] },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'gallery/**/*.test.{ts,tsx}'],
  },
});
