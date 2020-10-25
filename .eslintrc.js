module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'indent': ['off', 2],
    'space-before-function-paren': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'comma-spacing': 0,
    '@typescript-eslint/type-annotation-spacing': 0,
    'func-call-spacing': 0,
    'space-in-parens': 0,
    '@typescript-eslint/no-explicit-any': 0
  }
}
