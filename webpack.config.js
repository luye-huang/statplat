// {
//   test: /\.js?$/,
//     exclude: /(node_modules)/,
//   loader: 'babel-loader',
//   query: {
//   presets: ['react', 'es2015'],
//     plugins: ['react-html-attrs'], //添加组件的插件配置
// }
// },


var htmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: "./src/js/root.js",
  output: {
    path: './dist',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['react-html-attrs'], //添加组件的插件配置
        }
      },
      {
        test: /\.css$/,
        // include: path.resolve(__dirname, 'src'),
        loader: "style!css?importLoaders=1!postcss",
      },
      {
        test: /\.less$/,
        //include: path.resolve(__dirname, 'src'),
        loader: "style!css!postcss!less",
      },
      {
        test: /\.html$/,
        loader:'html-loader'
      },
      {
        test: /\.ejs/,
        loader:'ejs-loader'
      },
      { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=50000&name=[path][name].[ext]'}
    ]
  },
  postcss: [
    require('autoprefixer')({
      broswers:['last 5 versions']
    })
  ],
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: 'body'
      //minify:{
      //    removeComments: true,
      //    //collapseWhitespace: true
      //}
    })
    // ,
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery"
    // })
  ]
}