module.exports = {
  name: 'csrf_token',
  parse: function(str, line, parser, types, stack, options, swig) {
    return true;
  },

  compile: function(compiler, args, content, parents, options, blockName) {
    return compiler(content, parents, options, blockName)
  },

  ends: false,

  blockLevel: true
}
