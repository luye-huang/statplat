// https://segmentfault.com/a/1190000008671104  webpack upgrade
var htmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: "./src/js/main.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        include: path.resolve(__dirname, 'src'),
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {loader: "style-loader"},
          {loader: "css-loader"},
          {loader: "less-loader"}
          ]
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        use: 'url-loader?limit=50000&name=[path][name].[ext]'
      }
    ]
  },
  // postcss: [
  //   require('autoprefixer')({
  //     broswers: ['last 5 versions']
  //   })
  // ],
  node: {
    fs: "empty"
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: 'body',
      minify: {
        removeComments: true,
        //collapseWhitespace: true
      }
    })
  ]
}