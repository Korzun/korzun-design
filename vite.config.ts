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
    projects: [
      {
        extends: true,
        test: {
          name: 'src',
          include: ['src/**/*.test.{ts,tsx}'],
          // A file's first test pays its cold imports (ThemeSetting, FieldList),
          // which can pass 5 s on a loaded machine.
          testTimeout: 15_000,
        },
      },
      {
        extends: true,
        test: {
          name: 'gallery',
          include: ['gallery/**/*.test.{ts,tsx}'],
          // A gallery test renders whole pages from the full site data; its first
          // render in a file can take over 5 s on a loaded machine.
          testTimeout: 30_000,
        },
      },
    ],
  },
});
