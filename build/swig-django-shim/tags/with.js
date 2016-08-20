module.exports = {
  name: 'with',
  parse: function(str, line, parser, types, stack, options, swig) {

    if (typeof str === "undefined") {
      throw new Error('No conditional statement provided on line ' + line + '.');
    }

    parser.on(types.COMPARATOR, function (token) {
      if (this.isLast) {
        throw new Error('Unexpected logic "' + token.match + '" on line ' + line + '.');
      }
      if (this.prevToken.type === types.NOT) {
        throw new Error('Attempted logic "not ' + token.match + '" on line ' + line + '. Use !(foo ' + token.match + ') instead.');
      }
      this.out.push(token.match);
      this.filterApplyIdx.push(this.out.length);
    });

    parser.on(types.NOT, function (token) {
      if (this.isLast) {
        throw new Error('Unexpected logic "' + token.match + '" on line ' + line + '.');
      }
      this.out.push(token.match);
    });

    parser.on(types.BOOL, function (token) {
      this.out.push(token.match);
    });

    parser.on(types.LOGIC, function (token) {
      if (!this.out.length || this.isLast) {
        throw new Error('Unexpected logic "' + token.match + '" on line ' + line + '.');
      }
      this.out.push(token.match);
      this.filterApplyIdx.pop();
    });

    return true;
  },

  compile: function(compiler, args, content, parents, options, blockName) {
    return compiler(content, parents, options, blockName)
  },

  ends: true,

  blockLevel: true
}
