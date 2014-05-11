function PostUnaryExpression(op, operand) {
  this.op = op
  this.operand = operand
}

PostUnaryExpression.prototype.toString = function () {
  return '(' + this.operand + ' ' + this.op.lexeme + ')'
}

PostUnaryExpression.prototype.analyze = function (context) {
  this.operand.analyze(context)
}

module.exports = PostUnaryExpression