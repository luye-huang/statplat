// var debug = process.env.NODE_ENV !== "production";
var debug = process.traceDeprecation = true
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname + '/src',
  // devtool: debug ? "inline-sourcemap" : null,
  // entry: "./js/index.js",
  entry: [
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://localhost:8080',
      './js/index.js'
    ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
          // plugins: ['react-html-attrs'], //添加组件的插件配置
        }
      },
      //下面是使用 ant-design 的配置文件
      // { test: /\.css$/, loader: 'style-loader!css-loader' }
    ]
  },
  output: {
    path: __dirname + "/src/",
    filename: "bundle.js"
  },
  // plugins: debug ? [] : [
  //   new webpack.optimize.DedupePlugin(),
  //   new webpack.optimize.OccurenceOrderPlugin(),
  //   new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  // ],
};
