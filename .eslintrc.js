const { withVitest } = require('@kkkaoru/eslint-config');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  ...withVitest,
  parserOptions: {
    ...withVitest.parserOptions,
    tsconfigRootDir: __dirname,
  },
};
