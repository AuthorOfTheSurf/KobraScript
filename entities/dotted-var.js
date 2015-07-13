function DottedVar(struct, property) {
  this.struct = struct
  this.property = property
}

DottedVar.prototype.toString = function () {
  return '(. ' + this.struct + ' ' + this.property + ')'
}

DottedVar.prototype.analyze = function (context) {
  this.struct.analyze(context)
}

DottedVar.prototype.generateJavaScript = function (state) {
  var js = [
    this.struct.generateJavaScript(state),
    '.',
    this.property.generateJavaScript(state)
  ]
  return js.join(' ')
}

module.exports = DottedVar
