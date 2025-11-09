import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom for DOM simulation (faster than browser mode)
    environment: 'jsdom',
    // Enable global test APIs (describe, it, expect, etc.)
    globals: true,
    // Setup files to run before each test file
    setupFiles: './src/test-utils/setup.ts',
    // Coverage configuration
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-utils/',
        '**/*.stories.tsx',
        '**/*.config.ts',
        'dist/',
        '.storybook/',
        'coverage/',
      ],
      // Coverage thresholds (optional)
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
    // Include test files
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'src/**/__tests__/**/*.{ts,tsx}',
    ],
    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      '.storybook',
      'storybook-static',
      'coverage',
      '**/*.browser.tsx', // Exclude old browser tests
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
