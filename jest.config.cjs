/** @type {import('jest').Config} */

module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.{ts,tsx}'],
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
};
