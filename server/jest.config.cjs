/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',


  coverageDirectory: 'coverage',


  // Disable all transforms so Jest uses native ESM
  transform: {},

  // Global test setup file (starts in-memory MongoDB, connects Mongoose)
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test file patterns
  testMatch: ['<rootDir>/tests/**/*.test.js'],

  // Files measured for coverage



  coverageDirectory: 'coverage',

  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',        // HTTP + Socket.io bootstrap — not unit-testable
    '!src/seeder.js',        // seed script — not application logic
    '!src/config/db.js',     // MongoDB connection setup — requires a live server
    '!src/config/sentry.js', // error-tracking init — no testable logic
    '!src/sockets/**',       // Socket.io handlers — need integration/e2e tests
  ],

  // Coverage thresholds.
  // Branches are set lower because several paths are production-only
  // (NODE_ENV checks, Sentry integration) and cannot be hit in a test environment.
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  globalSetup: './tests/globalSetup.js',
  globalTeardown: './tests/globalTeardown.js',
  setupFilesAfterEnv: ['./tests/setup.js'],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
};
