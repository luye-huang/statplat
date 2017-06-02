
module.exports = {

  "extends": [ // extends 属性值可以省略包名的 eslint-config-  前缀
    "eslint:recommended",  //
    "plugin:react/recommended",
  ],

  "parser": "babel-eslint",
  // ESLint 支持使用第三方插件。在使用插件之前，必须使用 npm 安装它
  "plugins": [
    "import" , // 插件名称可以省略 eslint-plugin- 前缀
    "react", // 插件eslint-plugin-react
  ],
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "arrowFunctions": true,
      "classes": true,
      "modules": true,
      "defaultParams": true,
    }
  },
  "globals": { // 指出要使用的全局变量
    "var1": true, // 变量等于 true 允许变量被重写
    "var2": false //  等于 false 不允许被重写
  },
  "env": {
    "browser": true,
    "node": true,
    "es6":true,
    "commonjs":true,
  },

  /* rules
    "off" 或 0 - 关闭规则
    "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
    "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
  */
  "rules": {
    "semi": 1, //语句以分号结束
    "eqeqeq": [1, "smart"], //比较的时候使用严格等于
    "indent": ["warn", 2], // 缩进2
    "no-unused-vars":1,
    "no-console":1,
    "no-alert":1,
    "no-debugger":1,

    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/jsx-indent": [2, 2],
    "react/no-direct-mutation-state":1,
    "react/jsx-no-target-blank":1,

  },
}