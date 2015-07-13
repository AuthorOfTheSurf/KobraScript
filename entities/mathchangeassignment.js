var util = require('util')

function MathChangeAssignment(target, op, magnitude) {
  this.target = target
  this.op = op
  this.magnitude = magnitude
  this.isAssignment = true
}

MathChangeAssignment.prototype.toString = function () {
  return '(' + this.op.lexeme + ' ' + this.target + ' ' + this.magnitude.lexeme + ')'
}

MathChangeAssignment.prototype.analyze = function (context) {
  this.target.analyze(context)
}

MathChangeAssignment.prototype.generateJavaScript = function (state) {
  var target = this.target.generateJavaScript(state),
  var op = this.op.generateJavaScript(state),
  var magnitude = this.magnitude.generateJavaScript(state)
  return util.format('(%s %s %s)', target, op, magnitude)
}

module.exports = MathChangeAssignment