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

UnaryExpression.prototype.generateJavaScript = function (state) {
  var op = this.op.lexeme
  var operand = this.operand.generateJavaScript(state)
  return op + operand
}

module.exports = UnaryExpression
