import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.stories.tsx', 'src/**/__tests__/**'],
      outDir: 'dist',
      rollupTypes: false,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(rootDir, 'src/index.tsx'),
        zod: resolve(rootDir, 'src/zod.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        format === 'cjs' ? `${entryName}.cjs` : `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        /^react(?:\/.*)?$/,
        /^react-dom(?:\/.*)?$/,
        /^baseui(?:\/.*)?$/,
        /^@tanstack\/react-form(?:\/.*)?$/,
        /^zod(?:\/.*)?$/,
      ],
    },
    sourcemap: true,
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
  },
});
