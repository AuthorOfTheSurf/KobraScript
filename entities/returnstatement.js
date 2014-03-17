function ReturnStatement(expression) {
  this.expression = expression
}

ReturnStatement.prototype.toString = function () {
  return '(Return ' + this.expression.toString() + ')'
}

module.exports = ReturnStatement
