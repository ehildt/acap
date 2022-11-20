'use strict';

/**
 * @type {import('eslint'.Linter.Config)}
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'no-loops', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:sonarjs/recommended',
  ],
  rules: {
    'no-console': 'error',
    'no-loops/no-loops': 'error',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  ignorePatterns: ['node_modules', '.clinic', 'dist', 'coverage', '.eslintrc.js', '**/*.config.js', '**/*.config.ts'],
  env: {
    node: true,
    jest: true,
  },
};
