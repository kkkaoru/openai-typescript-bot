const { withVitest } = require('@kkkaoru/eslint-config');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  ...withVitest,
  parserOptions: {
    ...withVitest.parserOptions,
    tsconfigRootDir: __dirname,
  },
  rules: {
    ...withVitest.rules,
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/naming-convention': 'off',
  },
};
