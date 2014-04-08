function IndexVar(array, index) {
  this.array = array
  this.index = index
}

IndexVar.prototype.toString = function () {
  return '([] ' + this.array + ' ' + this.index + ')'
}

IndexVar.prototype.analyze = function (context) {
  this.array.analyze(context)
  this.index.analyze(context)
}

module.exports = IndexVar
