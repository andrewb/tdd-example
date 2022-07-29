module.exports = {
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es6: true,
    jest: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020
  },
  plugins: ['react', 'testing-library', 'jest-dom'],
  extends: [
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
    'eslint:recommended',
    'plugin:react/recommended'
  ]
};
