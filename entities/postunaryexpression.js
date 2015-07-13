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

PostUnaryExpression.prototype.generateJavaScript = function (state) {
  var operand = this.operand.generateJavaScript(state)
  var op = this.op.lexeme
  return operand + op
}

module.exports = PostUnaryExpression