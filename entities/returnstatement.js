function ReturnStatement(expression) {
  this.expression = expression
  this.isReturn = true
}

ReturnStatement.prototype.toString = function () {
  return '(Return ' + this.expression.toString() + ')'
}

module.exports = ReturnStatement
