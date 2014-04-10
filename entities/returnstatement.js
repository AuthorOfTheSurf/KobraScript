function ReturnStatement(expression) {
  this.expression = expression
}

ReturnStatement.prototype.toString = function () {
  return '(Return ' + this.expression.toString() + ')'
}

ReturnStatement.prototype.isReturnStatement = function() {
  return true
}

module.exports = ReturnStatement
