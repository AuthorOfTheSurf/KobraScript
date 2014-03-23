function Arguments(args) {
  this.args = args
}

Arguments.prototype.toString = function () {
  return '[' + this.args.toString() + ']'
}

module.exports = Arguments