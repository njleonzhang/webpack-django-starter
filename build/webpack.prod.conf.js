var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var glob = require("glob")
var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    // extract css into its own file
    new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css')),
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: utils.assetsPath('js/[name].[chunkhash].js')
    }),
  ]
})

var pugTemplates = glob.sync("./src/pages/**/*.jade")
pugTemplates.forEach(function(template) {
  var fileName = path.parse(template).name
  var html = {
    filename:  fileName + ".html",
    template: template,
    chunks: ['commons', fileName],
    inject: 'body',
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'dependency'
  }

  // 处理多级目录的问题
  var relative = path.relative('./src/pages', template)
  var pathArray = relative.split('/')
  if(pathArray.length > 2) {
    html.filename = relative.slice(0, [].lastIndexOf.call(relative, '/')) + '.html'
  }

  // 如果是jdango template
  if(/.+\.dj$/.test(fileName)) {
    html.filename = 'template/' + html.filename
    html.chunks = ['commons', fileName.slice(0, [].lastIndexOf.call(fileName, '.'))]
  } else {
    html.filename = 'static/html/' + html.filename
  }

  webpackConfig.plugins.push(new HtmlWebpackPlugin(html))
})

module.exports = webpackConfig
