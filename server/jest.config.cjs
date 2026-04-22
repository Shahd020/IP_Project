/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    // entry points and config — not unit-testable in isolation
    '!src/index.js',
    '!src/server.js',
    '!src/seeder.js',
    '!src/config/**',
    // old duplicate files left by merge conflict — not imported by app
    '!src/**/*.controller.js',
    '!src/**/*.service.js',
    '!src/**/*.routes.js',
    '!src/sockets/forum.socket.js',
    '!src/middleware/authenticate.js',
    '!src/middleware/validate.js',
    '!src/utils/**',
    '!src/validators/**',
    '!src/tests/**',
  ],
  coverageThreshold: {
    global: { lines: 50, functions: 30 },
  },
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  globalSetup: './tests/globalSetup.js',
  globalTeardown: './tests/globalTeardown.js',
  setupFilesAfterEnv: ['./tests/setup.js'],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
};
