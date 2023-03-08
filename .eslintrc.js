const { withVitest } = require('@kkkaoru/eslint-config');

module.exports = {
  ...withVitest,
  parserOptions: {
    ...withVitest.parserOptions,
    tsconfigRootDir: __dirname,
  },
  overrides: [
    ...withVitest.overrides,
    {
      files: ['**/vite.config.ts'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'unicorn/prefer-module': 'off',
      },
    },
  ],
  rules: {
    ...withVitest.rules,
    '@typescript-eslint/restrict-template-expressions': 'off',
  },
};
