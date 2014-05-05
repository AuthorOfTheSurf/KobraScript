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

module.exports = MathChangeAssignment