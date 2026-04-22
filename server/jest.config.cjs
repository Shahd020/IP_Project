/**
 * Jest configuration for a native ESM project (package.json "type":"module").
 * Run with: node --experimental-vm-modules node_modules/.bin/jest
 *
 * No Babel transform needed — Jest handles ESM natively via the flag above.
 */

/** @type {import('jest').Config} */
module.exports = {
  // Use Node.js test environment (not jsdom)
  testEnvironment: 'node',

  coverageDirectory: 'coverage',


  // Disable all transforms so Jest uses native ESM
  transform: {},

  // Global test setup file (starts in-memory MongoDB, connects Mongoose)
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test file patterns
  testMatch: ['<rootDir>/tests/**/*.test.js'],

  // Files measured for coverage


  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',    // entry point — not unit-testable in isolation
    '!src/config/sentry.js',
  ],

  // Enforce the >80% rubric threshold
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  coverageReporters: ['text', 'lcov', 'html'],

  // Prevent hanging after async tests
  forceExit: true,
  detectOpenHandles: true,

  // Verbose output so every test name is visible in CI
  verbose: true,
};
