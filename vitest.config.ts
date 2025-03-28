import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@shared': resolve(__dirname, './src/@shared'),
      '@features': resolve(__dirname, './src/@features'),
      '@design-system': resolve(__dirname, './src/@design-system'),
    },
  },
}); 