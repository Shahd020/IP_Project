/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
<<<<<<< HEAD

  coverageDirectory: 'coverage',


  // Disable all transforms so Jest uses native ESM
  transform: {},

  // Global test setup file (starts in-memory MongoDB, connects Mongoose)
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test file patterns
  testMatch: ['<rootDir>/tests/**/*.test.js'],

  // Files measured for coverage


=======
  coverageDirectory: 'coverage',
>>>>>>> 432d1fd7e21526f0e67bf425c6eced46f0b9c868
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
