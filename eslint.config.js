import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  // Base Node.js environment for all files
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Common Node.js globals
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
      },
    },
  },
  // Browser-specific environment for browser files
  {
    files: [
      '**/*.browser.{js,ts,jsx,tsx}',
      '**/src/components/**/*.{js,ts,jsx,tsx}',
      '**/src/features/**/*.{js,ts,jsx,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  // Node-specific environment for node files
  {
    files: [
      '**/*.node.{js,ts,jsx,tsx}',
      '**/vite.config.mts',
      '**/eslint.config.js',
      '**/jest.config.cjs',
    ],
    languageOptions: {
      globals: {
        // Additional Node.js globals that might be needed
        global: 'readonly',
        exports: 'readonly',
      },
    },
  },
  // Testing environment for test files
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/__tests__/**/*.{ts,tsx}',
      '**/setup-tests.ts',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        // Allow both browser and node globals in tests
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'error',
      'react/prop-types': 'off',
      'react/no-children-prop': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          minimumDescriptionLength: 5,
        },
      ],
      'no-restricted-globals': [
        'error',
        {
          name: 'event',
          message: 'Use local parameter instead.',
        },
      ],
      indent: ['error', 2],
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prettier/prettier': 'error',
      ...prettierConfig.rules,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Specific rules for browser environment files
  {
    files: ['**/*.browser.{js,ts,jsx,tsx}'],
    rules: {
      'no-restricted-globals': 'off', // Allow browser globals in browser files
    },
  },

  // Specific rules for Node.js environment files
  {
    files: ['**/*.node.{js,ts,jsx,tsx}'],
    rules: {
      'no-console': 'off', // Allow console in Node files
    },
  },

  // Ignore directories and files not needing linting
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '.storybook/**',
      'storybook-static/**',
      '.bun-cache/**',
    ],
  },
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      ...prettierConfig.rules,
    },
  },
]);
