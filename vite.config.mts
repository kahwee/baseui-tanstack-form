import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ 
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.stories.tsx', 'src/**/__tests__/**/*', 'src/**/stories.tsx'],
      rollupTypes: true,
      outDir: 'dist/types'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'baseui-tanstack-form',
      fileName: (format) => `baseui-tanstack-form.${format}.js`,
      formats: ['es', 'umd', 'cjs']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'baseui', '@tanstack/react-form', 'zod'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          baseui: 'baseui',
          '@tanstack/react-form': 'TanstackForm',
          zod: 'z'
        }
      }
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setup-tests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/setup-tests.ts',
        '**/*.stories.{ts,tsx}',
        'dist/'
      ]
    }
  }
});