function IndexVar(array, index) {
  this.array = array
  this.index = index
}

IndexVar.prototype.toString = function () {
  return '(lookup ' + this.array + ' ' + this.index + ')'
}

IndexVar.prototype.analyze = function (context) {
  this.array.analyze(context)
}

module.exports = IndexVar
