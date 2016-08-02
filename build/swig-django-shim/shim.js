var glob = require('glob')
var path = require('path')

var setTags = function(swig) {
  glob.sync(path.resolve(__dirname, "./tags/*.js")).forEach(function(tagFile) {
    var tag = require(tagFile)
    swig.setTag(tag.name, tag.parse, tag.compile, tag.blockLevel)
  })
}

var setFilters = function(swig) {
  glob.sync(path.resolve(__dirname, "./filters/*.js")).forEach(function(filterFile) {
    var filter = require(filterFile)
    swig.setFilter(filter.name, filter.method)
  })
}

module.exports = {
  apply: function(swig) {
    setTags(swig)
    setFilters(swig)
  }
}
