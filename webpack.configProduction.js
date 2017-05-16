/**
 * Created by luye on 16/05/2017.
 */
var htmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var BomPlugin = require('webpack-utf8-bom');
var path = require('path');

module.exports = {
  entry: "./src/js/main.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['react-html-attrs', ['import', {'libraryName': 'antd', 'style': true}]], //添加组件的插件配置
        }
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        // loader: 'style-loader!css-loader?modules'
        // loader: 'style!css?modules&localIdentName=[name]__[local]___[hash:base64:5]'
        loader: "style!css?importLoaders=1!postcss",
      },
      {
        test: /\.less$/,
        // include: path.resolve(__dirname, 'src'),
        loader: "style!css!postcss!less",
      },
      {test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=50000&name=[path][name].[ext]'}
    ]
  },
  postcss: [
    require('autoprefixer')({
      broswers: ['last 5 versions']
    })
  ],
  node: {
    fs: "empty"
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false
      }
    }),
    new BomPlugin(true),
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: 'body',
      minify:{
        removeComments: true,
        //collapseWhitespace: true
      }
    })
  ]
}