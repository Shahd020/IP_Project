/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'script',
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['jest'],
  rules: {
    // Allow console.info/warn/error in server code; ban console.log (use a logger)
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    // Unused variables are errors; leading _ marks intentionally unused params
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    // Prevent accidental == instead of ===
    eqeqeq: ['error', 'always'],
    // Enforce const where let is never reassigned
    'prefer-const': 'error',
    // Disallow var
    'no-var': 'error',
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      env: { 'jest/globals': true },
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      rules: {
        // Allow longer describe/it strings in tests
        'jest/valid-title': 'warn',
        // console.log is fine in tests for debugging
        'no-console': 'off',
      },
    },
  ],
};
