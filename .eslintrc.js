module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.wpy files
  plugins: [
    'html'
  ],
  settings: {
    'html/html-extensions': ['.html', '.wpy']
  },
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-before-function-paren': 0,
    //关闭禁止混用tab和空格
    "no-mixed-spaces-and-tabs": 0,
    // 关闭强制分号结尾
    "semi": 0,
    //空行最多不能超过100行
    "no-multiple-empty-lines": [0, {"max": 100}],
    "no-trailing-spaces": 0,
    "indent": 0,
    "space-infix-ops": 0
  }
}
