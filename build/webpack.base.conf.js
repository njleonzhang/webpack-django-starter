var path = require('path')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')
var glob = require("glob")
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var entryFiles = glob.sync("./src/pages/**/*.js")
var entries = {}

// entry文件的名字不能重复
entryFiles.forEach(function(file) {
  var fileName = path.parse(file).name

  // 如果文件名是base.js, 则不处理这个文件
  if(fileName == 'base') {
    return;
  }

  if(fileName in entryFiles) {
    console.error("entry文件名重复", fileName)
  }
  entries[fileName] = file
});

var webpackConfig = {
  entry: entries,
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: utils.assetsPath('js/[name].js'),
  },
  resolve: {
    extensions: ['', '.js', '.scss', '.jade'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'components': path.resolve(__dirname, '../src/components'),
      'pages': '../src/pages'
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules|web_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      // 将sass抽成文件
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("css!postcss!sass")
      },
      {
        test: /\.jade$/,
        loader: 'jade'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ],
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
}
// enhanced-require.config.js
module.exports = webpackConfig
