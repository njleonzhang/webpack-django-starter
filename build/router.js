var express = require('express')
var router = express.Router()
var glob = require("glob")
var swig = require('swig')
var path = require('path')
var mock = require('../mock')
var fs = require('fs')
var fsPath = require('fs-path');

var shim = require('./swig-django-shim/shim')
shim.apply(swig)

var tempIndexFile = '../.tmp/index.html'

fsPath.writeFileSync(path.resolve(__dirname, tempIndexFile), '', 'utf8', function(err){
  if(err) {
    throw err;
  } else {
    console.log('wrote a index file');
  }
});

var writeToIndex = function(str) {
  fs.writeFileSync(path.resolve(__dirname, tempIndexFile), str, {flag : 'a'})
}

var initRouter = function(devMiddleware) {
  var swigTemplates = glob.sync(path.resolve(__dirname, "../src/pages/**/*.jade"))
  var mfs = devMiddleware.fileSystem
  writeToIndex("<html><head></head><body><h1>Welcome!!!</h1>")

  swigTemplates.forEach(function(template) {
    var fileName = path.parse(template).name

    writeToIndex(`<p><a href='/${fileName}'> ${fileName}</a></p>`)

    router.get('/' + fileName, function(req, res, next) {
      var template = mfs.readFileSync(path.
        resolve(__dirname, '../dist/' + fileName + '.html'))
      try {
        res.send(swig.render(String(template),
          {locals: mock[fileName]}))
      } catch (error) {
        console.error(error)
      }
      next()
    })
  })

  writeToIndex('</body></html>')

  router.get('/', function(req, res, next) {
    var index = fs.readFileSync(path.resolve(__dirname, tempIndexFile))
    res.send(swig.render(String(index)))
  })

  return router;
}

module.exports = initRouter
