var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var glob = require("glob")
var path = require('path')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

var webpackConfig = merge(baseWebpackConfig, {
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: utils.assetsPath('js/[name].js')
    }),
    new ExtractTextPlugin(utils.assetsPath('css/[name].css')),
  ]
})

var pugTemplates = glob.sync("./src/pages/**/*.jade")
pugTemplates.forEach(function(template) {
  var fileName = path.parse(template).name
  var html = {
    filename: fileName + ".html",
    template: template,
    chunks: ['commons', fileName],
    inject: 'body'
  }

  if(/.+\.dj$/.test(fileName)){
    html.chunks = ['commons', fileName.slice(0, [].lastIndexOf.call(fileName, '.'))]
  }
  
  // https://github.com/ampedandwired/html-webpack-plugin
  webpackConfig.plugins.push(new HtmlWebpackPlugin(html))
})

module.exports = webpackConfig
