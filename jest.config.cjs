/** @type {import('jest').Config} */

module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.browser.{ts,tsx}', // Browser tests
    '**/__tests__/**/*.node.{ts,tsx}', // Node tests
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/src/setup-tests.ts'],
  // Bun-specific configuration
  resolver: undefined, // Let Bun handle module resolution
  runner: 'jest-runner', // Default Jest runner works with Bun
  testRunner: undefined, // Let Bun use its own test runner
};