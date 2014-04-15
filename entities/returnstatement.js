function ReturnStatement(expression) {
  this.expression = expression
  this.isReturn = "I sure am!"
}

ReturnStatement.prototype.toString = function () {
  return '(Return ' + this.expression.toString() + ')'
}

module.exports = ReturnStatement
