function IndexVar(array, index) {
  this.array = array
  this.index = index
}

IndexVar.prototype.toString = function () {
  return '(lookup ' + this.array + ' ' + this.index + ')'
}

IndexVar.prototype.analyze = function (context) {
  this.array.analyze(context)
  this.index.analyze(context)
}

IndexVar.prototype.generateJavaScript = function (state) {
  var js = [
    this.array.generateJavaScript(state),
    '[',
    this.index.generateJavaScript(state),
    ']'
  ]
  return js.join('')
}

module.exports = IndexVar
