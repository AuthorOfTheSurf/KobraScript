var Type = require('./type')

function UnaryExpression(op, operand) {
  this.op = op
  this.operand = operand
}

UnaryExpression.prototype.toString = function () {
  return '(' + this.op.lexeme + ' ' + this.operand + ')'
}

UnaryExpression.prototype.analyze = function (context) {
  this.operand.analyze(context)
}

module.exports = UnaryExpression
