const { withVitest } = require('@kkkaoru/eslint-config');

module.exports = {
  ...withVitest,
  parserOptions: {
    ...withVitest.parserOptions,
    tsconfigRootDir: __dirname,
  },
  rules: {
    ...withVitest.rules,
    '@typescript-eslint/restrict-template-expressions': 'off'
  }
};
